import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { StorageConfig, UploadResult, PresignedUploadResult } from './types'

export function createStorageService(config: StorageConfig) {
  const client = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  })

  function getPublicUrl(key: string): string {
    return `${config.publicUrl}/${key}`
  }

  return {
    getPublicUrl,

    async upload(
      key: string,
      body: Uint8Array | ReadableStream,
      contentType: string,
    ): Promise<UploadResult> {
      await client.send(
        new PutObjectCommand({
          Bucket: config.bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      )
      return { key, url: getPublicUrl(key) }
    },

    async delete(key: string): Promise<void> {
      await client.send(
        new DeleteObjectCommand({
          Bucket: config.bucket,
          Key: key,
        }),
      )
    },

    async createPresignedUpload(
      key: string,
      contentType: string,
      maxSizeBytes: number,
      expiresInSeconds = 3600,
    ): Promise<PresignedUploadResult> {
      const command = new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: contentType,
        ContentLength: maxSizeBytes,
      })

      const url = await getSignedUrl(client, command, {
        expiresIn: expiresInSeconds,
      })

      return {
        url,
        key,
        expiresAt: new Date(Date.now() + expiresInSeconds * 1000),
      }
    },
  }
}
