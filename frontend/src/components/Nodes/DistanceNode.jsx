import React from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import {
  ParamSegmented,
  ParamSelect,
  ParamTopic
} from '../NodeParameter/NodeParameter';

const DistanceNode = ({ id, data, selected }) => {
  const { updateNodeParameters } = usePlaygroundStore();
  const parameters = data.parameters || {};

  const handleChange = (paramName, value) => {
    updateNodeParameters(id, {
      ...parameters,
      [paramName]: value,
    });
  };

  const children = (
    <div className="flex flex-col mt-2">
      <ParamTopic name="Compare" />
      <ParamSegmented
        value={parameters.compare || 'rows'}
        options={[
          { value: 'rows', label: 'Rows' },
          { value: 'columns', label: 'Columns' },
        ]}
        onChange={(value) => handleChange('compare', value)}
      />

      <ParamTopic name="Distance Metric" />
      <ParamSelect
        value={parameters.metric || 'euclidean_normalized'}
        options={[
          { value: 'euclidean_normalized', label: 'Euclidean (normalized)' },
          { value: 'euclidean', label: 'Euclidean' },
          { value: 'manhattan_normalized', label: 'Manhattan (normalized)' },
          { value: 'manhattan', label: 'Manhattan' },
          { value: 'mahalanobis', label: 'Mahalanobis' },
          { value: 'hamming', label: 'Hamming' },
          { value: 'cosine', label: 'Cosine' },
          { value: 'pearson', label: 'Pearson' },
          { value: 'pearson_absolute', label: 'Pearson (absolute)' },
          { value: 'spearman', label: 'Spearman' },
          { value: 'spearman_absolute', label: 'Spearman (absolute)' },
          { value: 'jaccard', label: 'Jaccard' },
        ]}
        onChange={(value) => handleChange('metric', value)}
      />
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type="node-unsupervised-distance"
      parameters={parameters}
      children={children}
    />
  );
};

export default DistanceNode;
