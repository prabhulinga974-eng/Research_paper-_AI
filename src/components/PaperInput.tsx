import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  ArrowRight,
  Flame,
  FileCode,
  Zap,
} from "lucide-react";
import { SamplePaper } from "../types/paper";

interface PaperInputProps {
  onAnalyze: (payload: {
    url?: string;
    paperTitle?: string;
    paperText?: string;
  }) => void;
  isLoading: boolean;
  samplePapers: SamplePaper[];
  onSelectSample: (paper: SamplePaper) => void;
}

export const PaperInput: React.FC<PaperInputProps> = ({
  onAnalyze,
  isLoading,
  samplePapers,
  onSelectSample,
}) => {
  const [url, setUrl] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [paperTitle, setPaperTitle] = useState("");
  const [paperText, setPaperText] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!url.trim() && !paperTitle.trim() && !paperText.trim()) return;

    onAnalyze({
      url: url.trim() || undefined,
      paperTitle: paperTitle.trim() || undefined,
      paperText: paperText.trim() || undefined,
    });
  };

  return (
    <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-300">
              <LinkIcon className="w-3.5 h-3.5 text-blue-400" />
              Academic Research Paper URL (arXiv, OpenReview, GitHub, PDF)
            </span>
            <span className="text-[11px] text-cyan-400 font-mono font-normal">
              ⚡ Web Grounded & Token-Optimized
            </span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. https://arxiv.org/abs/2312.00752 (Mamba) or https://arxiv.org/abs/1706.03762"
                className="w-full pl-10 pr-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || (!url.trim() && !paperTitle.trim() && !paperText.trim())}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 text-white font-medium rounded-xl text-sm transition-all shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Parsing Paper...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Deconstruct Architecture</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible advanced manual input */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
          >
            <span>{showAdvanced ? "▼ Hide" : "▶ Or enter paper title & abstract manually"}</span>
          </button>

          {showAdvanced && (
            <div className="mt-3 p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3 animate-fadeIn">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Paper Title (Optional)
                </label>
                <input
                  type="text"
                  value={paperTitle}
                  onChange={(e) => setPaperTitle(e.target.value)}
                  placeholder="e.g. FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Abstract or Paper Excerpt
                </label>
                <textarea
                  value={paperText}
                  onChange={(e) => setPaperText(e.target.value)}
                  rows={3}
                  placeholder="Paste abstract or methodology section here..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-blue-500 font-mono resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Breakthrough Papers */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="font-semibold text-slate-300">
              Benchmark Papers (Instant 1-Click Load):
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {samplePapers.map((paper) => (
              <button
                key={paper.id}
                type="button"
                onClick={() => {
                  setUrl(paper.url);
                  onSelectSample(paper);
                }}
                className="px-2.5 py-1 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg text-xs transition-all flex items-center gap-1.5 cursor-pointer group"
              >
                <BookOpen className="w-3 h-3 text-blue-400 group-hover:text-cyan-300" />
                <span className="font-medium">{paper.title.split(":")[0]}</span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {paper.year}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
