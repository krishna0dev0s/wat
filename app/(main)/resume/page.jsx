import { getResume } from "@/app/actions/resume";
import React from "react";
import ResumeBuilder from "./_components/resume-builder";
import ResumeAnalyzer from "./_components/resume-analyzer";
import ResumeExtractor from "./_components/resume-extractor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ResumePage() {
  const resume = await getResume();

  return (
    <div className="w-full py-10 md:py-20 min-h-screen">
      {/* Background gradients */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {/* Removed background gradient */}
        {/* Removed background gradient */}
      </div>

      <div className="container mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="space-y-6 text-center container mx-auto mb-12">
          <div className="space-y-6 hero-content">
            <div className="hero-title">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight metallic-text">
                Professional Resume
                <br />
                <span className="metallic-blue">
                  Builder & AI Assistant
                </span>
              </h1>
              <p className="mt-6 text-lg md:text-xl lg:text-2xl font-medium max-w-3xl mx-auto text-gray-100">
                Craft a compelling resume with AI assistance. Stand out from the crowd with powerful descriptions and modern formatting.
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Tabs */}
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger 
                value="builder"
                className="data-[state=active]:text-primary-foreground"
              >
                Resume Builder
              </TabsTrigger>
              <TabsTrigger 
                value="extractor"
                className="data-[state=active]:text-primary-foreground"
              >
                Resume Extractor
              </TabsTrigger>
              <TabsTrigger 
                value="analyzer"
                className="data-[state=active]:text-primary-foreground"
              >
                Resume Analyzer
              </TabsTrigger>
            </TabsList>

            {/* Resume Builder Tab */}
            <TabsContent value="builder" className="border border-white/10 rounded-xl">
              <ResumeBuilder initialContent={resume?.content} />
            </TabsContent>

            {/* Resume Extractor Tab */}
            <TabsContent value="extractor" className="border border-white/10 rounded-xl p-6">
              <ResumeExtractor />
            </TabsContent>

            {/* Resume Analyzer Tab */}
            <TabsContent value="analyzer" className="border border-white/10 rounded-xl p-6">
              <ResumeAnalyzer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
