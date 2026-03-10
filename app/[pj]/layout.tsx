import { getPJs, getPJNavTree } from "@/lib/mdx";
import { PJSidebar } from "@/components/PJSidebar";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PJLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pj: string }>;
}) {
  const { pj: rawPjId } = await params;
  const pjId = decodeURIComponent(rawPjId);
  const pjs = getPJs();
  const pj = pjs.find((p) => p.id === pjId);
  if (!pj) notFound();

  const navTree = getPJNavTree(pjId);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 sticky top-0 h-screen border-r border-gray-200 bg-gray-50 flex flex-col">
        <div className="px-4 py-5 border-b border-gray-200 shrink-0">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
            ← プロジェクト一覧
          </Link>
          <h2 className="mt-2 text-base font-semibold text-gray-900 leading-tight">{pj.name}</h2>
          {pj.phase && (
            <span className="mt-1 inline-block text-sm text-gray-600">{pj.phase} · {pj.role}</span>
          )}
        </div>
        <div className="py-4 overflow-y-auto flex-1">
          <PJSidebar items={navTree} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
