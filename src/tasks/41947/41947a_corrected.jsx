import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

// Demo data for India's population over the last decade
const populationData = [
  { year: 2013, population: 1252139596 },
  { year: 2014, population: 1267401849 },
  { year: 2015, population: 1282390303 },
  { year: 2016, population: 1296834042 },
  { year: 2017, population: 1311050527 },
  { year: 2018, population: 1326093247 },
  { year: 2019, population: 1341179953 },
  { year: 2020, population: 1356223217 },
  { year: 2021, population: 1371360330 },
  { year: 2022, population: 1386493734 },
];

const ChartComponent = ({ type, data }) => {
  const getRandomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

  switch (type) {
    case 'bar':
      return (
        <div className="flex flex-col space-y-2">
          {data.map(item => (
            <div key={item.year} className="flex items-end">
              <div style={{ width: `${item.population / 15000000}px`, backgroundColor: getRandomColor() }} className="h-4"></div>
              <span className="ml-2 text-sm">{item.year}</span>
            </div>
          ))}
        </div>
      );
    case 'pie':
      const total = data.reduce((acc, item) => acc + item.population, 0);
      return (
        <div className="flex flex-wrap justify-center">
          {data.map((item, idx) => {
            const percentage = (item.population / total) * 100;
            return (
              <div
                key={idx}
                style={{
                  width: `${percentage * 2}px`,
                  height: `${percentage * 2}px`,
                  backgroundColor: getRandomColor(),
                }}
                className="rounded-full m-1"
              ></div>
            );
          })}
        </div>
      );
    case 'line':
      return (
        <div className="relative h-40 w-full">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="absolute bottom-0 left-0 w-full flex justify-between"
            >
              <div
                style={{
                  height: `${item.population / 5000000}px`,
                  top: `calc(100% - ${item.population / 5000000}px)`,
                }}
                className="w-1 bg-blue-500"
              ></div>
              {idx < data.length - 1 && (
                <div
                  className="absolute border-t-2 border-dotted border-gray-500"
                  style={{
                    width: `${100 / (data.length - 1)}%`,
                    left: `${(idx + 0.5) * 100 / (data.length - 1)}%`,
                    top: `${item.population / 5000000}px`,
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      );
    default:
      return <p>Chart type not supported</p>;
  }
};

function App() {
  const [chartType, setChartType] = useState('bar');

  return (
    <div className="p-4 sm:p-8 bg-gray-100 min-h-screen">
      <Card className="max-w-lg mx-auto bg-white shadow-lg">
        <CardHeader>
          <CardTitle>India Population Chart</CardTitle>
          <CardDescription>Choose a chart type to visualize population growth.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="chartType">Select Chart Type</Label>
            <Select onValueChange={setChartType}>
              <SelectTrigger id="chartType">
                <SelectValue placeholder="Select a chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="line">Line Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="border p-4 rounded-lg">
            <ChartComponent type={chartType} data={populationData} />
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            Data is for demonstration purposes only.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default App;
