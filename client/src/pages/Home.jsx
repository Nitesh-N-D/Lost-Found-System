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

function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

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
        if (active) {
          setItems([]);
          setItemsError(true);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [retryCount]);

  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-12 sm:px-6 lg:px-10 lg:pb-24 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.08fr,0.92fr] lg:items-center">
          <div>
            <p className="eyebrow inline-flex rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] px-4 py-2 text-[11px] font-semibold uppercase">
              A little help finding your way back
            </p>
            <h1 className="hero-title mt-7 max-w-4xl text-[2.75rem] font-semibold text-stone-900 sm:text-5xl md:text-6xl xl:text-7xl">
              Lost something? Let’s bring it <span className="text-emerald-800">back to you.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
              Post a lost or found item, connect with the right person, and work through a thoughtful claim process—all in one welcoming place.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link className="w-full sm:w-auto" to="/register">
                <Button className="w-full gap-2 sm:w-auto">
                  Get started
                  <Icon className="h-4 w-4" path={icons.arrowRight} />
                </Button>
              </Link>
              <Link className="w-full sm:w-auto" to="/report-item">
                <Button className="w-full sm:w-auto" variant="secondary">
                  Report an item
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-stone-500">
              <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-700" />
                Claims reviewed with care
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-600" />
                Contact visibility after approval
              </span>
            </div>

            <p className="mt-10 border-t border-stone-200 pt-6 text-sm text-stone-600">
              Clear details help the right person recognize a match.
            </p>
          </div>

          <div className="relative">
            <div className="hero-panel reveal relative overflow-hidden rounded-[32px] border p-5 md:p-7">
              <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-12 h-48 w-48 rounded-full bg-emerald-200/50 blur-3xl" />
              <div className="relative mb-5 flex items-center justify-between rounded-[20px] border border-stone-200 bg-white/80 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-stone-900">Community board</p>
                  <p className="text-xs text-stone-500">A thoughtful path from found to home</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-800">
                  Here to help
                </span>
              </div>
              <div className="soft-panel relative rounded-[22px] border p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">Your community board</p>
                    <p className="mt-1 text-sm text-stone-500">Small details can help someone recognize what they’ve lost.</p>
                  </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                    Here to help
                  </span>
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="soft-panel rounded-[22px] border p-5 transition hover:-translate-y-1 hover:bg-white"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-900">
                      <Icon path={feature.icon} />
                    </div>
                    <p className="mt-4 text-base font-semibold text-stone-900">{feature.title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-10">
        <div className="surface-card rounded-[30px] border p-6 md:p-8">
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
                <p className="text-lg font-semibold text-stone-900">{item.title}</p>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.description}</p>
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
              className="surface-card rounded-[26px] border p-6 transition hover:-translate-y-1"
            >
              <p className="text-5xl font-semibold text-emerald-900/20">0{index + 1}</p>
              <p className="mt-10 text-xl font-semibold text-stone-900">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="reports" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Listings"
            title="Recent reports"
            description="Browse recent items reported by people in your community."
          />
          <Link to="/dashboard/items" className="text-sm font-semibold text-emerald-900 hover:text-emerald-700">
            View all items
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />) : null}
          {!loading && itemsError ? (
            <div className="surface-card rounded-[26px] border p-7 md:col-span-2 xl:col-span-3" role="alert">
              <p className="font-semibold text-stone-900">Recent reports are temporarily unavailable.</p>
              <p className="mt-2 text-sm text-stone-600">Please try again in a moment.</p>
              <button className="mt-4 text-sm font-semibold text-emerald-900 underline underline-offset-4" onClick={() => { setLoading(true); setItemsError(false); setRetryCount((count) => count + 1); }} type="button">Try again</button>
            </div>
          ) : null}
          {!loading && !itemsError && items.length === 0 ? (
            <div className="surface-card rounded-[26px] border p-7 md:col-span-2 xl:col-span-3">
              <p className="font-semibold text-stone-900">No reports yet</p>
              <p className="mt-2 text-sm text-stone-600">Be the first to post an item and help someone find their way home.</p>
              <Link className="mt-4 inline-flex text-sm font-semibold text-emerald-900 underline underline-offset-4" to="/report-item">Report an item</Link>
            </div>
          ) : null}
          {!loading && !itemsError ? items.map((item) => <ItemCard item={item} key={item._id} />) : null}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <SectionHeading
          align="center"
          eyebrow="A thoughtful process"
          title="A little more care at every step"
          description="Your details stay protected while people share the information needed to make a confident match."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {["Share only what helps someone recognize the item. Keep private details out of public descriptions.", "Use the claim conversation to check identifying details before arranging a safe handoff."].map((tip, index) => (
            <div className="surface-card flex gap-5 rounded-[28px] border p-7" key={tip}>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 font-semibold text-emerald-900">0{index + 1}</span>
              <p className="text-base leading-7 text-stone-700">{tip}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="surface-card rounded-[34px] border p-8 text-center md:p-12">
          <p className="eyebrow text-xs font-semibold uppercase">
            Ready to get started?
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
            Help a lost item find its way home.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-600">
            Post a report, review claims, and keep the conversation together until there’s a safe handoff.
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
