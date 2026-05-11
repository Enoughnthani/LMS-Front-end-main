import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Form, Card, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaBook, FaClipboardList, FaFileAlt, FaSave, FaTimes } from 'react-icons/fa';
import { assessmentService } from './services/assessmentService';
import { useApiResponse } from '@/contexts/ApiResponseContext';

export default function AssessmentFormPage() {
  const navigate = useNavigate();
  const { unitStandardId, assessmentId } = useParams();
  const isEditing = !!assessmentId;
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    totalMarks: '',
    type: 'LEARNER_WORKBOOK',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [existingFile, setExistingFile] = useState(null);
  const { showResponse } = useApiResponse();

  useEffect(() => {
    if (isEditing && assessmentId) {
      loadAssessment();
    }
  }, [isEditing, assessmentId]);

  const loadAssessment = async () => {
    setLoading(true);
    try {
      const response = await assessmentService.getAssessmentById(assessmentId);
      const data = response?.payload || response;
      if (data) {
        setFormData({
          title: data.title || '',
          description: data.description || '',
          dueDate: data.dueDate || '',
          totalMarks: data.totalMarks || '',
          type: data.type || 'LEARNER_WORKBOOK',
        });
        if (data.fileUrl) {
          setExistingFile({
            url: data.fileUrl,
            name: data.fileName,
            size: data.fileSize
          });
        }
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
      showResponse({ success: false, message: 'Failed to load assessment' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title) {
      showResponse({ success: false, message: 'Please enter a title' });
      return;
    }

    setLoading(true);
    try {
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
      if (isEditing) {
        response = await assessmentService.updateAssessment(assessmentId, formDataToSend, null);
      } else {
        response = await assessmentService.createAssessment(formDataToSend, null);
      }

      if (response?.success) {
        showResponse(response);
        navigate(-1);
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

  const removeExistingFile = () => {
    setExistingFile(null);
  };

  if (loading && isEditing) {
    return (
      <div className="w-full overflow-y-auto flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full  overflow-y-auto h-screen bg-gray-50 py-2">
      <div className="mx-1 p-2 shadow-sm bg-white rounded">
        
        <button
          onClick={() => navigate(-1)}
          className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-gray-700 my-2 text-sm transition"
        >
          <FaArrowLeft size={14} /> Back
        </button>

        {/* Form Card */}
        <Card className="border-0   overflow-hidden">
          <Card.Header className="bg-white border-b border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isEditing ? 'bg-amber-100' : 'bg-blue-100'}`}>
                {formData.type === 'LEARNER_WORKBOOK' ? (
                  <FaBook className={isEditing ? 'text-amber-600' : 'text-blue-600'} />
                ) : (
                  <FaClipboardList className={isEditing ? 'text-amber-600' : 'text-purple-600'} />
                )}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {isEditing ? 'Edit Assessment' : 'Create Assessment'}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {isEditing ? 'Update assessment details' : 'Add a new assessment to the unit standard'}
                </p>
              </div>
            </div>
          </Card.Header>

          <Card.Body className="p-6">
            <Form onSubmit={handleSubmit}>
              {/* Assessment Type */}
              <Form.Group className="mb-5">
                <Form.Label className="text-sm font-semibold text-gray-700 mb-2">Assessment Type</Form.Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'LEARNER_WORKBOOK' })}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      formData.type === 'LEARNER_WORKBOOK' 
                        ? 'bg-blue-50 border-blue-300 text-blue-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FaBook size={14} /> Learner Workbook
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'SUMMATIVE' })}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition flex items-center justify-center gap-2 ${
                      formData.type === 'SUMMATIVE' 
                        ? 'bg-purple-50 border-purple-300 text-purple-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FaClipboardList size={14} /> Summative
                  </button>
                </div>
              </Form.Group>

              {/* Title */}
              <Form.Group className="mb-4">
                <Form.Label className="text-sm font-semibold text-gray-700 mb-1">Title *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter assessment title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label className="text-sm font-semibold text-gray-700 mb-1">Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                />
              </Form.Group>

              {/* Due Date & Total Marks */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label className="text-sm font-semibold text-gray-700 mb-1">Total Marks</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="e.g., 100"
                    value={formData.totalMarks}
                    onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                    className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-blue-200"
                  />
                </Form.Group>
              </div>

              {/* File Upload */}
              <Form.Group>
                <Form.Label className="text-sm font-semibold text-gray-700 mb-1">Assessment File (PDF/DOCX/TXT)</Form.Label>
                
                {/* Existing File Display */}
                {existingFile && !selectedFile && (
                  <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-gray-500 text-xl" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{existingFile.name}</p>
                        <p className="text-xs text-gray-400">Already uploaded</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeExistingFile}
                      className="text-gray-400 hover:text-red-500 transition"
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                )}

                {/* File Upload Input */}
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-blue-400 transition-colors ${!existingFile || selectedFile ? 'border-gray-200' : 'border-green-200 bg-green-50'}`}>
                  <input
                    type="file"
                    accept=".pdf,.docx,.doc,.txt"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                    id="assessment-file"
                  />
                  <label htmlFor="assessment-file" className="cursor-pointer block">
                    <FaFileAlt className="mx-auto text-3xl mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : (existingFile ? 'Replace with new file' : 'Click to upload assessment file')}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">PDF, DOCX, or TXT up to 10MB</p>
                  </label>
                </div>
              </Form.Group>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button 
                  variant="light" 
                  onClick={() => navigate(-1)} 
                  className="rounded-lg px-5"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={loading}
                  className="rounded-lg px-6 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave size={14} />
                      {isEditing ? 'Update Assessment' : 'Create Assessment'}
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}