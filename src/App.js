import { useState, useEffect } from "react";

export default function QuestionTimerApp() {
  const [step, setStep] = useState("start"); // start | session | summary
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
    if (activeQ < totalQuestions - 1) {
      setActiveQ(activeQ + 1);
    }
  };

  const prevQ = () => {
    if (activeQ > 0) setActiveQ(activeQ - 1);
  };

  const handleSubmit = () => {
    setStep("summary");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-6">
      {/* START SCREEN */}
      {step === "start" && (
        <div className="text-center space-y-6">
          <h1 className="text-2xl font-bold">Start a Session</h1>
          <input
            type="number"
            placeholder="Enter number of questions"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="px-4 py-2 rounded-lg text-black"
          />
          <button
            onClick={handleStart}
            className="block w-full px-6 py-3 mt-4 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Start
          </button>
        </div>
      )}

      {/* SESSION SCREEN */}
      {step === "session" && (
        <div className="w-full max-w-2xl">
          {/* Question Tabs */}
          <div className="flex flex-wrap gap-2 mb-4 justify-center">
            {Array.from({ length: totalQuestions }, (_, i) => (
              <button
                key={i}
                onClick={() => setActiveQ(i)}
                className={`px-3 py-1 rounded-lg border ${
                  i === activeQ
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                Q{i + 1}
              </button>
            ))}
          </div>

          {/* Question Card */}
          <div className="border rounded-xl p-6 shadow bg-gray-800">
            <h2 className="text-xl font-semibold mb-6">
              Question {activeQ + 1}
            </h2>

            {/* Timer */}
            <div className="text-2xl font-bold mb-6">
              ⏱ {timers[activeQ]}s
            </div>

            {/* Controls */}
            <div className="flex justify-between mt-6">
              <button
                onClick={prevQ}
                disabled={activeQ === 0}
                className="px-4 py-2 rounded-xl bg-gray-700 disabled:opacity-50"
              >
                Prev
              </button>
              {activeQ === totalQuestions - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 rounded-xl bg-green-600 hover:bg-green-700"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={nextQ}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
            <p className="text-sm text-gray-400 mt-4">
              💡 Tip: Press <kbd>Space</kbd> to go to next question
            </p>
          </div>
        </div>
      )}

      {/* SUMMARY SCREEN */}
      {step === "summary" && (
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-2xl font-bold text-center">Session Summary</h1>
          <ul className="space-y-2">
            {timers.map((t, i) => (
              <li
                key={i}
                className="flex justify-between bg-gray-800 p-3 rounded-lg"
              >
                <span>Question {i + 1}</span>
                <span>{t}s</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setStep("start")}
            className="w-full px-6 py-3 bg-blue-600 rounded-xl hover:bg-blue-700"
          >
            Start New Session
          </button>
        </div>
      )}
    </div>
  );
}
