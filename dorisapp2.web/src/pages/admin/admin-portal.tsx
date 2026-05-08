import {
  Boxes,
  CircleDollarSign,
  ClipboardCheck,
  PackageCheck,
  Search,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const stats = [
  {
    label: "Revenue",
    value: "$42,860",
    detail: "+12.4% this month",
    icon: CircleDollarSign,
  },
  {
    label: "Orders",
    value: "1,248",
    detail: "86 awaiting fulfillment",
    icon: ShoppingBag,
  },
  {
    label: "Products",
    value: "384",
    detail: "21 low stock items",
    icon: Boxes,
  },
  {
    label: "Customers",
    value: "8,492",
    detail: "+318 new accounts",
    icon: Users,
  },
]

const orderQueue = [
  {
    id: "DR-1048",
    customer: "Maria Santos",
    status: "Packing",
    total: "$128.40",
  },
  {
    id: "DR-1047",
    customer: "James Miller",
    status: "Payment review",
    total: "$86.20",
  },
  {
    id: "DR-1046",
    customer: "Anika Reyes",
    status: "Ready to ship",
    total: "$214.00",
  },
]

function AdminPortal() {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/75 md:px-6">
          <SidebarTrigger />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-base font-medium">Dashboard</h1>
          </div>
          <div className="hidden h-8 w-72 items-center gap-2 rounded-md border bg-muted/30 px-3 text-sm text-muted-foreground md:flex">
            <Search className="size-4" />
            <span>Search orders, products, customers</span>
          </div>
          <Button size="sm">New order</Button>
        </header>

        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border bg-card p-4 text-card-foreground"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <stat.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="mt-4 text-2xl font-semibold tracking-tight">
                  {stat.value}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {stat.detail}
                </p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="rounded-lg border bg-card text-card-foreground">
              <div className="flex items-center justify-between gap-3 border-b p-4">
                <div>
                  <h2 className="font-medium">Order Queue</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest orders that need admin attention.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  View all
                </Button>
              </div>
              <div className="divide-y">
                {orderQueue.map((order) => (
                  <div
                    key={order.id}
                    className="grid gap-3 p-4 text-sm sm:grid-cols-[110px_1fr_150px_90px]"
                  >
                    <span className="font-medium">{order.id}</span>
                    <span>{order.customer}</span>
                    <span className="text-muted-foreground">
                      {order.status}
                    </span>
                    <span className="font-medium sm:text-right">
                      {order.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4 text-card-foreground">
              <h2 className="font-medium">Today</h2>
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <PackageCheck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">34 orders packed</p>
                    <p className="text-sm text-muted-foreground">
                      Fulfillment is tracking ahead of target.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Truck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">18 shipments pending</p>
                    <p className="text-sm text-muted-foreground">
                      Carrier pickup window starts at 4:00 PM.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <ClipboardCheck className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">7 approvals open</p>
                    <p className="text-sm text-muted-foreground">
                      Discount and refund requests need review.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

export { AdminPortal }
