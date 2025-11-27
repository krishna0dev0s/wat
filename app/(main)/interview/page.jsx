"use client";

import { useState } from "react";
import { getAssessments } from "@/actions/interview";
import StatsCards from "./_components/stats-cards";
import PerformanceChart from "./_components/performace-chart";
import QuizList from "./_components/quiz-list";
import CompanySearch from "./_components/company-search";
import InterviewPrepWithCompany from "./_components/interview-prep-with-company";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InterviewPrepPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [assessments, setAssessments] = useState([]);

  // Fetch assessments once on mount
  const [assessmentsLoaded, setAssessmentsLoaded] = useState(false);

  if (!assessmentsLoaded) {
    // Server-side rendered data would be passed here
    // For now, we'll use client-side state
  }

  if (selectedJob) {
    return (
      <div className="w-full py-10 md:py-20 min-h-screen">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          {/* Removed background gradients and blur */}
        </div>

        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <InterviewPrepWithCompany
              company={selectedJob.company}
              job={selectedJob.job}
              onBack={() => setSelectedJob(null)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-10 md:py-20 min-h-screen">
      {/* Background gradients removed */}
      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="space-y-6 text-center container mx-auto mb-12">
          <div className="space-y-6 hero-content">
            <div className="hero-title">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
                Interview Preparation
                <br />
                <span className="metallic-blue">
                  Your Path to Success
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
                Search for companies, explore job openings, and practice with AI-powered interview questions tailored to your target role.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="company-search" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="company-search">Company Search</TabsTrigger>
              <TabsTrigger value="analytics">Your Progress</TabsTrigger>
              <TabsTrigger value="assessments">Past Assessments</TabsTrigger>
            </TabsList>

            <TabsContent value="company-search" className="space-y-6">
              <CompanySearch onJobSelect={setSelectedJob} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Performance Overview</h2>
                <StatsCards assessments={assessments} />
              </section>

              <section className="border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Progress Analysis</h2>
                <PerformanceChart assessments={assessments} />
              </section>
            </TabsContent>

            <TabsContent value="assessments">
              <section>
                <h2 className="text-2xl font-semibold mb-6 text-foreground/80">Past Assessments</h2>
                <QuizList assessments={assessments} />
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
