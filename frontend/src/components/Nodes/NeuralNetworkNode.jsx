import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamSelect, ParamName, ParamInputNumber, ParamMultiSelect, ParamCheckbox } from '../NodeParameter/NodeParameter';

const NeuralNetworkNode = ({ id, data, selected }) => {
    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData?.metadata?.columns;

    const children = (
        <div className="flex flex-col mt-2">
            {/* Hidden Layers */}
            <ParamName name="Hidden Layers" />
            <ParamMultiSelect
                value={Array.isArray(data.parameters.hiddenLayers) ? data.parameters.hiddenLayers : [100]}
                options={[8, 16, 32, 64, 128, 256, 512, 100].map(size => ({ value: size, label: `${size} Neurons` }))}
                onChange={(value) => updateNodeParameters(id, { hiddenLayers: value })}
            />

            {/* Activation Function */}
            <ParamName name="Activation" />
            <ParamSelect
                value={data.parameters.activation || 'relu'}
                options={[
                    { value: 'relu', label: 'ReLU' },
                    { value: 'tanh', label: 'Tanh' },
                    { value: 'logistic', label: 'Logistic (Sigmoid)' },
                    { value: 'identity', label: 'Identity' }
                ]}
                onChange={(value) => updateNodeParameters(id, { activation: value })}
            />

            {/* Solver */}
            <ParamName name="Solver" />
            <ParamSelect
                value={data.parameters.solver || 'adam'}
                options={[
                    { value: 'adam', label: 'Adam' },
                    { value: 'sgd', label: 'SGD' },
                    { value: 'lbfgs', label: 'L-BFGS-B' }
                ]}
                onChange={(value) => updateNodeParameters(id, { solver: value })}
            />

            {/* Regularization (α) */}
            <ParamName name="Regularization (α)" />
            <ParamInputNumber
                value={data.parameters.regularization ?? 650}
                onChange={(value) => updateNodeParameters(id, { regularization: value })}
                min={0}
                max={1000}
                step={
                    (data.parameters.regularization ?? 0) < 1 ? 0.001 : 
                    (data.parameters.regularization ?? 0) < 10 ? 1 : 
                    5
                }
            />

            {/* Max Iterations */}
            <ParamName name="Max Iterations" />
            <ParamInputNumber
                value={data.parameters.maxIterations ?? 1000000}
                onChange={(value) => updateNodeParameters(id, { maxIterations: value })}
                min={0}
                max={1000000}
                step={
                    (data.parameters.maxIterations ?? 0) < 1000 ? 10 :
                    (data.parameters.maxIterations ?? 0) < 10000 ? 100 :
                    1000
                }
            />

            {/* Replicable Training */}
            <ParamCheckbox
                label="Replicable Training"
                checked={data.parameters.replicable ?? false}
                onChange={(value) => updateNodeParameters(id, { replicable: value })}
            />
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-supervised-neural-network'}
            parameters={data.parameters}
            children={children}
        />
    );
};

export default NeuralNetworkNode;
