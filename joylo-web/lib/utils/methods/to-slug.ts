export function toSlug(input: string): string {
    if (!input) return "";
    const strInput = String(input);
    return strInput
        .toLowerCase() // Convert to lowercase
        .replace(/\s+/g, "-"); // Replace spaces with hyphens
}
