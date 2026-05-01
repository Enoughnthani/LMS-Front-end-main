import { apiFetch } from '@/api/api';
import { BASE_URL } from '@/utils/apiEndpoint';

// Helper to detect content type from file extension
const getContentTypeFromFile = (fileName) => {
  const ext = fileName.split('.').pop().toLowerCase();
  const typeMap = {
    'pdf': 'PDF',
    'docx': 'DOCX',
    'doc': 'DOCX',
    'xlsx': 'XLSX',
    'xls': 'XLSX',
    'pptx': 'PPTX',
    'ppt': 'PPTX',
    'mp4': 'VIDEO',
    'mov': 'VIDEO',
    'avi': 'VIDEO',
    'webm': 'VIDEO',
    'jpg': 'OTHER',
    'jpeg': 'OTHER',
    'png': 'OTHER',
    'gif': 'OTHER',
    'txt': 'OTHER',
    'zip': 'OTHER',
    'rar': 'OTHER',
    'json': 'OTHER',
    'xml': 'OTHER'
  };
  return typeMap[ext] || 'OTHER';
};

export const programResourceService = {
  // Get contents (root or folder)
  getContents: (programId, folderId = null) => 
    apiFetch(folderId 
      ? `/api/content/children/${folderId}`
      : `/api/content/program/${programId}`),

  // Create folder
  createFolder: (name, programId, parentId = null) => 
    apiFetch("/api/content", {
      method: "POST",
      body: JSON.stringify({ 
        name, 
        type: "FOLDER", 
        programId: parseInt(programId), 
        parentId 
      })
    }),

  // Upload file with progress tracking
  uploadFile: (file, programId, parentId = null, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      // Auto use filename without extension as name
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      formData.append("name", nameWithoutExt);
      // Use proper content type based on file extension
      const contentType = getContentTypeFromFile(file.name);
      formData.append("type", contentType);
      formData.append("programId", programId);
      if (parentId) formData.append("parentId", parentId);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress?.(Math.round((e.loaded / e.total) * 100));
        }
      });
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch {
            resolve(xhr.responseText);
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      xhr.ontimeout = () => reject(new Error('Upload timeout'));
      
      xhr.open('POST', `${BASE_URL}/api/content/upload`);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  },

  // Rename item (folder or file)
  renameItem: (id, newName) => 
    apiFetch(`/api/content/${id}`, { 
      method: "PUT", 
      body: JSON.stringify({ name: newName }) 
    }),

  // Delete item (folder or file)
  deleteItem: (id) => 
    apiFetch(`/api/content/${id}`, { method: "DELETE" })
};