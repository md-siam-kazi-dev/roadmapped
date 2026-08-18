import { CheckCircle2, Clock, ExternalLink, XCircle } from "lucide-react";

const submissions = [
  { id: "1", user: "Sarah Khan", course: "Frontend Mastery", submitted: "2026-04-10", status: "PENDING", link: "https://github.com/sarahk/final-project" },
  { id: "2", user: "James Lee", course: "React Advanced Patterns", submitted: "2026-04-09", status: "PENDING", link: "https://github.com/jameslee/react-assignment" },
  { id: "3", user: "David Chen", course: "Node.js Backend Dev", submitted: "2026-04-08", status: "APPROVED", link: "https://github.com/dchen/node-project" },
  { id: "4", user: "Amina Rahman", course: "CSS Architecture", submitted: "2026-04-07", status: "REJECTED", link: "https://github.com/aminar/css-proj" },
  { id: "5", user: "Omar Hassan", course: "TypeScript Deep Dive", submitted: "2026-04-06", status: "APPROVED", link: "https://github.com/omarh/ts-assignment" },
];

const badge: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-ember/10 text-ember" },
  APPROVED: { label: "Approved", className: "bg-success/10 text-success" },
  REJECTED: { label: "Rejected", className: "bg-danger/10 text-danger" },
};

export default function AdminSubmissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Assignment Submissions
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review and approve or reject learner assignment submissions.
        </p>
      </div>

      <div className="flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "All" ? "bg-action/10 text-action" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 font-medium text-muted-foreground">Learner</th>
                <th className="p-3 font-medium text-muted-foreground">Course</th>
                <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Submitted</th>
                <th className="p-3 font-medium text-muted-foreground">Status</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => {
                const b = badge[s.status] ?? badge.PENDING;
                return (
                  <tr key={s.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">{s.user}</td>
                    <td className="p-3 text-muted-foreground">{s.course}</td>
                    <td className="hidden p-3 text-muted-foreground sm:table-cell">{s.submitted}</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${b.className}`}>
                        {s.status === "PENDING" && <Clock className="size-3" />}
                        {s.status === "APPROVED" && <CheckCircle2 className="size-3" />}
                        {s.status === "REJECTED" && <XCircle className="size-3" />}
                        {b.label}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          title="Open submission"
                        >
                          <ExternalLink className="size-4" />
                        </a>
                        {s.status === "PENDING" && (
                          <>
                            <button className="rounded p-1 text-success transition-colors hover:bg-success/10" title="Approve">
                              <CheckCircle2 className="size-4" />
                            </button>
                            <button className="rounded p-1 text-danger transition-colors hover:bg-danger/10" title="Reject">
                              <XCircle className="size-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}