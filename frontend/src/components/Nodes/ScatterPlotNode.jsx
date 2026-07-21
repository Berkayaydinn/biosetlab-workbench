import React, { useMemo } from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalName, ModalChart } from '../NodeModal/NodeModalItem';

const ScatterPlotNode = ({ id, data, selected }) => {
  const outputData = data?.outputs?.visualization?.display_value;

  const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const columnData = getInputParameters(id, 'data');
  const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

  const preparePlotData = useMemo(() => {
    if (!outputData) return {};

    const rawData = outputData.data;

    // If grouped, organize data by groups
    if (rawData.some(item => item.group)) {
      const groupedData = {};
      rawData.forEach(item => {
        const group = item.group || 'Unknown';
        if (!groupedData[group]) {
          groupedData[group] = { xData: [], yData: [] };
        }
        groupedData[group].xData.push(item.x);
        groupedData[group].yData.push(item.y);
      });
      return { 
        xData: Object.values(groupedData).map(group => group.xData),
        yData: Object.values(groupedData).map(group => group.yData),
        groups: Object.keys(groupedData)
      };
    }
    
    // If not grouped, return single series
    return {
      xData: [rawData.map(item => item.x)],
      yData: [rawData.map(item => item.y)],
      groups: ['Default']
    };
  }, [
    outputData
  ]);

  const { xData, yData, groups } = preparePlotData;

  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="Visualization" />
      <ModalChart
        key={`${outputData?.metadata?.x}-${outputData?.metadata?.y}-${outputData?.metadata?.group_by}`}
        type="scatter"
        title={`${outputData?.metadata?.x || 'X'} vs ${outputData?.metadata?.y || 'Y'} Grouped by ${outputData?.metadata?.group_by || 'None'}`}
        xAxisName={outputData?.metadata?.x || 'X'}
        yAxisName={outputData?.metadata?.y || 'Y'}
        xData={xData}
        yData={yData}
        groups={groups}
      />
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="X-axis" />
      <ParamSelect
        value={data.parameters.x || ''}
        options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
        onChange={(value) => updateNodeParameters(id, { x: value })}
        disabled={!canColumnSelect}
        disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
      />
      <ParamName name="Y-axis" />
      <ParamSelect
        value={data.parameters.y || ''}
        options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
        onChange={(value) => updateNodeParameters(id, { y: value })}
        disabled={!canColumnSelect}
        disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
      />
      <ParamName name="Group By" />
      <ParamSelect
        value={data.parameters.group_by || ''}
        options={[
          { value: '', label: 'None' },
          ...(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])
        ]}
        onChange={(value) => updateNodeParameters(id, { group_by: value })}
        disabled={!canColumnSelect}
        disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Optional: Select a column to group by'}
      />
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-visualization-scatter-plot'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default ScatterPlotNode;
