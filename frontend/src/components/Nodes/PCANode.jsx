import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamName, ParamMultiSelect } from '../NodeParameter/NodeParameter';
import { ModalName, ModalChart } from '../NodeModal/NodeModalItem';

const PCANode = ({ id, data, selected }) => {
  const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const columnData = getInputParameters(id, 'data');
  const canColumnSelect = (columnData && columnData.metadata && columnData.metadata.columns);

  // Get variance info from outputs
  const varianceInfo = data.outputs?.variance_info?.display_value?.data || [];

  const modalContent = (
    <div className="max-w-2xl">
      {varianceInfo && varianceInfo.length > 0 ? (
        <>
          <ModalName name="Component Variance" />
          <ModalChart 
            type="line"
            title="Component Variance"
            xAxisName="Principal Components"
            yAxisName="Proportion of Variance"
            xData={varianceInfo.map(row => row.Component)}
            yData={varianceInfo.map(row => row['Individual Variance'])}
          />
          
          <ModalName name="Cumulative Variance" />
          <ModalChart 
            type="line"
            title="Cumulative Variance"
            xAxisName="Principal Components"
            yAxisName="Proportion of Variance"
            xData={varianceInfo.map(row => row.Component)}
            yData={varianceInfo.map(row => row['Cumulative Variance'])}
          />
        </>
      ) : (
        <div className="text-center p-4 text-gray-500">
          No variance information available. 
          Please ensure the PCA node has been processed.
        </div>
      )}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      {canColumnSelect ? (
        <>
          <ParamName name="Features" />
          <ParamMultiSelect 
            value={data.parameters.features || []}
            options={columnData.metadata.columns.map((col) => ({ value: col, label: col }))}
            onChange={(value) => updateNodeParameters(id, { features: value })}
            placeholder="Select features (optional)"
          />

          <ParamName name="Number of Components" />
          <ParamInputNumber
            value={data.parameters.components || 2}
            onChange={(value) => updateNodeParameters(id, { components: value })}
            min={1}
            placeholder="Number of Components"
          />
          <ParamName name="Explained Variance" />
          <ParamInputNumber
            value={data.parameters.explainedVariance || 0.95}
            onChange={(value) => updateNodeParameters(id, { explainedVariance: value })}
            min={0}
            max={1}
            step={0.1}
            placeholder="Explained Variance Ratio"
          />
        </>
      ) : (
        <>
          Please connect a data node to this node to select features.
        </>
      )}
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-unsupervised-pca'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default PCANode;