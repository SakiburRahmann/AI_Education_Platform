import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";

const components: Components = {
  h1: ({ children, ...props }) => (
    <h1 className="font-heading text-xl font-bold mt-6 mb-3 first:mt-0" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="font-heading text-lg font-bold mt-5 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="font-heading text-base font-semibold mt-4 mb-2" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="my-2 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 my-2 space-y-1" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 my-2 space-y-1" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => <li className="leading-relaxed" {...props}>{children}</li>,
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-l-4 border-primary/30 pl-4 my-3 italic text-muted-foreground"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ className, children, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <div className="relative my-3">
        <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm font-mono leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      </div>
    );
  },
  pre: ({ children }) => <>{children}</>,
  table: ({ children, ...props }) => (
    <div className="my-3 overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => <thead className="bg-muted/50" {...props}>{children}</thead>,
  th: ({ children, ...props }) => (
    <th className="px-3 py-2 text-left font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-3 py-2" {...props}>
      {children}
    </td>
  ),
  hr: (props) => <hr className="my-6 border-border" {...props} />,
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-eduai-secondary underline hover:no-underline"
      {...props}
    >
      {children}
    </a>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),
  em: ({ children, ...props }) => <em className="italic" {...props}>{children}</em>,
};

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
}
