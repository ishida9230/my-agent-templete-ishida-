import { getMDXPage, getPJNavTree } from "@/lib/mdx";
import { MDXContent } from "@/components/MDXContent";
import { ChatworkPanel } from "@/components/ChatworkPanel";
import { notFound } from "next/navigation";

const PM_COURSE_PJ_ID = "pm-講座";
const PM_COURSE_CHATWORK_ROOM = "TechElite_PMコース_石田高基さん";

export default async function MDXPage({
  params,
}: {
  params: Promise<{ pj: string; slug: string[] }>;
}) {
  const { pj: pjId, slug } = await params;
  const fullSlug = [pjId, ...slug];
  const page = getMDXPage(fullSlug);

  if (!page) notFound();

  const decodedPjId = decodeURIComponent(pjId);
  const isPMCourse = decodedPjId === PM_COURSE_PJ_ID;

  return (
    <div className="px-[30px] py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
        {page.description && (
          <p className="mt-2 text-gray-600 text-sm">{page.description}</p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {page.date && (
            <span className="text-xs text-gray-500">{page.date}</span>
          )}
          {page.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-6 border-t border-gray-200" />
      </div>
      <MDXContent content={page.content} />
      {isPMCourse && (
        <ChatworkPanel defaultRoomName={PM_COURSE_CHATWORK_ROOM} />
      )}
    </div>
  );
}
