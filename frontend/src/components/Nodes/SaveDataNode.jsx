import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect, ParamInput } from '../NodeParameter/NodeParameter';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { Button, Alert } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const SaveDataNode = ({ id, data, selected }) => {
  const { updateNodeParameters, nodes } = usePlaygroundStore();
  const currentNode = nodes.find(node => node.id === id);

  const fileTypeOptions = [
    { value: 'csv', label: 'CSV (Comma-separated)' },
    { value: 'tab', label: 'TSV (Tab-separated)' },
    { value: 'xlsx', label: 'Excel (XLSX)' }
  ];

  const setFileType = (value) => {
    updateNodeParameters(id, { file_type: value });
  };

  const setFilename = (value) => {
    updateNodeParameters(id, { filename: value });
  };

  // Get export data from output
  const exportData = currentNode?.data?.outputs?.data?.display_value || {};

  // Download function
  const handleDownload = () => {
    if (!exportData.file_content) {
      console.error('No file content available for download');
      return;
    }

    try {
      let blob;
      
      if (exportData.is_base64) {
        // For Excel files (base64 encoded)
        const binaryString = atob(exportData.file_content);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        blob = new Blob([bytes], { type: exportData.mime_type });
      } else {
        // For CSV and TSV files
        blob = new Blob([exportData.file_content], { type: exportData.mime_type });
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportData.filename || 'exported_data';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  // Modal content showing export information and download option
  const modalContent = exportData.file_content ? (
    <div className="max-w-full">
      <ModalName name="Export Data" />
      
      {/* Export Information */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Export Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><strong>File Type:</strong> {exportData.file_type?.toUpperCase()}</p>
          <p><strong>Filename:</strong> {exportData.filename}</p>
          <p><strong>Rows:</strong> {exportData.rows?.toLocaleString()}</p>
          <p><strong>Columns:</strong> {exportData.columns?.toLocaleString()}</p>
        </div>
        
        {/* Column Names */}
        {exportData.column_names && exportData.column_names.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium mb-1">Columns:</p>
            <div className="flex flex-wrap gap-1">
              {exportData.column_names.slice(0, 10).map((col, idx) => (
                <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {col}
                </span>
              ))}
              {exportData.column_names.length > 10 && (
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                  +{exportData.column_names.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
        
        {/* Download Button */}
        <div className="mt-4">
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownload}
            size="large"
          >
            Download {exportData.file_type?.toUpperCase()} File
          </Button>
        </div>
      </div>

      {/* Preview of first few columns (for CSV/TSV only) */}
      {exportData.file_type !== 'xlsx' && exportData.file_content && (
        <>
          <ModalName name="Data Preview" />
          <Alert
            message="File Preview"
            description="Showing first few lines of the exported file content"
            type="info"
            className="mb-2"
          />
          <div className="bg-gray-50 p-3 rounded text-xs font-mono overflow-auto max-h-40">
            <pre>{exportData.file_content.split('\n').slice(0, 10).join('\n')}</pre>
            {exportData.file_content.split('\n').length > 10 && (
              <div className="text-gray-500 mt-2">... ({exportData.file_content.split('\n').length - 10} more lines)</div>
            )}
          </div>
        </>
      )}
    </div>
  ) : (
    <div>
      <ModalName name="Export Data" />
      <Alert
        message="No Export Data"
        description="Connect data inputs and run the node to generate exportable data."
        type="info"
      />
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2 space-y-2">
      <ParamName name="File Type" />
      <ParamSelect
        value={data.parameters.file_type || 'csv'}
        options={fileTypeOptions}
        onChange={setFileType}
      />
      
      <ParamName name="Filename" />
      <ParamInput
        value={data.parameters.filename || 'exported_data'}
        onChange={(e) => setFilename(e.target.value)}
      />
      
      {!exportData.file_content && (
        <div className="text-xs text-gray-500">
          Connect data inputs to enable export functionality.
        </div>
      )}
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-data-save-data'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default SaveDataNode; 