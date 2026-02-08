'use client'

import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { LogOut, Settings, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

type UserMenuProps = {
  name: string | null
  email: string
}

export function UserMenu({ name, email }: UserMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium"
      >
        {name?.[0]?.toUpperCase() ?? <User className="h-4 w-4" />}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-48 rounded-md border bg-popover p-1 shadow-md">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{email}</p>
          </div>
          <div className="my-1 h-px bg-border" />
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  )
}
