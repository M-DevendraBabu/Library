const http = require("http");

// We will launch server.js in another process or require app directly
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

async function runTests() {
  console.log("Starting full system integration test against MongoDB Atlas...");

  // Launch test HTTP request helper
  const BASE_URL = "http://localhost:5000/api";

  async function req(path, options = {}) {
    const url = `${BASE_URL}${path}`;
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    const res = await fetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = text; }
    return { status: res.status, headers: res.headers, data };
  }

  const results = [];
  function assert(name, condition, details = "") {
    if (condition) {
      results.push({ name, passed: true });
      console.log(`  ✅ PASS: ${name}`);
    } else {
      results.push({ name, passed: false, details });
      console.error(`  ❌ FAIL: ${name} - ${details}`);
    }
  }

  try {
    // 1. Health check
    const health = await req("/health");
    assert("Health check returns 200 and status ok", health.status === 200 && health.data.status === "ok");

    // 2. Admin Login
    const adminLogin = await req("/auth/login", {
      method: "POST",
      body: { email: "admin@library.com", password: "admin123" }
    });
    assert("Admin login successful", adminLogin.status === 200 && adminLogin.data.success);
    const adminToken = adminLogin.data.token;
    const cookieHeader = adminLogin.headers.get("set-cookie");
    assert("Cookie header present on login", !!cookieHeader && cookieHeader.includes("access_token="));

    // 3. User Registration
    const testEmail = `testuser_${Date.now()}@example.com`;
    const userReg = await req("/auth/register", {
      method: "POST",
      body: {
        name: "Test Reader",
        email: testEmail,
        password: "password123",
        role: "user",
        studentId: "STU-9999"
      }
    });
    assert("User registration successful", userReg.status === 201 && userReg.data.success);
    const userToken = userReg.data.token;
    const userId = userReg.data.user._id;

    // 4. Admin registration without secret should fail
    const badAdminReg = await req("/auth/register", {
      method: "POST",
      body: {
        name: "Fake Admin",
        email: `fakeadmin_${Date.now()}@example.com`,
        password: "password123",
        role: "admin"
      }
    });
    assert("Admin registration without secret is rejected (403)", badAdminReg.status === 403);

    // 5. Auth Me
    const me = await req("/auth/me", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert("Get current user /auth/me returns user data", me.status === 200 && me.data.user.email === testEmail);

    // 6. Test Cookie-based authentication without Authorization header
    const meViaCookie = await req("/auth/me", {
      headers: { Cookie: `access_token=${userToken}` }
    });
    assert("Authentication via access_token cookie works", meViaCookie.status === 200 && meViaCookie.data.user.email === testEmail);

    // 7. Update profile
    const updateProf = await req("/auth/update-profile", {
      method: "PUT",
      headers: { Authorization: `Bearer ${userToken}` },
      body: { phone: "9876543210", address: "123 Library St" }
    });
    assert("Profile update works", updateProf.status === 200 && updateProf.data.user.phone === "9876543210");

    // 8. Books Catalog
    const booksRes = await req("/books?limit=10");
    assert("Get all books returns catalog", booksRes.status === 200 && booksRes.data.books.length > 0);
    const sampleBook = booksRes.data.books[0];

    // 9. Get Single Book
    const singleBook = await req(`/books/${sampleBook._id}`);
    assert("Get single book by ID works", singleBook.status === 200 && singleBook.data.book.title === sampleBook.title);

    // 10. Featured Books
    const featured = await req("/books/featured");
    assert("Get featured books works", featured.status === 200 && Array.isArray(featured.data.books));

    // 11. Admin create, update, delete a book
    const newBook = await req("/books", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: {
        title: "Temporary Test Book",
        author: "Test Author",
        isbn: `ISBN-${Date.now()}`,
        category: "tech",
        totalCopies: 3,
        availableCopies: 3,
        location: "Shelf T-01"
      }
    });
    assert("Admin can create new book", newBook.status === 201 && newBook.data.book._id);
    const tempBookId = newBook.data.book._id;

    const updateBook = await req(`/books/${tempBookId}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { totalCopies: 5, availableCopies: 5 }
    });
    assert("Admin can update book", updateBook.status === 200 && updateBook.data.book.totalCopies === 5);

    // 12. User reserve book
    const reserveRes = await req("/transactions/reserve", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: { bookId: tempBookId }
    });
    assert("User can reserve book", reserveRes.status === 201 && reserveRes.data.success);
    const reserveTxId = reserveRes.data.transaction._id;

    // 13. Admin issue book
    const issueRes = await req("/transactions/issue", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { bookId: tempBookId, userId: userId }
    });
    assert("Admin can issue book", issueRes.status === 201 && issueRes.data.success);
    const activeTxId = issueRes.data.transaction._id;

    // 14. User renew book
    const renewRes = await req("/transactions/renew", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: { transactionId: activeTxId }
    });
    assert("User can renew issued book", renewRes.status === 200 && renewRes.data.success);

    // 15. Admin return book
    const returnRes = await req("/transactions/return", {
      method: "POST",
      headers: { Authorization: `Bearer ${adminToken}` },
      body: { transactionId: activeTxId }
    });
    assert("Admin can return book", returnRes.status === 200 && returnRes.data.success);

    // 16. Cleanup temp book
    const deleteBook = await req(`/books/${tempBookId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert("Admin can delete book", deleteBook.status === 200);

    // 17. User transactions list
    const myTx = await req("/transactions/my", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert("User can view their transactions", myTx.status === 200 && Array.isArray(myTx.data.transactions));

    // 18. Admin transactions stats
    const txStats = await req("/transactions/stats", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert("Admin can view transaction stats", txStats.status === 200 && txStats.data.stats.totalReturned >= 1);

    // 19. User notifications
    const userNotifs = await req("/notifications", {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert("User receives notifications for transactions", userNotifs.status === 200 && userNotifs.data.notifications.length > 0);

    // 20. Admin Users list and stats
    const usersStats = await req("/users/stats", {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    assert("Admin can view user stats", usersStats.status === 200 && usersStats.data.stats.total >= 1);

    // 21. AI Recommendations endpoint
    const aiRec = await req("/ai/recommendations", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert("AI recommendations endpoint responds", aiRec.status === 200 && Array.isArray(aiRec.data.recommendations));

    // 22. AI Chat endpoint
    const aiChat = await req("/ai/chat", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` },
      body: { message: "Hello, what books do you have?" }
    });
    assert("AI chat endpoint responds", aiChat.status === 200 && typeof aiChat.data.reply === "string");

    // 23. Logout endpoint
    const logoutRes = await req("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${userToken}` }
    });
    assert("Logout clears cookie", logoutRes.status === 200 && logoutRes.headers.get("set-cookie").includes("access_token=;"));

    // Cleanup test user
    await req(`/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    console.log("\n==========================================");
    const passedCount = results.filter(r => r.passed).length;
    console.log(`TOTAL TESTS: ${results.length} | PASSED: ${passedCount} | FAILED: ${results.length - passedCount}`);
    console.log("==========================================");

    process.exit(passedCount === results.length ? 0 : 1);
  } catch (err) {
    console.error("Test execution failed:", err);
    process.exit(1);
  }
}

// Start test
setTimeout(runTests, 1000);
