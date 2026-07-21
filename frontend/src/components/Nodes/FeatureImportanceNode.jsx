import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalChart } from '../NodeModal/NodeModalItem';
import { ModalName } from '../NodeModal/NodeModalItem';

const FeatureImportanceNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  
  const outputData = data?.outputs?.importance?.display_value;
  const modalContent = (
      <div className="max-w-2xl">
        <ModalName name="Visualization" />
        <ModalChart
          type="bar"
          yData={outputData?.data?.map((item) => item.name) || []}
          yAxisName={outputData?.metadata?.x || 'Feature'}
          yAxisType='category'
          xAxisName={outputData?.metadata?.y || 'Importance'}
          series={[
            {
              data: outputData?.data?.map((item) => item.value) || [],
              type: 'bar',
            }
          ]}
        />
      </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      <>
        <ParamName name="Score" />
        <ParamSelect
          value={data.parameters.score || 'roc_auc'}
          options={[
            { label: 'AUC', value: 'roc_auc' },
            { label: 'Accuracy', value: 'accuracy' },
            { label: 'F1', value: 'f1' },
            { label: 'Precision', value: 'precision' },
            { label: 'Recall', value: 'recall' },
            { label: 'MCC', value: 'matthews_corrcoef' },
            { label: 'Specificity', value: 'recall_spec' },
            { label: 'Log Loss', value: 'log_loss' },
            { label: 'R2', value: 'r2' },
            { label: 'Mean Squared Error', value: 'mse' },
            { label: 'Mean Absolute Error', value: 'mae' },
          ]}
          onChange={(value) => updateNodeParameters(id, { score: value })}
        />
        <ParamName name="Permutations" />
        <ParamInputNumber
          value={data.parameters.n_permutations || 5}
          onChange={(value) => updateNodeParameters(id, { n_permutations: value })}
          min={1}
          max={1000}
        />
      </>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-explain-feature-importance'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default FeatureImportanceNode; 