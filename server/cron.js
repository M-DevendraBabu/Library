const Transaction  = require("./models/Transaction");
const Notification = require("./models/Notification");

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const log = msg => console.log(`[CRON ${new Date().toISOString()}] ${msg}`);

/* ── 1. Mark overdue + update fines (every hour) ───────────────────────── */
async function checkOverdue() {
  try {
    const now = new Date();
    const overdues = await Transaction.find({
      status: "active", dueDate: { $lt: now },
    }).populate("user book");

    for (const tx of overdues) {
      const days = Math.ceil((now - new Date(tx.dueDate)) / MS_PER_DAY);
      const fine = days * 5;
      await Transaction.findByIdAndUpdate(tx._id, { status:"overdue", fine, daysOverdue:days });

      const todayStart = new Date(); todayStart.setHours(0,0,0,0);
      const already = await Notification.findOne({
        user: tx.user._id, type:"fine", relatedTransaction:tx._id,
        createdAt:{ $gte: todayStart },
      });
      if (!already && tx.user?._id) {
        await Notification.create({
          user: tx.user._id,
          title: "⚠️ Book Overdue — Fine Accumulating",
          message: `"${tx.book?.title}" is ${days} day(s) overdue. Current fine: ₹${fine}. Please return it immediately to stop the fine.`,
          type:"fine", priority:"high", relatedTransaction:tx._id,
          bookCover:"⚠️", color:"#EF4444", actionRequired:true,
        });
      }
    }
    if (overdues.length > 0) log(`Updated ${overdues.length} overdue transaction(s).`);
  } catch (e) { log(`checkOverdue error: ${e.message}`); }
}

/* ── 2. Due date reminders (daily) ─────────────────────────────────────── */
async function sendDueReminders() {
  try {
    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0,0,0,0);

    // Remind for books due in 3 days and 1 day
    for (const daysAhead of [3, 1]) {
      const from = new Date(todayStart); from.setDate(from.getDate() + daysAhead);
      const to   = new Date(from);       to.setHours(23,59,59,999);

      const dueSoon = await Transaction.find({
        status:"active", dueDate:{ $gte:from, $lte:to },
      }).populate("user book");

      for (const tx of dueSoon) {
        if (!tx.user?._id) continue;
        const alreadySent = await Notification.findOne({
          user: tx.user._id, type:"due_date", relatedTransaction:tx._id,
          createdAt:{ $gte: todayStart },
        });
        if (!alreadySent) {
          const label = daysAhead === 1 ? "tomorrow" : `in ${daysAhead} days`;
          await Notification.create({
            user: tx.user._id,
            title: `⏰ Book Due ${daysAhead === 1 ? "Tomorrow!" : "Soon"}`,
            message: `"${tx.book?.title}" is due back ${label} (${new Date(tx.dueDate).toLocaleDateString("en-IN")}). Renew it in "My Books" if you need more time.`,
            type:"due_date", priority: daysAhead===1 ? "high" : "medium",
            relatedTransaction:tx._id, bookCover:"⏰", color:"#F59E0B",
          });
        }
      }
      if (dueSoon.length > 0) log(`Sent ${dueSoon.length} due-in-${daysAhead}-day reminder(s).`);
    }
  } catch (e) { log(`sendDueReminders error: ${e.message}`); }
}

/* ── Scheduler ──────────────────────────────────────────────────────────── */
function startCronJobs() {
  log("Cron jobs started.");
  checkOverdue();
  sendDueReminders();
  setInterval(checkOverdue, 60 * 60 * 1000);          // every hour
  setInterval(sendDueReminders, 24 * 60 * 60 * 1000); // every 24h
}

module.exports = { startCronJobs };
