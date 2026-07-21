import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalName, ModalChart } from '../NodeModal/NodeModalItem';

const LinePlotNode = ({ id, data, selected }) => {
  const outputData = data?.outputs?.visualization?.display_value;

  const preparePlotData = (data) => {
    if (!data) return { xData: [], yData: [] };
    
    return {
      xData: data.map(item => item.x),
      yData: data.map(item => item.y)
    };
  };

  const { xData, yData } = preparePlotData(outputData?.data);

  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="Visualization" />
      <ModalChart
        type="line"
        title={`${outputData?.metadata?.y || 'Y'} - ${outputData?.metadata?.x || 'X'}`}
        xAxisName={outputData?.metadata?.x || 'X'}
        yAxisName={outputData?.metadata?.y || 'Y'}
        xData={xData}
        yData={yData}
      />
    </div>
  );

  const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const columnData = getInputParameters(id, 'data');
  const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

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
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-visualization-line-plot'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default LinePlotNode;
