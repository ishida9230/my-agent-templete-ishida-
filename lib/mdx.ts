import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type PJMeta = {
  id: string;
  name: string;
  description: string;
  phase: string;
  role: string;
  joinDate: string;
  serviceUrl?: string;
  status: "active" | "archived";
  color?: string;
};

export type MDXPage = {
  slug: string[];
  title: string;
  description?: string;
  date?: string;
  tags?: string[];
  content: string;
};

export type NavItem = {
  title: string;
  slug: string[];
  children?: NavItem[];
  isDir: boolean;
};

/** PJ一覧を取得 */
export function getPJs(): PJMeta[] {
  const pjsDir = CONTENT_DIR;
  if (!fs.existsSync(pjsDir)) return [];

  return fs
    .readdirSync(pjsDir)
    .filter((name) => {
      const fullPath = path.join(pjsDir, name);
      return fs.statSync(fullPath).isDirectory();
    })
    .map((pjId) => {
      const metaPath = path.join(pjsDir, pjId, "_pj.json");
      if (fs.existsSync(metaPath)) {
        const raw = fs.readFileSync(metaPath, "utf-8");
        return { id: pjId, ...JSON.parse(raw) } as PJMeta;
      }
      return {
        id: pjId,
        name: pjId,
        description: "",
        phase: "",
        role: "",
        joinDate: "",
        status: "active" as const,
      };
    });
}

/** PJのナビゲーションツリーを取得 */
export function getPJNavTree(pjId: string): NavItem[] {
  const pjDir = path.join(CONTENT_DIR, pjId);
  if (!fs.existsSync(pjDir)) return [];
  return buildNavTree(pjDir, [pjId]);
}

function buildNavTree(dirPath: string, baseSlugs: string[]): NavItem[] {
  const entries = fs.readdirSync(dirPath).filter((name) => {
    // _pj.json やドットファイルを除外
    return !name.startsWith("_") && !name.startsWith(".");
  });

  const items: NavItem[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const children = buildNavTree(fullPath, [...baseSlugs, entry]);
      items.push({
        title: entry,
        slug: [...baseSlugs, entry],
        children,
        isDir: true,
      });
    } else if (entry.endsWith(".mdx")) {
      const title = entry.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data } = matter(raw);
      items.push({
        title: (data.title as string) || title,
        slug: [...baseSlugs, title],
        isDir: false,
      });
    }
  }

  // ディレクトリを先、ファイルを後ろにソート
  return items.sort((a, b) => {
    if (a.isDir !== b.isDir) return a.isDir ? -1 : 1;
    return a.title.localeCompare(b.title, "ja");
  });
}

/** slug からMDXページを取得 */
export function getMDXPage(slugs: string[]): MDXPage | null {
  // slugs = [pjId, ...rest]
  const [pjId, ...rest] = slugs;

  // URLデコードされたパスを処理
  const decodedRest = rest.map((segment) => decodeURIComponent(segment));
  const decodedPJId = decodeURIComponent(pjId);

  // ファイルのパス候補
  const joinedPath = decodedRest.join("/");
  const candidates = [
    path.join(CONTENT_DIR, decodedPJId, `${joinedPath}.mdx`),
    path.join(CONTENT_DIR, decodedPJId, joinedPath, "index.mdx"),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      
      // dateを文字列に変換（Dateオブジェクトの場合は文字列化）
      let dateString: string | undefined;
      if (data.date) {
        if (data.date instanceof Date) {
          dateString = data.date.toISOString().split('T')[0]; // YYYY-MM-DD形式
        } else if (typeof data.date === 'string') {
          dateString = data.date;
        } else {
          dateString = String(data.date);
        }
      }
      
      return {
        slug: slugs,
        title: (data.title as string) || decodedRest[decodedRest.length - 1] || decodedPJId,
        description: data.description as string | undefined,
        date: dateString,
        tags: data.tags as string[] | undefined,
        content,
      };
    }
  }

  return null;
}

/** PJの最初のページのslugを取得 */
export function getFirstPageSlug(pjId: string): string[] | null {
  const tree = getPJNavTree(pjId);
  return findFirstPage(tree);
}

function findFirstPage(items: NavItem[]): string[] | null {
  for (const item of items) {
    if (!item.isDir) return item.slug;
    if (item.children) {
      const found = findFirstPage(item.children);
      if (found) return found;
    }
  }
  return null;
}
