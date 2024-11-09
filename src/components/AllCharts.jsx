import React, { useRef } from "react";
import MetricChart from "./MetricChart";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const AllCharts = ({ chartsData }) => {
  const chartRefs = useRef([]); 

  const generatePDF = () => {
    const canvases = [];

    const captureCharts = chartRefs.current.map((chartRef) =>
      html2canvas(chartRef).then((canvas) => {
        canvases.push(canvas); 
      })
    );
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
      pdf.save("All_Charts.pdf");
    });
  };

  return (
    <div>
      <h1>All Metric Charts</h1>
      {chartsData.map((data, index) => (
        <MetricChart
          key={index}
          title={data.title}
          data={data.data}
          ref={(el) => (chartRefs.current[index] = el)}
        />
      ))}

      <button
        onClick={generatePDF} 
        className="mt-4 bg-black text-white py-2 px-4 rounded"
      >
        Download All Charts as PDF
      </button>
    </div>
  );
};

export default AllCharts;
