import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

// Export visualization as PNG
export const exportAsPng = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    const dataUrl = await toPng(element, { quality: 0.95 });
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error('Error exporting as PNG:', error);
    throw error;
  }
};

// Export visualization as PDF
export const exportAsPdf = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with ID "${elementId}" not found`);
  }

  try {
    const dataUrl = await toPng(element, { quality: 0.95 });
    
    // Initialize PDF
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });
    
    // Calculate dimensions to maintain aspect ratio
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Add image to PDF
    pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Save PDF
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    throw error;
  }
};

// Export entire dashboard as PDF
export const exportDashboardAsPdf = async (fileName: string): Promise<void> => {
  const dashboard = document.getElementById('email-dashboard');
  if (!dashboard) {
    throw new Error('Dashboard element not found');
  }

  try {
    // Generate a PDF with multiple pages if needed
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
    });
    
    // Get all visualization elements
    const visualizations = dashboard.querySelectorAll('.visualization-card');
    
    for (let i = 0; i < visualizations.length; i++) {
      const viz = visualizations[i] as HTMLElement;
      const dataUrl = await toPng(viz, { quality: 0.85 });
      
      // Add a new page for each visualization (except the first one)
      if (i > 0) {
        pdf.addPage();
      }
      
      // Calculate dimensions while maintaining aspect ratio
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20; // Add some margin
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // Add image to PDF
      pdf.addImage(dataUrl, 'PNG', 10, 10, pdfWidth, pdfHeight);
      
      // Add title
      const title = viz.querySelector('h3')?.textContent || `Visualization ${i + 1}`;
      pdf.setFontSize(12);
      pdf.text(title, 10, pdf.internal.pageSize.getHeight() - 10);
    }
    
    // Save PDF
    pdf.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('Error exporting dashboard as PDF:', error);
    throw error;
  }
};