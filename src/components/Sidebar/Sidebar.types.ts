// Interface for menu items
export interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path?: string;
  onClick?: () => void;
  // For popover type
  items?: {
    id: string;
    title: string;
    path: string;
    onClick?: () => void;
  }[];
}

// Interface for sidebar configuration
export interface SidebarConfig {
  top: MenuItem[];
  bottom: MenuItem[];
}
