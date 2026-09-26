import React, { useState } from "react";
import {
  Briefcase,
  Target,
  Wrench,
  Calendar,
  CheckCircle,
  Copy,
  Check,
  Code2,
  ChevronDown,
  ChevronUp,
  Award,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { StudentOpportunity } from "../types/paper";

interface StudentOpportunitiesViewProps {
  opportunities: StudentOpportunity[];
  paperTitle: string;
}

export const StudentOpportunitiesView: React.FC<StudentOpportunitiesViewProps> = ({
  opportunities,
  paperTitle,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedCodeId, setExpandedCodeId] = useState<string | null>(null);
  const [checkedMilestones, setCheckedMilestones] = useState<Record<string, boolean>>(
    {}
  );

  const handleCopyResumeBullet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleMilestone = (key: string) => {
    setCheckedMilestones((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "beginner-friendly":
        return "bg-emerald-950/70 text-emerald-300 border-emerald-800/80";
      case "challenging":
      case "advanced":
        return "bg-rose-950/70 text-rose-300 border-rose-800/80";
      case "intermediate":
      default:
        return "bg-amber-950/70 text-amber-300 border-amber-800/80";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
              Step 3 of 3
            </span>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              Future Work & Internship Project Opportunities
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            3 concrete, realistic extensions for 3rd-year CS students to turn breakthrough research into impactful resume projects.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-xl">
          <Award className="w-4 h-4" />
          <span>Resume-Ready Portfolio Projects</span>
        </div>
      </div>

      {/* 3 Project Opportunities Cards */}
      <div className="space-y-6">
        {opportunities.map((opp, index) => {
          const isCodeExpanded = expandedCodeId === opp.id;
          const isResumeCopied = copiedId === opp.id;

          return (
            <div
              key={opp.id || index}
              className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-6 shadow-xl hover:border-slate-700 transition-all space-y-5"
            >
              {/* Project Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {opp.whyGreatForResume}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[11px] font-mono font-medium ${getDifficultyBadge(
                      opp.difficulty
                    )}`}
                  >
                    {opp.difficulty || "Intermediate"}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                    {opp.estimatedWeeks || 4} Weeks Sprint
                  </span>
                </div>
              </div>

              {/* Exact Extension & Target Performance Metric */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Exact Extension */}
                <div className="bg-slate-950/60 border border-blue-950/70 rounded-xl p-4 relative">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-blue-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Exact Extension Description
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans">
                    {opp.exactExtension}
                  </p>
                </div>

                {/* Targeted Metric */}
                <div className="bg-slate-950/60 border border-emerald-950/70 rounded-xl p-4 relative">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5" />
                    Targeted Performance Metric
                  </div>
                  <p className="text-xs text-emerald-200 leading-relaxed font-sans font-medium">
                    {opp.targetedMetric}
                  </p>
                </div>
              </div>

              {/* Recommended Tech Stack */}
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                  <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                  Recommended Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {opp.recommendedTechStack.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 rounded-lg text-xs font-mono transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* 4-Week Milestone Roadmap */}
              {opp.fourWeekRoadmap && opp.fourWeekRoadmap.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-3 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    4-Week Student Implementation Roadmap
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {opp.fourWeekRoadmap.map((weekItem, wIdx) => {
                      const milestoneKey = `${opp.id}-w-${wIdx}`;
                      const isDone = !!checkedMilestones[milestoneKey];

                      return (
                        <div
                          key={wIdx}
                          onClick={() => toggleMilestone(milestoneKey)}
                          className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                            isDone
                              ? "bg-emerald-950/30 border-emerald-700/60"
                              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-semibold text-slate-400 text-[10px]">
                              {weekItem.week}
                            </span>
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                                isDone
                                  ? "bg-emerald-500 border-emerald-400 text-slate-950"
                                  : "border-slate-700 bg-slate-950"
                              }`}
                            >
                              {isDone && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>
                          <div className="font-semibold text-slate-200 text-xs mb-1">
                            {weekItem.milestone}
                          </div>
                          <p className="text-[11px] text-slate-400 leading-normal line-clamp-3">
                            {weekItem.tasks}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STAR Format Resume Bullet with 1-Click Copy */}
              <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="text-[11px] font-mono text-cyan-400 font-semibold mb-1 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>STAR Resume Bullet (Ready for Software & ML Internship Applications)</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-sans italic border-l-2 border-cyan-500/50 pl-3 py-0.5">
                    "{opp.resumeBulletSTAR}"
                  </p>
                </div>

                <button
                  onClick={() =>
                    handleCopyResumeBullet(opp.id, opp.resumeBulletSTAR)
                  }
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                  title="Copy bullet point for resume"
                >
                  {isResumeCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy for Resume</span>
                    </>
                  )}
                </button>
              </div>

              {/* Starter Code Snippet Accordion */}
              {opp.starterCodeSnippet && (
                <div>
                  <button
                    onClick={() =>
                      setExpandedCodeId(isCodeExpanded ? null : opp.id)
                    }
                    className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1.5 font-medium cursor-pointer"
                  >
                    <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {isCodeExpanded
                        ? "Hide Starter Code Template"
                        : "View Starter PyTorch Implementation Boilerplate"}
                    </span>
                    {isCodeExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {isCodeExpanded && (
                    <div className="mt-3 p-4 bg-slate-950 border border-slate-800 rounded-xl overflow-x-auto relative group">
                      <div className="flex items-center justify-between mb-2 text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                        <span className="font-mono text-cyan-400">
                          starter_prototype.py
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(opp.starterCodeSnippet);
                            setCopiedId(`code-${opp.id}`);
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedId === `code-${opp.id}` ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Code</span>
                            </>
                          )}
                        </button>
                      </div>
                      <pre className="text-xs font-mono text-emerald-300/90 leading-relaxed overflow-x-auto">
                        {opp.starterCodeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
