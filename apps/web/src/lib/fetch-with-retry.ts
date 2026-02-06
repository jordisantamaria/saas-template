type FetchWithRetryOptions = RequestInit & {
  retries?: number
  retryDelay?: number
}

export async function fetchWithRetry(
  url: string,
  options: FetchWithRetryOptions = {},
): Promise<Response> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions)

      if (response.ok || attempt === retries) {
        return response
      }

      // Only retry on server errors (5xx)
      if (response.status < 500) {
        return response
      }
    } catch (error) {
      if (attempt === retries) throw error
    }

    // Exponential backoff
    await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
  }

  // Unreachable, but TypeScript needs it
  throw new Error('fetchWithRetry: exhausted retries')
}
