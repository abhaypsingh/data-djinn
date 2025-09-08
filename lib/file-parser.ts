import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export interface ParsedData {
  headers: string[];
  rows: any[];
  preview: string;
  format: string;
  rowCount: number;
  columnCount: number;
}

export async function parseFile(file: File): Promise<ParsedData> {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  switch (fileExtension) {
    case 'csv':
      return parseCSV(file);
    case 'xlsx':
    case 'xls':
      return parseExcel(file);
    case 'json':
      return parseJSON(file);
    case 'txt':
      return parseText(file);
    default:
      throw new Error(`Unsupported file format: ${fileExtension}`);
  }
}

async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as any[];
        
        resolve({
          headers,
          rows,
          preview: generatePreview(headers, rows),
          format: 'CSV',
          rowCount: rows.length,
          columnCount: headers.length,
        });
      },
      error: (error) => reject(error),
    });
  });
}

async function parseExcel(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
        
        if (jsonData.length === 0) {
          reject(new Error('Empty Excel file'));
          return;
        }
        
        const headers = jsonData[0].map(h => String(h));
        const rows = jsonData.slice(1).map(row => {
          const obj: any = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        });
        
        resolve({
          headers,
          rows,
          preview: generatePreview(headers, rows),
          format: 'Excel',
          rowCount: rows.length,
          columnCount: headers.length,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsBinaryString(file);
  });
}

async function parseJSON(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        let rows: any[];
        let headers: string[];
        
        if (Array.isArray(data)) {
          rows = data;
          headers = rows.length > 0 ? Object.keys(rows[0]) : [];
        } else if (typeof data === 'object') {
          rows = [data];
          headers = Object.keys(data);
        } else {
          throw new Error('Invalid JSON structure');
        }
        
        resolve({
          headers,
          rows,
          preview: generatePreview(headers, rows),
          format: 'JSON',
          rowCount: rows.length,
          columnCount: headers.length,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

async function parseText(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split('\n').filter(line => line.trim());
        
        const rows = lines.map((line, index) => ({
          line_number: index + 1,
          content: line,
        }));
        
        resolve({
          headers: ['line_number', 'content'],
          rows,
          preview: lines.slice(0, 10).join('\n'),
          format: 'Text',
          rowCount: rows.length,
          columnCount: 2,
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

function generatePreview(headers: string[], rows: any[], maxRows = 5): string {
  const previewRows = rows.slice(0, maxRows);
  let preview = `Headers: ${headers.join(', ')}\n\n`;
  preview += 'Sample Data:\n';
  
  previewRows.forEach((row, index) => {
    preview += `Row ${index + 1}:\n`;
    headers.forEach(header => {
      const value = row[header];
      const displayValue = value !== undefined && value !== null ? String(value) : 'null';
      preview += `  ${header}: ${displayValue.length > 50 ? displayValue.substring(0, 50) + '...' : displayValue}\n`;
    });
    preview += '\n';
  });
  
  if (rows.length > maxRows) {
    preview += `... and ${rows.length - maxRows} more rows`;
  }
  
  return preview;
}