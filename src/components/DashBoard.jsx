import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataInputForm from "./DataInputForm";
import MetricChart from "./MetricChart";
import Comparsion from "./Comparsion";
import ExportOptions from "./ExportOptions";
import { useAuth } from "../context/authContext";
import axios from "axios";

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    carbonEmissions: Array(5).fill(0),
    waterUsage: Array(5).fill(0),
    wasteGenerated: Array(5).fill(0),
  });
  const { auth, signOut } = useAuth();
  const navigate = useNavigate();
  const chartRefs = useRef([]);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const handleDataInput = (newMetrics) => {
    setMetrics(newMetrics);
  };
  const handleSaveMetrics = async () => {
    try {
      // Send data to the backend
      const response = await axios.post("http://localhost:5001/api/metrics", metrics, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert(response.data.message); // "Metrics saved successfully"
      } else {
        alert("Failed to save metrics: " + response.data.message);
      }
    } catch (error) {
      console.error("Error saving metrics:", error);
      // Check if it's a duplicate metrics error
      if (error.response?.status === 400) {
        alert(error.response.data.message); // "These metrics already exist in the database!"
      } else {
        alert("Failed to save metrics. Please try again.");
      }
    }
  };


  const handleLogout = () => {
    signOut();
    navigate("/");
    console.log("User logged out.");
  };

  const chartData = [
    { title: "Carbon Emissions", data: metrics.carbonEmissions },
    { title: "Water Usage", data: metrics.waterUsage },
    { title: "Waste Generated", data: metrics.wasteGenerated },
  ];

  return (
    <div className="container mx-auto px-4 py-8 bg-customBlue min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center sm:text-left mb-4 sm:mb-0">
          Sustainability Dashboard
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded-md 
                    hover:bg-red-600 transition-transform transform hover:scale-105"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Input Sustainability Data
          </h2>
          <DataInputForm onDataInput={handleDataInput} />
          <button
            onClick={handleSaveMetrics}
            className="mt-4 w-full bg-green-500 text-white px-6 py-2 rounded-md 
                      hover:bg-green-600 transition-transform transform hover:scale-105
                      flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save Metrics
          </button>
        </div>

        <div className="space-y-6">
          {chartData.map((chart, index) => (
            <div
              key={chart.title}
              className="bg-white p-4 shadow-lg rounded-lg"
            >
              <MetricChart
                ref={(el) => (chartRefs.current[index] = el)}
                title={chart.title}
                data={chart.data}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Benchmark Comparison
          </h2>
          <Comparsion metrics={metrics} />
        </div>
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            Export Options
          </h2>
          <ExportOptions metrics={metrics} chartRefs={chartRefs} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
