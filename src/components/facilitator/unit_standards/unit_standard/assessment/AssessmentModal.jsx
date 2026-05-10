import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaBook, FaClipboardList, FaFileAlt, FaTimes } from 'react-icons/fa';
import { AssessmentService } from './services/AssessmentService';

export default function AssessmentModal({ show, onHide, editingItem, unitStandardId, onRefresh }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    type: 'LEARNER_WORKBOOK',
    status: 'DRAFT'
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        description: editingItem.description || '',
        dueDate: editingItem.dueDate || '',
        totalMarks: editingItem.totalMarks || '',
        type: editingItem.type || 'LEARNER_WORKBOOK',
        status: editingItem.status || 'DRAFT'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        totalMarks: '',
        type: 'LEARNER_WORKBOOK',
        status: 'DRAFT'
      });
      setSelectedFile(null);
    }
  }, [editingItem, show]);

  const handleSubmit = async () => {
    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    setLoading(true);
    try {
      let savedAssessment;
      
      if (editingItem) {
        savedAssessment = await AssessmentService.updateAssessment(editingItem.id, {
          ...formData,
          unitStandardId: parseInt(unitStandardId)
        });
      } else {
        savedAssessment = await AssessmentService.createAssessment({
          ...formData,
          unitStandardId: parseInt(unitStandardId)
        });
      }

      // Upload file if selected
      if (selectedFile && savedAssessment?.id) {
        setUploading(true);
        await AssessmentService.uploadAssessmentFile(selectedFile, savedAssessment.id, (progress) => {
          setUploadProgress(progress);
        });
      }

      onRefresh();
      onHide();
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment');
    } finally {
      setLoading(false);
      setUploading(false);
      setUploadProgress(0);
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
          <Form.Group className="mb-3">
            <Form.Label>Assessment Type</Form.Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'LEARNER_WORKBOOK' })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  formData.type === 'LEARNER_WORKBOOK' 
                    ? 'bg-blue-50 border-blue-300 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-600'
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
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <FaClipboardList className="inline mr-2" size={12} /> Summative
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter assessment title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Form.Group>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <Form.Group>
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Total Marks</Form.Label>
              <Form.Control
                type="number"
                placeholder="e.g., 100"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
              />
            </Form.Group>
          </div>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'DRAFT' })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  formData.status === 'DRAFT' 
                    ? 'bg-amber-50 border-amber-300 text-amber-700' 
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: 'PUBLISHED' })}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  formData.status === 'PUBLISHED' 
                    ? 'bg-green-50 border-green-300 text-green-700' 
                    : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                Published
              </button>
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label>Assessment File (PDF/DOCX/TXT)</Form.Label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="hidden"
                id="assessment-file"
              />
              <label htmlFor="assessment-file" className="cursor-pointer text-gray-500 hover:text-blue-600">
                <FaFileAlt className="mx-auto text-2xl mb-2" />
                <p className="text-sm">
                  {selectedFile ? selectedFile.name : 'Click to upload assessment file'}
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
              </label>
            </div>
            {uploading && (
              <div className="mt-2">
                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">{uploadProgress}% uploaded</p>
              </div>
            )}
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading || uploading}>
          {loading ? 'Saving...' : (editingItem ? 'Update' : 'Create')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}