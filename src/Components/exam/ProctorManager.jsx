// src/Components/exam/ProctorManager.jsx
import { useEffect, useRef } from "react";
import { useExam } from "../../hooks/useExam"; // Updated to named import
import { resultService } from "../../services/resultService";

const ProctorManager = () => {
  const { examId, proctorFlag, setProctorFlag } = useExam();
  const isProctoringActive = useRef(false);
  const lastFocusTime = useRef(Date.now());

  useEffect(() => {
    if (!examId) return;

    isProctoringActive.current = true;

    const logProctoringEvent = async (eventType, details = {}) => {
      try {
        await resultService.createProctoringEvent({
          examId,
          eventType,
          timestamp: new Date().toISOString(),
          ...details,
        });
      } catch (err) {
        console.error("Failed to log proctoring event:", err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isProctoringActive.current) {
        setProctorFlag(true);
        logProctoringEvent("fullscreen_exit", {
          message: "User exited fullscreen",
        });
      } else if (document.fullscreenElement) {
        setProctorFlag(false);
        logProctoringEvent("fullscreen_enter", {
          message: "User entered fullscreen",
        });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isProctoringActive.current) {
        const timeAway = (Date.now() - lastFocusTime.current) / 1000;
        setProctorFlag(true);
        logProctoringEvent("tab_switch", {
          message: "User switched tabs",
          duration: timeAway,
        });
      } else if (!document.hidden) {
        lastFocusTime.current = Date.now();
        setProctorFlag(false);
        logProctoringEvent("tab_focus", { message: "User returned to tab" });
      }
    };

    const handleFocus = () => {
      if (!isProctoringActive.current) return;
      const timeAway = (Date.now() - lastFocusTime.current) / 1000;
      if (timeAway > 5) {
        setProctorFlag(true);
        logProctoringEvent("window_blur", {
          message: "User minimized or switched window",
          duration: timeAway,
        });
      }
      lastFocusTime.current = Date.now();
    };

    const handleBlur = () => {
      if (!isProctoringActive.current) return;
      setProctorFlag(true);
      logProctoringEvent("window_blur", { message: "Window lost focus" });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    const requestFullscreen = () => {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
        setProctorFlag(true);
        logProctoringEvent("fullscreen_request_failed", {
          message: "User denied fullscreen",
        });
      });
    };
    requestFullscreen();

    return () => {
      isProctoringActive.current = false;
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
    };
  }, [examId, setProctorFlag]);

  return null;
};

export default ProctorManager;
