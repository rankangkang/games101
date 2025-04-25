import React, { useState, useEffect } from "react";
import { evaluate } from "@mdx-js/mdx";
import { MDXProvider } from "@mdx-js/react";
import * as runtime from "react/jsx-runtime";
import { useDebounceFn } from "ahooks";

interface MDXRendererProps {
  mdxString: string;
}

// MDX 组件
export function MDXRenderer({ mdxString }: MDXRendererProps) {
  const [content, setContent] = useState<React.ReactNode | null>(null);

  const { run: debouncedRender } = useDebounceFn(
    async (content: string) => {
      try {
        if (!content.trim()) {
          setContent(null);
          return;
        }

        // 使用 MDX 编译并渲染 Markdown 内容
        const { default: Content } = await evaluate(content, {
          ...runtime,
          development: false,
        });

        setContent(<Content />);
      } catch (error) {
        console.error("Failed to render markdown:", error);
        // 在渲染失败时显示错误信息
        setContent(<div className="error">Markdown rendering error</div>);
      }
    },
    { wait: 500 }
  );

  useEffect(() => {
    debouncedRender(mdxString);
  }, [mdxString, debouncedRender]);

  if (!content) {
    return null;
  }

  return (
    <MDXProvider>
      <div className="flex-1 p-4 overflow-auto">
        <div className="prose prose-invert max-w-none">{content}</div>
      </div>
    </MDXProvider>
  );
}
