"use client";

import { useState } from "react";

interface Paper {
  id: number;
  title: string;
  authors: string[];
  year: number;
  methodology: string;
  sampleSize: number;
  keyFindings: string;
}

interface ComparisonTableProps {
  paperIds: number[];
  onClose: () => void;
}

export default function ComparisonTable({ paperIds, onClose }: ComparisonTableProps) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [tableData, setTableData] = useState<Paper[]>([]);

  const statusMessages = [
    "Analyzing papers...",
    "Extracting methodologies...",
    "Identifying common themes...",
    "Building comparison matrix...",
    "Cross-referencing findings...",
    "Almost done...",
  ];

  const generateTable = async () => {
    setLoading(true);
    setProgress(0);
    setTableData([]);

    // Simulate AI processing with realistic delays
    for (let i = 0; i < statusMessages.length; i++) {
      setStatusMessage(statusMessages[i]);
      setProgress((i / statusMessages.length) * 100);
      await new Promise((resolve) => setTimeout(resolve, 400 + Math.random() * 400));
    }

    // Fetch and filter papers
    const response = await fetch("/data/papers.json");
    const data = await response.json();
    const selectedPapers = data.papers.filter((p: Paper) => paperIds.includes(p.id));

    setProgress(100);
    setStatusMessage("Complete!");
    await new Promise((resolve) => setTimeout(resolve, 300));

    setTableData(selectedPapers);
    setLoading(false);
  };

  const exportToCSV = () => {
    const headers = ["Title", "Authors", "Year", "Methodology", "Sample Size", "Key Findings"];
    const rows = tableData.map((paper) => [
      paper.title,
      paper.authors.join("; "),
      paper.year,
      paper.methodology,
      paper.sampleSize,
      paper.keyFindings,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `comparison-table-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Comparison Table Generator</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-auto">
          {!loading && tableData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-600 mb-4">
                Ready to generate comparison table for {paperIds.length} papers
              </p>
              <button
                onClick={generateTable}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Generate Table
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <div className="mb-6">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-700 font-medium">{statusMessage}</p>
              </div>
              <div className="max-w-md mx-auto">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-slate-500 mt-2">{Math.round(progress)}%</p>
              </div>
            </div>
          )}

          {!loading && tableData.length > 0 && (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-slate-600">
                  Showing {tableData.length} papers
                </p>
                <button
                  onClick={exportToCSV}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export to CSV
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="text-left p-3 font-semibold text-slate-700">Title</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Authors</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Year</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Methodology</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Sample Size</th>
                      <th className="text-left p-3 font-semibold text-slate-700">Key Findings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((paper, index) => (
                      <tr
                        key={paper.id}
                        className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}
                      >
                        <td className="p-3 text-slate-900 max-w-xs">
                          <div className="font-medium">{paper.title}</div>
                        </td>
                        <td className="p-3 text-slate-600">{paper.authors.join(", ")}</td>
                        <td className="p-3 text-slate-600">{paper.year}</td>
                        <td className="p-3 text-slate-600">{paper.methodology}</td>
                        <td className="p-3 text-slate-600">n={paper.sampleSize}</td>
                        <td className="p-3 text-slate-700 max-w-md">{paper.keyFindings}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}