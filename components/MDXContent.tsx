import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

export function MDXContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg prose-gray max-w-none
      prose-headings:text-gray-900 prose-headings:font-semibold
      prose-h1:text-3xl prose-h2:text-2xl prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2
      prose-h3:text-xl prose-h3:text-gray-800
      prose-p:text-gray-700 prose-p:text-base prose-p:leading-7
      prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
      prose-strong:text-gray-900
      prose-code:text-emerald-700 prose-code:bg-gray-100 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
      prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200
      prose-blockquote:border-l-gray-300 prose-blockquote:text-gray-600
      prose-table:text-base
      prose-th:text-gray-700 prose-th:bg-gray-100
      prose-td:text-gray-600
      prose-li:text-gray-700 prose-li:text-base
      prose-hr:border-gray-200
    ">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
