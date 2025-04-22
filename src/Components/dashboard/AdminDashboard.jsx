import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { examService } from "../../services/exam";
import { resultService } from "../../services/resultService";
import ExamTable from "../../Components/dashboard/ExamTable";
import ExamAnalytics from "../../Components/dashboard/ExamAnalytics";
import ExamResults from "../../Components/dashboard/ExamResults";
import ExamFormModal from "./ExamFormModal";
import ExamDetailsModal from "../../Components/dashboard/ExamDetailsModal";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsExam, setDetailsExam] = useState(null);
  const [editExam, setEditExam] = useState(null);

  // Load exams on component mount
  useEffect(() => {
    document.title = "Admin Dashboard | EduAssess";
    loadExams();
  }, []);

  async function loadExams() {
    try {
      setLoading(true);
      // Changed to getMyExams to only fetch exams created by current admin
      const response = await examService.getMyExams();

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
      const response = await examService.getMyExams();
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

  // When admin clicks on create exam
  const handleCreateExam = async (examId) => {
    try {
      await refreshExams();
      setShowExamModal(false);

      // Navigate to the questions page
      navigate(`/admin/exams/${examId}/questions`);
      toast.success("Exam created successfully! Now add questions.");
    } catch (err) {
      toast.error("Failed to create exam");
    }
  };

  // When admin clicks edit button for updating an exam
  const handleUpdateExam = async (id, data) => {
    try {
      await examService.updateExam(id, data);
      await refreshExams();

      setShowExamModal(false);
      navigate(`/admin/exams/${id}/questions`);
      toast.success("Exam updated successfully! Now you can edit questions.");
    } catch (err) {
      toast.error("Failed to update exam");
      setEditExam(null);
    }
  };

  // When admin clicks on delete exam
  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam?")) return;

    try {
      await examService.deleteExam(id);
      setExams((prevExams) => prevExams.filter((exam) => exam._id !== id));

      // Reset selected exam if it was the deleted one
      if (selectedExam === id) {
        setSelectedExam(null);
        setAnalytics(null);
        setResults([]);
      }

      toast.success("Exam deleted successfully!");
    } catch (err) {
      console.error("Error deleting exam:", err);
      toast.error("Failed to delete exam");
    }
  };

  // When admin clicks to view exam details and analytics
  const handleViewDetails = async (examId) => {
    if (!examId) {
      toast.error("Cannot view details: Invalid exam ID");
      return;
    }

    try {
      setResultsLoading(true);
      setAnalyticsLoading(true);
      setSelectedExam(examId);

      // Fetch results
      try {
        const resultResponse = await resultService.getAllResultsByExamId(
          examId
        );
        setResults(resultResponse?.data || []);
      } catch (resultError) {
        console.error("Failed to load exam results:", resultError);
        toast.error("Failed to load exam results");
        setResults([]);
      } finally {
        setResultsLoading(false);
      }

      // Fetch analytics
      try {
        const analyticsResponse = await examService.getExamAnalytics(examId);
        setAnalytics(analyticsResponse?.data || null);
      } catch (analyticsError) {
        console.error("Failed to load exam analytics:", analyticsError);
        toast.error("Failed to load exam analytics");
        setAnalytics(null);
      } finally {
        setAnalyticsLoading(false);
      }
    } catch (err) {
      console.error("General error in handleViewDetails:", err);
      toast.error("Failed to load exam details");
    }
  };

  // When user clicks on an exam row to show details modal
  const handleRowClick = (exam) => {
    setDetailsExam(exam);
    setShowDetailsModal(true);
  };

  // When admin clicks to edit questions
  const handleEditQuestions = (examId) => {
    navigate(`/admin/exams/${examId}/questions`);
  };

  return (
    <div className="p-2 md:p-6 bg-gray-50 min-h-screen ">
      <div className="max-w-7xl mx-4 md:mx-auto">
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your exams and view analytics
          </p>
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
          onEditQuestions={handleEditQuestions}
          onDeleteExam={handleDeleteExam}
          onViewDetails={handleViewDetails}
          onRowClick={handleRowClick}
        />

        {/* Selected Exam Details */}
        {selectedExam && (
          <>
            {/* Exam Summary Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-8 mb-6">
              <div className="px-3 md:px-6 py-4 border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                  {exams.find((e) => e._id === selectedExam)?.title ||
                    "Exam Details"}
                </h2>
              </div>
              <div className="p-4 md:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-blue-800 uppercase mb-1">
                      Duration
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-blue-700">
                      {exams.find((e) => e._id === selectedExam)?.duration || 0}{" "}
                      mins
                    </p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 col-span-2 md:col-span-1">
                    <h3 className="text-xs font-medium text-green-800 uppercase mb-1">
                      Start Time
                    </h3>
                    <p className="text-sm md:text-base font-medium text-green-700">
                      {exams.find((e) => e._id === selectedExam)?.startTime
                        ? new Date(
                            exams.find((e) => e._id === selectedExam)?.startTime
                          ).toLocaleString()
                        : "Not scheduled"}
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h3 className="text-xs font-medium text-purple-800 uppercase mb-1">
                      Questions
                    </h3>
                    <p className="text-xl md:text-2xl font-bold text-purple-700">
                      {exams.find((e) => e._id === selectedExam)?.questions
                        ?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results and Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Analytics Section */}
              <ExamAnalytics loading={analyticsLoading} analytics={analytics} />

              {/* Results Section */}
              <ExamResults loading={resultsLoading} results={results} />
            </div>
          </>
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
      <ExamDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        exam={detailsExam}
      />
    </div>
  );
};

export default AdminDashboard;
