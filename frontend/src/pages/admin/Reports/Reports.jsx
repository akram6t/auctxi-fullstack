import { IconDownload, IconPrinter } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import AuctionSummaryReport from './components/AuctionSummaryReport';
import TeamSpendingReport from './components/TeamSpendingReport';
import FinancialReport from './components/FinancialReport';

const Reports = () => {
  const [activeReport, setActiveReport] = useState('summary');
  const reportRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    toast.info('Generating PDF...');
    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`auctxi_${activeReport}_report.pdf`);
      toast.success('Report exported to PDF!');
    } catch (error) {
      console.error('Failed to export PDF', error);
      toast.error('Failed to generate PDF');
    }
  };

  const renderReport = () => {
    switch(activeReport) {
      case 'summary': return <AuctionSummaryReport />;
      case 'spending': return <TeamSpendingReport />;
      case 'financial': return <FinancialReport />;
      default: return <AuctionSummaryReport />;
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Analytics & Reports
          </h1>
          <p className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
            View insights, auction summaries, and export data.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button 
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 border border-secondary-300 dark:border-secondary-700 rounded-lg shadow-sm text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-white dark:bg-secondary-800 hover:bg-secondary-50 dark:hover:bg-secondary-700 focus:outline-none transition-colors print:hidden"
          >
            <IconPrinter size={18} className="mr-2" />
            Print
          </button>
          <button 
            onClick={handleExportPDF}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors print:hidden"
          >
            <IconDownload size={18} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-900 shadow-sm rounded-xl border border-secondary-200 dark:border-secondary-800 p-4 mb-6 flex flex-col sm:flex-row gap-4 items-center print:hidden">
        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 whitespace-nowrap">Select Report Type:</label>
        <select 
          value={activeReport} 
          onChange={(e) => setActiveReport(e.target.value)} 
          className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-secondary-300 dark:border-secondary-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg bg-white dark:bg-secondary-800 text-secondary-900 dark:text-white transition-shadow"
        >
          <option value="summary">Auction Summary</option>
          <option value="spending">Team Spending Performance</option>
          <option value="financial">Financial Transactions</option>
        </select>
      </div>

      <div ref={reportRef} className="print:m-0 print:p-0">
        {renderReport()}
      </div>
    </div>
  );
};

export default Reports;
