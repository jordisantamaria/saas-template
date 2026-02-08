'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { updateProfile } from '../actions'

interface ProfileFormProps {
  initialName: string
  email: string
  initialImage: string | null
}

export function ProfileForm({ initialName, email, initialImage }: ProfileFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(initialName)
  const [image, setImage] = useState(initialImage)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setMessage('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/upload/avatar', { method: 'POST', body: formData })
    const data = (await res.json()) as { url?: string; error?: string }

    if (res.ok && data.url) {
      setImage(data.url)
      router.refresh()
    } else {
      setMessage(data.error ?? 'Upload failed.')
    }

    setUploading(false)
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const result = await updateProfile({ name })

    if (result.success) {
      setMessage('Profile updated.')
      router.refresh()
    } else {
      setMessage(result.error)
    }
    setLoading(false)
  }

  const initials = (initialName || email).charAt(0).toUpperCase()

  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-medium">Profile</h3>
      <p className="mt-1 text-sm text-muted-foreground">Your personal information.</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-16 shrink-0">
          {image ? (
            <Image
              src={image}
              alt="Avatar"
              width={64}
              height={64}
              className="size-16 rounded-full object-cover"
            />
          ) : (
            <div className="flex size-16 items-center justify-center rounded-full bg-muted text-lg font-medium text-muted-foreground">
              {initials}
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-background/80">
              <div className="size-5 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
            </div>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            {image ? 'Change avatar' : 'Upload avatar'}
          </button>
          <p className="text-xs text-muted-foreground">JPEG, PNG or WebP. Max 2MB.</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-4 grid max-w-md gap-4">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            disabled
            className="flex h-10 rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground"
          />
        </div>

        {message && (
          <p
            className={`text-sm ${message === 'Profile updated.' ? 'text-green-600' : 'text-destructive'}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 w-fit items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
