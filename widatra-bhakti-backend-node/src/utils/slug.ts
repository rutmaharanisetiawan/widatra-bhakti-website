export function slugify(text: string, fallback = "item"): string {
  const s = text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || fallback;
}

export async function generateUniqueSlug(
  title: string,
  existsFn: (slug: string) => Promise<boolean>,
  fallback = "item"
): Promise<string> {
  const base = slugify(title, fallback);
  if (!(await existsFn(base))) {
    return base;
  }
  let counter = 2;
  while (await existsFn(`${base}-${counter}`)) {
    counter++;
  }
  return `${base}-${counter}`;
}
