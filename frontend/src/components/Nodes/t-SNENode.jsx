import React from 'react';
import ReactECharts from 'echarts-for-react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamSelect, ParamName, ParamCheckbox, ParamMultiSelect } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';

const TSNENode = ({ id, data, selected }) => {
    const outputData = data?.outputs?.transformed_data?.display_value;

    const prepareTSNEPlotData = (data) => {
        if (!data || !Array.isArray(data)) return { points: [], labels: [], colors: [] };

        return {
            points: data.map((point) => ({
                value: [parseFloat(point["t-SNE 1"]), parseFloat(point["t-SNE 2"])],
                label: point.Label || "Unknown"
            })),
            labels: [...new Set(data.map(point => point.Label || 'Unknown'))]
        };
    };

    const { points, labels } = prepareTSNEPlotData(outputData?.data);

    const modalContent = (
        <div className="max-w-2xl">
            <ModalName name="t-SNE Visualization" />
            <ReactECharts
                option={{
                    title: {
                        text: 't-SNE Projection',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    xAxis: {
                        type: 'value',
                        name: 't-SNE 1',
                        nameLocation: 'middle',
                        nameGap: 25
                    },
                    yAxis: {
                        type: 'value',
                        name: 't-SNE 2',
                        nameLocation: 'middle',
                        nameGap: 25
                    },
                    series: labels.map((label, index) => ({
                        name: label,
                        type: 'scatter',
                        data: points
                            .filter(p => p.label === label)
                            .map(p => p.value),
                        symbolSize: 8,
                        itemStyle: {
                            color: ['#5470c6', '#91cc75', '#fac858', '#ee6666', '#73c0de'][index % 5]
                        }
                    }))
                }}
                style={{ height: '500px', width: '100%' }}
            />
        </div>
    );

    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData?.metadata?.columns;

    const children = (
        <div className="flex flex-col mt-2">
            {/* Feature Selection */}
            <ParamName name="Features" />
            <ParamMultiSelect
                value={Array.isArray(data.parameters.features) ? data.parameters.features : []}
                options={canColumnSelect ? columnData.metadata.columns.map(col => ({ value: col, label: col })) : []}
                onChange={(value) => updateNodeParameters(id, { features: value })}
                disabled={!canColumnSelect}
            />

            {/* Color Selection */}
            <ParamName name="Color" />
            <ParamSelect
                value={data.parameters.color_column || ''}
                options={[{ value: '', label: 'None' }, ...(canColumnSelect ? columnData.metadata.columns.map(col => ({ value: col, label: col })) : [])]}
                onChange={(value) => updateNodeParameters(id, { color_column: value })}
                disabled={!canColumnSelect}
            />

            {/* Preprocessing */}
            <ParamName name="Preprocessing" />
            <ParamCheckbox
                label="Normalize Data"
                checked={data.parameters.normalize ?? false}
                onChange={(value) => updateNodeParameters(id, { normalize: value })}
            />
            <ParamCheckbox
                label="Apply PCA Preprocessing"
                checked={data.parameters.applyPCA ?? false}
                onChange={(value) => updateNodeParameters(id, { applyPCA: value })}
            />
            {data.parameters.applyPCA && (
                <>
                    <ParamName name="PCA Components" />
                    <ParamInputNumber
                        value={data.parameters.pcaComponents ?? 20}
                        onChange={(value) => updateNodeParameters(id, { pcaComponents: value })}
                        min={2}
                        max={100}
                        step={1}
                    />
                </>
            )}

            {/* t-SNE Parameters */}
            <ParamName name="Initialization" />
            <ParamSelect
                value={data.parameters.init || 'PCA'}
                options={[
                    { value: 'PCA', label: 'PCA' },
                    { value: 'Spectral', label: 'Spectral' }
                ]}
                onChange={(value) => updateNodeParameters(id, { init: value })}
            />

            <ParamName name="Distance Metric" />
            <ParamSelect
                value={data.parameters.metric || 'euclidean'}
                options={[
                    { value: 'euclidean', label: 'Euclidean' },
                    { value: 'manhattan', label: 'Manhattan' },
                    { value: 'cosine', label: 'Cosine' }
                ]}
                onChange={(value) => updateNodeParameters(id, { metric: value })}
            />

            <ParamName name="Perplexity" />
            <ParamInputNumber
                value={data.parameters.perplexity ?? 30}
                onChange={(value) => updateNodeParameters(id, { perplexity: value })}
                min={5}
                max={50}
                step={1}
            />

            <ParamCheckbox
                label="Preserve Global Structure"
                checked={data.parameters.globalStructure ?? false}
                onChange={(value) => updateNodeParameters(id, { globalStructure: value })}
            />

            <ParamName name="Exaggeration" />
            <ParamInputNumber
                value={data.parameters.exaggeration ?? 1.0}
                onChange={(value) => updateNodeParameters(id, { exaggeration: value })}
                min={0.1}
                max={10.0}
                step={0.1}
            />
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-unsupervised-tsne'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default TSNENode;
