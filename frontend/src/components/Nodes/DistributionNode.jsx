import React from 'react';

import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect, ParamInputNumber } from '../NodeParameter/NodeParameter';
import { ModalName, ModalChart } from '../NodeModal/NodeModalItem';

const DistributionNode = ({ id, data, selected }) => {
    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

    const outputData = data?.outputs?.visualization?.display_value;
    const isStacked = outputData?.metadata?.type === 'stacked_bar';
    const numBins = outputData?.metadata?.num_bins || 0;

    const modalContent = (
        <div className="max-w-2xl">
            <ModalName name="Distribution" />
            <ModalChart
                type={isStacked ? 'stacked_bar' : 'bar'}
                title={`Distribution of ${outputData?.metadata?.x || 'Values'}${isStacked ? ' Grouped by ' + outputData?.metadata?.group_by : ''}${numBins > 0 ? ` (${numBins} bins)` : ''}`}
                xAxisName={outputData?.metadata?.x || 'Bins'}
                yAxisName={outputData?.metadata?.y || 'Frequency'}
                xAxisType="category"
                yAxisType="value"
                xData={isStacked ? outputData?.data : outputData?.data?.map((item) => item.name)}
                yData={!isStacked ? outputData?.data?.map((item) => item.value) : undefined}
                groups={isStacked ? outputData?.metadata?.groups : []}
            />
        </div>
    );

    const children = (
        <div className="flex flex-col mt-2">
            <ParamName name="Column" />
            <ParamSelect
                value={data.parameters.x || ''}
                options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
                onChange={(value) => updateNodeParameters(id, { x: value })}
                disabled={!canColumnSelect}
                disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
            />
            <ParamName name="Group By (Optional)" />
            <ParamSelect
                value={data.parameters.group_by || ''}
                options={[
                    { value: '', label: 'None' },
                    ...(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])
                ]}
                onChange={(value) => updateNodeParameters(id, { group_by: value })}
                disabled={!canColumnSelect}
                disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
            />
            <ParamName name="Bin Width" />
            <ParamInputNumber
                value={data.parameters.bin_width || 2}
                onChange={(value) => updateNodeParameters(id, { bin_width: value })}
                min={0.1}
                max={100}
                step={0.1}
            />
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type="node-visualization-distributions"
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default DistributionNode; 