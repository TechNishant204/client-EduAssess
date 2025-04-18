// // src/utils/validators.js
// export const validateExamForm = (data) => {
//   const errors = {};
//   if (!data.title) errors.title = "Title is required";
//   if (!data.description) errors.description = "Description is required";
//   if (!data.duration || data.duration <= 0)
//     errors.duration = "Duration must be positive";
//   if (!data.startTime) errors.startTime = "Start time is required";
//   if (!data.endTime) errors.endTime = "End time is required";
//   if (!data.totalMarks || data.totalMarks <= 0)
//     errors.totalMarks = "Total marks must be positive";
//   if (!data.passingMarks || data.passingMarks <= 0)
//     errors.passingMarks = "Passing marks must be positive";
//   return errors;
// };

// export const validateQuestionForm = (data) => {
//   const errors = {};
//   if (!data.text) errors.text = "Question text is required";
//   if (!data.type) errors.type = "Question type is required";
//   if (
//     data.type === "multiple-choice" &&
//     (!data.options || data.options.length < 2)
//   )
//     errors.options = "At least 2 options are required";
//   if (!data.correctAnswer) errors.correctAnswer = "Correct answer is required";
//   if (!data.marks || data.marks <= 0) errors.marks = "Marks must be positive";
//   if (!data.difficulty) errors.difficulty = "Difficulty is required";
//   return errors;
// };
