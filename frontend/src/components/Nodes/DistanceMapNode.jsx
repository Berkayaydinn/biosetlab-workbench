import React, { useMemo } from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ModalName, ModalHeatmap } from '../NodeModal/NodeModalItem';

const DistanceMapNode = ({ id, data, selected }) => {
  const { nodes } = usePlaygroundStore();
  const currentNode = nodes.find(node => node.id === id);

  const visualizationData = currentNode?.data?.outputs?.visualization?.display_value || [];

  // Prepare modal content with distance map visualization
  const modalContent = useMemo(() => {
    if (!visualizationData.data) return null;

    const { metadata } = visualizationData;
    const metric = metadata?.metric || 'unknown';
    const compare = metadata?.compare || 'rows';

    return (
      <div className="max-w-4xl">
        <ModalName name={`Distance Map (${metric} - ${compare})`} />
        <ModalHeatmap 
          data={visualizationData.data || []}
          xColumns={[...new Set(visualizationData.data.map(d => d[0]))]}
          yColumns={[...new Set(visualizationData.data.map(d => d[1]))]}
          defaultShowValues={false}
        />
      </div>
    );
  }, [visualizationData]);

  const children = (
    <div className="flex flex-col mt-2 space-y-2">
      <div className="text-sm text-gray-600">
        Connect a distance matrix to visualize as a heatmap.
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-unsupervised-distance-map'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default DistanceMapNode; 