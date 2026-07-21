import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';

const RandomForestNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const modalContent = (
    <div className="max-w-2xl">
      {/* Add content to display random forest results */}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
        <>
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
          <ParamName name="Maximum Depth" />
          <ParamInputNumber
            value={data.parameters.max_depth || null}
            min={1}
            max={1000}
            onChange={(value) => updateNodeParameters(id, { max_depth: value })}
          />
          <ParamName name="Minimum Samples Split" />
          <ParamInputNumber
            value={data.parameters.min_samples_split || 2}
            min={2}
            max={1000}
            onChange={(value) => updateNodeParameters(id, { min_samples_split: value })}
          />
          <ParamName name="Minimum Samples Leaf" />
          <ParamInputNumber
            value={data.parameters.min_samples_leaf || 1}
            min={1}
            max={1000}
            onChange={(value) => updateNodeParameters(id, { min_samples_leaf: value })}
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

export default RandomForestNode; 