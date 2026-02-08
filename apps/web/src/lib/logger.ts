type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) ?? 'info'

function shouldLog(level: LogLevel): boolean {
  return (LOG_LEVELS[level] ?? 0) >= (LOG_LEVELS[currentLevel] ?? 0)
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const base = { timestamp, level, message }
  return meta ? { ...base, ...meta } : base
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('debug')) console.debug(JSON.stringify(formatMessage('debug', message, meta)))
  },
  info(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('info')) console.info(JSON.stringify(formatMessage('info', message, meta)))
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('warn')) console.warn(JSON.stringify(formatMessage('warn', message, meta)))
  },
  error(message: string, meta?: Record<string, unknown>) {
    if (shouldLog('error')) console.error(JSON.stringify(formatMessage('error', message, meta)))
  },
}
