import BaseNode from './BaseNode';

import { usePlaygroundStore } from '../../store/playgroundStore';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { ParamInputNumber, ParamName, ParamSegmented, ParamCheckbox, ParamSelect, ParamSliderWithInput } from '../NodeParameter/NodeParameter';

  
const PredictionsNode = ({ id, data, selected }) => {
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
      <ModalName name="Predictions" />
      <ModalTable
        data={(outputDataPred?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={(outputDataPred?.metadata || {}).columns?.map((column) => ({ title: column, dataIndex: column })) || []}
        title={(outputDataPred?.metadata || {}).name || 'Unknown'}
        nRows={(outputDataPred?.metadata || {}).n_rows || 0}
      />
      <ModalName name="Evaluation Results" />
      <ModalTable
        data={dataSource}
        columns={['Model', 'Accuracy', 'Precision', 'Recall', 'F1', 'NMSE', 'R2'].map((column) => ({ title: column, dataIndex: column.toLowerCase() }))}
        title="Evaluation Results"
        nRows={rows.length}
        details={false}
      />
    </div>
  );
  
  const children = (
    <div className="flex flex-col mt-2">
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-evaluation-predictions'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    > 
    </BaseNode>
  );
};

export default PredictionsNode;