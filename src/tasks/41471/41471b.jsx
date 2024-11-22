import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import * as THREE from "three";
import Chart from "chart.js/auto";
import p5 from "p5";

const PopulationChart = ({ data }) => {
  const canvasRef = React.useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((d) => d.year),
        datasets: [
          {
            label: "Population (billions)",
            data: data.map((d) => d.population),
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={canvasRef} />;
};

const ThreeJSGlobe = () => {
  const mountRef = React.useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 32, 32);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 3;

    const animate = () => {
      requestAnimationFrame(animate);
      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    return () => mountRef.current.removeChild(renderer.domElement);
  }, []);

  return <div ref={mountRef} />;
};

const P5Sketch = () => {
  const sketchRef = React.useRef(null);

  useEffect(() => {
    new p5((p) => {
      p.setup = () => {
        p.createCanvas(300, 300);
      };

      p.draw = () => {
        p.background(220);
        p.fill(255, 0, 0);
        p.ellipse(150, 150, 100, 100);
      };
    }, sketchRef.current);
  }, []);

  return <div ref={sketchRef} />;
};

const populationData = [
  { year: 2024, population: 1.45 },
  { year: 2054, population: 1.69 },
  { year: 2100, population: 1.5 },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("chart");

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">India's Population Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="chart">Chart</TabsTrigger>
              <TabsTrigger value="globe">3D Globe</TabsTrigger>
              <TabsTrigger value="sketch">P5 Sketch</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <PopulationChart data={populationData} />
            </TabsContent>
            <TabsContent value="globe">
              <div className="flex justify-center">
                <ThreeJSGlobe />
              </div>
            </TabsContent>
            <TabsContent value="sketch">
              <div className="flex justify-center">
                <P5Sketch />
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-6 space-y-4">
            <p>
              India's population is projected to peak in the early 2060s at about 1.7 billion and
              then decline by 12%, but India will remain the world's most populous country
              throughout the century.
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>2024: 1.45 billion</li>
              <li>2054: 1.69 billion (peak)</li>
              <li>2100: 1.5 billion</li>
            </ul>
            <p>
              Meanwhile, China's population is projected to decline from 1.41 billion in 2024 to
              633 million by 2100.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}