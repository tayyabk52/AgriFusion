"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isTemporary: boolean;
  setIsCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  // Always initialize to collapsed state to avoid hydration mismatch
  // The useEffect below will update to the correct state after mount
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTemporary, setIsTemporary] = useState(true);
  // Auto-collapse on smaller screens with better breakpoint handling
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // Auto-collapse on tablets and below (< 1024px)
      if (width < 1280) {
        setIsTemporary(true);
        setIsCollapsed(true);
      } else if (width >= 1280) {
        // Auto-expand on larger screens (>= 1280px)
        setIsTemporary(false);
        setIsCollapsed(false);
      }
    };

    // Check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed, toggleSidebar, isTemporary }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
