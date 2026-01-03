"use client";

import { useState, useEffect } from "react";
import PaperList from "./PaperList";
import ComparisonTable from "./ComparisonTable";

interface Cluster {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface Paper {
  id: number;
  clusterId: string;
}

interface ClusterWithCount extends Cluster {
  count: number;
}

export default function ClusterVisualization() {
  const [clusters, setClusters] = useState<ClusterWithCount[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [selectedPapers, setSelectedPapers] = useState<number[]>([]);
  const [showComparisonTable, setShowComparisonTable] = useState(false);

  useEffect(() => {
    // Load data
    Promise.all([
      fetch("/data/clusters.json").then((r) => r.json()),
      fetch("/data/papers.json").then((r) => r.json()),
    ]).then(([clustersData, papersData]) => {
      // Count papers per cluster
      const counts = papersData.papers.reduce((acc: Record<string, number>, paper: Paper) => {
        acc[paper.clusterId] = (acc[paper.clusterId] || 0) + 1;
        return acc;
      }, {});

      const clustersWithCounts = clustersData.clusters.map((cluster: Cluster) => ({
        ...cluster,
        count: counts[cluster.id] || 0,
      }));

      setClusters(clustersWithCounts);
    });
  }, []);

  const handleSelectPapers = (paperIds: number[]) => {
    setSelectedPapers(paperIds);
  };

  const handleGenerateTable = () => {
    setShowComparisonTable(true);
  };

  const handleCloseTable = () => {
    setShowComparisonTable(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Research Clusters</h2>
        <p className="text-sm text-slate-600">
          Click on a cluster to explore papers in that research area
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => setSelectedCluster(cluster.id)}
            className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg ${
              selectedCluster === cluster.id
                ? "border-slate-900 shadow-md"
                : "border-slate-200 hover:border-slate-300"
            }`}
            style={{
              backgroundColor: selectedCluster === cluster.id ? `${cluster.color}10` : "white",
            }}
          >
            <div
              className="w-12 h-12 rounded-full mb-3 mx-auto flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: cluster.color }}
            >
              {cluster.count}
            </div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">{cluster.name}</h3>
            <p className="text-xs text-slate-600">{cluster.description}</p>
          </button>
        ))}
      </div>

      <PaperList clusterId={selectedCluster} onSelectPapers={handleSelectPapers} />

      {selectedPapers.length > 0 && (
        <div className="flex justify-center">
          <button 
            onClick={handleGenerateTable}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Generate Comparison Table ({selectedPapers.length} papers)
          </button>
        </div>
      )}

      {showComparisonTable && (
        <ComparisonTable paperIds={selectedPapers} onClose={handleCloseTable} />
      )}
    </div>
  );
}