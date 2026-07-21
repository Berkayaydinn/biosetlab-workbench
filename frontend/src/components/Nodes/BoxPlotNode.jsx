import React from 'react';
import ReactECharts from 'echarts-for-react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';

const BoxPlotNode = ({ id, data, selected }) => {
  const outputData = data?.outputs?.visualization?.display_value;

  const prepareBoxPlotData = (data) => {
    if (!data) return { boxData: [], outliers: [], categories: [] };
    
    // Prepare box plot data directly since we can't use transform
    const boxData = data.map(item => [
      parseFloat(item.min).toFixed(4),
      parseFloat(item.q1).toFixed(4),
      parseFloat(item.median).toFixed(4),
      parseFloat(item.q3).toFixed(4),
      parseFloat(item.max).toFixed(4)
    ]);

    const outliers = data.map((item, idx) => 
      item.outliers.map(value => [idx, parseFloat(value)])
    ).flat();

    return {
      boxData,
      outliers,
      categories: data.map(item => item.name)
    };
  };

  const { boxData, outliers, categories } = prepareBoxPlotData(outputData?.data);

  const modalContent = (
    <div className="max-w-2xl">
      <ModalName name="Visualization" />
      <ReactECharts
        option={{
          title: {
            text: `Distribution of ${outputData?.metadata?.y || 'Values'} by ${outputData?.metadata?.x || 'Group'}`,
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            confine: true
          },
          grid: {
            left: '15%',
            right: '15%',
            top: '10%',
            bottom: '20%'
          },
          yAxis: {
            type: 'value',
            name: outputData?.metadata?.x || 'Values',
            nameLocation: 'middle',
            nameGap: 45,
            splitArea: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          xAxis: {
            type: 'category',
            data: categories,
            name: outputData?.metadata?.y || '',
            nameLocation: 'middle',
            nameGap: 60,
            position: 'bottom',
            inverse: true,
            axisLabel: {
              inside: false,
              align: 'right',
              margin: 8,
              rotate: 45
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: true
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          dataZoom: [
            {
              type: 'inside',
              xAxisIndex: 0
            },
            {
              type: 'slider',
              xAxisIndex: 0,
              height: 20,
              bottom: 5,
              borderColor: 'transparent',
              backgroundColor: '#e2e2e2',
              fillerColor: '#d3d3d3',
              handleStyle: {
                color: '#7d7d7d'
              }
            }
          ],
          series: [
            {
              name: outputData?.metadata?.x || 'Values',
              type: 'boxplot',
              data: boxData,
              layout: 'vertical',
              itemStyle: {
                borderWidth: 2,
                borderColor: '#5470c6',
                color: '#a8c5f2'
              },
              boxWidth: [0, 50],
              emphasis: {
                itemStyle: {
                  borderWidth: 3,
                  borderColor: '#5470c6',
                  shadowBlur: 5,
                  shadowColor: 'rgba(0,0,0,0.1)'
                }
              }
            },
            {
              name: 'outliers',
              type: 'scatter',
              data: outliers,
              symbolSize: 4,
              itemStyle: {
                color: '#ee6666',
                borderColor: '#ee6666'
              }
            }
          ]
        }}
        style={{ height: '500px', width: '100%' }}
      />
    </div>
  );

  const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
  const columnData = getInputParameters(id, 'data');
  const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

  const children = (
    <div className="flex flex-col mt-2">
      <ParamName name="Value Column (X-axis)" />
      <ParamSelect
        value={data.parameters.x || ''}
        options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
        onChange={(value) => updateNodeParameters(id, { x: value })}
        disabled={!canColumnSelect}
        disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
      />
      <ParamName name="Group By (Y-axis)" />
      <ParamSelect
        value={data.parameters.y || ''}
        options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
        onChange={(value) => updateNodeParameters(id, { y: value })}
        disabled={!canColumnSelect}
        disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
      />
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-visualization-box-plot'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    >
    </BaseNode>
  );
};

export default BoxPlotNode; 