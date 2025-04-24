import { useState, useEffect } from "react";
import { classNames } from "../../utils/classNames";
import { Link } from "react-router-dom";

interface Assignment {
  id: string;
  name: string;
}

interface SidebarProps {
  isOpen: boolean;
  onChange: (isOpen: boolean) => void;
  title: string;
}

export const Sidebar = ({ isOpen, onChange, title }: SidebarProps) => {
  // Default assignments
  const [assignments] = useState<Assignment[]>([
    { id: "demo", name: "Demo Assignment" },
    { id: "01", name: "Assignment 1" },
  ]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        isOpen &&
        !target.closest("[data-sidebar]") &&
        !target.closest("[data-sidebar-toggle]")
      ) {
        onChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => onChange(false)}
      />

      {/* Sidebar */}
      <div
        data-sidebar
        className={classNames(
          "fixed top-0 left-0 w-[300px] h-full bg-[#353745] shadow-lg z-50 flex flex-col transform transition-transform duration-300 ease-in-out text-[#b5b5b7]",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          className={classNames(
            "text-2xl hover:text-[#F6F6F4] focus:outline-none cursor-pointer",
            "flex items-center justify-center",
            "absolute w-[28px] h-[28px] top-[14px] rounded-full transition-all duration-300 ease-in-out",
            isOpen ? "right-[14px]" : "-right-[32px]"
          )}
          onClick={() => onChange(!isOpen)}
        >
          {isOpen ? "⤫" : "☰"}
        </button>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="block px-4 py-2 hover:text-[#F6F6F4] rounded-md transition-colors"
                onClick={() => onChange(false)}
              >
                Home
              </Link>
            </li>
            {assignments.map((assignment) => (
              <li key={assignment.id}>
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="block px-4 py-2 hover:text-[#F6F6F4] rounded-md transition-colors"
                  onClick={() => onChange(false)}
                >
                  {assignment.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
