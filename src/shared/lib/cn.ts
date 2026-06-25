/**
 * Tiny className combiner. Keeps a zero-dependency alternative to `clsx`,
 * filtering out falsy values so conditional classes stay readable.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
