import { Edit, FolderTree, Trash2 } from "lucide-react";

const categories = [
  { id: "1", name: "Web Development", courses: 8, description: "HTML, CSS, JavaScript, and modern web frameworks" },
  { id: "2", name: "Frontend", courses: 5, description: "React, Vue, Angular and UI/UX" },
  { id: "3", name: "Backend", courses: 6, description: "Node.js, Python, Go, and server architecture" },
  { id: "4", name: "Languages", courses: 4, description: "TypeScript, Rust, Go, and language fundamentals" },
  { id: "5", name: "DevOps", courses: 3, description: "Docker, CI/CD, cloud infrastructure" },
  { id: "6", name: "Data Science", courses: 2, description: "Python, ML, data analysis" },
];

export default function AdminCategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Categories
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Organize courses into categories. {categories.length} total.
          </p>
        </div>
        <button className="rounded-md bg-action px-4 py-2 text-sm font-medium text-action-fg transition-colors hover:bg-action-hover">
          + New Category
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="rounded-lg border border-border bg-surface p-4 transition-colors hover:border-action/30"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="size-5 text-action" />
                <h3 className="font-medium text-foreground">{cat.name}</h3>
              </div>
              <div className="flex gap-1">
                <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  <Edit className="size-3.5" />
                </button>
                <button className="rounded p-1 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{cat.description}</p>
            <p className="mt-3 font-mono text-sm text-foreground">
              {cat.courses} <span className="text-xs text-muted-foreground">courses</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}