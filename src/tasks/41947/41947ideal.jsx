import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bar, Line, Pie, Bubble } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement, ArcElement } from "chart.js";

// Register the components with Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

// Demo data for India's population
const populationData = [
  { year: 2010, population: 1234281170 },
  { year: 2011, population: 1250288729 },
  { year: 2012, population: 1265782790 },
  { year: 2013, population: 1280846129 },
  { year: 2014, population: 1295604184 },
  { year: 2015, population: 1310152403 },
  { year: 2016, population: 1324509589 },
  { year: 2017, population: 1338676785 },
  { year: 2018, population: 1352642280 },
  { year: 2019, population: 1366417754 },
];

// Demo data for Bubble chart
const bubbleData = [
  { x: 2010, y: 1234281170, size: 20 },
  { x: 2011, y: 1250288729, size: 22 },
  { x: 2012, y: 1265782790, size: 24 },
  { x: 2013, y: 1280846129, size: 26 },
  { x: 2014, y: 1295604184, size: 28 },
  { x: 2015, y: 1310152403, size: 30 },
  { x: 2016, y: 1324509589, size: 32 },
  { x: 2017, y: 1338676785, size: 34 },
  { x: 2018, y: 1352642280, size: 36 },
  { x: 2019, y: 1366417754, size: 38 },
];

// Chart Types Enum
const ChartTypes = {
  BAR: "Bar",
  PIE: "Pie",
  LINE: "Line",
  GANTT: "Gantt",
  BUBBLE: "Bubble",
};

// Bar Chart
const BarChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "Population",
        data: data.map((item) => item.population),
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

// Line Chart
const LineChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "Population",
        data: data.map((item) => item.population),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

// Pie Chart
const PieChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "Population",
        data: data.map((item) => item.population),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return <Pie data={chartData} />;
};

// Bubble Chart
const BubbleChart = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: "Population",
        data: data.map((item) => ({
          x: item.x,
          y: item.y,
          r: item.size,
        })),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: "linear",
        position: "bottom",
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bubble data={chartData} options={options} />;
};

// Gantt Chart (Simulated)
const GanttChart = ({ data }) => {
  const chartData = {
    labels: data.map((item) => item.year),
    datasets: [
      {
        label: "Population Growth",
        data: data.map((item) => item.population),
        backgroundColor: "rgba(0, 123, 255, 0.5)",
        borderColor: "rgba(0, 123, 255, 1)",
        borderWidth: 1,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default function App() {
  const [chartType, setChartType] = useState(ChartTypes.BAR);

  const renderChart = () => {
    switch (chartType) {
      case ChartTypes.BAR:
        return <BarChart data={populationData} />;
      case ChartTypes.PIE:
        return <PieChart data={populationData} />;
      case ChartTypes.LINE:
        return <LineChart data={populationData} />;
      case ChartTypes.GANTT:
        return <GanttChart data={populationData} />;
      case ChartTypes.BUBBLE:
        return <BubbleChart data={bubbleData} />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">India Population Chart</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Select Chart Type</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={(value) => setChartType(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ChartTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{chartType} Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center min-h-[300px]">
          {renderChart()}
        </CardContent>
      </Card>
    </div>
  );
}
