import { apiFetch } from '@/api/api';
import { BASE_URL } from '@/utils/apiEndpoint';

export const assessmentService = {
  // Get all assessments for a unit standard
  getAssessments: (unitStandardId) => 
    apiFetch(`/api/assessments/unit-standard/${unitStandardId}`),

  // Get assessment by ID
  getAssessmentById: (id) => 
    apiFetch(`/api/assessments/${id}`),

  // Create assessment (with or without file)
  createAssessment: (formData, onProgress) => {
    return new Promise((resolve, reject) => {
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
          reject(new Error(`Create failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      xhr.open('POST', `${BASE_URL}/api/assessments`);
      xhr.send(formData);
    });
  },

  // Update assessment (with or without file)
  updateAssessment: (id, formData, onProgress) => {
    return new Promise((resolve, reject) => {
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
          reject(new Error(`Update failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      xhr.open('PUT', `${BASE_URL}/api/assessments/${id}`);
      xhr.send(formData);
    });
  },

  // Delete assessment
  deleteAssessment: (id) => 
    apiFetch(`/api/assessments/${id}`, { method: 'DELETE' }),

  // Get submissions for an assessment
  getSubmissions: (assessmentId) => 
    apiFetch(`/api/assessments/${assessmentId}/submissions`),

  // Download assessment file
  downloadAssessmentFile: (fileUrl) => {
    const filename = fileUrl.split('/').pop();
    window.open(`${BASE_URL}/api/assessments/download/${filename}`, '_blank');
  }
};