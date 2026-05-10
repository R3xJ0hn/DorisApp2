import {
  BadgeCheck,
  Boxes,
  ChartNoAxesColumnIncreasing,
  ClipboardList,
  FolderTree,
  Home,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"

import { logout } from "@/api/auth"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { title: "Products", href: "/admin/products", icon: Package },
  { title: "Categories", href: "/admin/categories", icon: FolderTree },
  { title: "Inventory", href: "/admin/inventory", icon: Boxes },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Reports", href: "/admin/reports", icon: ChartNoAxesColumnIncreasing },
]

const operationsNav = [
  { title: "Tasks", href: "/admin/tasks", icon: ClipboardList },
  { title: "Approvals", href: "/admin/approvals", icon: BadgeCheck },
  { title: "Settings", href: "/admin/settings", icon: Settings },
]

function AdminSidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Doris Admin"
              render={<Link to="/admin" />}
            >
              <img
                src="/Logo.png"
                alt=""
                className="aspect-square size-8 rounded-lg object-contain"
              />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Doris Admin</span>
                <span className="truncate text-xs text-muted-foreground">
                  Operations
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Store</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    tooltip={item.title}
                    render={<Link to={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Operations</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {operationsNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.href}
                    tooltip={item.title}
                    render={<Link to={item.href} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <Button
          type="button"
          className="w-full justify-center bg-black text-white hover:bg-black/85 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:px-0"
          aria-label="Logout"
          onClick={handleLogout}
        >
          <LogOut />
          <span className="group-data-[collapsible=icon]:hidden">Logout</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export { AdminSidebar }
