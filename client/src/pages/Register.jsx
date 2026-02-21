import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";

function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Error registering");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
        /><br /><br />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
        /><br /><br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;