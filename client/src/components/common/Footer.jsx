import { Link } from "react-router-dom";
import Button from "./Button";
import { Icon } from "./Icons";
import icons from "./iconPaths";

function Footer() {
  return (
    <footer className="site-footer border-t">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="surface-card mb-10 rounded-[30px] border p-8 md:flex md:items-center md:justify-between md:p-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">
              Clear communication
            </p>
            <h3 className="mt-4 text-3xl font-semibold text-stone-900 md:text-4xl">
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

        <div className="grid gap-10 text-sm text-stone-500 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <p className="text-lg font-semibold text-stone-900">Lost & Found</p>
            <p className="mt-3 leading-7">
              A modern application for managing lost items, submitted claims, owner communication, and final handoff workflows.
            </p>
          </div>

          <div>
            <p className="font-semibold text-stone-900">About</p>
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
            <p className="font-semibold text-stone-900">Product</p>
            <div className="mt-4 space-y-3">
              <p>Responsive dashboard experience</p>
              <p>Item creation and image upload</p>
              <p>Claim review and approval flow</p>
              <p>Chat-based coordination</p>
            </div>
          </div>

          <div>
            <p className="font-semibold text-stone-900">Contact</p>
            <div className="mt-4 space-y-3">
              <p>Email: niteshdwaraka@gmail.com</p>
             
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-stone-200 pt-6 text-xs uppercase tracking-[0.3em] text-stone-500 md:flex-row md:items-center md:justify-between">
          <p>Lost & Found System</p>
          <p>Minimal interface • Secure workflow </p>
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
