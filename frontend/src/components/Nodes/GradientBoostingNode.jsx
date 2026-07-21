import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamCheckbox, ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect, ParamTopic } from '../NodeParameter/NodeParameter';

const GradientBoostingNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const modalContent = (
    <div className="max-w-2xl">
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
        <>
          <ParamTopic name="Basic Properties" />
          <ParamName name="Task Type" />
          <ParamSelect
            value={data.parameters.task_type || 'classification'}
            options={[
              { value: 'classification', label: 'Classification' },
              { value: 'regression', label: 'Regression' },
            ]}
            onChange={(value) => updateNodeParameters(id, { task_type: value })}
          />
          <ParamName name="Number of Trees" />
          <ParamInputNumber
            value={data.parameters.n_estimators || 100}
            min={1}
            max={1000}
            onChange={(value) => updateNodeParameters(id, { n_estimators: value })}
          />
          <ParamName name="Learning Rate" />
          <ParamInputNumber
            value={data.parameters.learning_rate || 0.1}
            min={0.001}
            max={1.0}
            onChange={(value) => updateNodeParameters(id, { learning_rate: value })}
          />
          <ParamName name="Replicable Training" />
          <ParamCheckbox
            label="Replicable Training"
            checked={data.parameters.replicable_training}
            onChange={(value) => {updateNodeParameters(id, { replicable_training: value.target.checked })}}
          />
          <ParamTopic name="Growth Control" />
          <ParamName name="Limit depth of individual trees" />
          <ParamInputNumber
            value={data.parameters.max_depth || null}
            min={3}
            max={10}
            onChange={(value) => updateNodeParameters(id, { max_depth: value })}
          />
          <ParamName name="Do not split subsets smaller than" />
          <ParamInputNumber
            value={data.parameters.min_samples_split || 2}
            min={2}
            max={1000}
            onChange={(value) => updateNodeParameters(id, { min_samples_split: value })}
          />
          <ParamTopic name="Subsampling" />
          <ParamName name="Fraction of training instances" />
          <ParamInputNumber
            value={data.parameters.subsample || 1.0}
            min={0.01}
            max={1.0}
            onChange={(value) => updateNodeParameters(id, { subsample: value })}
          />
        </>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-prediction-random-forest'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default GradientBoostingNode; 