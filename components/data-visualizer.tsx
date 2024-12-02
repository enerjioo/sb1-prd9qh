"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactECharts from "echarts-for-react";
import { DataSet } from "@/app/analytics/page";

interface DataVisualizerProps {
  dataset: DataSet;
}

export function DataVisualizer({ dataset }: DataVisualizerProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>(dataset.headers[0]);
  const [chartType, setChartType] = useState<string>("bar");

  const getChartOptions = () => {
    const columnIndex = dataset.headers.indexOf(selectedColumn);
    const values = dataset.data.map(row => row[columnIndex]);
    
    // Check if values are numeric
    const isNumeric = values.every(v => !isNaN(Number(v)));
    
    if (isNumeric) {
      // Numeric data visualization
      const numericValues = values.map(Number);
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      
      if (chartType === "bar") {
        // Frequency distribution for numeric data
        const bins = 10;
        const binSize = (max - min) / bins;
        
        const frequencies = Array(bins).fill(0);
        const binLabels = [];
        
        for (let i = 0; i < bins; i++) {
          const binStart = min + (i * binSize);
          const binEnd = binStart + binSize;
          binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
          
          frequencies[i] = numericValues.filter(v => v >= binStart && v < binEnd).length;
        }
        
        return {
          title: {
            text: `Distribution of ${selectedColumn}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: binLabels,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: frequencies,
            type: 'bar'
          }]
        };
      } else if (chartType === "line") {
        // Time series or trend visualization
        return {
          title: {
            text: `Trend of ${selectedColumn}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: Array.from({ length: values.length }, (_, i) => i + 1)
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: numericValues,
            type: 'line',
            smooth: true
          }]
        };
      } else {
        // Box plot for numeric data
        const sortedValues = numericValues.sort((a, b) => a - b);
        const q1 = sortedValues[Math.floor(sortedValues.length * 0.25)];
        const median = sortedValues[Math.floor(sortedValues.length * 0.5)];
        const q3 = sortedValues[Math.floor(sortedValues.length * 0.75)];
        const iqr = q3 - q1;
        const whiskerBottom = Math.max(min, q1 - 1.5 * iqr);
        const whiskerTop = Math.min(max, q3 + 1.5 * iqr);
        
        return {
          title: {
            text: `Box Plot of ${selectedColumn}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          xAxis: {
            type: 'category',
            data: [selectedColumn]
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            name: selectedColumn,
            type: 'boxplot',
            data: [[whiskerBottom, q1, median, q3, whiskerTop]]
          }]
        };
      }
    } else {
      // Categorical data visualization
      const frequencies: { [key: string]: number } = {};
      values.forEach(value => {
        frequencies[value] = (frequencies[value] || 0) + 1;
      });
      
      const categories = Object.keys(frequencies);
      const counts = Object.values(frequencies);
      
      if (chartType === "bar" || chartType === "line") {
        return {
          title: {
            text: `Distribution of ${selectedColumn}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
              rotate: 45
            }
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: counts,
            type: chartType
          }]
        };
      } else {
        return {
          title: {
            text: `Distribution of ${selectedColumn}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'item'
          },
          series: [{
            type: 'pie',
            radius: '50%',
            data: categories.map((cat, index) => ({
              name: cat,
              value: counts[index]
            }))
          }]
        };
      }
    }
  };

  return (
    <Card className="p-6">
      <div className="grid gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <Label>Select Column</Label>
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select a column" />
              </SelectTrigger>
              <SelectContent>
                {dataset.headers.map(header => (
                  <SelectItem key={header} value={header}>
                    {header}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1">
            <Tabs value={chartType} onValueChange={setChartType}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bar">Bar</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="pie">Box/Pie</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="h-[400px]">
          <ReactECharts
            option={getChartOptions()}
            style={{ height: '100%' }}
            notMerge={true}
          />
        </div>

        <div className="mt-4 space-y-2">
          <h3 className="font-semibold">Data Insights</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {dataset.insights.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}