'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Auto-collapse on smaller screens with better breakpoint handling
    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            // Auto-collapse on tablets and below (< 1024px)
            if (width < 1024) {
                setIsCollapsed(true);
            } else if (width >= 1280) {
                // Auto-expand on larger screens (>= 1280px)
                setIsCollapsed(false);
            }
        };

        // Check on mount
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <SidebarContext.Provider value={{ isCollapsed, setIsCollapsed, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}
