import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, BookOpen, Users, RefreshCw, BarChart2,
  LogOut, AlertTriangle, DollarSign, Calendar, Menu, X, Bell,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const SIDENAV = [
  { id:"dashboard",    label:"Dashboard",     icon:<LayoutDashboard size={20}/>, path:"/admin-dashboard",      color:"#4f46e5" },
  { id:"books",        label:"Books",         icon:<BookOpen size={20}/>,        path:"/admin/book-management", color:"#0ea5e9" },
  { id:"users",        label:"Members",       icon:<Users size={20}/>,           path:"/admin/user-management", color:"#10b981" },
  { id:"issue-return", label:"Issue/Return",  icon:<RefreshCw size={20}/>,       path:"/admin/issue-return",    color:"#f59e0b" },
  { id:"reports",      label:"Reports",       icon:<BarChart2 size={20}/>,       path:"/admin/reports",         color:"#8b5cf6" },
];

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();
  const [open, setOpen] = useState(false);

  const activeId = SIDENAV.find(s => s.path === location.pathname)?.id || "dashboard";
  const handleLogout = () => { logout(); navigate("/login"); };

  const SideContent = () => (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", padding:"1.5rem 1rem" }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"2rem", padding:"0 0.5rem" }}>
        <div style={{ width:40, height:40, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:12, display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📚</div>
        <div>
          <div style={{ fontWeight:800, color:"white", fontSize:"1rem" }}>LibraryMS</div>
          <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)" }}>Admin Panel</div>
        </div>
      </div>

      {/* Admin chip */}
      <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:12, padding:"0.875rem", marginBottom:"1.5rem", display:"flex", alignItems:"center", gap:"0.75rem" }}>
        <div style={{ width:38, height:38, background:"linear-gradient(135deg,#f59e0b,#d97706)", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"1rem", flexShrink:0 }}>
          {user?.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div style={{ overflow:"hidden", minWidth:0 }}>
          <div style={{ fontWeight:700, color:"white", fontSize:"0.875rem", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.name || "Admin"}</div>
          <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.4)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{user?.email}</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex:1, display:"flex", flexDirection:"column", gap:"0.25rem" }}>
        {SIDENAV.map(item => {
          const active = activeId === item.id;
          return (
            <motion.div key={item.id} whileHover={{ x:4 }} whileTap={{ scale:0.97 }}>
              <Link to={item.path} onClick={() => setOpen(false)}
                style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 1rem", borderRadius:12,
                  background: active ? "rgba(255,255,255,0.15)" : "transparent",
                  color: active ? "white" : "rgba(255,255,255,0.6)",
                  textDecoration:"none", fontWeight: active ? 700 : 500, fontSize:"0.875rem",
                  borderLeft: active ? `3px solid ${item.color}` : "3px solid transparent",
                  transition:"all 0.2s" }}>
                <span style={{ color: active ? item.color : "rgba(255,255,255,0.5)", flexShrink:0 }}>{item.icon}</span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.button whileHover={{ x:4 }} whileTap={{ scale:0.97 }} onClick={handleLogout}
        style={{ display:"flex", alignItems:"center", gap:"0.75rem", padding:"0.75rem 1rem", borderRadius:12,
          background:"rgba(239,68,68,0.15)", color:"#fca5a5", border:"none", cursor:"pointer",
          fontWeight:600, fontSize:"0.875rem", marginTop:"1rem", width:"100%" }}>
        <LogOut size={18}/> Logout
      </motion.button>
    </div>
  );

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#f8fafc" }}>

      {/* Desktop sidebar */}
      <aside style={{ width:240, background:"linear-gradient(180deg,#0f172a 0%,#1e1b4b 100%)", flexShrink:0, height:"100vh", position:"sticky", top:0, overflowY:"auto" }}>
        <SideContent/>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              onClick={() => setOpen(false)}
              style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.55)", zIndex:200 }}/>
            <motion.aside initial={{ x:-250 }} animate={{ x:0 }} exit={{ x:-250 }} transition={{ type:"spring", stiffness:300, damping:30 }}
              style={{ position:"fixed", left:0, top:0, bottom:0, width:240, background:"linear-gradient(180deg,#0f172a,#1e1b4b)", zIndex:201 }}>
              <SideContent/>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        {/* Mobile topbar */}
        <div style={{ padding:"0.875rem 1.25rem", background:"white", borderBottom:"1px solid #e2e8f0",
          display:"flex", alignItems:"center", gap:"1rem",
          position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 8px rgba(0,0,0,0.06)" }}
          className="admin-mobile-bar">
          <motion.button whileTap={{ scale:0.9 }} onClick={() => setOpen(true)}
            style={{ background:"none", border:"none", cursor:"pointer", padding:4, display:"flex", alignItems:"center" }}>
            <Menu size={22} color="#475569"/>
          </motion.button>
          <div style={{ display:"flex", alignItems:"center", gap:"0.6rem" }}>
            <div style={{ width:28, height:28, background:"linear-gradient(135deg,#4f46e5,#7c3aed)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>📚</div>
            <span style={{ fontWeight:800, color:"#1e293b", fontSize:"0.95rem" }}>LibraryMS Admin</span>
          </div>
        </div>

        <main style={{ flex:1, overflow:"auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        .admin-mobile-bar { display: none !important; }
        @media (max-width: 768px) {
          aside:first-child { display: none !important; }
          .admin-mobile-bar { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
