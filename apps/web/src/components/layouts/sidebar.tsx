'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Settings, CreditCard, Users, Bell } from 'lucide-react'
import { cn } from '@nyxidiom/ui'

const NAV_ITEMS = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Settings', href: '/dashboard/settings', icon: Settings },
  { label: 'Billing', href: '/dashboard/settings/billing', icon: CreditCard },
  { label: 'Team', href: '/dashboard/settings/team', icon: Users },
  { label: 'Notifications', href: '/dashboard/settings/notifications', icon: Bell },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-60 shrink-0 border-r border-border/40 bg-sidebar lg:block">
      <div className="flex h-14 items-center border-b border-border/40 px-5">
        <Link href="/dashboard" className="text-base font-semibold tracking-tight">
          SaaS App
        </Link>
      </div>

      <nav className="space-y-0.5 p-3">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] transition-all duration-150',
                isActive
                  ? 'bg-sidebar-accent font-medium text-sidebar-accent-foreground shadow-sm'
                  : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
