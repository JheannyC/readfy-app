import { db } from "../lib/db";
import { computeStats } from "../lib/metrics";
import { StatCard } from "./Frontend/components/dashboard/stat-card";
import { QuickActions } from "./Frontend/components/dashboard/quick-actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const books = await db.list();
  const stats = computeStats(books);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <QuickActions />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {/* Estatísticas*/}
      </div>

      <div className="space-y-3">
        <h2 className="text-base font-medium text-muted-foreground">
          Recentes
        </h2>
        <ul className="divide-y rounded-lg border overflow-hidden">
          {books.slice(0, 6).map((b) => (
            <li
              key={b.id}
              className="flex items-center justify-between p-3 sm:p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{b.titulo}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {b.autor}
                  {b.genero ? ` • ${b.genero}` : ""}
                </p>
              </div>
              <span className="text-xs rounded-full bg-secondary px-2 py-1">
                {b.status ?? "—"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
