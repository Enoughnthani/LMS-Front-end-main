import { X } from 'lucide-react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import { FaBook, FaSave, FaPenSquare } from 'react-icons/fa';
import { categories, statuses, types, locations, facilitators } from './mockPrograms';

export default function ProgramModal({ 
    show, 
    onHide, 
    programForm, 
    setProgramForm, 
    editingProgram, 
    onSave, 
    loading 
}) {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProgramForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleTagsChange = (e) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
        setProgramForm(prev => ({ ...prev, tags }));
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header className="border-0 py-3">
                <Modal.Title className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    {editingProgram ? <FaPenSquare className='text-orange-600' /> : <FaBook className='text-blue-700' />}
                    {editingProgram ? 'Edit Program' : 'Add New Program'}
                </Modal.Title>
                <div className="flex-1">
                    <X size={25} onClick={onHide} className='cursor-pointer text-red-600 ms-auto' />
                </div>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <Form>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <Form.Group>
                            <Form.Label>Program Title</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={programForm.title}
                                onChange={handleInputChange}
                                placeholder="Enter program title"
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Category</Form.Label>
                            <Form.Select
                                name="category"
                                value={programForm.category}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            >
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Type</Form.Label>
                            <Form.Select
                                name="type"
                                value={programForm.type}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                                name="status"
                                value={programForm.status}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            >
                                {statuses.map(status => (
                                    <option key={status.id} value={status.id}>{status.label}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Duration</Form.Label>
                            <Form.Control
                                type="text"
                                name="duration"
                                value={programForm.duration}
                                onChange={handleInputChange}
                                placeholder="e.g., 8 weeks, 3 months"
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                name="capacity"
                                value={programForm.capacity}
                                onChange={handleInputChange}
                                min="1"
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="startDate"
                                value={programForm.startDate}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                name="endDate"
                                value={programForm.endDate}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Facilitator</Form.Label>
                            <Form.Select
                                name="facilitator"
                                value={programForm.facilitator}
                                onChange={handleInputChange}
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            >
                                <option value="">Select Facilitator</option>
                                {facilitators.map(fac => (
                                    <option key={fac} value={fac}>{fac}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Select
                                name="location"
                                value={programForm.location}
                                onChange={handleInputChange}
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            >
                                {locations.map(loc => (
                                    <option key={loc} value={loc}>{loc}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="md:col-span-2">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={programForm.description}
                                onChange={handleInputChange}
                                placeholder="Enter program description"
                                required
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group className="md:col-span-2">
                            <Form.Label>Tags (comma-separated)</Form.Label>
                            <Form.Control
                                type="text"
                                name="tags"
                                value={programForm.tags.join(', ')}
                                onChange={handleTagsChange}
                                placeholder="e.g., React, JavaScript, Frontend"
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Price ($)</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={programForm.price}
                                onChange={handleInputChange}
                                min="0"
                                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                            />
                        </Form.Group>

                        <Form.Group className="flex items-center mt-2">
                            <Form.Check
                                type="checkbox"
                                name="featured"
                                label="Featured Program"
                                checked={programForm.featured}
                                onChange={handleInputChange}
                                className="mr-3"
                            />
                        </Form.Group>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-t pt-4">
                <Button
                    variant="outline-danger"
                    onClick={onHide}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button
                    variant="outline-success"
                    onClick={onSave}
                    disabled={loading || !programForm.title || !programForm.description}
                    className="flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" />
                            {editingProgram ? 'Updating...' : 'Creating...'}
                        </>
                    ) : (
                        <>
                            <FaSave />
                            {editingProgram ? 'Update Program' : 'Create Program'}
                        </>
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}