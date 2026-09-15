/**
 * Formats a number of bytes to the more adequate unit.
 *
 * @param {number} bytes The number of bytes.
 *
 * @returns {string} The number of bytes, appended by the unit.
 *
 */
export const formatBytes = (bytes) =>
{
    if(bytes < 1e3) return bytes + "B";
    if(bytes < 1e6) return (bytes / 1e3).toFixed(2) + " kB";
    if(bytes < 1e9) return (bytes / 1e6).toFixed(2) + " MB";
    else return (bytes / 1e9).toFixed(2) + " GB"
}