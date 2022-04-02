export function dateFormat(
  date: string,
  locale: string = 'pt-br',
  options?: Record<string, any> | null
): string {
  return new Date(date).toLocaleDateString(
    locale,
    options ?? { day: '2-digit', month: 'long', year: 'numeric' }
  )
}
