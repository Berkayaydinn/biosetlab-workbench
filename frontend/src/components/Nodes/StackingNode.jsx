import BaseNode from './BaseNode';

const StackingNode = ({ id, data, selected }) => {
  const modalContent = (
    <div className="max-w-2xl">
      <p className="text-sm text-gray-500">
        This node takes multiple base models and combines them into a single ensemble using stacking.
      </p>
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2 text-xs text-gray-500 italic">
      Combines base models using meta-learning (stacking).
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type="node-prediction-stacking"
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default StackingNode;
