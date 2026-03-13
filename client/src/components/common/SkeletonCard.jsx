function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[28px] border border-white/8 bg-white/[0.03] p-5">
      <div className="h-48 rounded-3xl bg-white/[0.07]" />
      <div className="mt-5 h-5 w-3/4 rounded-full bg-white/[0.07]" />
      <div className="mt-3 h-4 w-full rounded-full bg-white/[0.06]" />
      <div className="mt-2 h-4 w-2/3 rounded-full bg-white/[0.05]" />
    </div>
  );
}

export default SkeletonCard;
