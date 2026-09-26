import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import {
  GitBranch,
  Copy,
  Check,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Code2,
  Layers,
  AlertTriangle,
  Eye,
  Maximize2,
} from "lucide-react";
import { FlowchartData } from "../types/paper";

interface MermaidViewerProps {
  flowchart: FlowchartData;
  paperTitle: string;
}

export const MermaidViewer: React.FC<MermaidViewerProps> = ({
  flowchart,
  paperTitle,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>("");
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"diagram" | "code" | "layers">(
    "diagram"
  );
  const [zoom, setZoom] = useState<number>(1);
  const [isRendering, setIsRendering] = useState(false);

  // Initialize mermaid configuration once
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
      fontFamily: "Inter, sans-serif",
      themeVariables: {
        darkMode: true,
        background: "#0f172a",
        primaryColor: "#1e293b",
        primaryTextColor: "#f8fafc",
        primaryBorderColor: "#3b82f6",
        lineColor: "#64748b",
        secondaryColor: "#0f172a",
        tertiaryColor: "#1e293b",
      },
      flowchart: {
        curve: "basis",
        padding: 20,
        htmlLabels: true,
      },
    });
  }, []);

  // Render the diagram whenever mermaidCode changes
  useEffect(() => {
    let isCancelled = false;

    async function renderDiagram() {
      if (!flowchart.mermaidCode) return;
      setIsRendering(true);
      setRenderError(null);

      try {
        // Clean any accidental markdown code fence delimiters from AI response
        let code = flowchart.mermaidCode.trim();
        code = code
          .replace(/^```mermaid\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/, "");

        // Ensure starts with graph TD if not already
        if (!code.startsWith("graph ") && !code.startsWith("flowchart ")) {
          code = `graph TD\n${code}`;
        }

        const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(id, code);

        if (!isCancelled) {
          setSvgContent(svg);
          setRenderError(null);
        }
      } catch (err: any) {
        console.error("Mermaid rendering failed:", err);
        if (!isCancelled) {
          setRenderError(
            err?.message ||
              "Could not render flowchart directly. You can inspect and copy the raw Mermaid syntax below."
          );
        }
      } finally {
        if (!isCancelled) {
          setIsRendering(false);
        }
      }
    }

    renderDiagram();

    return () => {
      isCancelled = true;
    };
  }, [flowchart.mermaidCode]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(flowchart.mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${paperTitle.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 25)}_architecture.svg`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-mono font-medium">
              Step 2 of 3
            </span>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-cyan-400" />
              Architectural Flowchart (Mermaid.js)
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Synthesizes input flows, neural layers, latent projections, and outputs into a clean computational graph.
          </p>
        </div>

        {/* View switcher & Actions */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center bg-slate-950/80 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setActiveTab("diagram")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "diagram"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Diagram</span>
            </button>
            <button
              onClick={() => setActiveTab("code")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "code"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>[FLOWCHART] Syntax</span>
            </button>
            <button
              onClick={() => setActiveTab("layers")}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "layers"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Layer Breakdown</span>
            </button>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Copy raw Mermaid code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>

          {svgContent && activeTab === "diagram" && (
            <button
              onClick={handleDownloadSvg}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download diagram as SVG"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>SVG</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl overflow-hidden relative min-h-[420px] flex flex-col">
        {/* Diagram View */}
        {activeTab === "diagram" && (
          <div className="relative flex-1 flex flex-col">
            {/* Diagram Controls Toolbar */}
            <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setZoom((prev) => Math.min(prev + 0.15, 2.5))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((prev) => Math.max(prev - 0.15, 0.5))}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom(1)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs font-mono"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 text-[11px] font-mono text-slate-400 border-l border-slate-800">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Error state */}
            {renderError ? (
              <div className="p-8 text-center my-auto">
                <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-slate-200 mb-1">
                  Diagram Syntax Advisory
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto mb-4">
                  {renderError}
                </p>
                <button
                  onClick={() => setActiveTab("code")}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Inspect [FLOWCHART] Syntax</span>
                </button>
              </div>
            ) : isRendering ? (
              <div className="p-12 text-center my-auto flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-3" />
                <span className="text-xs text-slate-400 font-mono">
                  Compiling Mermaid Graph...
                </span>
              </div>
            ) : (
              <div className="flex-1 overflow-auto p-8 flex items-center justify-center min-h-[400px]">
                <div
                  ref={containerRef}
                  className="mermaid-container transition-transform duration-150 origin-center max-w-full"
                  style={{ transform: `scale(${zoom})` }}
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              </div>
            )}
          </div>
        )}

        {/* Raw Code View ([FLOWCHART] string) */}
        {activeTab === "code" && (
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-mono text-cyan-400 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                [FLOWCHART] Segment
              </span>
              <span className="text-slate-500 text-[11px]">
                Plain text format without markdown wrappers
              </span>
            </div>
            <pre className="flex-1 p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-cyan-300/90 overflow-x-auto leading-relaxed select-all">
              {`[FLOWCHART]\n${flowchart.mermaidCode}`}
            </pre>
          </div>
        )}

        {/* Component Layer Breakdown */}
        {activeTab === "layers" && (
          <div className="p-5 flex-1">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
              Component & Neural Layer Specification
            </h3>
            <div className="border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Layer / Node</th>
                    <th className="py-2.5 px-4 font-semibold">Functional Role</th>
                    <th className="py-2.5 px-4 font-semibold">Inputs & Outputs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {flowchart.componentBreakdown && flowchart.componentBreakdown.length > 0 ? (
                    flowchart.componentBreakdown.map((comp, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-900/40 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium text-blue-400 font-mono">
                          {comp.component}
                        </td>
                        <td className="py-3 px-4 text-slate-300">
                          {comp.role}
                        </td>
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {comp.inputsOutputs}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-500">
                        Component breakdown extracted dynamically from the Mermaid architecture graph.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
