import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { storage } from '@/lib/storage'
import { db } from 'db'
import { users } from 'db/schemas'
import { eq } from 'drizzle-orm'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: 'Invalid file type. Use JPEG, PNG, or WebP.' },
      { status: 400 },
    )
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum 2MB.' },
      { status: 400 },
    )
  }

  const typePart = file.type.split('/')[1] ?? 'png'
  const ext = typePart === 'jpeg' ? 'jpg' : typePart
  const key = `avatars/${session.user.id}.${ext}`
  const buffer = new Uint8Array(await file.arrayBuffer())

  const { url } = await storage.upload(key, buffer, file.type)

  await db.update(users).set({ image: url }).where(eq(users.id, session.user.id))

  return NextResponse.json({ url })
}
