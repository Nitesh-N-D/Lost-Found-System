import { Link } from "react-router-dom";
import Button from "../components/common/Button";

function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--color-primary)]">
        404
      </p>
      <h1 className="mt-5 text-5xl font-semibold text-white">Page not found</h1>
      <p className="mt-4 text-slate-300">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Link className="mt-8" to="/">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}

export default NotFound;
