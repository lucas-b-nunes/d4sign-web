"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n/provider";
import { documentationContent } from "@/lib/i18n/documentation";
import { cn } from "@/lib/utils";

function DocList({ items, ordered }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag
      className={cn(
        "space-y-2 text-sm text-muted-foreground",
        ordered ? "list-decimal pl-5" : "list-disc pl-5",
      )}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
}

export function DocumentationContent() {
  const { locale } = useI18n();
  const doc = documentationContent[locale];

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <nav className="lg:sticky lg:top-6 lg:w-56 shrink-0">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{doc.toc}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {doc.sections.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              >
                {section.title}
              </a>
            ))}
          </CardContent>
        </Card>
      </nav>

      <div className="min-w-0 flex-1 space-y-8 max-w-3xl">
        <p className="text-muted-foreground text-sm leading-relaxed">{doc.subtitle}</p>

        {doc.sections.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-6 space-y-3">
            <h2 className="text-lg font-semibold border-b border-border pb-2">
              {section.title}
            </h2>
            {section.paragraphs.map((p) => (
              <p key={p} className="text-sm text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
            {section.steps && section.steps.length > 0 && (
              <DocList items={section.steps} ordered />
            )}
            {section.bullets && section.bullets.length > 0 && (
              <DocList items={section.bullets} />
            )}
            {section.note && (
              <p className="text-xs rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-amber-900">
                {section.note}
              </p>
            )}
          </section>
        ))}

        <Card className="bg-muted/30">
          <CardContent className="pt-5 text-sm text-muted-foreground">
            {doc.externalApiNote}{" "}
            <Link
              href="https://docapi.d4sign.com.br/docs"
              target="_blank"
              rel="noreferrer"
              className="text-[var(--bitrix-primary-dark)] underline"
            >
              {doc.externalApiLink}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
