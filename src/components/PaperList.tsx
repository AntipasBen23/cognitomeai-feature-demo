"use client";

import { useState, useEffect } from "react";

interface Paper {
  id: number;
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  methodology: string;
  sampleSize: number;
  keyFindings: string;
  clusterId: string;
  doi: string;
}

interface PaperListProps {
  clusterId: string | null;
  onSelectPapers: (paperIds: number[]) => void;
}

export default function PaperList({ clusterId, onSelectPapers }: PaperListProps) {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!clusterId) {
      setPapers([]);
      return;
    }

    fetch("/data/papers.json")
      .then((r) => r.json())
      .then((data) => {
        const filtered = data.papers.filter((p: Paper) => p.clusterId === clusterId);
        setPapers(filtered);
      });
  }, [clusterId]);

  const togglePaper = (paperId: number) => {
    const newSelected = new Set(selectedPapers);
    if (newSelected.has(paperId)) {
      newSelected.delete(paperId);
    } else {
      newSelected.add(paperId);
    }
    setSelectedPapers(newSelected);
    onSelectPapers(Array.from(newSelected));
  };

  const selectAll = () => {
    const allIds = papers.map((p) => p.id);
    setSelectedPapers(new Set(allIds));
    onSelectPapers(allIds);
  };

  const clearSelection = () => {
    setSelectedPapers(new Set());
    onSelectPapers([]);
  };

  if (!clusterId) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Papers ({papers.length})
        </h3>
        <div className="flex gap-2">
          {selectedPapers.size > 0 && (
            <span className="text-sm text-slate-600 bg-blue-50 px-3 py-1 rounded-full">
              {selectedPapers.size} selected
            </span>
          )}
          <button
            onClick={selectAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Select All
          </button>
          {selectedPapers.size > 0 && (
            <button
              onClick={clearSelection}
              className="text-sm text-slate-600 hover:text-slate-700 font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {papers.map((paper) => (
          <div
            key={paper.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedPapers.has(paper.id)
                ? "border-blue-500 bg-blue-50"
                : "border-slate-200 hover:border-slate-300 bg-white"
            }`}
            onClick={() => togglePaper(paper.id)}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedPapers.has(paper.id)}
                onChange={() => togglePaper(paper.id)}
                className="mt-1 h-4 w-4 rounded border-slate-300"
                onClick={(e) => e.stopPropagation()}
              />
              <div className="flex-1">
                <h4 className="font-medium text-slate-900 mb-1">{paper.title}</h4>
                <p className="text-sm text-slate-600 mb-2">
                  {paper.authors.join(", ")} ({paper.year})
                </p>
                <p className="text-sm text-slate-700 mb-2">{paper.abstract}</p>
                <div className="flex gap-4 text-xs text-slate-500">
                  <span>📊 {paper.methodology}</span>
                  <span>👥 n={paper.sampleSize}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}