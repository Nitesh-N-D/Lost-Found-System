import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { itemService } from "../services/itemService";
import { usePageMeta } from "../hooks/usePageMeta";
import SectionHeading from "../components/common/SectionHeading";
import ItemCard from "../components/items/ItemCard";
import Button from "../components/common/Button";
import SkeletonCard from "../components/common/SkeletonCard";
import { Icon } from "../components/common/Icons";
import icons from "../components/common/iconPaths";
import Footer from "../components/common/Footer";

const features = [
  {
    title: "Item reporting",
    description: "Create clear listings with image upload, category details, and searchable metadata.",
    icon: icons.upload,
  },
  {
    title: "Secure claims",
    description: "Let users submit ownership claims with context before any contact details are revealed.",
    icon: icons.shield,
  },
  {
    title: "Built-in messaging",
    description: "Keep owner and claimant communication inside the workflow with chat-linked claim history.",
    icon: icons.chat,
  },
  {
    title: "Operations visibility",
    description: "Track claims, items, and approvals through clean dashboards and administrative controls.",
    icon: icons.dashboard,
  },
];

const steps = [
  "Create a lost or found report",
  "Review matching items and claim requests",
  "Verify ownership through secure messaging",
  "Approve the claim and complete the handoff",
];

const testimonials = [
  {
    quote:
      "The interface feels clean, calm, and deliberate. It communicates trust right away, which is exactly what this kind of product needs.",
    author: "Product Review",
  },
  {
    quote:
      "The dashboard and claim flow feel much closer to a real SaaS application than a typical portfolio CRUD project.",
    author: "Technical Feedback",
  },
];

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: "Lost & Found System | Secure item recovery workflow",
    description:
      "A modern lost and found platform for reporting items, managing claims, and reconnecting owners with secure workflows.",
  });

  useEffect(() => {
    let active = true;

    itemService
      .list({ limit: 6 })
      .then((data) => {
        if (active) setItems(Array.isArray(data?.items) ? data.items : []);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-6 pb-18 pt-16 lg:px-10 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-[1.08fr,0.92fr] lg:items-center">
          <div>
            <p className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-slate-300">
              Secure recovery workspace
            </p>
            <h1 className="mt-8 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-6xl xl:text-7xl">
              A cleaner way to manage lost items, claims, and verified handoffs.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Lost & Found brings reporting, verification, messaging, and approval into one structured workflow designed for clarity and trust.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link to="/register">
                <Button className="w-full gap-2 sm:w-auto">
                  Get started
                  <Icon className="h-4 w-4" path={icons.arrowRight} />
                </Button>
              </Link>
              <Link to="/report-item">
                <Button className="w-full sm:w-auto" variant="secondary">
                  Report an item
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Secure claim approval
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Contact visibility after approval
              </span>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {[
                ["1.2k+", "Recovered items"],
                ["8.4k", "Active users"],
                ["3.1k", "Listings created"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[26px] border border-white/8 bg-white/[0.03] p-5"
                >
                  <p className="text-4xl font-semibold text-white">{value}</p>
                  <p className="mt-2 text-sm text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-16 top-8 h-40 w-40 rounded-full bg-white/6 blur-3xl" />
            <div className="rounded-[36px] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(2,6,23,0.96))] p-6 shadow-2xl shadow-slate-950/30 md:p-8">
              <div className="mb-5 flex items-center justify-between rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white">Operations panel</p>
                  <p className="text-xs text-slate-500">Overview of reports, claims, and messages</p>
                </div>
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-slate-300">
                  Dashboard
                </span>
              </div>
              <div className="rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">Recovery overview</p>
                    <p className="mt-1 text-sm text-slate-400">Structured workflows for item reporting and claim review.</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-slate-300">
                    Live
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.04] text-white">
                      <Icon path={feature.icon} />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">{feature.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="rounded-[32px] border border-white/8 bg-white/[0.03] p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "For campuses",
                description: "Centralize lost IDs, keys, bags, electronics, and recovery communication in one place.",
              },
              {
                title: "For teams",
                description: "Give staff and users a consistent workflow for discovery, claims, and approvals.",
              },
              {
                title: "For trust",
                description: "Keep contact protected until approval and preserve a clear message trail for every claim.",
              },
            ].map((item) => (
              <div key={item.title}>
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          align="center"
          description="Each stage is designed to reduce friction while keeping ownership checks and communication clear."
          eyebrow="Workflow"
          title="From report to return"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step}
              className="rounded-[28px] border border-white/8 bg-white/[0.03] p-6"
            >
              <p className="text-5xl font-semibold text-white/12">0{index + 1}</p>
              <p className="mt-10 text-xl font-semibold text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Listings"
            title="Recent reports"
            description="A cleaner item feed with clearer status handling and a more structured presentation."
          />
          <Link to="/dashboard/items" className="text-sm font-medium text-slate-300 hover:text-white">
            View all items
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
            : Array.isArray(items)
            ? items.map((item) => <ItemCard item={item} key={item._id} />)
            : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          align="center"
          eyebrow="Feedback"
          title="A calmer, more professional product surface"
          description="The visual language is intentionally minimal so the workflow feels focused, modern, and trustworthy."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {testimonials.map((item) => (
            <div
              key={item.author}
              className="rounded-[30px] border border-white/8 bg-white/[0.03] p-8"
            >
              <p className="text-lg leading-8 text-white">“{item.quote}”</p>
              <p className="mt-6 text-sm font-medium text-slate-400">{item.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="rounded-[38px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-8 text-center md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Start with a cleaner workflow
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold text-white md:text-5xl">
            Bring reporting, claims, and communication into one straightforward system.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The interface is structured to feel simple and professional while still supporting the full recovery flow end to end.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/register">
              <Button className="w-full sm:w-auto">Create account</Button>
            </Link>
            <Link to="/dashboard">
              <Button className="w-full sm:w-auto" variant="secondary">
                Explore dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
