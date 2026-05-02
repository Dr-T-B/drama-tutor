const registry = new Map<string, string>()

export function register(key: string, uuid: string): void {
  registry.set(key, uuid)
}

export function resolve(key: string): string {
  const id = registry.get(key)
  if (!id) throw new Error(`UUID not registered for key: "${key}"`)
  return id
}

export function tryResolve(key: string): string | null {
  return registry.get(key) ?? null
}

export function has(key: string): boolean {
  return registry.has(key)
}

export function snapshot(): Record<string, string> {
  return Object.fromEntries(registry)
}
