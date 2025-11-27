"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function LeetCodeSolver() {
	const [problem, setProblem] = useState("");
	const [language, setLanguage] = useState("JavaScript");
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState(null);
	const [error, setError] = useState(null);

	const submit = async (e) => {
		e?.preventDefault();
		setLoading(true);
		setError(null);
		setResult(null);
		try {
			const res = await fetch("/api/leetcode", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ problemNumber: problem, language }),
			});
			const json = await res.json();
			if (!res.ok) throw new Error(json?.error || "Server error");
			setResult(json.data);
		} catch (err) {
			setError(String(err));
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-3xl mx-auto p-6">
			<div className="border border-white/10 p-4">
				<div className="text-2xl font-semibold mb-4">LeetCode Solver</div>
				<div className="space-y-4">
					  <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end">
						<div className="sm:col-span-3">
							<label className="block text-sm font-medium mb-2">Problem Number</label>
							<Input
								id="problemNumber"
								type="number"
								value={problem}
								onChange={(e) => setProblem(e.target.value)}
								placeholder="e.g. 1"
								className="border-white/20"
								required
							/>
						</div>

						<div className="sm:col-span-2">
							<label className="block text-sm font-medium mb-2">Language</label>
							<select
								className="w-full rounded-md border border-white/20 px-3 py-2"
								value={language}
								onChange={(e) => setLanguage(e.target.value)}
							>
								<option>JavaScript</option>
								<option>TypeScript</option>
								<option>Python</option>
								<option>Java</option>
								<option>c++</option>
								<option>C#</option>
							</select>
						</div>

									<div className="sm:col-span-1">
										<Button
											type="submit"
											variant="secondary"
											size="lg"
											className="w-full rounded-lg px-4 py-3 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_40px_rgba(82,39,255,0.18)] text-white"
											disabled={loading}
										>
											{loading ? "Generating..." : "Get Solution"}
										</Button>
									</div>
					</form>

					{error && <div className="text-red-500">{error}</div>}

					{result && (
						<div className="space-y-4">
							<div className="p-4 rounded">
								<h2 className="text-xl font-medium">{result.title}</h2>
								<p className="text-sm text-muted-foreground">Difficulty: {result.difficulty}</p>
							</div>

							{result.description && (
								<div className="text-sm text-gray-300">
									<h3 className="font-semibold">Description</h3>
									<div className="mt-1 whitespace-pre-wrap">{result.description}</div>
								</div>
							)}

							{result.approach && (
								<div className="text-sm text-gray-300">
									<h3 className="font-semibold">Approach</h3>
									<div className="mt-1 whitespace-pre-wrap">{result.approach}</div>
								</div>
							)}

							{result.steps && Array.isArray(result.steps) && (
								<div className="text-sm text-gray-300">
									<h3 className="font-semibold">Steps</h3>
									<ol className="list-decimal list-inside mt-1">
										{result.steps.map((s, i) => (
											<li key={i} className="mt-1">{s}</li>
										))}
									</ol>
								</div>
							)}

							<div>
								<h3 className="font-semibold">Code</h3>
								<Textarea
									readOnly
									value={result.code || JSON.stringify(result, null, 2)}
									className="font-mono min-h-[180px] text-sm"
								/>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
