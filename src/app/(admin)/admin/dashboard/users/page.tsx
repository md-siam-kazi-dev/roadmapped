import { Shield, User, UserCheck } from "lucide-react";

const users = [
  { id: "1", name: "Sarah Khan", email: "sarah@example.com", role: "LEARNER", courses: 2, streak: 12, joined: "2026-01-05" },
  { id: "2", name: "James Lee", email: "james@example.com", role: "LEARNER", courses: 1, streak: 7, joined: "2026-02-10" },
  { id: "3", name: "David Chen", email: "david@example.com", role: "INSTRUCTOR", courses: 3, streak: 0, joined: "2025-11-20" },
  { id: "4", name: "Amina Rahman", email: "amina@example.com", role: "LEARNER", courses: 4, streak: 23, joined: "2026-01-18" },
  { id: "5", name: "Omar Hassan", email: "omar@example.com", role: "LEARNER", courses: 1, streak: 3, joined: "2026-03-02" },
  { id: "6", name: "Admin User", email: "admin@roadmapped.com", role: "ADMIN", courses: 0, streak: 0, joined: "2025-10-01" },
];

const roleColors: Record<string, string> = {
  ADMIN: "bg-ember/10 text-ember",
  INSTRUCTOR: "bg-gem/10 text-gem",
  LEARNER: "bg-muted text-muted-foreground",
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage user accounts and roles. {users.length} total users.
        </p>
      </div>

      <div className="flex gap-2">
        {["All", "Admin", "Instructor", "Learner"].map((tab) => (
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
                <th className="p-3 font-medium text-muted-foreground">User</th>
                <th className="hidden p-3 font-medium text-muted-foreground sm:table-cell">Role</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Courses</th>
                <th className="hidden p-3 font-medium text-muted-foreground md:table-cell">Streak</th>
                <th className="hidden p-3 font-medium text-muted-foreground lg:table-cell">Joined</th>
                <th className="p-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <p className="font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="hidden p-3 sm:table-cell">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[u.role] ?? roleColors.LEARNER}`}>
                      {u.role === "ADMIN" && <Shield className="size-3" />}
                      {u.role === "INSTRUCTOR" && <UserCheck className="size-3" />}
                      {u.role === "LEARNER" && <User className="size-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="hidden p-3 font-mono text-foreground md:table-cell">{u.courses}</td>
                  <td className="hidden p-3 font-mono text-foreground md:table-cell">{u.streak}</td>
                  <td className="hidden p-3 text-muted-foreground lg:table-cell">{u.joined}</td>
                  <td className="p-3">
                    <button className="rounded px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      Edit Role
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}