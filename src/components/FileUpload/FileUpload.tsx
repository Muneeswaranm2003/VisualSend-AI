import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { FileText, Upload, Check, AlertTriangle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { detectColumns } from '../../utils/columnDetection';
import { EmailData } from '../../types';
import ColumnMapper from './ColumnMapper';

const FileUpload: React.FC = () => {
  const { setRawData, setColumnMapping, processData } = useData();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  const processFile = useCallback(async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (file.name.endsWith('.csv')) {
        Papa.parse(file, {
          header: true,
          complete: (results) => {
            if (results.data.length === 0) {
              setError('The file appears to be empty');
              setIsProcessing(false);
              return;
            }
            
            const headers = Object.keys(results.data[0]);
            setHeaders(headers);
            
            // Auto-detect columns
            const mapping = detectColumns(headers);
            setColumnMapping(mapping);
            
            // Store the parsed data
            setRawData(results.data as EmailData[]);
            setIsProcessing(false);
            setIsReady(true);
          },
          error: (error) => {
            setError(`Error parsing CSV: ${error.message}`);
            setIsProcessing(false);
          }
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Use the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON with headers
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        if (jsonData.length === 0) {
          setError('The Excel file appears to be empty');
          setIsProcessing(false);
          return;
        }
        
        const headers = Object.keys(jsonData[0]);
        setHeaders(headers);
        
        // Auto-detect columns
        const mapping = detectColumns(headers);
        setColumnMapping(mapping);
        
        // Store the parsed data
        setRawData(jsonData as EmailData[]);
        setIsProcessing(false);
        setIsReady(true);
      } else {
        setError('Unsupported file format. Please upload a CSV or Excel file.');
        setIsProcessing(false);
      }
    } catch (err) {
      setError(`Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  }, [setRawData, setColumnMapping]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setFile(file);
      processFile(file);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    multiple: false,
  });

  const handleContinue = () => {
    processData();
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Upload Your Data</h2>
        <p className="text-gray-600">Upload your data file (CSV or Excel) to automatically generate insights</p>
      </div>
      
      {!file && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
            ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-12 h-12 text-blue-500 mb-3" />
            <p className="text-lg font-medium text-gray-700 mb-1">
              {isDragActive ? 'Drop the file here' : 'Drag & drop your file here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
            <p className="text-xs text-gray-400">Supports CSV, XLSX, and XLS files</p>
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {file && !error && (
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-md flex items-center mb-4">
            <FileText className="h-8 w-8 text-blue-500 mr-3" />
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(1)} KB • {new Date().toLocaleDateString()}
              </p>
            </div>
            {isProcessing ? (
              <div className="ml-auto flex items-center">
                <div className="animate-spin h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Processing...</span>
              </div>
            ) : (
              <div className="ml-auto">
                <Check className="h-6 w-6 text-green-500" />
              </div>
            )}
          </div>
          
          {headers.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Column Mapping</h3>
              <ColumnMapper headers={headers} />
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleContinue}
                  disabled={!isReady}
                  className={`px-6 py-2 rounded-md font-medium ${
                    isReady
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Generate Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUpload;