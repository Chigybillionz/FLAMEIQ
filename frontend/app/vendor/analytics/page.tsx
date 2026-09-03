"use client";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, LinearScale, PointElement } from "chart.js";

Chart.register(LinearScale, PointElement);

const AnalyticsPage = () => {
  const [chartData, setChartData] = useState({
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Data",
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Fetch data from an API or update the data source
    const fetchData = async () => {
      try {
        // This is dummy data, you can replace it with real data from an API
        const data = {
          labels: ["January", "February", "March", "April", "May", "June"],
          datasets: [
            {
              label: "Data",
              data: [10, 20, 30, 40, 50, 60],
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
        setChartData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold text-slate-900">Analytics</h1>
      {/*<div style={{ width: "100%", height: "300px" }}>
        {chartData ? (
          <Line data={chartData} /> 

        ) : (
          <div>Loading...</div>
        )}
      </div>*/}
    </div>
  );
};

export default AnalyticsPage;