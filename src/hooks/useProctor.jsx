// src/hooks/useProctor.jsx
import { useEffect, useRef, useState } from "react";
import { resultService } from "../services/resultService";

const useProctor = (examId, setProctorFlag) => {
  const isProctoringActive = useRef(false);
  const lastFocusTime = useRef(Date.now());
  const [proctorEvents, setProctorEvents] = useState([]);

  useEffect(() => {
    if (!examId) return;

    isProctoringActive.current = true;

    const logProctoringEvent = async (eventType, details = {}) => {
      try {
        const eventData = {
          examId,
          eventType,
          timestamp: new Date().toISOString(),
          message: details.message || "",
          duration: details.duration || 0,
        };
        await resultService.createProctoringEvent(eventData);
        setProctorEvents((prev) => [...prev, eventData]);
      } catch (err) {
        console.error("Failed to log proctoring event:", err);
      }
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isProctoringActive.current) {
        setProctorFlag(true);
        logProctoringEvent("full-screen-exit", {
          message: "User exited fullscreen",
        });
      } else if (document.fullscreenElement) {
        setProctorFlag(false);
        logProctoringEvent("other", { message: "User entered fullscreen" });
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isProctoringActive.current) {
        const timeAway = (Date.now() - lastFocusTime.current) / 1000;
        setProctorFlag(true);
        logProctoringEvent("tab-switch", {
          message: "User switched tabs",
          duration: timeAway,
        });
      } else if (!document.hidden) {
        lastFocusTime.current = Date.now();
        setProctorFlag(false);
        logProctoringEvent("tab-switch", { message: "User returned to tab" });
      }
    };

    const handleFocus = () => {
      if (!isProctoringActive.current) return;
      const timeAway = (Date.now() - lastFocusTime.current) / 1000;
      if (timeAway > 5) {
        setProctorFlag(true);
        logProctoringEvent("other", {
          message: "User minimized or switched window",
          duration: timeAway,
        });
      }
      lastFocusTime.current = Date.now();
    };

    const handleBlur = () => {
      if (!isProctoringActive.current) return;
      setProctorFlag(true);
      logProctoringEvent("other", { message: "Window lost focus" });
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);

    const requestFullscreen = () => {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Fullscreen request failed:", err);
        setProctorFlag(true);
        logProctoringEvent("other", {
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

  return { proctorEvents };
};

export default useProctor;
