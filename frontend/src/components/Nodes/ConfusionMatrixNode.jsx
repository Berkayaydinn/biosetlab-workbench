import React, { useState, useEffect } from 'react';
import { ModalHeatmap, ModalName } from '../NodeModal/NodeModalItem';
import BaseNode from './BaseNode';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';

const ConfusionMatrixNode = ({ id, data, selected }) => {
  const outputData = data?.outputs?.confusion_matrix?.display_value;
  const [selectedModel, setSelectedModel] = useState(null);

  // Auto-select first model when data changes
  useEffect(() => {
    if (outputData && Object.keys(outputData).length > 0) {
      setSelectedModel(Object.keys(outputData)[0]);
    }
  }, [outputData]);

  // Prepare confusion matrix data for visualization
  const formatConfusionMatrix = (data, labels) => {
    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        // Format: [x, y, value, annotation]
        formattedData.push([
          i, 
          j, 
          data[i][j],
          `Actual: ${labels[i]}, Predicted: ${labels[j]}`
        ]);
      }
    }
    return formattedData;
  };

  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="Confusion Matrix" />
      {selectedModel && outputData[selectedModel] && (
        <>
          {Object.keys(outputData).length > 1 && (
            <div className='w-64 mb-4'>
              <ParamName name="Model" />
              <ParamSelect
                options={Object.keys(outputData).map((model) => ({ value: model, label: model }))}
                value={selectedModel}
                onChange={(value) => setSelectedModel(value)}
              />
            </div>
          )}
          <ModalHeatmap
            data={formatConfusionMatrix(
              outputData[selectedModel].data, 
              outputData[selectedModel].labels
            )}
            xColumns={outputData[selectedModel].labels}
            yColumns={outputData[selectedModel].labels}
            defaultColor="Blue"
          />
        </>
      )}
    </div>
  );

  const children = <></>;

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-evaluation-confusion-matrix'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default ConfusionMatrixNode;