import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Form, Badge, Tab, Tabs } from 'react-bootstrap';
import {
  FaArrowLeft, FaPlus, FaTrash, FaSave, FaCopy, FaEye,
  FaCheckCircle, FaTimesCircle, FaListUl, FaPencilAlt,
  FaFont, FaAlignLeft, FaPlusCircle, FaRegCheckCircle
} from 'react-icons/fa';
import { Trash2 } from 'lucide-react';
// Remove this line if AssessmentService doesn't exist or fix the path
// import { assessmentService } from '../services/AssessmentService';

export default function AssessmentBuilderPage() {
  const navigate = useNavigate();
  const { unitStandardId } = useParams();
  const [activeTab, setActiveTab] = useState('questions');
  const [questionCounts, setQuestionCounts] = useState({
    multipleChoice: 0,
    trueOrFalse: 0,
    fillInBlanks: 0,
    longQuestion: 0,
    matching: 0,
  });
  const [assessmentInfo, setAssessmentInfo] = useState({
    title: '',
    description: '',
    duration: 60,
    passingScore: 50,
    totalMarks: 0
  });

  const [questions, setQuestions] = useState([]);


  const questionTypeOrder = {
    trueOrFalse: 1,
    multipleChoice: 2,
    matching: 3,
    fillInBlanks: 4,
    longQuestion: 5
  };

  // Function to sort questions based on the defined order
  const sortQuestions = (questionsToSort) => {
    return [...questionsToSort].sort((a, b) => {
      const orderA = questionTypeOrder[a.type] || 999;
      const orderB = questionTypeOrder[b.type] || 999;
      return orderA - orderB;
    });
  };

  const questionTypes = [
    { id: 'multipleChoice', count: questionCounts.multipleChoice, label: 'Multiple Choice', icon: <FaListUl />, description: 'Select one correct answer from options' },
    { id: 'trueOrFalse', count: questionCounts.trueOrFalse, label: 'True / False', icon: <FaCheckCircle />, description: 'Choose true or false' },
    { id: 'fillInBlanks', count: questionCounts.fillInBlanks, label: 'Fill in the Blanks', icon: <FaFont />, description: 'Complete missing words in text' },
    { id: 'longQuestion', count: questionCounts.longQuestion, label: 'Long Question', icon: <FaPencilAlt />, description: 'Written response' },
    { id: 'matching', count: questionCounts.matching, label: 'Matching', icon: <FaRegCheckCircle />, description: 'Match pairs correctly' }
  ];

  const addQuestion = (type) => {
    const baseQuestion = {
      id: Date.now(),
      type: type,
      text: '',
      marks: 0,
      explanation: ''
    };

    switch (type) {
      case 'multipleChoice':
        baseQuestion.options = ['', '', '', ''];
        baseQuestion.correctAnswer = '';
        updateQuestionCount('multipleChoice')
        break;
      case 'trueOrFalse':
        baseQuestion.correctAnswer = 'true';
        updateQuestionCount('trueOrFalse')
        break;
      case 'fillInBlanks':
        baseQuestion.text = '';
        baseQuestion.blanks = [];
        updateQuestionCount('fillInBlanks')
        break;
      case 'longQuestion':
        baseQuestion.sampleAnswer = '';
        updateQuestionCount('longQuestion')
        break;
      case 'matching':
        baseQuestion.pairs = [
          { left: '', right: '' },
          { left: '', right: '' },
          { left: '', right: '' }
        ];
        updateQuestionCount('matching')
        break;
    }

    // Add the new question and then sort all questions
    setQuestions(prevQuestions => sortQuestions([...prevQuestions, baseQuestion]));
  };

  const updateQuestionCount = (key) => {
    setQuestionCounts(p => ({ ...p, [key]: p[key] + 1 }))
  }

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
      } : q
    ));
  };

  const updatePair = (questionId, pairIndex, side, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        pairs: q.pairs.map((pair, idx) =>
          idx === pairIndex ? { ...pair, [side]: value } : pair
        )
      } : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, options: [...q.options, ''] } : q
    ));
  };

  const addPair = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, pairs: [...q.pairs, { left: '', right: '' }] } : q
    ));
  };

  const removeOption = (questionId, optionIndex) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        options: q.options.filter((_, idx) => idx !== optionIndex)
      } : q
    ));
  };

  const removePair = (questionId, pairIndex) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? {
        ...q,
        pairs: q.pairs.filter((_, idx) => idx !== pairIndex)
      } : q
    ));
  };

  const removeQuestion = (id) => {
    if (window.confirm('Delete this question?')) {
      const questionToDelete = questions.find(q => q.id === id);

      if (questionToDelete) {
        const questionType = questionToDelete.type;
        setQuestionCounts(prev => ({
          ...prev,
          [questionType]: prev[questionType] - 1
        }));
      }

      // Filter out the deleted question and then sort the remaining ones
      const remainingQuestions = questions.filter(q => q.id !== id);
      setQuestions(sortQuestions(remainingQuestions));
    }
  };

  const duplicateQuestion = (question) => {
    updateQuestionCount(question?.type);
    const duplicatedQuestion = { ...question, id: Date.now() };
    // Add the duplicated question and sort all questions
    setQuestions(prevQuestions => sortQuestions([...prevQuestions, duplicatedQuestion]));
  };

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + (parseInt(q.marks) || 0), 0);
  };

  const handleReset = () => {
    setQuestionCounts({
      multipleChoice: 0,
      trueOrFalse: 0,
      fillInBlanks: 0,
      longQuestion: 0,
      matching: 0,
    });

    setAssessmentInfo({
      title: '',
      description: '',
      duration: 60,
      passingScore: 50,
      totalMarks: 0
    });

    setQuestions([])
  }

  const handleSave = async () => {
    const totalMarks = calculateTotalMarks();
    const assessmentData = {
      ...assessmentInfo,
      totalMarks,
      questions,
      unitStandardId: parseInt(unitStandardId)
    };

    console.log('Saving assessment:', assessmentData);
    // Uncomment and fix the path to AssessmentService if needed
    // await assessmentService.createAssessment(assessmentData);
    alert('Assessment saved successfully!');
  };

  const renderQuestionEditor = (question) => {
    switch (question.type) {
      case 'multipleChoice':
        return (
          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={`correct-${question.id}`}
                  checked={question.correctAnswer === option}
                  onChange={() => updateQuestion(question.id, 'correctAnswer', option)}
                  className="w-4 h-4"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(question.id, idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                {question.options.length > 2 && (
                  <button
                    onClick={() => removeOption(question.id, idx)}
                    className="p-1 bg-transparent text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={() => addOption(question.id)}
              className="text-sm bg-transparent text-blue-700 flex items-center gap-1 mt-2"
            >
              <FaPlus size={12} /> Add Option
            </button>
          </div>
        );

      case 'trueOrFalse':
        return (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`tf-${question.id}`}
                checked={question.correctAnswer === 'true'}
                onChange={() => updateQuestion(question.id, 'correctAnswer', 'true')}
              />
              <span>True</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name={`tf-${question.id}`}
                checked={question.correctAnswer === 'false'}
                onChange={() => updateQuestion(question.id, 'correctAnswer', 'false')}
              />
              <span>False</span>
            </label>
          </div>
        );

      case 'fillInBlanks':
        return (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Use <span className="text-blue-600">[blank]</span> to indicate missing words
            </p>
            <textarea
              value={question.text}
              onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
              placeholder="Type your sentence with [blank] for missing words. Example: The capital of France is [blank]."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[100px]"
            />
          </div>
        );

      case 'longQuestion':
        return (
          <div>
            <textarea
              value={question.sampleAnswer}
              onChange={(e) => updateQuestion(question.id, 'sampleAnswer', e.target.value)}
              placeholder="Provide a sample answer or rubric for grading..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm min-h-[120px]"
            />
          </div>
        );

      case 'matching':
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <span className="text-sm font-medium text-gray-600">Left Column</span>
              <span className="text-sm font-medium text-gray-600">Right Column</span>
            </div>
            {question.pairs.map((pair, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={pair.left}
                  onChange={(e) => updatePair(question.id, idx, 'left', e.target.value)}
                  placeholder={`Item ${idx + 1}`}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pair.right}
                    onChange={(e) => updatePair(question.id, idx, 'right', e.target.value)}
                    placeholder={`Match ${idx + 1}`}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  />
                  {question.pairs.length > 2 && (
                    <button
                      onClick={() => removePair(question.id, idx)}
                      className="p-1 bg-transparent text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              onClick={() => addPair(question.id)}
              className="text-sm bg-transparent text-blue-700 flex items-center gap-1 mt-2"
            >
              <FaPlus size={12} /> Add Pair
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="overflow-y-auto w-full h-screen bg-gray-50 py-6">
      <div className="px-6">

        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-transparent flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4 text-sm"
          >
            <FaArrowLeft size={14} /> Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Assessment Builder</h1>
          <p className="text-gray-500 text-sm">Create custom assessments with various question types</p>
        </div>

        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-6"
        >
          <Tab eventKey="questions" title="Questions">
            {/* Assessment Info */}
            <Card className="border-0 shadow-sm mb-6">
              <Card.Body className="p-5">
                <h3 className="font-semibold text-gray-800 mb-4">Assessment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={assessmentInfo.title}
                      onChange={(e) => setAssessmentInfo({ ...assessmentInfo, title: e.target.value })}
                      placeholder="e.g., React Fundamentals Quiz"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={assessmentInfo.duration}
                      onChange={(e) => setAssessmentInfo({ ...assessmentInfo, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={assessmentInfo.description}
                      onChange={(e) => setAssessmentInfo({ ...assessmentInfo, description: e.target.value })}
                      rows={2}
                      placeholder="Instructions for learners..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Question Types Grid */}
            <div className="my-3">
              <h3 className="font-semibold text-gray-800 mb-3">Add Question</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {questionTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => addQuestion(type.id)}
                    className="bg-white relative border border-gray-200 rounded-lg p-4 text-center hover:shadow-md hover:border-blue-300 transition"
                  >
                    <div className='absolute top-1 right-1'><Badge bg='success'>{type.count}</Badge></div>
                    <div className="text-2xl text-blue-500 mb-2">{type.icon}</div>
                    <div className="text-sm font-medium text-gray-700">{type.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className='my-4 flex'>
              <Button onClick={handleReset} className='ms-auto' variant='outline-secondary' size='sm'>
                Reset
              </Button>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {questions.map((question, index) => (
                <Card key={question.id} className="border-0 shadow-sm">
                  <Card.Body className="p-5">
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Badge className="!bg-blue-100 text-blue-700 px-2 py-1">
                          {index + 1}. {questionTypes.find(t => t.id === question.type)?.label}
                        </Badge>
                        <input
                          type="number"
                          value={question.marks}
                          onChange={(e) => updateQuestion(question.id, 'marks', e.target.value)}
                          placeholder="Marks"
                          className="w-20 px-2 py-1 border border-gray-200 rounded text-sm text-center"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => duplicateQuestion(question)}
                          className="p-1 bg-transparent text-blue-500"
                          title="Duplicate"
                        >
                          <FaCopy size={14} />
                        </button>
                        <button
                          onClick={() => removeQuestion(question.id)}
                          className="p-1 bg-transparent text-red-500"
                          title="Delete"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-4">
                      <input
                        type="text"
                        value={question.text}
                        onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                        placeholder="Enter your question here..."
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium"
                      />
                    </div>

                    {/* Question Type Specific Editor */}
                    {renderQuestionEditor(question)}

                    {/* Explanation */}
                    <div className="mt-4">
                      <textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                        placeholder="Explanation (optional) - shown after answering"
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-500"
                      />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

            {/* Empty State */}
            {questions.length === 0 && (
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
                <FaPlusCircle className="text-gray-300 text-5xl mx-auto mb-3" />
                <p className="text-gray-500">No questions added yet</p>
                <p className="text-sm text-gray-400 mt-1">Click on any question type above to start building your assessment</p>
              </div>
            )}

            {/* Summary & Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div>
                <span className="text-sm text-gray-500">Total Questions: {questions.length}</span>
                <span className="text-sm text-gray-500 ml-4">Total Marks: {calculateTotalMarks()}</span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="light"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <FaSave size={14} /> Save Assessment
                </Button>
              </div>
            </div>
          </Tab>

          <Tab eventKey="preview" title="Preview">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-5">
                <h3 className="font-semibold text-gray-800 mb-2">{assessmentInfo.title || 'Assessment Preview'}</h3>
                <p className="text-gray-500 text-sm mb-4">{assessmentInfo.description}</p>
                <div className="flex gap-4 text-sm text-gray-500 mb-6">
                  <span>Duration: {assessmentInfo.duration} min</span>
                  <span>Questions: {questions.length}</span>
                  <span>Total Marks: {calculateTotalMarks()}</span>
                </div>

                {questions.map((question, index) => (
                  <div key={question.id} className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800 mb-2">{index + 1}. {question.text || '[Question text]'}</p>
                    <p className="text-xs text-gray-400 mb-2">({question.marks} marks)</p>

                    {/* Preview of answer options based on type */}
                    {question.type === 'multipleChoice' && question.options && (
                      <div className="space-y-2 mt-2">
                        {question.options.map((opt, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <input type="radio" disabled className="w-4 h-4" />
                            <span className="text-sm text-gray-600">{opt || `Option ${String.fromCharCode(65 + idx)}`}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === 'trueOrFalse' && (
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2"><input type="radio" disabled /> True</label>
                        <label className="flex items-center gap-2"><input type="radio" disabled /> False</label>
                      </div>
                    )}

                    {question.type === 'longQuestion' && (
                      <textarea disabled placeholder="Your answer..." className="w-full mt-2 p-2 border border-gray-200 rounded text-sm bg-white" rows={3} />
                    )}

                    {question.type === 'fillInBlanks' && (
                      <div className="mt-2 p-2 bg-white border border-gray-200 rounded">
                        <p className="text-sm text-gray-600">{question.text || '[Sentence with blanks]'}</p>
                      </div>
                    )}

                    {question.type === 'matching' && (
                      <div className="mt-2 space-y-2">
                        <p className="text-sm text-gray-600">Matching pairs will be displayed here</p>
                      </div>
                    )}
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}