import { getPJs, getFirstPageSlug } from "@/lib/mdx";
import { redirect, notFound } from "next/navigation";

export default async function PJTopPage({
  params,
}: {
  params: Promise<{ pj: string }>;
}) {
  const { pj: rawPjId } = await params;
  const pjId = decodeURIComponent(rawPjId);
  const pjs = getPJs();
  const pj = pjs.find((p) => p.id === pjId);
  if (!pj) notFound();

  const firstSlug = getFirstPageSlug(pjId);
  if (firstSlug) {
    redirect(`/${firstSlug.join("/")}`);
  }

  return (
    <div className="flex items-center justify-center h-full py-24 text-gray-600">
      コンテンツを追加してください
    </div>
  );
}
