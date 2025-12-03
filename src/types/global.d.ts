import type { FC, SVGProps } from 'react';

declare module 'lucide-react' {
  export type LucideIcon = FC<SVGProps<SVGSVGElement> & { size?: number | string }>;
  
  export const AlertCircle: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const FileText: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Clock: LucideIcon;
}
