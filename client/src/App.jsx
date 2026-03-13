import { Suspense, lazy } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary";
import PageLoader from "./components/common/PageLoader";
import ProtectedRoute from "./components/common/ProtectedRoute";
import PublicRoute from "./components/common/PublicRoute";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";

const Home = lazy(() => import("./pages/Home"));
const ItemDetails = lazy(() => import("./pages/ItemDetails"));
const CreateItem = lazy(() => import("./pages/CreateItem"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const MyItems = lazy(() => import("./pages/dashboard/MyItems"));
const MyClaims = lazy(() => import("./pages/dashboard/MyClaims"));
const ReceivedClaims = lazy(() => import("./pages/dashboard/ReceivedClaims"));
const ChatPage = lazy(() => import("./pages/dashboard/ChatPage"));
const SettingsPage = lazy(() => import("./pages/dashboard/SettingsPage"));
const AdminPanel = lazy(() => import("./pages/admin/AdminPanel"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<PageLoader label="Loading experience..." />}>
          <Routes>
            <Route element={<MainLayout />}>
              <Route element={<PublicRoute />}>
                <Route element={<Login />} path="/login" />
                <Route element={<Register />} path="/register" />
              </Route>

              <Route element={<Home />} path="/" />
              <Route element={<ItemDetails />} path="/items/:id" />

              <Route element={<ProtectedRoute />}>
                <Route element={<CreateItem />} path="/report-item" />
                <Route element={<Navigate replace to="/report-item" />} path="/create" />
                <Route element={<DashboardLayout />} path="/dashboard">
                  <Route element={<DashboardOverview />} index />
                  <Route element={<MyItems />} path="items" />
                  <Route element={<MyClaims />} path="claims" />
                  <Route element={<ReceivedClaims />} path="received-claims" />
                  <Route element={<ChatPage />} path="chat/:claimId" />
                  <Route element={<SettingsPage />} path="settings" />
                </Route>
              </Route>

              <Route element={<ProtectedRoute adminOnly />}>
                <Route element={<AdminPanel />} path="/admin" />
              </Route>

              <Route element={<NotFound />} path="*" />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
