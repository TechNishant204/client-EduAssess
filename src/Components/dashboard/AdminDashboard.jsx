import React, { useState, useEffect } from "react";
import { examService } from "../../services/exam";
import { resultService } from "../../services/resultService";
import ExamTable from "../../Components/dashboard/ExamTable";
import ExamAnalytics from "../../Components/dashboard/ExamAnalytics";
import ExamResults from "../../Components/dashboard/ExamResults";
import ExamFormModal from "./ExamFormModal";
import QuestionFormModal from "./QuestionFormModal";
import ExamDetailsModal from "../../Components/dashboard/ExamDetailsModal";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsExam, setDetailsExam] = useState(null);
  const [editExam, setEditExam] = useState(null);
  const [newExamId, setNewExamId] = useState(null);

  // Load exams on component mount
  useEffect(() => {
    document.title = "Admin Dashboard | EduAssess";
    loadExams();
  }, []);

  async function loadExams() {
    try {
      setLoading(true);
      const response = await examService.getAllExams();
      console.log("All exams response:", response);

      // Fix: Check for response.data directly
      if (response && response.data) {
        setExams(response.data);
      } else {
        console.error("Unexpected API structure:", response);
        toast.error("Could not load exams. Unexpected data format.");
      }
    } catch (error) {
      console.error("Error loading exams:", error);
      toast.error("Failed to load exams");
    } finally {
      setLoading(false);
    }
  }

  const refreshExams = async () => {
    try {
      setLoading(true);
      const response = await examService.getAllExams();
      if (response && response.data) {
        setExams(response.data);
      }
    } catch (error) {
      console.error("Error refreshing exams:", error);
      toast.error("Failed to refresh exams");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (examId) => {
    try {
      setNewExamId(examId);
      setShowExamModal(false);
      setShowQuestionModal(true);
      await refreshExams();
      toast.success("Exam created successfully!");
    } catch (err) {
      toast.error("Failed to create exam");
    }
  };

  const handleUpdateExam = async (id, data) => {
    try {
      await examService.updateExam(id, data);
      await refreshExams();
      setShowExamModal(false);
      setEditExam(null);
      toast.success("Exam updated successfully!");
    } catch (err) {
      toast.error("Failed to update exam");
    }
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await examService.deleteExam(id);
      setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));
      if (selectedExam === id) {
        setSelectedExam(null);
      }
      toast.success("Exam deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete exam");
    }
  };

  const handleCreateQuestion = async () => {
    try {
      await refreshExams();
      setShowQuestionModal(false);
      setNewExamId(null);
      toast.success("Question added successfully!");
    } catch (err) {
      toast.error("Failed to add question");
    }
  };

  const handleViewDetails = async (examId) => {
    console.log("Attempting to view details for examId:", examId);
    try {
      setLoading(true);
      setSelectedExam(examId);

      const [resultResponse, analyticsResponse] = await Promise.all([
        resultService.getAllResultsByExamId(examId),
        examService.getExamAnalytics(examId),
      ]);

      if (resultResponse && resultResponse.data) {
        setResults(resultResponse.data);
      } else {
        setResults([]);
      }

      if (analyticsResponse && analyticsResponse.data) {
        setAnalytics(analyticsResponse.data);
      } else {
        setAnalytics(null);
      }
    } catch (err) {
      console.error("Failed to load exam details:", err);
      toast.error("Failed to load exam details");
      setResults([]);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (exam) => {
    setDetailsExam(exam);
    setShowDetailsModal(true);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage exams and view analytics</p>
        </header>

        {/* Exam Table Section */}
        <ExamTable
          exams={exams}
          loading={loading}
          onCreateExam={() => {
            setEditExam(null);
            setShowExamModal(true);
          }}
          onEditExam={(exam) => {
            setEditExam(exam);
            setShowExamModal(true);
          }}
          onDeleteExam={handleDeleteExam}
          onViewDetails={handleViewDetails}
          onRowClick={handleRowClick}
        />

        {/* Selected Exam Details */}
        {selectedExam && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {/* Exam Info Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden md:col-span-3">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {exams.find((e) => e._id === selectedExam)?.title ||
                    "Exam Details"}
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">
                      Duration
                    </h3>
                    <p className="text-2xl font-bold text-blue-700">
                      {exams.find((e) => e._id === selectedExam)?.duration || 0}{" "}
                      mins
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-green-800 mb-2">
                      Start Time
                    </h3>
                    <p className="text-lg font-semibold text-green-700">
                      {exams.find((e) => e._id === selectedExam)?.startTime
                        ? new Date(
                            exams.find((e) => e._id === selectedExam)?.startTime
                          ).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-purple-800 mb-2">
                      Questions
                    </h3>
                    <p className="text-2xl font-bold text-purple-700">
                      {exams.find((e) => e._id === selectedExam)?.questions
                        ?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <ExamAnalytics loading={loading} analytics={analytics} />

            {/* Results Section */}
            <ExamResults loading={loading} results={results} />
          </div>
        )}
      </div>

      {/* Modals */}
      <ExamFormModal
        isOpen={showExamModal}
        onClose={() => {
          setShowExamModal(false);
          setEditExam(null);
        }}
        onNext={editExam ? handleUpdateExam : handleCreateExam}
        initialData={editExam}
      />
      <QuestionFormModal
        isOpen={showQuestionModal}
        onClose={() => {
          setShowQuestionModal(false);
          setNewExamId(null);
        }}
        onFinish={handleCreateQuestion}
        examId={newExamId || selectedExam}
      />
      <ExamDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        exam={detailsExam}
      />
    </div>
  );
};

export default AdminDashboard;
