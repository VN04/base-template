import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const ChartTypes = {
  BAR: "Bar",
  PIE: "Pie",
  LINE: "Line",
  GANTT: "Gantt",
  BUBBLE: "Bubble",
};

const BarChart = ({ data }) => (
  <div className="flex h-64 items-end space-x-2">
    {data.map((item) => (
      <div
        key={item.year}
        className="bg-blue-500 w-8 hover:bg-blue-600 transition-all duration-300"
        style={{ height: `${(item.population / 1366417754) * 100}%` }}
      >
        <span className="text-xs text-white rotate-90 inline-block mt-2">
          {item.year}
        </span>
      </div>
    ))}
  </div>
);

const PieChart = ({ data }) => (
  <div className="relative w-64 h-64">
    {data.map((item, index) => {
      const angle = (item.population / 1366417754) * 360;
      const rotation = index === 0 ? 0 : data.slice(0, index).reduce((sum, d) => sum + (d.population / 1366417754) * 360, 0);
      return (
        <div
          key={item.year}
          className="absolute top-0 left-0 w-full h-full"
          style={{
            clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((rotation + angle) * Math.PI / 180)}% ${50 + 50 * Math.sin((rotation + angle) * Math.PI / 180)}%)`,
            transform: `rotate(${rotation}deg)`,
            backgroundColor: `hsl(${index * 36}, 70%, 50%)`,
          }}
        />
      );
    })}
  </div>
);

const LineChart = ({ data }) => (
  <div className="relative h-64 w-full">
    <div className="absolute inset-0 flex items-end">
      {data.map((item, index) => (
        <React.Fragment key={item.year}>
          {index > 0 && (
            <line
              x1={`${(index - 1) * 10}%`}
              y1={`${100 - (data[index - 1].population / 1366417754) * 100}%`}
              x2={`${index * 10}%`}
              y2={`${100 - (item.population / 1366417754) * 100}%`}
              stroke="blue"
              strokeWidth="2"
            />
          )}
          <circle
            cx={`${index * 10}%`}
            cy={`${100 - (item.population / 1366417754) * 100}%`}
            r="4"
            fill="blue"
          />
        </React.Fragment>
      ))}
    </div>
  </div>
);

const GanttChart = ({ data }) => (
  <div className="space-y-2">
    {data.map((item) => (
      <div key={item.year} className="flex items-center">
        <span className="w-12 text-sm">{item.year}</span>
        <div
          className="h-6 bg-blue-500"
          style={{ width: `${(item.population / 1366417754) * 100}%` }}
        />
      </div>
    ))}
  </div>
);

const BubbleChart = ({ data }) => (
  <div className="relative h-64 w-full">
    {data.map((item, index) => (
      <div
        key={item.year}
        className="absolute rounded-full bg-blue-500 flex items-center justify-center text-white text-xs"
        style={{
          width: `${(item.population / 1366417754) * 50}%`,
          height: `${(item.population / 1366417754) * 50}%`,
          left: `${index * 10}%`,
          top: `${50 - (item.population / 1366417754) * 25}%`,
        }}
      >
        {item.year}
      </div>
    ))}
  </div>
);

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
        return <BubbleChart data={populationData} />;
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