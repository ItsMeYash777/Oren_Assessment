import React from "react";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const generatePDF = () => {
    const chartElements = document.querySelectorAll(".chart-container"); 
    const canvases = [];
    const captureCharts = Array.from(chartElements).map((chart) => {
      return html2canvas(chart).then((canvas) => {
        canvases.push(canvas); 
      });
    });

    Promise.all(captureCharts).then(() => {
      const pdf = new jsPDF("landscape");
      const imgWidth = 280; 
      let imgHeight = 0;
      let yOffset = 10; 

      canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL("image/png");
        imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (index > 0) {
          pdf.addPage();
          yOffset = 10; 
        }

        pdf.addImage(imgData, "PNG", 10, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 10;
      });

      pdf.save("sustainability_metrics.pdf");
    });
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4">Export Options</h2>
      <div className="flex space-x-4">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          onClick={exportToCSV}
        >
          Export to CSV
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={generatePDF}
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default ExportOptions;
