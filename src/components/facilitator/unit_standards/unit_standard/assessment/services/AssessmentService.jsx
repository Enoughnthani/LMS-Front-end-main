import { apiFetch } from '@/api/api';
import { BASE_URL } from '@/utils/apiEndpoint';

export const AssessmentService = {
  // Get all assessments for a unit standard
  getAssessments: (unitStandardId) => 
    apiFetch(`/api/assessments/unit-standard/${unitStandardId}`),

  // Get assessment by ID
  getAssessmentById: (id) => 
    apiFetch(`/api/assessments/${id}`),

  // Create assessment
  createAssessment: (data) => 
    apiFetch('/api/assessments', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Update assessment
  updateAssessment: (id, data) => 
    apiFetch(`/api/assessments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Delete assessment
  deleteAssessment: (id) => 
    apiFetch(`/api/assessments/${id}`, { method: 'DELETE' }),

  // Upload assessment file (DOCX, PDF, TXT)
  uploadAssessmentFile: (file, assessmentId, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assessmentId", assessmentId);

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
          reject(new Error(`Upload failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      xhr.open('POST', `${BASE_URL}/api/assessments/upload`);
      xhr.send(formData);
    });
  },

  // Download assessment file (for learners)
  downloadAssessmentFile: (fileUrl) => {
    const filename = fileUrl.split('/').pop();
    const downloadUrl = `${BASE_URL}/api/assessments/download/${filename}`;
    window.open(downloadUrl, '_blank');
  },

  // Submit learner's completed assessment
  submitLearnerAssessment: (assessmentId, file, onProgress) => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assessmentId", assessmentId);

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
          reject(new Error(`Submission failed: ${xhr.status}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error'));
      
      xhr.open('POST', `${BASE_URL}/api/assessments/submit`);
      xhr.send(formData);
    });
  },

  // Get learner submissions for an assessment
  getSubmissions: (assessmentId) => 
    apiFetch(`/api/assessments/${assessmentId}/submissions`),

  // Grade submission (facilitator)
  gradeSubmission: (submissionId, marks, feedback) => 
    apiFetch(`/api/assessments/submissions/${submissionId}/grade`, {
      method: 'PUT',
      body: JSON.stringify({ marks, feedback })
    })
};