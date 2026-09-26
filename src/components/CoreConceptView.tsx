import React, { useState } from "react";
import {
  FileText,
  AlertCircle,
  Cpu,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  BookOpen,
  Scale,
  BrainCircuit,
} from "lucide-react";
import { CoreConcept, PaperDetails } from "../types/paper";

interface CoreConceptViewProps {
  concept: CoreConcept;
  details: PaperDetails;
}

export const CoreConceptView: React.FC<CoreConceptViewProps> = ({
  concept,
  details,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopySynthesis = () => {
    navigator.clipboard.writeText(
      `Core Concept Extraction: ${details.title}\n\nProblem Statement:\n${concept.problemStatement}\n\nPrimary Methodology:\n${concept.primaryMethodology}\n\nAccessible Synthesis:\n${concept.accessibleSynthesis}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount =
    concept.wordCount || concept.accessibleSynthesis.split(/\s+/).filter(Boolean).length;
  const isUnder300 = wordCount <= 300;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header & Word Count Compliance */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-mono font-medium">
              Step 1 of 3
            </span>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-blue-400" />
              Core Concept Extraction
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Deconstructs the foundational CS bottleneck, algorithmic methodology, and key breakthroughs.
          </p>
        </div>

        {/* Word budget gauge */}
        <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800/90 px-4 py-2 rounded-xl">
          <div className="text-right">
            <div className="text-xs font-medium text-slate-400">Synthesis Word Budget</div>
            <div className="text-sm font-mono font-bold text-slate-200">
              <span className={isUnder300 ? "text-emerald-400" : "text-amber-400"}>
                {wordCount}
              </span>{" "}
              / 300 words
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Grid: Problem Statement vs Primary Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Problem Statement Card */}
        <div className="bg-slate-900/70 border border-red-950/60 rounded-2xl p-5 relative overflow-hidden group hover:border-red-900/80 transition-colors">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500/80" />
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
            <AlertCircle className="w-4 h-4" />
            <span>The Bottleneck & Problem Statement</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {concept.problemStatement}
          </p>
        </div>

        {/* Primary Methodology Card */}
        <div className="bg-slate-900/70 border border-blue-950/60 rounded-2xl p-5 relative overflow-hidden group hover:border-blue-900/80 transition-colors">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/80" />
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono uppercase tracking-wider font-semibold mb-3">
            <Cpu className="w-4 h-4" />
            <span>Primary Methodology & Architecture</span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-sans">
            {concept.primaryMethodology}
          </p>
        </div>
      </div>

      {/* Key Mathematical & Algorithmic Breakthroughs */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono uppercase tracking-wider font-semibold mb-4">
          <Scale className="w-4 h-4" />
          <span>Key Mathematical & Algorithmic Breakthroughs</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {concept.keyBreakthroughs.map((item, index) => (
            <div
              key={index}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 hover:border-indigo-500/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 text-xs font-mono flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                <span className="text-xs font-semibold text-slate-200">
                  Breakthrough #{index + 1}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Plain-Language Synthesis (< 300 words) */}
      <div className="bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-blue-950/30 border border-blue-900/40 rounded-2xl p-6 relative shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono uppercase tracking-wider font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Plain-Language Synthesis (Accessible CS Summary)</span>
          </div>

          <button
            onClick={handleCopySynthesis}
            className="px-2.5 py-1 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <div className="prose prose-invert max-w-none">
          <div className="text-slate-200 text-sm leading-relaxed whitespace-pre-line font-sans border-l-2 border-cyan-500/40 pl-4 py-1 italic">
            "{concept.accessibleSynthesis}"
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Target Audience: 3rd-year CS students, engineers, and researchers</span>
          <span className="font-mono text-cyan-400/80">Reading Time: ~1 min</span>
        </div>
      </div>
    </div>
  );
};
