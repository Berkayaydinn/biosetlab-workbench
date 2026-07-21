import React from 'react';
import ReactECharts from 'echarts-for-react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamSelect, ParamName, ParamMultiSelect } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';

const CorrelationsNode = ({ id, data, selected }) => {
    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData && columnData.metadata && columnData.metadata.features;
    const outputData = data?.outputs?.correlations?.display_value;

    // Process correlation data for visualization
    const prepareCorrelationData = (data) => {
        if (!data || !Array.isArray(data)) return { values: [], labels: [] };

        return {
            values: data.map(d => ({
                name: `${d.feature1} : ${d.feature2}`,
                value: parseFloat(d.value) // Keep as float, no `.toFixed(3)`
            })),
            labels: data.map(d => `${d.feature1} : ${d.feature2}`)
        };
    };

    const { values, labels } = prepareCorrelationData(outputData?.data);

    // ECharts option for displaying correlations
    const chartOptions = {
        title: {
            text: 'Feature Correlations',
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: (params) => {
                if (params.length === 0) return "No Data";
                const item = params[0];
                return `${item.name}: ${item.value.toFixed(3)}`;
            }
        },
        xAxis: {
            type: 'value',
            min: -1,
            max: 1,
            axisLabel: { color: '#fff' }
        },
        yAxis: {
            type: 'category',
            data: labels,
            axisLabel: {
                color: '#fff'
            }
        },
        series: [
            {
                name: 'Correlation',
                type: 'bar',
                data: values.map(d => ({
                    value: d.value,
                    itemStyle: { color: d.value >= 0 ? '#A2FF00' : '#0091F7' } // Green for +, Blue for -
                })),
                barWidth: '50%'
            }
        ]
    };

    const modalContent = (
        <div className="max-w-2xl">
            <ModalName name="Correlations" />
            {values.length > 0 ? (
                <ReactECharts option={chartOptions} style={{ height: '500px', width: '100%' }} />
            ) : (
                <div className="text-center text-gray-500">No Correlations Found</div>
            )}
        </div>
    );

    const children = (
        <div className="flex flex-col mt-2">
            {canColumnSelect ? (
                <>
                    {/* Feature Selection */}
                    <ParamName name="Features" />
                    <ParamMultiSelect 
                        value={data.parameters.features || []}
                        options={columnData.metadata.features.map((col) => ({ value: col, label: col }))}
                        onChange={(value) => updateNodeParameters(id, { features: value })}
                    />

                    {/* Correlation Type Selection */}
                    <ParamName name="Correlation Type" />
                    <ParamSelect
                        value={data.parameters.correlationType || 'pearson'}
                        options={[
                            { value: 'pearson', label: 'Pearson Correlation' },
                            { value: 'spearman', label: 'Spearman Correlation' }
                        ]}
                        onChange={(value) => updateNodeParameters(id, { correlationType: value })}
                    />

                    {/* Target Variable Selection */}
                    <ParamName name="Target Variable" />
                    <ParamSelect
                        value={data.parameters.target || 'all'}
                        options={[
                            { value: 'all', label: 'All Combinations' },
                            ...columnData.metadata.features.map(col => ({ value: col, label: col }))
                        ]}
                        onChange={(value) => updateNodeParameters(id, { target: value })}
                    />
                </>
            ) : (
                <>Please connect a data node to this node.</>
            )}
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-unsupervised-correlations'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default CorrelationsNode;
