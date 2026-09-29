import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import { usePageMeta } from "../../hooks/usePageMeta";
import Button from "../../components/common/Button";
import { Icon } from "../../components/common/Icons";
import icons from "../../components/common/iconPaths";

function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  usePageMeta({
    title: "Register | Lost & Found",
    description: "Create an account to report items, submit claims, and manage secure recovery workflows.",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const user = await authService.register(form);
      login(user);
      toast.success("Account created successfully.");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-5xl items-center px-6 py-12 lg:px-10">
      <div className="grid w-full gap-8 rounded-[36px] border border-stone-200 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-8 md:grid-cols-2 md:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
            Get started
          </p>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-900">Create your recovery workspace.</h1>
          <p className="mt-4 leading-7 text-stone-600">
            Report items, collaborate securely with claimants, and track every recovery step in one place.
          </p>
        </div>
        <form className="space-y-5 rounded-[28px] border border-stone-200 bg-stone-50 p-5 md:p-6" onSubmit={handleSubmit}>
          {[
            { name: "name", type: "text", placeholder: "Full name", label: "Name" },
            { name: "email", type: "email", placeholder: "Email", label: "Email" },
            { name: "phone", type: "text", placeholder: "Phone number", label: "Phone number" },
          ].map((field) => (
            <div className="space-y-2" key={field.name}>
              <label className="text-sm text-stone-500">{field.label}</label>
              <input
                className="w-full rounded-[18px] border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none focus:border-white/30"
                onChange={(event) =>
                  setForm((current) => ({ ...current, [field.name]: event.target.value }))
                }
                placeholder={field.placeholder}
                required={field.name !== "phone"}
                type={field.type}
                value={form[field.name]}
              />
            </div>
          ))}
          <div className="space-y-2">
            <label className="text-sm text-stone-500">Password</label>
            <div className="relative">
              <input
                className="w-full rounded-[18px] border border-stone-200 bg-white px-4 py-3 pr-12 text-stone-900 outline-none focus:border-white/30"
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                placeholder="Password"
                required
                type={showPassword ? "text" : "password"}
                value={form.password}
              />
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition hover:text-stone-900"
                onClick={() => setShowPassword((value) => !value)}
                type="button"
              >
                <Icon className="h-4 w-4" path={showPassword ? icons.eyeOff : icons.eye} />
              </button>
            </div>
          </div>
          <Button className="w-full justify-center" disabled={submitting} type="submit">
            {submitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-sm text-stone-500">
            Already have an account?{" "}
            <Link className="text-stone-900 underline decoration-white/20 underline-offset-4" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
