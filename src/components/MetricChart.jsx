import React, { useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MetricChart = ({ title, data }) => {
  const chartRef = useRef(); 

  const chartData = {
    labels: data.map((_, index) => new Date().getFullYear() - 4 + index),
    datasets: [
      {
        label: title,
        data: data,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  // Function to generate PDF with combined images
  const generatePDF = () => {
    const chartElements = document.querySelectorAll(".chart-container"); // Get all chart containers
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
      canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL("image/png"); 
        imgHeight = (canvas.height * imgWidth) / canvas.width; 
        const position = index === 0 ? 0 : imgHeight + (index - 1) * imgHeight;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight); 
      });
      pdf.save(`${title}.pdf`);
    });
  };

  return (
    <div>
      <div
        className="chart-container bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        ref={chartRef}
      >
        <Line data={chartData} options={options} />
      </div>
      <button
        onClick={generatePDF}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Download as PDF
      </button>
    </div>
  );
};

export default MetricChart;
