type Level = "info" | "warn" | "error" | "debug";

function write(level: Level, msg: string, meta?: Record<string, unknown>): void {
  const line = JSON.stringify({ level, msg, ts: new Date().toISOString(), ...meta }) + "\n";
  if (level === "error" || level === "warn") {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
}

const isDev = (process.env["NODE_ENV"] ?? "development") !== "production";

export const log = {
  info:  (msg: string, meta?: Record<string, unknown>) => write("info",  msg, meta),
  warn:  (msg: string, meta?: Record<string, unknown>) => write("warn",  msg, meta),
  error: (msg: string, meta?: Record<string, unknown>) => write("error", msg, meta),
  debug: (msg: string, meta?: Record<string, unknown>) => { if (isDev) write("debug", msg, meta); },
};
