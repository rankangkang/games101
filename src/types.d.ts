// mdx 类型扩展
declare module "*.mdx" {
  import { ComponentType } from "react";

  interface MDXMeta {
    title: string;
    date: string;
    tags?: string[];
  }

  // 导出元数据
  export const meta: MDXMeta;

  const MDXComponent: ComponentType<{
    components?: Record<string, ComponentType<unknown>>;
  }>;

  export default MDXComponent;
}
