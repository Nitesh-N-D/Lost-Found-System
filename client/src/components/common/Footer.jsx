import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:flex-row sm:items-center sm:justify-between lg:px-10">
        <Link className="flex items-center gap-3" to="/" aria-label="Lost and Found home">
          <span className="brand-mark flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white">LF</span>
          <span>
            <span className="block text-sm font-semibold text-stone-900">Lost &amp; Found</span>
            <span className="mt-0.5 block text-xs text-stone-500">Helping good things find their way home.</span>
          </span>
        </Link>
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-stone-600">
          <Link className="hover:text-emerald-900" to="/#reports">Browse reports</Link>
          <Link className="hover:text-emerald-900" to="/report-item">Report an item</Link>
          <Link className="hover:text-emerald-900" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-emerald-900" to="/login">Sign in</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
