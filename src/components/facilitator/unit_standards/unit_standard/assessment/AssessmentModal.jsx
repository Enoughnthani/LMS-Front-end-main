import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaBook, FaClipboardList, FaFileAlt, FaTimes, FaSpinner } from 'react-icons/fa';
import { assessmentService } from './services/assessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function AssessmentModal({ show, onHide, editingItem, unitStandardId, onRefresh }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    type: 'LEARNER_WORKBOOK',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { showResponse } = useApiResponse();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        dueDate: editingItem.dueDate || '',
        totalMarks: editingItem.totalMarks || '',
        type: editingItem.type || 'LEARNER_WORKBOOK',
      });
    } else {
      resetForm();
    }
  }, [editingItem, show]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      totalMarks: '',
      type: 'LEARNER_WORKBOOK',
    });
    setSelectedFile(null);
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      showResponse({ success: false, message: 'Please enter a title' });
      return;
    }

    setLoading(true);
    try {
      // Create FormData with all fields
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('dueDate', formData.dueDate);
      formDataToSend.append('totalMarks', parseInt(formData.totalMarks) || 0);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('unitStandardId', parseInt(unitStandardId));
      
      if (selectedFile) {
        formDataToSend.append('file', selectedFile);
      }

      let response;
      if (editingItem) {
        response = await assessmentService.updateAssessment(editingItem.id, formDataToSend, null);
      } else {
        response = await assessmentService.createAssessment(formDataToSend, null);
      }

      if (response?.success) {
        showResponse(response);
        onRefresh();
        onHide();
        resetForm();
      } else {
        showResponse(response || { success: false, message: 'Failed to save assessment' });
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
      showResponse({ success: false, message: 'Failed to save assessment: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="border-0 pb-0">
        <Modal.Title className="flex items-center gap-2">
          {formData.type === 'LEARNER_WORKBOOK' ? (
            <FaBook className="text-blue-600" />
          ) : (
            <FaClipboardList className="text-purple-600" />
          )}
          {editingItem ? 'Edit Assessment' : 'Create Assessment'}
        </Modal.Title>
        <button onClick={onHide} className="text-gray-400 hover:text-gray-600">
          <FaTimes />
        </button>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="text-sm font-medium text-gray-700">Assessment Type</Form.Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'LEARNER_WORKBOOK' })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  formData.type === 'LEARNER_WORKBOOK' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaBook className="inline mr-2" size={12} /> Learner Workbook
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'SUMMATIVE' })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  formData.type === 'SUMMATIVE' 
                    ? 'bg-purple-50 border-purple-300 text-purple-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FaClipboardList className="inline mr-2" size={12} /> Summative
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-sm font-medium text-gray-700">Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assessment title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="rounded-lg"
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-sm font-medium text-gray-700">Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="rounded-lg"
            />
          </Form.Group>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <Form.Group>
              <Form.Label className="text-sm font-medium text-gray-700">Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="rounded-lg"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="text-sm font-medium text-gray-700">Total Marks</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g., 100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                className="rounded-lg"
              />
            </Form.Group>
          </div>

          <Form.Group>
            <Form.Label className="text-sm font-medium text-gray-700">Assessment File (PDF/DOCX/TXT)</Form.Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="assessment-file"
              />
              <label htmlFor="assessment-file" className="cursor-pointer block">
                <FaFileAlt className="mx-auto text-2xl mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {selectedFile ? selectedFile.name : 'Click to upload assessment file'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
              </label>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="light" onClick={onHide} className="rounded-lg px-4">
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit} 
          disabled={loading}
          className="rounded-lg px-4"
        >
          {loading ? (
            <>
              <FaSpinner className="inline mr-2 animate-spin" size={14} />
              Saving...
            </>
          ) : (
            editingItem ? 'Update' : 'Create'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}