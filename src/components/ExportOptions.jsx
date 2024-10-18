import React from "react";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const ExportOptions = ({ metrics, chartRefs }) => {
 
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(
      Object.keys(metrics).map((metric) => ({
        Metric: metric,
        ...metrics[metric].reduce(
          (acc, val, idx) => ({ ...acc, [`Year ${idx + 1}`]: val }),
          {}
        ),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sustainability Metrics");
    XLSX.writeFile(wb, "sustainability_metrics.xlsx");
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4">Export Options</h2>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={exportToCSV}
      >
        Export to CSV
      </button>
    </div>
  );
};

export default ExportOptions;
