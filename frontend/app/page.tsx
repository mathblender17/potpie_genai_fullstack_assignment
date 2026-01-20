"use client";

import { useState } from "react";

interface DecisionOutput {
  recommendation: string;
  reasoning: string;
  tradeoffs: string[];
  fallback_plan: string;
  confidence_score: number;
}

export default function Home() {
  const [decision, setDecision] = useState("");
  const [options, setOptions] = useState<string[]>([""]);
  const [constraints, setConstraints] = useState<string[]>([]);
  const [urgency, setUrgency] = useState<"low" | "medium" | "high">("medium");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DecisionOutput | null>(null);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index: number) => {
    if (options.length > 1) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addConstraint = () => {
    setConstraints([...constraints, ""]);
  };

  const removeConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...constraints];
    newConstraints[index] = value;
    setConstraints(newConstraints);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const filteredOptions = options.filter((opt) => opt.trim() !== "");
    const filteredConstraints = constraints.filter((c) => c.trim() !== "");

    if (!decision.trim()) {
      setError("Please enter a decision to make.");
      return;
    }

    if (filteredOptions.length < 2) {
      setError("Please provide at least 2 options.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://decideforme-backend.onrender.com/decide
", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          decision: decision.trim(),
          options: filteredOptions,
          constraints: filteredConstraints.length > 0 ? filteredConstraints : null,
          urgency,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error occurred" }));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get recommendation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            DecideForMe
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Get AI-powered recommendations for your decisions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Decision Textarea */}
          <div>
            <label htmlFor="decision" className="block text-sm font-medium text-black dark:text-zinc-50 mb-2">
              Decision
            </label>
            <textarea
              id="decision"
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
              placeholder="What decision do you need help with?"
            />
          </div>

          {/* Options */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-black dark:text-zinc-50">
                Options
              </label>
              <button
                type="button"
                onClick={addOption}
                className="text-sm text-black hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                + Add Option
              </button>
            </div>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  {options.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-black dark:text-zinc-50">
                Constraints <span className="text-zinc-500 dark:text-zinc-400">(optional)</span>
              </label>
              <button
                type="button"
                onClick={addConstraint}
                className="text-sm text-black hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
              >
                + Add Constraint
              </button>
            </div>
            {constraints.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                No constraints added yet
              </p>
            ) : (
              <div className="space-y-2">
                {constraints.map((constraint, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={constraint}
                      onChange={(e) => updateConstraint(index, e.target.value)}
                      className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black placeholder-zinc-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:placeholder-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
                      placeholder={`Constraint ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeConstraint(index)}
                      className="px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Urgency Dropdown */}
          <div>
            <label htmlFor="urgency" className="block text-sm font-medium text-black dark:text-zinc-50 mb-2">
              Urgency
            </label>
            <select
              id="urgency"
              value={urgency}
              onChange={(e) => setUrgency(e.target.value as "low" | "medium" | "high")}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-black focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-500 dark:focus:ring-zinc-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            {loading ? "Thinking…" : "Get Recommendation"}
          </button>
        </form>

        {/* Result Card */}
        {result && (
          <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-2xl font-bold text-black dark:text-zinc-50 mb-4">
              Recommendation
            </h2>
            <p className="text-lg text-black dark:text-zinc-50 mb-6 leading-relaxed">
              {result.recommendation}
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-black dark:text-zinc-50 mb-2">
                  Reasoning
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.reasoning}
                </p>
              </div>

              {result.tradeoffs.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-black dark:text-zinc-50 mb-2">
                    Trade-offs
                  </h3>
                  <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300">
                    {result.tradeoffs.map((tradeoff, index) => (
                      <li key={index}>{tradeoff}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-black dark:text-zinc-50 mb-2">
                  Fallback Plan
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {result.fallback_plan}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-black dark:text-zinc-50 mb-2">
                  Confidence Score
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {result.confidence_score}/10
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
