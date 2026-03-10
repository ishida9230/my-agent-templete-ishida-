"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/lib/mdx";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function NavItemComponent({ item, depth = 0, isCommentedOut = false }: { item: NavItem; depth?: number; isCommentedOut?: boolean }) {
  const pathname = usePathname();
  // URLエンコードしてパスを生成
  const itemPath = "/" + item.slug.map(segment => encodeURIComponent(segment)).join("/");
  const isActive = pathname === itemPath;
  const [open, setOpen] = useState(true);

  const indent = depth * 12;

  if (item.isDir) {
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger
          className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-left text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          style={{ paddingLeft: `${12 + indent}px` }}
        >
          <span className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>▶</span>
          <span className={isCommentedOut ? "line-through" : ""}>{item.title}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {item.children?.map((child) => {
            const childIsCommented = commentedOutTitles.includes(child.title);
            return (
              <NavItemComponent key={child.slug.join("/")} item={child} depth={depth + 1} isCommentedOut={childIsCommented} />
            );
          })}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={itemPath}
      className={`flex w-full items-center rounded-md py-1.5 text-sm transition-colors ${
        isActive
          ? "bg-gray-200 text-gray-900 font-medium"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
      style={{ paddingLeft: `${20 + indent}px`, paddingRight: "12px" }}
    >
      <span className={isCommentedOut ? "line-through" : ""}>{item.title}</span>
    </Link>
  );
}

// コメントアウトされた項目のタイトル
const commentedOutTitles = [
  "チームと体制",
  "マイルストーン",
  "リスク管理",
  "意思決定ログ",
  "現状と課題"
];

export function PJSidebar({ items }: { items: NavItem[] }) {
  return (
    <nav className="space-y-0.5 px-2">
      {items.map((item) => {
        const isCommented = commentedOutTitles.includes(item.title);
        return (
          <NavItemComponent key={item.slug.join("/")} item={item} isCommentedOut={isCommented} />
        );
      })}
    </nav>
  );
}
