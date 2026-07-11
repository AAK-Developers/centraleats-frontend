/**
 * Sanitizes a filename to prevent encoding issues (accents, spaces, special characters)
 * across the network, server filesystems, and databases.
 */
export const sanitizeFilename = (filename: string): string => {
    // 1. Separate accented characters into letter + accent marker (NFD)
    // 2. Remove all accent markers
    // 3. Replace spaces and non-alphanumeric characters (except dots and hyphens) with underscores
    return filename
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .replace(/_+/g, "_"); // collapse multiple underscores
};

/**
 * Normalizes a URL that may contain double-encoded / Mojibake UTF-8 characters
 * (e.g., 'Ã¡' instead of 'á') so the browser can fetch the resource successfully.
 */
export const fixImageUrl = (url: string | undefined | null): string => {
    if (!url) return '';
    try {
        // decodeURIComponent(escape(str)) is a standard way to restore UTF-8 from ISO-8859-1 Mojibake
        return decodeURIComponent(escape(url));
    } catch {
        return url;
    }
};

/**
 * Combines file sanitization for upload. Creates a new File object with a clean name.
 */
export const prepareFileForUpload = (file: File): File => {
    const cleanName = sanitizeFilename(file.name);
    return new File([file], cleanName, { type: file.type });
};
