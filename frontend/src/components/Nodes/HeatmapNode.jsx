import React, { useMemo, useEffect } from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamMultiSelect, ParamSelect, ParamSegmented } from '../NodeParameter/NodeParameter';
import { ModalName, ModalHeatmap } from '../NodeModal/NodeModalItem';

const HeatmapNode = ({ id, data, selected }) => {
  const { nodes, getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const currentNode = nodes.find(node => node.id === id);

  const visualizationData = currentNode?.data?.outputs?.visualization?.display_value || [];

  // Determine visualization type and prepare modal content
  const modalContent = useMemo(() => {
    if (!visualizationData.data) return null;

    return (
      <div className="max-w-4xl">
        <ModalName name={`${data.parameters.mode === 'correlation' ? 'Correlation' : 'Data'} Heatmap`} />
        <ModalHeatmap 
          data={visualizationData.data || []}
          xColumns={[...new Set(visualizationData.data.map(d => d[0]))]}
          yColumns={[...new Set(visualizationData.data.map(d => d[1]))]}
        />
      </div>
    );
  }, [visualizationData, data.parameters.mode]);

  const columnData = getInputParameters(id, 'data');
  const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;
  
  // Get available columns
  const availableColumns = useMemo(() => {
    return canColumnSelect ? columnData.metadata.columns : [];
  }, [canColumnSelect, columnData]);

  // Prepare column options
  const columnOptions = useMemo(() => 
    availableColumns.map(col => ({ 
      value: col, 
      label: col 
    })), 
    [availableColumns]
  );

  // Automatically set all columns as default when columns become available
  useEffect(() => {
    if (canColumnSelect && 
        (!data.parameters.columns || data.parameters.columns.length === 0)) {
      updateNodeParameters(id, { 
        columns: availableColumns,
        mode: 'values'  // Default mode
      });
    }
  }, [canColumnSelect, availableColumns, id]);

  const children = (
    <div className="flex flex-col mt-2 space-y-2">
      {/* Mode Selection */}
      <div>
        <ParamName name="Heatmap Mode" />
        <ParamSegmented
          value={data.parameters.mode || 'values'}
          options={[
            { value: 'values', label: 'Values' },
            { value: 'correlation', label: 'Correlation' },
            { value: 'pca', label: 'PCA' }
          ]}
          onChange={(value) => updateNodeParameters(id, { mode: value })}
        />
      </div>

      {/* Columns Selection */}
      <div>
        <ParamName name="Columns" />
        <ParamMultiSelect
          value={data.parameters.columns || availableColumns}
          options={columnOptions}
          onChange={(value) => updateNodeParameters(id, { columns: value })}
          disabled={!canColumnSelect}
        />
      </div>

      {data.parameters.mode === 'values' && 
        <div>
          <ParamName name="Row Annotation" />
          <ParamSelect
            value={data.parameters.values_row_annotation}
            options={[
              { value: '', label: 'None' },
              ...columnOptions
            ]}
            onChange={(value) => updateNodeParameters(id, { values_row_annotation: value })}
            disabled={!canColumnSelect}
          />
        </div>
      }

      {data.parameters.mode === 'correlation' &&
        <div>
          <ParamName name="Correlation Method" />
          <ParamSelect
            value={data.parameters.correlation_method}
            options={[
              { value: 'pearson', label: 'Pearson' },
              { value: 'kendall', label: 'Kendall' },
              { value: 'spearman', label: 'Spearman' }
            ]}
            onChange={(value) => updateNodeParameters(id, { correlation_method: value })}
          />
        </div>
      }
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-visualization-heatmap'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default HeatmapNode;
