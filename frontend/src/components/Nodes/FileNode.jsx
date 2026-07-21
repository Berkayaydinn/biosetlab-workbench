import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelectWithSearch } from '../NodeParameter/NodeParameter';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Select, Space } from 'antd';
import { 
  columnTypes,
  columnClasses,
} from './utils/ColumnBadges';

const FileNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  const [files, setFiles] = useState([]);
  
  // Example datasets from the backend (matching file.py)
  const exampleDatasets = [
    { value: "iris.csv", label: "Iris Dataset" },
    { value: "wine.csv", label: "Wine Dataset" },
    { value: "breast_cancer.csv", label: "Breast Cancer Dataset" }
  ];
    
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8000/api/user/owned-datasets",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const datasets = response.data.datasets;
        const formattedFiles = datasets.map(dataset => ({
          value: dataset.projectId + "-" + dataset._id + "." + dataset.extension,
          label: dataset.name
        }));
        setFiles(formattedFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };
    fetchFiles();
  }, [])

  // Create options with sections
  const createFileOptions = () => {
    const options = [];
    
    // Add Owned Datasets section
    if (files.length > 0) {
      options.push({
        label: 'Owned Datasets',
        options: files
      });
    }
    
    // Add Example Datasets section
    options.push({
      label: 'Example Datasets',
      options: exampleDatasets
    });
    
    return options.length > 0 ? options : [{ value: '', label: 'No datasets available' }];
  };

  const outputData = data?.outputs?.data?.display_value;
  const columnInfo = outputData?.metadata?.column_info || {};

  const setFileName = (value) => {
    updateNodeParameters(id, { file_name: value });
    // Empty the column info
    updateNodeParameters(id, { column_info: {} });
  };

  // Update the node parameters when column info changes
  const updateColumnInfo = (updatedInfo) => {
    updateNodeParameters(id, { column_info: updatedInfo });
  };

  // Handle column type change
  const handleTypeChange = (columnName, newType) => {
    const updatedInfo = { ...columnInfo };
    updatedInfo[columnName].type = newType;
    updateColumnInfo(updatedInfo);
  };

  // Handle column class change
  const handleClassChange = (columnName, newClass) => {
    const updatedInfo = { ...columnInfo };
    updatedInfo[columnName].class = newClass;
    updateColumnInfo(updatedInfo);
    
    // Add/remove also features and target
    if (newClass === 'feature') {
      toggleFeature(columnName);
    } else if (newClass === 'target') {
      setAsTarget(columnName);
    }
  };

  // Mark a column as target
  const setAsTarget = (colName) => {
    updateNodeParameters(id, { target: colName });
  };

  // Add/remove a column as feature
  const toggleFeature = (colName) => {
    const currentFeatures = data.parameters.features || [];
    const newFeatures = currentFeatures.includes(colName)
      ? currentFeatures.filter(f => f !== colName)
      : [...currentFeatures, colName];
    
    updateNodeParameters(id, { features: newFeatures });
  };

  // Convert dictionary to array for table display
  const columnInfoArray = Object.entries(columnInfo).map(([name, info]) => ({
    key: name,
    name,
    ...info
  }));

  // Ant Design table columns
  const tableColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '30%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '35%',
      render: (text, record) => (
        <Space direction="vertical" style={{ width: '50%' }}>
          <Select
            size="small"
            value={record.type}
            style={{ width: '100%' }}
            onChange={(value) => handleTypeChange(record.name, value)}
            options={columnTypes}
            labelInValue={false}
          />
        </Space>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      width: '35%',
      render: (text, record) => (
        <Space direction="vertical" style={{ width: '50%' }}>
          <Select
            size="small"
            value={record.class}
            style={{ width: '100%' }}
            onChange={(value) => handleClassChange(record.name, value)}
            options={columnClasses}
            labelInValue={false}
          />
        </Space>
      ),
    }
  ];

  const modalContent = (
    <>
      <ModalName name="Data" />
      <ModalTable
        data={(outputData?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={(outputData?.metadata || {}).columns?.map((column) => ({ title: column, dataIndex: column })) || []}
        title={(outputData?.metadata || {}).name || 'Unknown'}
        nRows={(outputData?.metadata || {}).n_rows || 0}
      />
      {/* Column Information Table */}
      {Object.keys(columnInfo).length > 0 && (
        <>
          <ModalName name="Column Information" />
          <div className="mt-2">
            <Table
              dataSource={columnInfoArray}
              columns={tableColumns}
              size="small"
              pagination={false}
              scroll={{ y: 240 }}
              bordered
            />
          </div>
        </>
      )}
    </>
  );

  // Helper function to find label for selected value
  const findLabelForValue = (value) => {
    const allOptions = createFileOptions();
    for (const group of allOptions) {
      if (group.options) {
        const option = group.options.find(opt => opt.value === value);
        if (option) return option.label;
      }
    }
    return value; // fallback to value if label not found
  };

  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="File Name" />
      <ParamSelectWithSearch
        value={data.parameters.file_name || ''}
        options={createFileOptions()}
        onChange={(value) => {
          updateNodeParameters(id, { 
            file_name: value,
            file_label: findLabelForValue(value),
            column_info: {},
            features: [],
            target: ''
          });
        }}
      />
    </div>
  );

  return (
    <BaseNode 
    id={id} 
    parameters={data.parameters} 
    data={data} 
    type={"node-data-file"}
    modalContent={modalContent}
    children={children}
    >
    </BaseNode>
  );
};

export default FileNode;


