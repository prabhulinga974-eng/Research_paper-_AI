/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  BrainCircuit,
  GitBranch,
  Briefcase,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertCircle,
  FileCheck2,
  Terminal,
  Cpu,
  Layers,
  Sparkles,
} from "lucide-react";
import { Navbar } from "./components/Navbar";
import { PaperInput } from "./components/PaperInput";
import { CoreConceptView } from "./components/CoreConceptView";
import { MermaidViewer } from "./components/MermaidViewer";
import { StudentOpportunitiesView } from "./components/StudentOpportunitiesView";
import { HistoryDrawer } from "./components/HistoryDrawer";
import { AgentDiagnostics } from "./components/AgentDiagnostics";
import { PaperAnalysis, SamplePaper } from "./types/paper";
import { INITIAL_MAMBA_ANALYSIS } from "./data/initialPaper";

const STORAGE_KEY = "arxiv_architect_history_v1";

export default function App() {
  const [currentAnalysis, setCurrentAnalysis] = useState<PaperAnalysis>(
    INITIAL_MAMBA_ANALYSIS
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "concepts" | "flowchart" | "opportunities" | "diagnostics"
  >("concepts");
  const [samplePapers, setSamplePapers] = useState<SamplePaper[]>([]);
  const [history, setHistory] = useState<PaperAnalysis[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history from localStorage and fetch sample papers
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          // If there is recent history, pick the latest one
          setCurrentAnalysis(parsed[0]);
        } else {
          setHistory([INITIAL_MAMBA_ANALYSIS]);
        }
      } else {
        setHistory([INITIAL_MAMBA_ANALYSIS]);
      }
    } catch (_e) {
      setHistory([INITIAL_MAMBA_ANALYSIS]);
    }

    // Fetch sample papers list
    fetch("/api/sample-papers")
      .then((res) => res.json())
      .then((data) => {
        if (data.papers) setSamplePapers(data.papers);
      })
      .catch((err) => console.error("Could not fetch sample papers:", err));
  }, []);

  const saveToHistory = (newAnalysis: PaperAnalysis) => {
    const updated = [
      newAnalysis,
      ...history.filter((h) => h.paperDetails.title !== newAnalysis.paperDetails.title),
    ].slice(0, 15);
    setHistory(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("LocalStorage save error:", e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("LocalStorage clear error:", e);
    }
  };

  const handleAnalyze = async (payload: {
    url?: string;
    paperTitle?: string;
    paperText?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStep("1/3 Querying arXiv & Ingesting Research Context...");

    const stepInterval = setTimeout(() => {
      setLoadingStep("2/3 Extracting Core Methodologies & Synthesizing System Layers...");
    }, 3200);

    const stepInterval2 = setTimeout(() => {
      setLoadingStep("3/3 Generating Mermaid.js Flowchart & Formulating Student Projects...");
    }, 7000);

    try {
      const response = await fetch("/api/analyze-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || `Server responded with ${response.status}`);
      }

      const result = await response.json();

      if (!result.data || !result.data.coreConcept) {
        throw new Error("Invalid structure returned from research agent.");
      }

      const completeAnalysis: PaperAnalysis = {
        ...result.data,
        id: `paper-${Date.now()}`,
        timestamp: Date.now(),
        grounding: result.grounding,
        usage: result.usage,
      };

      setCurrentAnalysis(completeAnalysis);
      saveToHistory(completeAnalysis);
      setActiveTab("concepts");
    } catch (err: any) {
      console.error("Paper analysis failed:", err);
      setErrorMessage(
        err.message || "Failed to analyze paper. Please check the URL or try again."
      );
    } finally {
      clearTimeout(stepInterval);
      clearTimeout(stepInterval2);
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const handleSelectSample = (paper: SamplePaper) => {
    // If we have it in history, select it right away
    const existing = history.find(
      (h) => h.paperDetails.title.toLowerCase().includes(paper.title.slice(0, 15).toLowerCase())
    );
    if (existing) {
      setCurrentAnalysis(existing);
      return;
    }
    // Otherwise trigger analysis for this paper
    handleAnalyze({ url: paper.url, paperTitle: paper.title });
  };

  const details = currentAnalysis?.paperDetails;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Navbar */}
      <Navbar
        currentAnalysis={currentAnalysis}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Paper Input Section */}
        <section>
          <PaperInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            samplePapers={samplePapers}
            onSelectSample={handleSelectSample}
          />
        </section>

        {/* Loading Progress Banner */}
        {isLoading && (
          <div className="bg-slate-900/90 border border-blue-500/40 rounded-2xl p-6 text-center shadow-xl space-y-3 animate-pulse">
            <div className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-400 rounded-full animate-spin" />
              <span className="text-sm font-semibold text-blue-300 font-mono">
                {loadingStep || "Agent Pipeline in Progress..."}
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Extracting mathematical breakthroughs, generating Mermaid.js system architecture, and blueprinting student internship projects under 25k token constraint.
            </p>
          </div>
        )}

        {/* Error Advisory */}
        {errorMessage && (
          <div className="bg-red-950/40 border border-red-900/80 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-semibold text-red-300">
                Agent Execution Error
              </h4>
              <p className="text-xs text-red-200/80 mt-0.5">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Current Paper Hero & Overview */}
        {details && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center flex-wrap gap-2 text-xs">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono font-medium">
                    {details.venueOrArxiv || details.year}
                  </span>
                  <span className="text-slate-400 font-mono">
                    {details.authors}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold text-slate-50 tracking-tight">
                  {details.title}
                </h1>

                {details.oneLineTakeaway && (
                  <p className="text-xs sm:text-sm text-cyan-300/90 font-mono font-medium">
                    💡 {details.oneLineTakeaway}
                  </p>
                )}
              </div>

              {details.url && (
                <a
                  href={details.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 self-start shrink-0"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>View Original Paper</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              )}
            </div>

            {/* Navigation Tabs (3 Main Steps + Diagnostics) */}
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center flex-wrap gap-2">
              <button
                onClick={() => setActiveTab("concepts")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "concepts"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                }`}
              >
                <BrainCircuit className="w-4 h-4" />
                <span>1. Core Concept Extraction</span>
                <span className="text-[10px] font-mono opacity-80">&lt; 300 words</span>
              </button>

              <button
                onClick={() => setActiveTab("flowchart")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "flowchart"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                }`}
              >
                <GitBranch className="w-4 h-4" />
                <span>2. Architectural Flowchart</span>
                <span className="text-[10px] font-mono opacity-80">Mermaid.js</span>
              </button>

              <button
                onClick={() => setActiveTab("opportunities")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === "opportunities"
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                    : "bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>3. Internship & Resume Lab</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  3 Ideas
                </span>
              </button>

              <button
                onClick={() => setActiveTab("diagnostics")}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ml-auto ${
                  activeTab === "diagnostics"
                    ? "bg-slate-700 text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Telemetry & Grounding</span>
              </button>
            </div>
          </section>
        )}

        {/* Tab Content Display */}
        {currentAnalysis && (
          <section>
            {activeTab === "concepts" && (
              <CoreConceptView
                concept={currentAnalysis.coreConcept}
                details={currentAnalysis.paperDetails}
              />
            )}

            {activeTab === "flowchart" && (
              <MermaidViewer
                flowchart={currentAnalysis.flowchart}
                paperTitle={currentAnalysis.paperDetails.title}
              />
            )}

            {activeTab === "opportunities" && (
              <StudentOpportunitiesView
                opportunities={currentAnalysis.studentOpportunities}
                paperTitle={currentAnalysis.paperDetails.title}
              />
            )}

            {activeTab === "diagnostics" && (
              <AgentDiagnostics analysis={currentAnalysis} />
            )}
          </section>
        )}
      </main>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelect={(item) => {
          setCurrentAnalysis(item);
          setActiveTab("concepts");
        }}
        onClear={handleClearHistory}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">ArXivArchitect</span>
            <span>•</span>
            <span>Computer Science Research Agent</span>
          </div>
          <div className="text-[11px] font-mono text-slate-500">
            Powered by Gemini 3.8 Flash • Strict &lt;25k Token Guardrail • Mermaid.js Visual Graph
          </div>
        </div>
      </footer>
    </div>
  );
}
