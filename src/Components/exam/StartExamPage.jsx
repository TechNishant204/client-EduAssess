// src/Components/exam/StartExamPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useExam } from "../../hooks/useExam"; // Updated to named import
import { examService } from "../../services/exam";
import { Link } from "react-router-dom";

const StartExamPage = () => {
  const { examId } = useParams();
  const { startExam } = useExam();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await examService.startExam(examId);
        setExam(response.data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId, startExam]);

  if (loading) return <div className="p-4 text-gray-700">Loading...</div>;
  if (!exam) return <div className="p-4 text-gray-700">Exam not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl text-orange-600 mb-4">
        {exam.title} - Examination Rules
      </h1>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 mb-4">
        <p className="text-yellow-700 font-bold text-sm sm:text-base">
          Important Notice:
        </p>
        <p className="text-yellow-600 text-sm sm:text-base">
          Any violation of these rules may result in immediate disqualification.
        </p>
      </div>
      <ul className="list-disc pl-5 text-gray-700 mb-6 space-y-2 text-sm sm:text-base">
        <li>
          Strictly no cheating or external assistance allowed during the exam.
        </li>
        <li>Do not leave the exam window or switch tabs/applications.</li>
        <li>Timer starts immediately once you begin the exam.</li>
        <li>Ensure stable internet connection before starting.</li>
        <li>
          Submit all answers before the timer ends - late submissions won't be
          accepted.
        </li>
        <li>
          Keep your webcam on and facing you throughout the exam duration.
        </li>
        <li>No mobile phones or electronic devices allowed.</li>
        <li>Maintain complete silence during the examination.</li>
      </ul>
      <div className="mt-4 sm:mt-6">
        <Link
          to={`/student/exam/${examId}`}
          className="block w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium text-sm sm:text-base"
        >
          I Accept Rules & Start Exam
        </Link>
      </div>
    </div>
  );
};

export default StartExamPage;
