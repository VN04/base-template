import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const populationData = {
  labels: ['2024', '2054', '2100'],
  datasets: [
    {
      label: 'India',
      data: [1450, 1690, 1500],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
    },
    {
      label: 'China',
      data: [1410, 1210, 633],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
    },
  ],
};

const pieData = {
  labels: ['India', 'China', 'Rest of the World'],
  datasets: [
    {
      data: [1450, 1410, 5340], // Assuming world population in 2024 is 8200
      backgroundColor: [
        'rgba(255, 99, 132, 0.5)',
        'rgba(54, 162, 235, 0.5)',
        'rgba(255, 206, 86, 0.5)',
      ],
      borderWidth: 1,
    },
  ],
};

function PopulationChart() {
  const [chartType, setChartType] = useState('line');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Population Trends</CardTitle>
        <CardDescription>Visualize population growth and decline.</CardDescription>
      </CardHeader>
      <CardContent>
        {chartType === 'line' ? (
          <Line data={populationData} options={{ 
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Population (in millions)'
                }
              }
            }
          }} />
        ) : (
          <Pie data={pieData} options={{ responsive: true }} />
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={() => setChartType('line')}>Line Chart</Button>
        <Button onClick={() => setChartType('pie')}>Pie Chart</Button>
      </CardFooter>
    </Card>
  );
}

function PopulationArticle() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>India's Population Dynamics</CardTitle>
      </CardHeader>
      <CardContent>
        <p>India's population is projected to peak in the early 2060s at about 1.7 billion and then decline by 12%, but will remain the world's most populous country throughout the century.</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  return (
    <div className="container mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Global Population Insights</h1>
      <PopulationArticle />
      <PopulationChart />
    </div>
  );
}