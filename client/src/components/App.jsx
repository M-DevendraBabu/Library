import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { useAuth } from "../context/AuthContext";

const Home                      = lazy(() => import("./Home"));
const Login                     = lazy(() => import("./Login"));
const Register                  = lazy(() => import("./Register"));
const UserDashboard             = lazy(() => import("./UserDashboard"));
const AdminDashboard            = lazy(() => import("./AdminDashboard"));
const BookCatalog               = lazy(() => import("./BookCatalog"));
const MyIssuedBooks             = lazy(() => import("./MyIssuedBooksPage"));
const ReserveBook               = lazy(() => import("./ReserveBookPage"));
const BookDetails               = lazy(() => import("./BookDetailspage"));
const RecommendationPage        = lazy(() => import("./RecommendationPage"));
const NotificationPage          = lazy(() => import("./NotificationPage"));
const Profile                   = lazy(() => import("./Profile"));
const Support                   = lazy(() => import("./Support"));
const UserManagementPage        = lazy(() => import("./UserManagementPage"));
const IssueReturnManagementPage = lazy(() => import("./IssueReturnManagementPage"));
const Report                    = lazy(() => import("./Report"));
const BookManagementPage        = lazy(() => import("./BookManagementPage"));

/* ── Guards ───────────────────────────────────────────────────────────────── */
const HomeRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  if (isAuthenticated) return <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace />;
  return children;
};

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  if (loading) return <Loader />;
  if (isAuthenticated) return <Navigate to={isAdmin ? "/admin-dashboard" : "/dashboard"} replace />;
  return children;
};

/* ── Beautiful loader ─────────────────────────────────────────────────────── */
const Loader = () => (
  <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#0f172a,#1e293b)" }}>
    <motion.div
      style={{ textAlign:"center" }}
      initial={{ opacity:0, scale:0.8 }}
      animate={{ opacity:1, scale:1 }}
      transition={{ duration:0.5 }}
    >
      <motion.div
        style={{ width:56, height:56, border:"3px solid rgba(99,102,241,0.3)", borderTop:"3px solid #6366f1", borderRadius:"50%", margin:"0 auto 1.25rem" }}
        animate={{ rotate:360 }}
        transition={{ duration:0.9, repeat:Infinity, ease:"linear" }}
      />
      <motion.p
        style={{ color:"rgba(255,255,255,0.6)", fontWeight:600, letterSpacing:"0.05em", fontSize:"0.875rem" }}
        animate={{ opacity:[0.5,1,0.5] }}
        transition={{ duration:1.8, repeat:Infinity }}
      >
        LOADING
      </motion.p>
    </motion.div>
    <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
  </div>
);

/* ── Page transition wrapper ─────────────────────────────────────────────── */
/* Smooth 1.2s cinematic fade + rise — feels premium not sluggish */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 24,
    scale: 0.97,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],   // expo-out: fast settle, long tail
      opacity:  { duration: 0.8 },
      filter:   { duration: 0.7 },
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    scale: 0.98,
    filter: "blur(3px)",
    transition: {
      duration: 0.45,
      ease: "easeIn",
    },
  },
};

const Page = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    style={{ minHeight:"100vh", willChange:"transform,opacity" }}
  >
    {children}
  </motion.div>
);

/* ── App ─────────────────────────────────────────────────────────────────── */
export default function App() {
  const location = useLocation();
  return (
    <div className="app-wrapper" style={{ overflow:"hidden" }}>
      <AnimatePresence mode="wait" initial={false}>
        <Suspense fallback={<Loader />}>
          <Routes location={location} key={location.pathname}>

            <Route path="/"         element={<HomeRoute><Page><Home /></Page></HomeRoute>} />
            <Route path="/login"    element={<AuthRoute><Page><Login /></Page></AuthRoute>} />
            <Route path="/register" element={<AuthRoute><Page><Register /></Page></AuthRoute>} />

            <Route path="/dashboard"       element={<PrivateRoute><Page><UserDashboard /></Page></PrivateRoute>} />
            <Route path="/catalog"         element={<PrivateRoute><Page><BookCatalog /></Page></PrivateRoute>} />
            <Route path="/my-books"        element={<PrivateRoute><Page><MyIssuedBooks /></Page></PrivateRoute>} />
            <Route path="/reserve"         element={<PrivateRoute><Page><ReserveBook /></Page></PrivateRoute>} />
            <Route path="/book-details"    element={<PrivateRoute><Page><BookDetails /></Page></PrivateRoute>} />
            <Route path="/recommendations" element={<PrivateRoute><Page><RecommendationPage /></Page></PrivateRoute>} />
            <Route path="/notifications"   element={<PrivateRoute><Page><NotificationPage /></Page></PrivateRoute>} />
            <Route path="/profile"         element={<PrivateRoute><Page><Profile /></Page></PrivateRoute>} />
            <Route path="/support"         element={<PrivateRoute><Page><Support /></Page></PrivateRoute>} />

            <Route path="/admin-dashboard"         element={<PrivateRoute adminOnly><Page><AdminDashboard /></Page></PrivateRoute>} />
            <Route path="/admin/user-management"   element={<PrivateRoute adminOnly><Page><UserManagementPage /></Page></PrivateRoute>} />
            <Route path="/admin/issue-return"      element={<PrivateRoute adminOnly><Page><IssueReturnManagementPage /></Page></PrivateRoute>} />
            <Route path="/admin/reports"           element={<PrivateRoute adminOnly><Page><Report /></Page></PrivateRoute>} />
            <Route path="/admin/book-management"   element={<PrivateRoute adminOnly><Page><BookManagementPage /></Page></PrivateRoute>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </div>
  );
}
