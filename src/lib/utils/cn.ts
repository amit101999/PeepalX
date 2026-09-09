type ClassValue = string | false | null | undefined;

/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not `clsx` + `tailwind-merge`: the components in this project
 * compose classes in a fixed order and do not need conflict resolution, so a
 * six-line helper avoids two dependencies.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
