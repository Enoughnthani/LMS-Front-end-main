import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Alert, Spinner } from 'react-bootstrap';
import { FaArrowLeft, FaDownload, FaUpload, FaSave, FaPaperPlane, FaFileWord, FaFilePdf, FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

export default function AssessmentDetailPage() {
  const { title } = useParams();
  const navigate = useNavigate();
  const [answer, setAnswer] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Mock assessment data
  const assessment = {
    title: title || 'React Basics Quiz',
    unitStandard: '14933',
    dueDate: '2026-03-10',
    downloadUrl: '/assessment/assessment-question.docx'
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
      if (validTypes.includes(file.type)) {
        setUploadedFile(file);
        setSaveStatus('File ready to submit');
      } else {
        alert('Please upload a DOCX or PDF file');
      }
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem(`draft_${assessment.title}`, answer);
    setSaveStatus('Draft saved successfully!');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleSubmit = async () => {
    if (!answer.trim() && !uploadedFile) {
      alert('Please write your answer or upload a file before submitting');
      return;
    }

    setSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      localStorage.removeItem(`draft_${assessment.title}`);
    }, 2000);
  };

  const applyFormat = (command) => {
    document.execCommand(command, false, null);
    document.getElementById('editor').focus();
  };

  if (submitted) {
    return (
      <div className="overflow-y-auto w-full h-screen bg-gray-50 p-4">
        <div className="mx-auto">
          <Card className="text-center p-5">
            <div className="mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mb-2">Assessment Submitted!</h4>
            <p className="text-gray-600 text-sm mb-4">
              Your answer has been submitted successfully.
            </p>
            <Button variant="primary" onClick={() => navigate(-1)}>
              Back to Assessments
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto w-full h-screen bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 transition text-sm"
          >
            <FaArrowLeft size={14} /> Back to Assessments
          </button>
          
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{assessment.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded">US{assessment.unitStandard}</span>
                    <span>Due: {formatDate(assessment.dueDate)}</span>
                  </div>
                </div>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => alert('Downloading assessment file...')}
                  className="flex items-center gap-2"
                >
                  <FaDownload size={14} /> Download Assessment
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Save Status Alert */}
        {saveStatus && (
          <Alert variant="success" className="mb-3 py-2 text-sm">
            {saveStatus}
          </Alert>
        )}

        {/* Answer Section */}
        <Card className="border-0 shadow-sm mb-3">
          <Card.Header className="bg-white border-b p-3">
            <h5 className="font-semibold text-gray-800 m-0 text-base">Your Answer</h5>
          </Card.Header>
          <Card.Body className="p-3">
            {/* Text Editor Toolbar */}
            <div className="border rounded-t-lg p-2 bg-gray-50 flex flex-wrap gap-1">
              <button
                type="button"
                onClick={() => applyFormat('bold')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Bold"
              >
                <FaBold size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('italic')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Italic"
              >
                <FaItalic size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('underline')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Underline"
              >
                <FaUnderline size={14} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button
                type="button"
                onClick={() => applyFormat('insertUnorderedList')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Bullet List"
              >
                <FaListUl size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('insertOrderedList')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Numbered List"
              >
                <FaListOl size={14} />
              </button>
              <div className="w-px h-5 bg-gray-300 mx-1"></div>
              <button
                type="button"
                onClick={() => applyFormat('justifyLeft')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Align Left"
              >
                <FaAlignLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyCenter')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Align Center"
              >
                <FaAlignCenter size={14} />
              </button>
              <button
                type="button"
                onClick={() => applyFormat('justifyRight')}
                className="p-1.5 hover:bg-gray-200 rounded transition"
                title="Align Right"
              >
                <FaAlignRight size={14} />
              </button>
            </div>

            {/* Rich Text Editor */}
            <div
              id="editor"
              contentEditable
              className="border rounded-b-lg p-3 min-h-[300px] focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              style={{ lineHeight: '1.6' }}
              onInput={(e) => setAnswer(e.target.innerHTML)}
              dangerouslySetInnerHTML={{ __html: localStorage.getItem(`draft_${assessment.title}`) || '' }}
            />
          </Card.Body>
        </Card>

        {/* OR Divider */}
        <div className="text-center my-3">
          <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded">OR</span>
        </div>

        {/* File Upload Section */}
        <Card className="border-0 shadow-sm mb-3">
          <Card.Header className="bg-white border-b p-3">
            <h5 className="font-semibold text-gray-800 m-0 text-base">Upload File</h5>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              {!uploadedFile ? (
                <>
                  <FaUpload className="text-gray-400 text-3xl mx-auto mb-2" />
                  <p className="text-gray-500 text-sm mb-2">Click to upload or drag and drop</p>
                  <p className="text-gray-400 text-xs">DOCX or PDF (Max 10MB)</p>
                  <input
                    type="file"
                    accept=".docx,.pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline-primary" size="sm" as="span" className="mt-2">
                      Choose File
                    </Button>
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div className="flex items-center gap-3">
                    {uploadedFile.type.includes('pdf') ? (
                      <FaFilePdf className="text-red-500 text-2xl" />
                    ) : (
                      <FaFileWord className="text-blue-500 text-2xl" />
                    )}
                    <div className="text-left">
                      <p className="text-sm font-medium text-gray-700 mb-0">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-400">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => setUploadedFile(null)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline-secondary"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <FaSave size={14} /> Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-2"
          >
            {submitting ? (
              <>
                <Spinner as="span" animation="border" size="sm" /> Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane size={14} /> Submit Assessment
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}