// BulkUploadModal.jsx
import { useState } from 'react';
import { Modal, Alert, Form, Button } from 'react-bootstrap';
import { FaUpload, FaDownload } from 'react-icons/fa';
import { apiFetch } from '@/api/api';
import { USERS } from '@/utils/apiEndpoint';
import ResponseMessage from '@/components/common/ResponseMessage';
import { useTopLoader } from '../../../contexts/TopLoaderContext';

export default function BulkUploadModal({ 
    show, 
    setShow, 
    setResponse, 
    response,
    getUsers 
}) {
    const [bulkFile, setBulkFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const { start, complete } = useTopLoader();

    const handleBulkUpload = async () => {
        if (!bulkFile) {
            setResponse({ success: false, message: "Please select a file" });
            return;
        }

        setUploading(true);
        start();
        
        try {
            const formData = new FormData();
            formData.append('file', bulkFile);

            const result = await apiFetch(`${USERS}/bulk`, {
                method: "POST",
                body: formData,
                // Don't set Content-Type header, let browser set it with boundary
            });

            setResponse(result);
            
            if (result?.success) {
                await getUsers();
                setShow(false);
                setBulkFile(null);
                
                // Optional: Show success count
                if (result.data?.created) {
                    setResponse({ 
                        success: true, 
                        message: `Successfully created ${result.data.created} users. ${result.data.errors || 0} errors.` 
                    });
                }
            }
        } catch (error) {
            setResponse({ success: false, message: "Bulk upload failed: " + error.message });
        } finally {
            setUploading(false);
            complete();
        }
    };

    const downloadCSV = (csv, filename) => {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const downloadTemplate = () => {
        const template = "firstname,lastname,email,contactNumber,idNumber,roles,status\nJohn,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE";
        downloadCSV(template, 'bulk_upload_template.csv');
    };

    const handleClose = () => {
        setShow(false);
        setBulkFile(null);
        setResponse(null);
    };

    return (
        <Modal
            show={show}
            onHide={handleClose}
            centered
            size="lg"
            backdrop="static"
        >
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <FaUpload className="text-info" />
                    Bulk Upload Users
                </Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <div className="mb-4">
                    <Alert variant="info" className="border-l-4 border-info">
                        <p className="mb-2"><strong>📋 CSV Format Requirements:</strong></p>
                        <ul className="mb-2 text-sm">
                            <li>File must be in <strong>.csv</strong> format</li>
                            <li>Maximum file size: <strong>10MB</strong></li>
                            <li>Required columns: firstname, lastname, email, contactNumber, idNumber, roles,status</li>
                        </ul>
                        <p className="mb-1 text-sm"><strong>Column Order:</strong></p>
                        <code className="bg-white p-1 rounded text-xs block mb-2">
                            firstname,lastname,email,contactNumber,idNumber,roles,status
                        </code>
                        <p className="text-sm mb-0"><strong>Example:</strong></p>
                        <code className="bg-white p-1 rounded text-xs block">
                            John,Doe,john@email.com,0812345678,9001015123089,LEARNER,ACTIVE
                        </code>
                    </Alert>
                </div>

                <ResponseMessage setResponse={setResponse} response={response} />

                <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Select CSV File</Form.Label>
                    <Form.Control
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file && file.size > 10 * 1024 * 1024) {
                                setResponse({ 
                                    success: false, 
                                    message: "File size exceeds 10MB limit" 
                                });
                                return;
                            }
                            setBulkFile(file);
                            setResponse(null);
                        }}
                        className="py-2"
                    />
                    {bulkFile && (
                        <Form.Text className="text-success">
                            Selected: {bulkFile.name} ({(bulkFile.size / 1024).toFixed(2)} KB)
                        </Form.Text>
                    )}
                </Form.Group>

                <div className="mt-3">
                    <Button
                        variant="outline-success"
                        size="sm"
                        onClick={downloadTemplate}
                        className="d-flex align-items-center gap-2"
                    >
                        <FaDownload /> Download Template CSV
                    </Button>
                </div>

                <div className="mt-3 p-3 bg-light rounded">
                    <p className="text-sm text-muted mb-0">
                        <strong>💡 Tips:</strong>
                        <br />
                        • First row must contain column headers
                        <br />
                        • Role must be one of: ADMIN, PROGRAM_MANAGER, FACILITATOR, MENTOR, INTERN, LEARNER, ASSESSOR, MODERATOR
                        <br />
                        • ID Number must be a valid South African ID (13 digits)
                        <br />
                        • Email addresses must be unique in the system
                    </p>
                </div>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
                <Button 
                    variant="outline-secondary" 
                    onClick={handleClose}
                    disabled={uploading}
                >
                    Cancel
                </Button>
                <Button
                    variant="info"
                    onClick={handleBulkUpload}
                    disabled={!bulkFile || uploading}
                    className="text-white d-flex align-items-center gap-2"
                >
                    {uploading ? (
                        <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <FaUpload /> Upload & Create Users
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}