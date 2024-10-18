import React, { useState } from "react";

const DataInputForm = ({ onDataInput }) => {
  const [formData, setFormData] = useState({
    carbonEmissions: Array(5).fill(0),
    waterUsage: Array(5).fill(0),
    wasteGenerated: Array(5).fill(0),
  });

  const handleChange = (metric, year, value) => {
    const newFormData = { ...formData };
    newFormData[metric][year] = parseFloat(value);
    setFormData(newFormData);
    onDataInput(newFormData);
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-semibold mb-4">
        Enter Sustainability Metrics
      </h2>
      {Object.keys(formData).map((metric) => (
        <div key={metric} className="mb-4">
          <h3 className="text-lg font-medium mb-2">
            {metric.replace(/([A-Z])/g, " $1").trim()}
          </h3>
          {formData[metric].map((_, index) => (
            <div key={index} className="mb-2">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Year {new Date().getFullYear() - 4 + index}:
              </label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={formData[metric][index]}
                onChange={(e) => handleChange(metric, index, e.target.value)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataInputForm;
