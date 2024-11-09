import React from "react";

const Comparsion = ({ metrics }) => {
  // Dummy industry benchmarks
  const benchmarks = {
    carbonEmissions: 100,
    waterUsage: 1000,
    wasteGenerated: 50,
  };

 const calculateAverage = (arr) => {
   if (Array.isArray(arr)) {
     return arr.reduce((acc, value) => acc + value, 0) / arr.length;
   } else {
     console.error("Expected an array, but got:", arr);
     return 0; // or some default value
   }
 };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4">Benchmark Comparison</h2>
      {Object.keys(metrics).map((metric) => {
        const average = calculateAverage(metrics[metric]);
        const benchmark = benchmarks[metric];
        const percentDifference = ((average - benchmark) / benchmark) * 100;

        return (
          <div key={metric} className="mb-4">
            <h3 className="text-lg font-medium mb-2">
              {metric.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <p>Your average: {average.toFixed(2)}</p>
            <p>Industry benchmark: {benchmark}</p>
            <p
              className={
                percentDifference > 0 ? "text-red-500" : "text-green-500"
              }
            >
              {Math.abs(percentDifference).toFixed(2)}%{" "}
              {percentDifference > 0 ? "above" : "below"} benchmark
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default Comparsion;
