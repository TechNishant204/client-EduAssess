// // src/utils/helper.js
// export const formatTime = (seconds) => {
//   const minutes = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
// };

// export const calculateScore = (questions, answers) => {
//   return questions.reduce((score, q) => {
//     return score + (answers[q._id] === q.correctAnswer ? q.marks : 0);
//   }, 0);
// };
