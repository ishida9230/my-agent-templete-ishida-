import Link from "next/link";
import { getPJs } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PHASE_COLORS: Record<string, string> = {
  "立ち上げ": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "開発中": "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  "改善期": "bg-green-500/10 text-green-400 border-green-500/20",
  "リリース直前": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "アーカイブ": "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function HomeContent() {
  const pjs = getPJs();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-8 py-5">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">my-agent</h1>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">プロジェクト一覧</h2>
        </div>

        {pjs.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-12 text-center">
            <p className="text-gray-600">content/ 配下にプロジェクトを追加してください</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pjs.map((pj) => (
              <Link key={pj.id} href={`/${pj.id}`}>
                <Card className="border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all cursor-pointer h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-gray-900 text-base leading-tight">
                        {pj.name}
                      </CardTitle>
                      {pj.status === "archived" && (
                        <Badge variant="outline" className="text-xs shrink-0 border-gray-300 text-gray-600">
                          archive
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="text-gray-600 text-sm line-clamp-2">
                      {pj.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-wrap gap-2">
                      {pj.phase && (
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${PHASE_COLORS[pj.phase] ?? "bg-gray-100 text-gray-700 border-gray-300"}`}>
                          {pj.phase}
                        </span>
                      )}
                      {pj.role && (
                        <span className="inline-flex items-center rounded-md border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs text-gray-700">
                          {pj.role}
                        </span>
                      )}
                    </div>
                    {pj.joinDate && (
                      <p className="mt-3 text-xs text-gray-500">参画: {pj.joinDate}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
