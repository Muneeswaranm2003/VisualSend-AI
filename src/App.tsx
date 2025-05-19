import React, { useState } from 'react';
import { DataProvider, useData } from './context/DataContext';
import MainLayout from './components/Layout/MainLayout';
import FileUpload from './components/FileUpload/FileUpload';
import Dashboard from './components/Dashboard/Dashboard';

const Main: React.FC = () => {
  const { processedData } = useData();
  
  return (
    <MainLayout>
      {!processedData ? <FileUpload /> : <Dashboard />}
    </MainLayout>
  );
};

function App() {
  return (
    <DataProvider>
      <Main />
    </DataProvider>
  );
}

export default App;