import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateItem from "./pages/CreateItem";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ClaimItem from "./pages/ClaimItem";
import MyClaims from "./pages/MyClaims";
import ReceivedClaims from "./pages/ReceivedClaims";
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
       <Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
<Route
  path="/my-claims"
  element={
    <ProtectedRoute>
      <MyClaims />
    </ProtectedRoute>
  }
/>

<Route
  path="/received-claims"
  element={
    <ProtectedRoute>
      <ReceivedClaims />
    </ProtectedRoute>
  }
/>
        <Route
  path="/register"
  element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  }
/>
        <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
<Route
  path="/claim/:id"
  element={
    <ProtectedRoute>
      <ClaimItem />
    </ProtectedRoute>
  }
/>
        <Route
  path="/create"
  element={
    <ProtectedRoute>
      <CreateItem />
    </ProtectedRoute>
  }
/>
      </Routes>
    </Router>
  );
}

export default App;