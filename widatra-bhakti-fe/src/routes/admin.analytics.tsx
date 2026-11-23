import { createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatCard } from "@/components/admin-shell";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: () => (
    <AdminShell
      title="Analytics"
      subtitle="Traffic, engagement and conversion across the Widatra digital ecosystem."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Page views" value="128,472" delta="+8.4%" />
        <StatCard label="Unique visitors" value="42,918" delta="+11.2%" />
        <StatCard label="Avg. time" value="2m 48s" />
        <StatCard label="Conversion" value="3.6%" delta="+0.4pp" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-3">Top pages</div>
          <div className="space-y-3 text-sm">
            {[
              ["/products", "24,182"],
              ["/careers", "18,904"],
              ["/", "16,220"],
              ["/factory-tour", "9,412"],
              ["/about", "7,844"],
            ].map(([p, v]) => (
              <div key={p} className="flex justify-between border-b border-hairline pb-2">
                <span className="font-mono text-[12px]">{p}</span>
                <span className="font-semibold">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card-elevated p-6">
          <div className="eyebrow text-primary mb-3">Traffic by country</div>
          <div className="space-y-3 text-sm">
            {[
              ["Indonesia", 82],
              ["Singapore", 6],
              ["Malaysia", 4],
              ["Japan", 3],
              ["Others", 5],
            ].map(([c, n]) => (
              <div key={c as string}>
                <div className="flex justify-between mb-1"><span>{c}</span><span className="font-semibold">{n}%</span></div>
                <div className="h-1.5 bg-brand-tint rounded-full overflow-hidden"><div className="h-full bg-primary" style={{ width: `${n}%` }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminShell>
  ),
});
