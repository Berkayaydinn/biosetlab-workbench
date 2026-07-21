import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamCheckbox, ParamInputNumber, ParamName, ParamSelect, ParamTopic } from '../NodeParameter/NodeParameter';

const AdaBoostNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();

  // Varsayılan parametreleri data.parameters içinden çek
//   const {
//     n_estimators = 50,
//     learning_rate = 1.0,
//     loss = 'Linear',
//     fixed_seed = false,
//     random_state = 0
//   } = data.parameters;

  const modalContent = (
    <div className="max-w-2xl">
      {/* İsteğe bağlı rapor veya model çıktısı buraya gelebilir */}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="Number of Estimators" />
      <ParamInputNumber
        min={1}
        max={10000}
        step={1}
        value={data.parameters.n_estimators || 50}
        onChange={(value) => updateNodeParameters(id, { n_estimators: Number(value) })}
      />

      <ParamName name="Learning Rate" />
      <ParamInputNumber
        min={0.00001}
        max={1.0}
        step={0.00001}
        value={data.parameters.learning_rate || 1.0}
        onChange={(value) => updateNodeParameters(id, { learning_rate: Number(value) })}
      />

      <ParamName name="Loss (regression)" />
      <ParamSelect
        value={data.parameters.loss || 'Linear'}
        options={[
          { value: 'Linear', label: 'Linear' },
          { value: 'Square', label: 'Square' },
          { value: 'Exponential', label: 'Exponential' }
        ]}
        onChange={(value) => updateNodeParameters(id, { loss: value })}
      />

      <ParamTopic name="Reproducibility" />
      <ParamCheckbox
        label="Fixed seed for random generator"
        checked={data.parameters.fixed_seed || false}
        onChange={(value) => updateNodeParameters(id, { fixed_seed: value.target.checked })}
      />

      {data.parameters.fixed_seed && (
        <>
          <ParamName name="Random Seed" />
          <ParamInputNumber
            min={0}
            max={100000}
            step={1}
            value={data.parameters.random_state || 0}
            onChange={(value) => updateNodeParameters(id, { random_state: value })}
          />
        </>
      )}
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-prediction-adaboost'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default AdaBoostNode;
