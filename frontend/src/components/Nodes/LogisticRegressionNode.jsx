import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';

const LogisticRegressionNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const modalContent = (
    <div className="max-w-2xl">
      {/* Add content to display logistic regression results */}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
        <>
          <ParamName name="Strength" />
          <ParamInputNumber
            value={data.parameters.C || 0.0}
            onChange={(value) => updateNodeParameters(id, { C: value })}
          />
          <ParamName name="Solver" />
          <ParamSelect
            value={data.parameters.solver || ''}
            options={[
              { value: 'newton-cg', label: 'Newton-CG' },
              { value: 'lbfgs', label: 'LBFGS' },
              { value: 'liblinear', label: 'Liblinear' },
              { value: 'newton-cholesky', label: 'Newton-Cholesky' },
              { value: 'sag', label: 'SAG' },
              { value: 'saga', label: 'SAGA' },
            ]}
            onChange={(value) => updateNodeParameters(id, { solver: value })}
          />
          <ParamName name="Penalty" />
          <ParamSelect
            value={data.parameters.penalty || ''}
            options={[
              { value: 'l1', label: 'L1' },
              { value: 'l2', label: 'L2' },
              { value: 'elasticnet', label: 'Elasticnet' },
              { value: 'none', label: 'None' },
            ]}
            onChange={(value) => updateNodeParameters(id, { penalty: value })}
          />
        </>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-prediction-logistic-regression'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
      
    </BaseNode>
  );
};

export default LogisticRegressionNode;