interface DriveFileMetadata {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  size: string;
}

const driveCache = new Map<string, DriveFileMetadata>();

export const extractFileIdFromLink = (link: string): string | null => {
  try {
    const url = new URL(link);
    
    // Handle different Google Drive URL formats
    if (url.hostname === 'drive.google.com') {
      // Format: https://drive.google.com/file/d/{fileId}/view
      if (url.pathname.includes('/file/d/')) {
        const matches = url.pathname.match(/\/file\/d\/([^/]+)/);
        return matches ? matches[1] : null;
      }
      
      // Format: https://drive.google.com/open?id={fileId}
      const urlParams = new URLSearchParams(url.search);
      const fileId = urlParams.get('id');
      if (fileId) return fileId;
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing Drive link:', error);
    return null;
  }
};

export const validateDriveLink = (link: string): boolean => {
  const fileId = extractFileIdFromLink(link);
  return !!fileId && /^[a-zA-Z0-9_-]+$/.test(fileId);
};

export const getDirectDownloadLink = (fileId: string): string => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

export const getCachedMetadata = (fileId: string): DriveFileMetadata | undefined => {
  return driveCache.get(fileId);
};

export const setCachedMetadata = (fileId: string, metadata: DriveFileMetadata): void => {
  driveCache.set(fileId, metadata);
};

export const clearCache = (): void => {
  driveCache.clear();
};