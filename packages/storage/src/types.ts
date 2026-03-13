export type StorageConfig = {
  endpoint: string
  region: string
  bucket: string
  accessKeyId: string
  secretAccessKey: string
  publicUrl: string
}

export type UploadResult = {
  key: string
  url: string
}

export type PresignedUploadResult = {
  url: string
  key: string
  expiresAt: Date
}
