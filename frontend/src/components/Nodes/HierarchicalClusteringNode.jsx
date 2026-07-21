import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import {
  ParamName,
  ParamInputNumber,
  ParamSelect,
  ParamTopic,
} from '../NodeParameter/NodeParameter';

const HierarchicalClusteringNode = ({ id, data }) => {
  const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const parameters = data.parameters || {};
  const dendrogramData = data?.outputs?.visualization?.display_value?.dendrogram;
  const clusterColors = data?.outputs?.visualization?.display_value?.cluster_colors;
  const labels = data?.outputs?.visualization?.display_value?.labels || [];
  const columnData = getInputParameters(id, 'distance_matrix');
  console.log('columnData', columnData);
  const canColumnSelect = columnData && columnData.columns 

  const handleChange = (paramName, value) => {
    updateNodeParameters(id, {
      ...parameters,
      [paramName]: value,
    });
  };

  const chartOption = useMemo(() => {
    if (!dendrogramData || !dendrogramData.icoord || !dendrogramData.dcoord) {
      return null;
    }
    return generateEChartsOption(dendrogramData, clusterColors, labels);
  }, [dendrogramData, clusterColors, labels]);

  const modalContent = (
    <div className="max-w-2xl">
      <div style={{ height: '600px', border: '1px solid #ccc', marginBottom: '1rem' }}>
        {chartOption ? (
          <ReactECharts option={chartOption} style={{ height: '100%' }} />
        ) : (
          <p>No dendrogram data available.</p>
        )}
      </div>
    </div>
  );

  const children = (
    <div className="flex flex-col mt-2">
      <ParamTopic name="Linkage Method" />
      <ParamSelect
        value={parameters.linkage || 'ward'}
        options={[
          { value: 'ward', label: 'Ward' },
          { value: 'single', label: 'Single' },
          { value: 'complete', label: 'Complete' },
          { value: 'average', label: 'Average' },
        ]}
        onChange={(value) => handleChange('linkage', value)}
      />
      <ParamTopic name="Annotations" />
      <ParamSelect
        value={parameters.annotation_column || ''}
        options={[{ value: '', label: 'Values' }, ...(canColumnSelect ? columnData.columns.map((col) => ({ value: col, label: col })) : [])]}
        onChange={(value) => handleChange('annotation_column', value)}
      />
      <ParamTopic name="Clustering Cut" />
      <ParamName name="Max Depth" />
      <ParamInputNumber
        value={parameters.max_depth || null}
        min={1}
        max={50}
        onChange={(value) => handleChange('max_depth', value)}
      />
      {/* <ParamName name="Height Ratio (0-1)" />
      <ParamInputNumber
        value={parameters.height_ratio || 0.5}
        min={0.01}
        max={1.0}
        step={0.01}
        onChange={(value) => handleChange('height_ratio', value)}
      />
      <ParamName name="Top N Clusters" />
      <ParamInputNumber
        value={parameters.top_n || null}
        min={1}
        max={20}
        onChange={(value) => handleChange('top_n', value)}
      /> */}
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type="node-unsupervised-hierarchical-clustering"
      parameters={parameters}
      children={children}
      modalContent={modalContent}
    />
  );
};

function generateEChartsOption(dendrogram, clusterColors = [], labels = []) {
  if (!dendrogram || !dendrogram.icoord || !dendrogram.dcoord) {
    return { series: [] };
  }

  const seriesData = [];
  const labelSeries = [];

  for (let i = 0; i < dendrogram.icoord.length; i++) {
    const x = dendrogram.icoord[i];
    const y = dendrogram.dcoord[i];
    const color = colorFromCluster(clusterColors[i] || 0);

    const segments = [
      [[x[0], y[0]], [x[1], y[1]]],
      [[x[1], y[1]], [x[2], y[2]]],
      [[x[2], y[2]], [x[3], y[3]]],
    ];

    segments.forEach(([start, end]) => {
      seriesData.push({
        type: 'line',
        data: [start, end],
        lineStyle: { color },
        tooltip: {
          valueFormatter: (val) => val.toFixed(2),
        },
      });
    });
  }

  const labelIndexMap = new Map();
  labels.forEach((label, i) => {
    const xPos = 5 + i * 10;
    labelIndexMap.set(xPos, label);
  });

  const used = new Set();
  for (let i = 0; i < dendrogram.icoord.length; i++) {
    const x = dendrogram.icoord[i];
    const y = dendrogram.dcoord[i];
    for (let j = 0; j < 4; j++) {
      if (y[j] === 0) {
        const xCoord = x[j];
        if (!used.has(xCoord)) {
          used.add(xCoord);
          const label = labelIndexMap.get(xCoord);
          if (label) {
            labelSeries.push({
              type: 'scatter',
              data: [[xCoord, 0]],
              symbolSize: 1,
              label: {
                show: true,
                formatter: label,
                position: 'bottom',
                fontSize: 10,
                rotate: 45,
                color: '#000',
              },
            });
          }
        }
      }
    }
  }

  return {
    animation: false,
    xAxis: {
      type: 'value',
      axisLabel: { show: false },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLabel: { show: true },
      splitLine: { show: false },
    },
    grid: {
      top: 30,
      bottom: 80,
      left: 50,
      right: 20,
    },
    dataZoom: [
      {
        type: 'inside',
        xAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'inside',
        yAxisIndex: 0,
        filterMode: 'none',
      },
      {
        type: 'slider',
        xAxisIndex: 0,
        height: 20,
        bottom: 0,
      },
    ],
    series: [...seriesData, ...labelSeries],
    tooltip: {
      show: true,
      trigger: 'item',
    },
  };
}

function colorFromCluster(cluster) {
  const palette = [
    '#1f77b4', '#ff7f0e', '#2ca02c',
    '#d62728', '#9467bd', '#8c564b',
    '#e377c2', '#7f7f7f', '#bcbd22', '#17becf',
  ];
  return palette[(cluster - 1) % palette.length] || '#888';
}

export default HierarchicalClusteringNode;
