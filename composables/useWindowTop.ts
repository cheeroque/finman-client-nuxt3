export function useWindowTop(): number {
  if (!process.client) return 0

  return Math.max(window.pageYOffset, document?.documentElement?.scrollTop, document?.body?.scrollTop) ?? 0
}
