import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { ModalName } from '../NodeModal/NodeModalItem';
import BaseNode from './BaseNode';
import { ParamSelect } from '../NodeParameter/NodeParameter';

const ROCCurveNode = ({ id, data, selected }) => {
  const outputData = data?.outputs?.roc_curve?.display_value;
  const [selectedModel, setSelectedModel] = useState(outputData ? Object.keys(outputData)[0] : null);

  useEffect(() => {
    setSelectedModel(outputData ? Object.keys(outputData)[0] : null);
  }, [outputData]);

  const selectedModelData = outputData ? outputData[selectedModel] : null;

  const getROCChartOption = (rocData) => {
    if (!rocData) return {};

    const series = rocData.data.map(curve => ({
      name: `${curve.class} (AUC = ${curve.auc.toFixed(3)})`,
      type: 'line',
      data: curve.fpr.map((x, i) => [x, curve.tpr[i]]),
      smooth: true,
      symbol: 'none'
    }));

    return {
      title: {
        text: `ROC Curve - ${selectedModel}`,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `${params.seriesName}<br/>
                  FPR: ${params.data[0].toFixed(3)}<br/>
                  TPR: ${params.data[1].toFixed(3)}`;
        }
      },
      legend: {
        top: 40,
        data: series.map(s => s.name)
      },
      grid: {
        left: '5%',
        right: '7%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: 'False Positive Rate',
        min: 0,
        max: 1
      },
      yAxis: {
        type: 'value',
        name: 'True Positive Rate',
        min: 0,
        max: 1
      },
      series: [
        {
          name: 'Random',
          type: 'line',
          showSymbol: false,
          data: [[0, 0], [1, 1]],
          lineStyle: {
            type: 'dashed',
            color: '#999'
          },
          tooltip: {
            formatter: 'Random Classifier'
          }
        },
        ...series
      ]
    };
  };

  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="ROC Curve" />
      {selectedModelData && (
        <>
          <ParamSelect
            options={Object.keys(outputData).map((model) => ({ value: model, label: model }))}
            value={selectedModel}
            onChange={(value) => setSelectedModel(value)}
            style={{ maxWidth: '300px' }}
          />
          <div style={{ height: '400px', width: '100%', position: 'relative' }}>
            <ReactECharts
              option={getROCChartOption(selectedModelData)}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
              lazyUpdate={true}
              notMerge={true}
            />
          </div>
        </>
      )}
    </div>
  );

  const children = <></>;

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-evaluation-roc-curve'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default ROCCurveNode; 