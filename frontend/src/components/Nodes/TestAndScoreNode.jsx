import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { ParamInputNumber, ParamName, ParamSegmented, ParamCheckbox, ParamSelect, ParamSliderWithInput } from '../NodeParameter/NodeParameter';

  
const TestAndScoreNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  const outputData = data?.outputs?.evaluation_results?.display_value;
  const rows = outputData ? Object.entries(outputData) : [];

    const formatValue = (value) => {
        if (typeof value === "number") {
        return value.toFixed(3); // Sayıyı üç basamağa yuvarlar
        }
        return value; // Sayı değilse olduğu gibi döndür
    };
  
    // Ant Design için uygun formatta veriler
    const dataSource = rows.map(([key, row], index) => ({
      key, // Benzersiz anahtar
      model: key, // Model adı
      accuracy: formatValue(row.scores?.accuracy),
      precision: formatValue(row.scores?.precision),
      recall: formatValue(row.scores?.recall),
      f1: formatValue(row.scores?.f1),
      nmse: formatValue(row.scores?.nmse),
      r2: formatValue(row.scores?.r2),
    }));

  const outputDataPred = data?.outputs?.predictions?.display_value;
  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="Evaluation Results" />
      <ModalTable
        data={dataSource}
        columns={['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'NMSE', 'R2'].map((column) => ({ title: column, dataIndex: column.toLowerCase() }))}
        title="Evaluation Results"
        nRows={rows.length}
        details={false}
      />
      <ModalName name="Predictions" />
      <ModalTable
        data={(outputDataPred?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={(outputDataPred?.metadata || {}).columns?.map((column) => ({ title: column, dataIndex: column })) || []}
        title={(outputDataPred?.metadata || {}).name || 'Unknown'}
        nRows={(outputDataPred?.metadata || {}).n_rows || 0}
      />
    </div>
  );
  
  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="Evaluation Type" />
      <ParamSegmented
          options={[
              { value: 'random_sampling', label: 'Random Sampling' },
              { value: 'cross_validation', label: 'Cross Validation' },
          ]}
          value={data.parameters.evaluation_type}
          onChange={(value) => updateNodeParameters(id, { evaluation_type: value })}
      />

      {data.parameters.evaluation_type === 'cross_validation' && (
          <>
              <ParamName name="Number of folds" />
              <ParamSelect
                  value={data.parameters.n_splits}
                  options={[2, 3, 5, 10, 20].map((value) => ({ value, label: value }))}
                  onChange={(value) => updateNodeParameters(id, { n_splits: value })}
              />
              <ParamName name="Stratified" />
              <ParamCheckbox
                  label="Stratified"
                  checked={data.parameters.stratified}
                  onChange={(value) => updateNodeParameters(id, { stratified: value.target.checked })}
              />
          </>
      )}

      {data.parameters.evaluation_type === 'random_sampling' && (
          <>
              <ParamName name="Train Size" />
              <ParamSliderWithInput
                  value={data.parameters.train_size}
                  onChange={(value) => updateNodeParameters(id, { train_size: value })}
                  min={0.01}
                  max={0.99}
                  step={0.01}
              />
              <ParamName name="Repeat" />
              <ParamInputNumber
                  value={data.parameters.repeat}
                  onChange={(value) => updateNodeParameters(id, { repeat: value })}
                  step={1}
                  min={2}
                  max={100}
              />
              <ParamName name="Stratified" />
              <ParamCheckbox
                  label="Stratified"
                  checked={data.parameters.stratified}
                  onChange={(value) => updateNodeParameters(id, { stratified: value.target.checked })}
              />
          </>
      )}
  </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-evaluation-test-and-score'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    > 
    </BaseNode>
  );
};

export default TestAndScoreNode;