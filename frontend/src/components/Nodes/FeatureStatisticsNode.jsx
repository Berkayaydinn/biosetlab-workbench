import BaseNode from './BaseNode';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';
import { createTableColumns } from './utils/ColumnBadges';

const FeatureStatisticsNode = ({ id, data, selected }) => {

  const formatNumericalData = (data) => {
    return data.map((column_dict) => {
      // Check values of dict to see if they are numerical
      for (const [key, value] of Object.entries(column_dict)) {
        if (typeof value === 'number') {
          column_dict[key] = parseFloat(value.toFixed(3));
        }
      }
      return column_dict;
    });
  }

  const outputData = data?.outputs?.feature_statistics?.display_value;
  
  const modalContent = (
    <>
      <ModalName name="Data" />
      <ModalTable
        data={formatNumericalData(outputData?.data || []).map((item, index) => ({ key: index, ...item }))}
        columns={createTableColumns((outputData?.metadata || {}).columns || [])}
        title={(outputData?.metadata || {}).name || 'Unknown'}
        nRows={(outputData?.metadata || {}).n_rows || 0}
      />
    </>
  );

  const children = (
    <div className="flex flex-col mt-2">
    </div>
  );

  return (
    <BaseNode 
    id={id} 
    parameters={data.parameters} 
    data={data} 
    type={"node-data-feature-statistics"}
    modalContent={modalContent}
    children={children}
    >
    </BaseNode>
  );
};

export default FeatureStatisticsNode;


