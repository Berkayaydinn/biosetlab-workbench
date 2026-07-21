import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect, ParamCheckbox, ParamInput } from '../NodeParameter/NodeParameter';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { Table, Select, Input, Space } from 'antd';
import { ColumnTypeBadge, ColumnClassBadge } from './utils/ColumnBadges';

const ImputeNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();

  const methodOptions = [
    { value: 'default', label: 'Default' },
    { value: 'dont_impute', label: "Don't Impute" },
    { value: 'average_frequent', label: 'Average/Most Frequent' },
    { value: 'distinct_value', label: 'As a Distinct Value' },
    { value: 'model_based', label: 'Model-based Imputer (1-NN)' },
    { value: 'random', label: 'Random Values' },
    { value: 'remove_examples', label: 'Remove Examples with Missing Values' },
    { value: 'fixed_value', label: 'Fixed Value' }
  ];

  const generalMethodOptions = methodOptions.filter(option => option.value !== 'default');

  const setMethod = (value) => {
    updateNodeParameters(id, { method: value });
  };

  const setRemoveMissingClass = (value) => {
    updateNodeParameters(id, { remove_missing_class: value });
  };

  const setFixedValue = (value) => {
    updateNodeParameters(id, { fixed_value: value });
  };

  // Column-specific parameter handling
  const setColumnMethod = (columnName, method) => {
    const currentColumnParams = data.parameters.column_params || {};
    const updatedColumnParams = {
      ...currentColumnParams,
      [columnName]: {
        ...currentColumnParams[columnName],
        method: method
      }
    };
    updateNodeParameters(id, { column_params: updatedColumnParams });
  };

  const setColumnValue = (columnName, value) => {
    const currentColumnParams = data.parameters.column_params || {};
    const updatedColumnParams = {
      ...currentColumnParams,
      [columnName]: {
        ...currentColumnParams[columnName],
        value: value
      }
    };
    updateNodeParameters(id, { column_params: updatedColumnParams });
  };

  // Get input data for column information
  const outputData = data?.outputs?.data?.display_value;
  const columnInfo = outputData?.metadata?.column_info || {};
  const columnParams = data.parameters.column_params || {};

  // Convert column info to array for table display
  const columnInfoArray = Object.entries(columnInfo).map(([name, info]) => ({
    key: name,
    name,
    type: info.type,
    class: info.class,
    method: columnParams[name]?.method || 'default',
    value: columnParams[name]?.value || ''
  }));

  // Table columns for column-specific imputation
  const tableColumns = [
    {
      title: 'Column',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '15%',
      render: (text) => (
        <ColumnTypeBadge type={text} />
      )
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
      width: '15%',
      render: (text) => (
        <ColumnClassBadge classType={text} />
      )
    },
    {
      title: 'Imputation Method',
      dataIndex: 'method',
      key: 'method',
      width: '30%',
      render: (text, record) => (
        <Select
          size="small"
          value={record.method}
          style={{ width: '100%' }}
          onChange={(value) => setColumnMethod(record.name, value)}
          options={methodOptions}
        />
      ),
    },
    {
      title: 'Fixed Value',
      dataIndex: 'value',
      key: 'value',
      width: '20%',
      render: (text, record) => (
        <Input
          size="small"
          value={record.value}
          placeholder="Enter value"
          disabled={record.method !== 'fixed_value'}
          onChange={(e) => setColumnValue(record.name, e.target.value)}
          style={{ 
            width: '100%',
            backgroundColor: record.method !== 'fixed_value' ? '#f5f5f5' : 'white'
          }}
        />
      ),
    }
  ];

  const modalContent = (
    <div className="max-w-full">
      {/* Column-Specific Parameters Section */}
      {Object.keys(columnInfo).length > 0 && (
        <div>
          <ParamName name="Column-Specific Imputation" />
          <div className="text-xs text-gray-600 mb-2">
            Set specific imputation methods for individual columns. Use "Default" to apply general method.
          </div>
          <div className="border rounded">
            <Table
              dataSource={columnInfoArray}
              columns={tableColumns}
              size="small"
              pagination={false}
              scroll={{ y: 200 }}
              bordered={false}
            />
          </div>
        </div>
      )}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2 space-y-2">
      {/* General Parameters Section */}
      <div className="border-b pb-3">
        <ParamName name="General Imputation Method (Default)" />
        <ParamSelect
          value={data.parameters.method || 'model_based'}
          options={generalMethodOptions}
          onChange={setMethod}
        />
        
        {/* Fixed Value Input - only show when fixed_value method is selected */}
        {data.parameters.method === 'fixed_value' && (
          <div className="mt-2">
            <ParamName name="Default Fixed Value" />
            <ParamInput
              value={data.parameters.fixed_value || ''}
              onChange={(e) => setFixedValue(e.target.value)}
              placeholder="Enter the value to replace missing values with"
            />
          </div>
        )}
        
        <div className="mt-2">
          <ParamCheckbox
            label="Remove examples with missing target values"
            checked={data.parameters.remove_missing_class || false}
            onChange={(e) => setRemoveMissingClass(e.target.checked)}
          />
        </div>
      </div>
      
      {/* Method descriptions */}
      <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
        {data.parameters.method === 'dont_impute' && (
          <p>No imputation will be performed. Missing values remain as NaN.</p>
        )}
        {data.parameters.method === 'average_frequent' && (
          <p>Missing values replaced with column mean (numeric) or mode (categorical).</p>
        )}
        {data.parameters.method === 'distinct_value' && (
          <p>Missing values replaced with distinct placeholder values.</p>
        )}
        {(data.parameters.method === 'model_based' || !data.parameters.method) && (
          <p>Missing values predicted using 1-NN (k-nearest neighbors) algorithm.</p>
        )}
        {data.parameters.method === 'random' && (
          <p>Missing values replaced with random values from existing distribution.</p>
        )}
        {data.parameters.method === 'remove_examples' && (
          <p>Rows containing any missing values will be removed from the dataset.</p>
        )}
        {data.parameters.method === 'fixed_value' && (
          <p>Missing values replaced with the specified fixed value.</p>
        )}
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-transform-impute'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default ImputeNode; 