import { useState } from "react";
import { 
  Home, 
  Music, 
  Users, 
  BarChart3, 
  Settings, 
  Upload,
  FileText,
  Crown,
  Shield,
  Mail
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAdmin } from "@/hooks/useAdmin";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home, roles: ['admin', 'editor', 'support'] },
  { title: "Releases", url: "/admin/releases", icon: Music, roles: ['admin', 'editor'] },
  { title: "Upload", url: "/admin/upload", icon: Upload, roles: ['admin', 'editor'] },
  { title: "Users", url: "/admin/users", icon: Users, roles: ['admin', 'support'] },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3, roles: ['admin', 'editor'] },
  { title: "Campaigns", url: "/admin/campaigns", icon: Mail, roles: ['admin', 'editor'] },
  { title: "Settings", url: "/admin/settings", icon: Settings, roles: ['admin'] },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { hasRole } = useAdmin();
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin") {
      return currentPath === "/admin";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  // Filter items based on user role
  const availableItems = adminItems.filter(item => 
    item.roles.some(role => hasRole(role as 'admin' | 'editor' | 'support'))
  );

  return (
    <Sidebar
      collapsible="icon"
    >
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Crown className="h-4 w-4" />
            {!collapsed && "AlkePlay Admin"}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {availableItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin"}
                      className={getNavCls}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {!collapsed && "Security"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/admin/audit" 
                    className={getNavCls}
                  >
                    <FileText className="h-4 w-4" />
                    {!collapsed && <span>Audit Log</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}