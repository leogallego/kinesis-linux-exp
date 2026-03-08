/**
 * File System Access API wrapper for Chrome/Edge.
 * Provides directory open, file read/write, and subdirectory creation.
 */

/** Check if the File System Access API is available. */
export function isFileSystemAccessSupported() {
  return typeof window.showDirectoryPicker === 'function';
}

/**
 * Prompt the user to select a directory.
 * @returns {Promise<FileSystemDirectoryHandle>}
 */
export async function openDirectory() {
  return await window.showDirectoryPicker({ mode: 'readwrite' });
}

/**
 * Read a text file from a subdirectory.
 * @param {FileSystemDirectoryHandle} dirHandle - Root directory handle
 * @param {string} subdir - Subdirectory name (e.g., 'layouts')
 * @param {string} filename - File name (e.g., 'layout1.txt')
 * @returns {Promise<string|null>} File contents or null if not found
 */
export async function readFile(dirHandle, subdir, filename) {
  try {
    const subdirHandle = await dirHandle.getDirectoryHandle(subdir);
    const fileHandle = await subdirHandle.getFileHandle(filename);
    const file = await fileHandle.getFile();
    return await file.text();
  } catch {
    return null;
  }
}

/**
 * Write a text file to a subdirectory.
 * @param {FileSystemDirectoryHandle} dirHandle - Root directory handle
 * @param {string} subdir - Subdirectory name
 * @param {string} filename - File name
 * @param {string} content - File contents to write
 */
export async function writeFile(dirHandle, subdir, filename, content) {
  const subdirHandle = await dirHandle.getDirectoryHandle(subdir, { create: true });
  const fileHandle = await subdirHandle.getFileHandle(filename, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

/**
 * Ensure a subdirectory exists, creating it if needed.
 * @param {FileSystemDirectoryHandle} dirHandle - Root directory handle
 * @param {string} name - Subdirectory name
 * @returns {Promise<FileSystemDirectoryHandle>}
 */
export async function ensureSubdir(dirHandle, name) {
  return await dirHandle.getDirectoryHandle(name, { create: true });
}
