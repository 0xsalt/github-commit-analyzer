"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, GitCommit, GitCompare, Github } from "lucide-react";
import CommitAnalyzer from "@/components/CommitAnalyzer";
import ForkComparison from "@/components/ForkComparison";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Github className="h-10 w-10 text-slate-700 dark:text-slate-300" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
              GitHub Commit Analyzer
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Analyze GitHub repository commits with AI-powered insights and compare forks with their upstream repositories
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="commits" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="commits" className="flex items-center gap-2">
              <GitCommit className="h-4 w-4" />
              Commit Analysis
            </TabsTrigger>
            <TabsTrigger value="compare" className="flex items-center gap-2">
              <GitCompare className="h-4 w-4" />
              Fork Comparison
            </TabsTrigger>
          </TabsList>

          <TabsContent value="commits" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Repository Commit Analysis
                </CardTitle>
                <CardDescription>
                  Analyze the last N commits from any GitHub repository with AI-powered summaries
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <CommitAnalyzer />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compare" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <GitCompare className="h-5 w-5 text-green-600 dark:text-green-400" />
                  Fork vs Upstream Comparison
                </CardTitle>
                <CardDescription>
                  Compare a forked repository with its upstream to analyze differences and synchronization status
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ForkComparison />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Powered by GitHub API and AI-driven commit analysis
          </p>
        </div>
      </div>
    </div>
  );
}
