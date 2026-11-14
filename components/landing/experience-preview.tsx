export function ExperiencePreview() {
  return (
    <div className="relative isolate flex h-[420px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-[#071d29] shadow-[0_30px_80px_rgba(2,16,24,0.55)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(91,175,194,0.24),_transparent_55%)]" />
      <div className="absolute inset-8 rounded-[1.6rem] border border-white/8 bg-[linear-gradient(135deg,rgba(11,31,42,0.75),rgba(7,22,29,0.96))]" />

      <div className="pulse-soft absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200/35" />
      <div className="pulse-soft absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-100/25" />

      <div className="earth-globe float-soft relative z-10 flex h-40 w-40 items-center justify-center rounded-full border border-white/15">
        <div className="absolute inset-3 rounded-full border border-white/15" />
        <div className="absolute inset-5 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,247,214,0.96),rgba(150,205,179,0.9)_18%,rgba(73,142,164,0.9)_36%,rgba(17,63,92,0.96)_68%,rgba(10,27,35,0.96)_100%)]" />
      </div>

      <div className="absolute bottom-8 left-8 rounded-2xl border border-white/10 bg-[#031b25]/80 px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="mb-2 text-[0.58rem] font-medium uppercase tracking-[0.3em] text-sky-100/70">
          Signals
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-100">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
          movement
        </div>
      </div>

      <div className="absolute right-8 top-8 rounded-2xl border border-white/10 bg-[#031b25]/80 px-4 py-3 shadow-lg backdrop-blur-md">
        <div className="mb-2 text-[0.58rem] font-medium uppercase tracking-[0.3em] text-sky-100/70">
          Planetary flow
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-100">
          <span className="h-2.5 w-2.5 rounded-full bg-[#d6b778] shadow-[0_0_14px_rgba(214,183,120,0.7)]" />
          sound + motion
        </div>
      </div>
    </div>
  );
}
