import React from "react";
import { X, Clock, ExternalLink, Trash2, BookOpen } from "lucide-react";
import { PaperAnalysis } from "../types/paper";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: PaperAnalysis[];
  onSelect: (paper: PaperAnalysis) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelect,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 shadow-2xl flex flex-col z-10 animate-slideLeft">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-sm">
              Analysis History ({history.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No previous paper analyses stored yet.
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => {
                  onSelect(item);
                  onClose();
                }}
                className="p-3.5 bg-slate-950/70 border border-slate-800 hover:border-blue-500/50 rounded-xl cursor-pointer transition-all group"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {item.paperDetails.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 font-mono">
                  <span>{item.paperDetails.venueOrArxiv || item.paperDetails.year}</span>
                  <span>
                    {item.timestamp
                      ? new Date(item.timestamp).toLocaleDateString()
                      : "Recent"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={onClear}
              className="w-full py-2 bg-slate-800 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-700/80 hover:border-red-900/60 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
