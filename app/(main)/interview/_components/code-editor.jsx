"use client";

import { useState } from "react";
import { Copy, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
  const handleRun = async () => {
    setRunning(true);
    // Simulate code execution - in production, use a safe execution engine
    setTimeout(() => {
      setOutput("// Output simulated\n" + code);
      setRunning(false);
    }, 1000);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit(code);
  };

  const handleReset = () => {
    setCode(question.codeTemplate || "");
    setOutput("");
    setSubmitted(false);
  };

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(code);
  };
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function CodeEditor({ question, onSubmit }) {
  const [code, setCode] = useState(question.codeTemplate || "");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <Card className="border border-border shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Write Your Solution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg p-1 overflow-hidden border border-border">
            <Textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Write your code here..."
              className="border-0 focus:ring-0 font-mono text-sm h-96 resize-none"
              disabled={submitted}
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyTemplate}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Code
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRun}
              disabled={running || submitted}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {running ? "Running..." : "Run Code"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={submitted}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      {output && (
        <Card className="border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded text-sm overflow-x-auto text-muted-foreground font-mono">
              {output}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Expected Output */}
      {question.expectedOutput && (
        <Card className="border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Expected Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-3 rounded text-sm overflow-x-auto text-muted-foreground font-mono">
              {question.expectedOutput}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Sample Answer */}
      {question.sampleAnswer && !submitted && (
        <Card className="border border-border shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Badge variant="outline">Hint</Badge>
              Sample Approach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{question.sampleAnswer}</p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!code.trim() || submitted}
        className="w-full"
      >
        {submitted ? "✓ Submitted" : "Submit Solution"}
      </Button>
    </div>
  );
}

