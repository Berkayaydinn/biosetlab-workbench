import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamTopic, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';

const DecisionTreeNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const modalContent = (
    <div className="max-w-2xl">
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      <>
        <ParamName name="Criterion" tooltip="Criterion to measure the quality of a split" />
        <ParamSelect
          value={data.parameters.criterion || ''}
          options={[
            { value: 'gini', label: 'Gini' },
            { value: 'entropy', label: 'Entropy' },
            { value: 'log_loss', label: 'Log Loss' },
          ]}
          onChange={(value) => updateNodeParameters(id, { criterion: value })}
        />
        <ParamName name="Max Depth" tooltip="Limit maximal tree depth to this value" />
        <ParamInputNumber
          value={data.parameters.max_depth || 0}
          onChange={(value) => updateNodeParameters(id, { max_depth: value })}
          min={1}
          max={1000}
        />
        <ParamName name="Min Samples Split" tooltip="Do not split subsets smaller than this value" />
        <ParamInputNumber
          value={data.parameters.min_samples_split || 2}
          onChange={(value) => updateNodeParameters(id, { min_samples_split: value })}
          min={1}
          max={1000}
        />
        <ParamName name="Min Samples Leaf" tooltip="Stop splitting when number of instances in a leaf node is less than this value" />
        <ParamInputNumber
          value={data.parameters.min_samples_leaf || 1}
          onChange={(value) => updateNodeParameters(id, { min_samples_leaf: value })}
          min={1}
          max={1000}
        />
        <ParamTopic name="Classification" />
        <ParamName name="Sufficient Majority (%)" tooltip="Stop splitting when majority class reaches this percentage" />
        <ParamInputNumber
          value={(data.parameters.sufficient_majority || 0.95) * 100}
          onChange={(value) => updateNodeParameters(id, { sufficient_majority: value / 100 })}
          min={0}
          max={100}
          step={1}
        />
      </>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-prediction-decision-tree'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
      
    </BaseNode>
  );
};

export default DecisionTreeNode; 