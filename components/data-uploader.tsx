"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import { DataSet } from "@/app/analytics/page";

interface DataUploaderProps {
  onUpload: (data: DataSet) => void;
  loading: boolean;
}

export function DataUploader({ onUpload, loading }: DataUploaderProps) {
  const processFile = async (file: File) => {
    try {
      let headers: string[] = [];
      let data: any[][] = [];

      if (file.name.endsWith('.csv')) {
        // Process CSV
        const text = await file.text();
        const result = Papa.parse(text, { header: true });
        headers = Object.keys(result.data[0]);
        data = result.data.map((row: any) => headers.map(header => row[header]));
      } else {
        // Process Excel
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        headers = Object.keys(jsonData[0]);
        data = jsonData.map((row: any) => headers.map(header => row[header]));
      }

      // Generate basic insights
      const insights = generateInsights(headers, data);

      onUpload({ headers, data, insights });
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error("Failed to process file");
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        processFile(file);
      } else {
        toast.error("Please upload a CSV or Excel file");
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    multiple: false,
    disabled: loading
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Card className={`p-8 border-2 border-dashed ${isDragActive ? 'border-primary' : 'border-muted'} text-center`}>
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Processing file...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive
                ? "Drop the file here..."
                : "Drag & drop a CSV or Excel file here, or click to select"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

function generateInsights(headers: string[], data: any[][]): string[] {
  const insights: string[] = [];

  // Basic data summary
  insights.push(`Total rows: ${data.length}`);
  insights.push(`Total columns: ${headers.length}`);

  // Column types and basic stats
  headers.forEach((header, index) => {
    const values = data.map(row => row[index]);
    const numericValues = values.filter(v => !isNaN(Number(v)));
    
    if (numericValues.length > 0) {
      // Numeric column
      const numbers = numericValues.map(Number);
      const sum = numbers.reduce((a, b) => a + b, 0);
      const avg = sum / numbers.length;
      const max = Math.max(...numbers);
      const min = Math.min(...numbers);
      
      insights.push(`${header}:`);
      insights.push(`- Average: ${avg.toFixed(2)}`);
      insights.push(`- Max: ${max}`);
      insights.push(`- Min: ${min}`);
    } else {
      // Categorical column
      const uniqueValues = new Set(values).size;
      insights.push(`${header}:`);
      insights.push(`- Unique values: ${uniqueValues}`);
    }
  });

  return insights;
}