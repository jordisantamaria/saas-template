# @nyxidiom/storage

S3-compatible file storage service (Cloudflare R2, AWS S3, MinIO).

## Structure

```
src/
  types.ts       — StorageConfig, UploadResult, PresignedUploadResult
  service.ts     — createStorageService() factory
  index.ts       — Public exports
```

## Usage

```ts
import { createStorageService } from '@nyxidiom/storage'

const storage = createStorageService({
  endpoint: 'https://ACCOUNT_ID.r2.cloudflarestorage.com',
  region: 'auto',
  bucket: 'my-bucket',
  accessKeyId: 'xxx',
  secretAccessKey: 'xxx',
  publicUrl: 'https://pub-xxx.r2.dev',
})

// Server-side upload
const { key, url } = await storage.upload('avatars/user-123.webp', buffer, 'image/webp')

// Delete
await storage.delete('avatars/user-123.webp')

// Get public URL
const url = storage.getPublicUrl('avatars/user-123.webp')

// Presigned upload (for direct browser uploads)
const { url, key, expiresAt } = await storage.createPresignedUpload(
  'documents/report.pdf',
  'application/pdf',
  10 * 1024 * 1024, // 10MB max
)
```

## Conventions

- Factory function pattern (dependency injection)
- Works with any S3-compatible provider
- `publicUrl` used to construct public-facing URLs
- `delete()` is idempotent (S3 DeleteObject doesn't error on missing keys)
