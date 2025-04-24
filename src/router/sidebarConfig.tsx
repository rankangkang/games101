import { SidebarConfig, MenuItem } from "../components/Sidebar/Sidebar.types";
import { routeConfig, RouteConfig } from "./config";

type SafeRouteConfig = RouteConfig;

// Process a route and its children to create menu items
function processRoute(
  route: SafeRouteConfig,
  parentPath = ""
): MenuItem | null {
  const meta = route.meta;
  if (!meta || !meta.showInSidebar) {
    return null;
  }

  const fullPath = `${parentPath}${route.path}`.replace(/\/\//g, "/");

  const menuItem: MenuItem = {
    id: route.path?.replace(/^\//, "") || "root",
    title: meta.title || "",
    icon: meta.icon,
    path: route.children?.length ? undefined : fullPath,
  };

  if (route.children?.length) {
    // Process child routes - cast to SafeRouteConfig to ensure types match
    const childItems = route.children
      .map((childRoute) => {
        const safeChild = childRoute as SafeRouteConfig;
        const childPath = `${fullPath}/${safeChild.path}`.replace(/\/\//g, "/");
        if (!safeChild.meta?.showInSidebar) {
          return null;
        }

        return {
          id: safeChild.path || "child",
          title: safeChild.meta.title || '',
          path: childPath,
        };
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    if (childItems.length > 0) {
      menuItem.items = childItems;
    }
  }

  return menuItem;
}

// Generate sidebar config from route configuration
export function generateSidebarConfig(
  routes: SafeRouteConfig[]
): SidebarConfig {
  const top: MenuItem[] = [];
  const bottom: MenuItem[] = [];

  // Process each route
  routes.forEach((route) => {
    const menuItem = processRoute(route);
    if (menuItem && route.meta) {
      if (route.meta.position === "bottom") {
        bottom.push(menuItem);
      } else {
        top.push(menuItem);
      }
    }
  });

  return { top, bottom };
}

export function getSidebarConfig() {
  return generateSidebarConfig(routeConfig);
}
