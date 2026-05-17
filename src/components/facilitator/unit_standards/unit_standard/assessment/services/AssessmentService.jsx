import { apiFetch } from '@/api/api';
import { BASE_URL } from '@/utils/apiEndpoint';

export const assessmentService = {
  // Get all assessments for a unit standard
  getAssessments: (unitStandardId) =>
    apiFetch(`/api/assessments/unit-standard/${unitStandardId}`),

  // Get assessment by ID
  getAssessmentById: (id) =>
    apiFetch(`/api/assessments/${id}`),

  getEnrollmentCountByProgramId: (programId) =>
    apiFetch(`/api/enrollments/count/${programId}`),


  getUserSubmission: (assessmentId) =>
    apiFetch(`/api/assessments/${assessmentId}/submission`),


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
      xhr.withCredentials = true;
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
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  },

  // Delete assessment
  deleteAssessment: (id) =>
    apiFetch(`/api/assessments/${id}`, { method: 'DELETE' }),

  // Get submissions for an assessment (facilitator view)
  getSubmissions: (assessmentId) =>
    apiFetch(`/api/assessments/${assessmentId}/submissions`),

  // Submit assessment (file upload)
  submitAssessment: (file, assessmentId, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('assessmentId', assessmentId);

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
          reject(new Error(`Submit failed: ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error('Network error'));

      xhr.open('POST', `${BASE_URL}/api/assessments/submit`);
      xhr.withCredentials = true;
      xhr.send(formData);
    });
  },

  // Submit text answer
  submitTextAnswer: (assessmentId, answer) =>
    apiFetch(`/api/assessments/${assessmentId}/submit-text`, {
      method: 'POST',
      body: JSON.stringify({ answer })
    }),

  // Download assessment file with original name
  downloadAssessmentFile: (fileUrl, originalFileName) => {
    const filename = fileUrl.split('/').pop();
    const downloadUrl = `${BASE_URL}/uploads/assessments/${filename}/download?originalName=${encodeURIComponent(originalFileName)}`;
    window.open(downloadUrl, '_blank');
  },
};