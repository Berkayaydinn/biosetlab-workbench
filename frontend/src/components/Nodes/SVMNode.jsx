import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';

const SVMNode = ({ id, data, selected }) => {
    const { updateNodeParameters } = usePlaygroundStore();

    const modalContent = <div className="max-w-2xl">{/* Add content to display SVM results */}</div>;

    const { svmType = 'SVM', kernel = 'rbf' } = data.parameters;

    const children = (
        <div className="flex flex-col mt-2">
            {/* SVM Type */}
            <ParamName name="SVM Type" />
            <ParamSelect
                value={svmType}
                options={[
                    { value: 'SVM', label: 'SVM' },
                    { value: 'v-SVM', label: 'v-SVM' },
                ]}
                onChange={(value) => updateNodeParameters(id, { svmType: value })}
            />

            {/* SVM-Specific Parameters */}
            {svmType === 'SVM' && (
                <>
                    <ParamName name="Cost (C)" />
                    <ParamInputNumber
                        value={data.parameters.C || 1.0}
                        onChange={(value) => updateNodeParameters(id, { C: value })}
                        min={0.0001}
                        max={1000}
                        step={0.01}
                    />
                    <ParamName name="Regression Loss Epsilon (ε)" />
                    <ParamInputNumber
                        value={data.parameters.epsilon || 0.1}
                        onChange={(value) => updateNodeParameters(id, { epsilon: value })}
                        min={0.0}
                        max={10.0}
                        step={0.01}
                    />
                </>
            )}
            {svmType === 'v-SVM' && (
                <>
                    <ParamName name="Cost (C)" />
                    <ParamInputNumber
                        value={data.parameters.C || 1.0}
                        onChange={(value) => updateNodeParameters(id, { C: value })}
                        min={0.0001}
                        max={1000}
                        step={0.01}
                    />
                    <ParamName name="Complexity Bound (ν)" />
                    <ParamInputNumber
                        value={data.parameters.v || 0.5}
                        onChange={(value) => updateNodeParameters(id, { v: value })}
                        min={0.05}
                        max={1.00}
                        step={0.05}
                    />
                </>
            )}

            {/* Kernel Selection */}
            <ParamName name="Kernel" />
            <ParamSelect
                value={kernel}
                options={[
                    { value: 'linear', label: 'Linear' },
                    { value: 'poly', label: 'Polynomial' },
                    { value: 'rbf', label: 'RBF' },
                    { value: 'sigmoid', label: 'Sigmoid' },
                ]}
                onChange={(value) => updateNodeParameters(id, { kernel: value })}
            />

            {/* Common Kernel Parameters (Gamma for rbf, poly, sigmoid) */}
            {['poly', 'rbf', 'sigmoid'].includes(kernel) && (
                <>
                    <ParamName name="Gamma (γ)" />
                    <ParamInputNumber
                        value={data.parameters.gamma || 0.1}
                        onChange={(value) => updateNodeParameters(id, { gamma: value })}
                        min={0.01}
                        max={10.00}
                        step={0.01}
                    />
                </>
            )}

            {/* Polynomial Kernel Parameters */}
            {kernel === 'poly' && (
                <>
                    <ParamName name="Degree (d)" />
                    <ParamInputNumber
                        value={data.parameters.degree || 3}
                        onChange={(value) => updateNodeParameters(id, { degree: value })}
                        min={1}
                        max={10}
                        step={1}
                    />
                    <ParamName name="Coef0 (c)" />
                    <ParamInputNumber
                        value={data.parameters.coef0 || 1.0}
                        onChange={(value) => updateNodeParameters(id, { coef0: value })}
                        min={0.0}
                        max={10.0}
                        step={0.01}
                    />
                </>
            )}

            {/* Sigmoid Kernel Parameter */}
            {kernel === 'sigmoid' && (
                <>
                    <ParamName name="Coef0 (c)" />
                    <ParamInputNumber
                        value={data.parameters.coef0 || 1.0}
                        onChange={(value) => updateNodeParameters(id, { coef0: value })}
                        min={0.0}
                        max={10.0}
                        step={0.01}
                    />
                </>
            )}

            {/* Optimization Parameters */}
            <ParamName name="Numerical Tolerance (tol)" />
            <ParamInputNumber
                value={data.parameters.tol || 0.001}
                onChange={(value) => updateNodeParameters(id, { tol: value })}
                min={0.0001}
                max={1.0000}
                step={0.0001}
            />
            <ParamName name="Iteration Limit" />
            <ParamInputNumber
                value={data.parameters.max_iter || 100}
                onChange={(value) => updateNodeParameters(id, { max_iter: value })}
                min={5}
                max={10000}
                step={50}
            />
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-prediction-svm'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default SVMNode;
