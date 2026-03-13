import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import Button from "../../components/common/Button";
import { Icon } from "../../components/common/Icons";
import icons from "../../components/common/iconPaths";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  usePageMeta({
    title: "Login | Lost & Found",
    description: "Access your dashboard, claims, and messaging workspace.",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitting(true);
      const user = await authService.login(form);
      login(user);
      toast.success("Welcome back.");
      navigate(location.state?.from?.pathname || "/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 py-12 lg:px-10">
      <div className="grid w-full gap-8 rounded-[36px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Sign in
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white">Continue managing reports and recoveries.</h1>
          <p className="mt-4 leading-7 text-slate-300">
            Access your dashboard, claim inbox, messaging workspace, and account settings.
          </p>
        </div>
        <form className="space-y-5 rounded-[28px] border border-white/8 bg-slate-950/40 p-5 md:p-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Email</label>
          <input
            className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 text-white outline-none focus:border-white/30"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
            required
            type="email"
            value={form.email}
          />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-[18px] border border-white/10 bg-slate-950/70 px-4 py-3 pr-12 text-white outline-none focus:border-white/30"
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Password"
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-white"
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                <Icon className="h-4 w-4" path={showPassword ? icons.eyeOff : icons.eye} />
              </button>
            </div>
          </div>
          <Button className="w-full justify-center" disabled={submitting} type="submit">
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-sm text-slate-400">
            New here?{" "}
            <Link className="text-white underline decoration-white/20 underline-offset-4" to="/register">
              Create your account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
