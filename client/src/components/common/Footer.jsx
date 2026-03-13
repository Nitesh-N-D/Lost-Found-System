import { Link } from "react-router-dom";
import Button from "./Button";
import { Icon } from "./Icons";
import icons from "./iconPaths";

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(15,23,42,0.98))]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="mb-10 rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 md:flex md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
              Clear communication
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
              A structured experience for reporting, claiming, and returning items.
            </h3>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-200">
              Designed to keep item recovery organized with secure messaging, approval flow, and clean dashboards.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <LinkButton />
          </div>
        </div>

        <div className="grid gap-10 text-sm text-slate-400 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-white">Lost & Found</p>
            <p className="mt-3 leading-7">
              A modern application for managing lost items, submitted claims, owner communication, and final handoff workflows.
            </p>
          </div>

          <div>
            <p className="font-semibold text-white">About</p>
            <div className="mt-4 space-y-3 leading-7">
              <p>
                The platform helps schools, workplaces, and shared communities organize item recovery through a cleaner digital workflow.
              </p>
              <p>
                Messaging, verification, and approval are kept inside the product so the process stays clear and traceable.
              </p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">Product</p>
            <div className="mt-4 space-y-3">
              <p>Responsive dashboard experience</p>
              <p>Item creation and image upload</p>
              <p>Claim review and approval flow</p>
              <p>Chat-based coordination</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-white">Contact</p>
            <div className="mt-4 space-y-3">
              <p>Add your public support email before deployment</p>
              <p>Frontend deployment: Vercel</p>
              <p>Backend deployment: Render</p>
              <p>Database: MongoDB Atlas</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.3em] text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Lost & Found System</p>
          <p>Minimal interface • Secure workflow • Deployment ready</p>
        </div>
      </div>
    </footer>
  );
}

function LinkButton() {
  return (
    <Link to="/register">
      <Button className="gap-2">
        Get started
        <Icon className="h-4 w-4" path={icons.arrowRight} />
      </Button>
    </Link>
  );
}

export default Footer;
