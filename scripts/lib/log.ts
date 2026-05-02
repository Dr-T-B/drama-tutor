export function ok(msg: string)   { console.log(`  ✓  ${msg}`) }
export function err(msg: string)  { console.error(`  ✗  ${msg}`) }
export function info(msg: string) { console.log(`  ℹ  ${msg}`) }
export function warn(msg: string) { console.warn(`  !  ${msg}`) }
export function section(title: string) {
  console.log(`\n${'─'.repeat(60)}\n  ${title}\n${'─'.repeat(60)}`)
}
