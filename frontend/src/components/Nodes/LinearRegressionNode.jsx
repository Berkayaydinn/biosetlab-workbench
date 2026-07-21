import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect, ParamCheckbox } from '../NodeParameter/NodeParameter';

const LinearRegressionNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const modalContent = (
    <div className="max-w-2xl">
      {/* Add content to display logistic regression results */}
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
        <>
          <ParamName name="Fit Intercept" />
          <ParamCheckbox 
            value={data.parameters.fitIntercept || true}
            label="Fit Intercept"
            onChange={(value) => updateNodeParameters(id, { features: value.target.checked })}
            checked={data.parameters.fitIntercept}
            
          />
           <ParamName name="Regularization" />
          <ParamSelect
            value={data.parameters.regulazition || ''}
            options={[
                { value: 'l1', label: 'Lasso Regression (L1)' },
                { value: 'l2', label: 'Ridge Regression (L2)' },
                { value: 'elasticnet', label: 'Elastic net' },
                { value: 'none', label: 'No Regulazition' },   
            ]}
            onChange={(value) => updateNodeParameters(id, { regulazition: value })}
          />
          { data.parameters.regulazition === 'l1' || data.parameters.regulazition === 'l2' || data.parameters.regulazition === 'elasticnet' && (
            <>
          <ParamName name="Strength" />
          <ParamInputNumber
            value={data.parameters.C || 0.0}
            onChange={(value) => updateNodeParameters(id, { C: value })}
          />
          </>
          )}
        { data.parameters.regulazition === 'elasticnet' && (
            <>
          <ParamName name="Elastic net Mixing" />
          <ParamInputNumber
            value={data.parameters.elasticnetMixing || 0.5}
            onChange={(value) => updateNodeParameters(id, { elasticnetMixing: value })}
          />
          </>
          )}
        </>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-prediction-linear-regression'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
      
    </BaseNode>
  );
};

export default LinearRegressionNode;