import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSliderWithInput } from '../NodeParameter/NodeParameter';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';


const TrainTestSplitNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();

  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="Test Size" />
      <ParamSliderWithInput
        value={data.parameters.test_size}
        onChange={(value) => updateNodeParameters(id, { test_size: value })}
        min={0.01}
        max={0.99}
        step={0.01}
      />
    </div>
  );
  
  const trainData = data?.outputs?.train?.display_value || {};
  const testData = data?.outputs?.test?.display_value || {};
  const modalContent = (
    <>
      <ModalName name="Train Data" />
      <ModalTable
        data={(trainData?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={(trainData?.metadata || {}).columns?.map((column) => ({ title: column, dataIndex: column })) || []}
        title={(trainData?.metadata || {}).name || 'Unknown'}
        nRows={(trainData?.metadata || {}).n_rows || 0}
      />
      <ModalName name="Test Data" />
      <ModalTable
        data={(testData?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={(testData?.metadata || {}).columns?.map((column) => ({ title: column, dataIndex: column })) || []}
        title={(testData?.metadata || {}).name || 'Unknown'}
        nRows={(testData?.metadata || {}).n_rows || 0}
      />
    </>
  );
  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-data-train-test-split'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    > 
    </BaseNode>
  );
};

export default TrainTestSplitNode;