import { createStorageService } from '@nyxidiom/storage'

export const storage = createStorageService({
  endpoint: process.env.R2_ENDPOINT ?? '',
  region: 'auto',
  bucket: process.env.R2_BUCKET_NAME ?? '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID ?? '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? '',
  publicUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? '',
})
