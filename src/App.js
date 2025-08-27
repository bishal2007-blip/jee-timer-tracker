import { useState, useEffect } from "react";

export default function QuestionTimerApp() {
  const [step, setStep] = useState("start");
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [activeQ, setActiveQ] = useState(0);
  const [timers, setTimers] = useState([]);
  const [inputValue, setInputValue] = useState("");

  // Timer per question
  useEffect(() => {
    if (step !== "session") return;
    const interval = setInterval(() => {
      setTimers((prev) =>
        prev.map((t, i) => (i === activeQ ? t + 1 : t))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [activeQ, step]);

  // Spacebar → next question
  useEffect(() => {
    if (step !== "session") return;
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        nextQ();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeQ, step]);

  const handleStart = () => {
    const num = parseInt(inputValue);
    if (!num || num <= 0) return;
    setTotalQuestions(num);
    setTimers(Array(num).fill(0));
    setStep("session");
  };

  const nextQ = () => {
    if (activeQ < totalQuestions - 1) setActiveQ(activeQ + 1);
  };

  const prevQ = () => {
    if (activeQ > 0) setActiveQ(activeQ - 1);
  };

  const handleSubmit = () => setStep("summary");

  const formatTime = (t) => {
    const mins = Math.floor(t / 60);
    const secs = t % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      {/* START SCREEN */}
      {step === "start" && (
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Start a Session</h1>
          <input
            type="number"
            placeholder="Enter number of questions"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-4 py-2 rounded-lg text-black w-48"
          />
          <button
            onClick={handleStart}
            className="block w-48 mx-auto px-6 py-3 mt-4 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            Start
          </button>
        </div>
      )}

      {/* SESSION SCREEN */}
      {step === "session" && (
        <div className="w-full max-w-5xl flex gap-8">
          {/* QUESTION CARD */}
          <div className="flex-1 border rounded-xl p-8 shadow-xl bg-gray-800 max-w-xl h-[250px] flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-semibold mb-6">Question {activeQ + 1}</h2>
              <div className="text-3xl font-bold mb-6">⏱ {formatTime(timers[activeQ])}</div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={prevQ}
                disabled={activeQ === 0}
                className="px-4 py-2 rounded-xl bg-gray-700 disabled:opacity-50 hover:bg-gray-600 transition"
              >
                Prev
              </button>
              {activeQ === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700 transition"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={nextQ}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>

          {/* QUESTION LIST */}
          <div className="w-64 bg-gray-800 p-4 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold mb-3 text-center">List of Questions</h3>
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveQ(i)}
                  className={`px-2 py-2 rounded-lg text-center font-medium transition ${
                    i === activeQ
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUMMARY SCREEN */}
      {step === "summary" && (
        <div className="w-full max-w-3xl space-y-6">
          <h1 className="text-3xl font-bold text-center">Session Summary</h1>
          <ul className="space-y-2">
            {timers.map((t, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-800 p-3 rounded-lg shadow"
              >
                <span>Question {i + 1}</span>
                <span>{formatTime(t)}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStep("start")}
            className="w-full px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
