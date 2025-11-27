"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeEditor from "./code-editor";
import { saveInterviewAssessment } from "@/actions/interview";

export default function InterviewPrepWithCompany({ company, job, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, [company, job]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: company,
          jobTitle: job.title,
          jobDescription: job.description,
          skills: job.skills,
          level: job.level,
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch questions");

      const data = await res.json();
      setQuestions(data.questions || []);
    } catch (err) {
      setError(err.message || "Failed to load interview questions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex items-center justify-center">
        <Card className="border border-border shadow-md w-full max-w-md">
          <CardContent className="pt-6 flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-lg font-medium">Generating interview questions...</p>
            <p className="text-sm text-muted-foreground">Customizing for {company} - {job.title}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <Card className="border border-border shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
            <div>
              <p className="font-medium">{error || "No questions found"}</p>
              <p className="text-sm text-muted-foreground mt-1">Please try again or select another job.</p>
              <Button onClick={onBack} className="mt-4 gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const answered = answers[currentIndex];

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentIndex]: answer,
    });
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const scores = {};
      questions.forEach((_, idx) => {
        scores[idx] = { passed: !!answers[idx] };
      });

      await saveInterviewAssessment(company, job.title, questions, answers, scores);
      setSubmitted(true);
      
      // Show success message and redirect after 2 seconds
      setTimeout(() => onBack(), 2000);
    } catch (err) {
      setError("Failed to save assessment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border border-border shadow-md">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="text-5xl">✓</div>
            <p className="text-xl font-semibold">Interview Completed!</p>
            <p className="text-muted-foreground">Your assessment has been saved. Redirecting...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-300";
      case "medium":
        return "text-yellow-300";
      case "hard":
        return "text-red-300";
      default:
        return "text-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "coding":
        return "💻";
      case "technical":
        return "🔧";
      case "behavioral":
        return "💬";
      default:
        return "❓";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <Card className="border border-border bg-card/80 backdrop-blur-md shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{company} - {job.title}</CardTitle>
              <CardDescription className="text-base mt-1">Interview Preparation</CardDescription>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Question {currentIndex + 1} of {questions.length}</p>
              <div className="h-2 w-48 bg-background rounded-full mt-2 overflow-hidden border border-border">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Question Card */}
      <Card className="border border-border shadow-md">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{getTypeIcon(currentQuestion.type)}</span>
                <Badge className={`${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty || "medium"}
                </Badge>
                <Badge variant="outline">{currentQuestion.type}</Badge>
              </div>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              {currentQuestion.category && (
                <p className="text-sm text-muted-foreground mt-2">Category: {currentQuestion.category}</p>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hints */}
          {currentQuestion.hints && currentQuestion.hints.length > 0 && (
            <div className="bg-background/50 border border-border rounded-lg p-4">
              <p className="text-sm font-medium mb-2">Hints:</p>
              <ul className="space-y-1">
                {currentQuestion.hints.map((hint, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">→</span>
                    {hint}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Code Editor for Coding Questions */}
          {currentQuestion.type?.toLowerCase() === "coding" ? (
            <CodeEditor question={currentQuestion} onSubmit={handleAnswer} />
          ) : (
            /* Text Area for Behavioral/Technical Questions */
            <div className="bg-background/50 rounded-lg p-1 border border-border">
              <textarea
                value={answers[currentIndex] || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder={`Your answer for this ${currentQuestion.type} question...`}
                className="w-full p-3 border-0 focus:ring-0 font-normal text-sm h-48 resize-none"
              />
            </div>
          )}

          {/* Sample Answer */}
          {currentQuestion.sampleAnswer && answered && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm font-medium text-primary mb-2">Sample Approach:</p>
              <p className="text-sm text-muted-foreground">{currentQuestion.sampleAnswer}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          variant="outline"
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? "w-8 bg-primary"
                  : answers[idx]
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-border"
              }`}
              title={`Question ${idx + 1}${answers[idx] ? " (answered)" : ""}`}
            />
          ))}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={handleFinish}
            disabled={!answered || submitting}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Complete Interview
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!answered}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
