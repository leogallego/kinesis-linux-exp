/**
 * Upload/download fallback for browsers without File System Access API (Firefox).
 */

/**
 * Prompt the user to upload a directory of files.
 * Returns a Map<subdir, File[]> grouped by subdirectory.
 * @returns {Promise<Map<string, File[]>>}
 */
export function uploadDirectory() {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true;
    input.multiple = true;

    input.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      const grouped = new Map();

      for (const file of files) {
        const parts = file.webkitRelativePath.split('/');
        // parts: [rootDir, subdir?, filename] or [rootDir, filename]
        const subdir = parts.length > 2 ? parts[parts.length - 2] : '';
        if (!grouped.has(subdir)) grouped.set(subdir, []);
        grouped.get(subdir).push(file);
      }

      resolve(grouped);
    });

    input.click();
  });
}

/**
 * Trigger a file download in the browser.
 * @param {string} filename - Suggested file name
 * @param {string} content - Text content to download
 */
export function downloadFile(filename, content) {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
