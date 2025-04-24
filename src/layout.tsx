import { useState } from "react";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { classNames } from "./utils/classNames";
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="relative h-screen">
      <Sidebar
        title="Games101 Playground"
        isOpen={isSidebarOpen}
        onChange={(isOpen) => setIsSidebarOpen(isOpen)}
      />

      <main
        className={classNames(
          "relative h-full transition-all duration-300",
          isSidebarOpen ? "pl-[300px]" : "pl-0"
        )}
      >
        {children}
      </main>
    </div>
  );
};
