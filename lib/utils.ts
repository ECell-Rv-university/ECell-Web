export type ClassValue = string | false | null | undefined;

/** Joins conditional class names without adding another runtime dependency. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
