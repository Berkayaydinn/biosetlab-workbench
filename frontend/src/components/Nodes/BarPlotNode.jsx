import React, { useEffect, useState } from 'react';

import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';
import { ModalChart } from '../NodeModal/NodeModalItem'; // Import ModalChart

const BarPlotNode = ({ id, data, selected }) => {
    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

    const outputData = data?.outputs?.visualization?.display_value;
    const modalContent = (
        <div className="max-w-2xl">
            <ModalName name="Visualization" />
            <ModalChart
                type="bar"
                title={`${outputData?.metadata?.y || 'Y'} - ${outputData?.metadata?.x || 'X'}`}
                xData={outputData?.data?.map((item) => item.name) || []}
                yData={outputData?.data?.map((item) => item.value) || []}
                xAxisName={outputData?.metadata?.x || 'Features'}
                yAxisName={outputData?.metadata?.y || 'Values'}
                xAxisType='category'
                yAxisType='value'
                series={[
                    {
                        data: outputData?.data?.map((item) => item.value) || [],
                        type: 'bar',
                    }
                ]}
            />
        </div>
    );

    const children = (
        <div className="flex flex-col mt-2">
            <>
                <ParamName name="X Axis Column" />
                <ParamSelect
                    value={data.parameters.x || ''}
                    options={(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])}
                    onChange={(value) => updateNodeParameters(id, { x: value })}
                    disabled={!canColumnSelect}
                    disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
                />
                <ParamName name="Y Axis Column" />
                <ParamSelect
                    value={data.parameters.y || ''}
                    options={[{ value: '', label: 'Values' }, ...(canColumnSelect ? columnData.metadata.columns.map((col) => ({ value: col, label: col })) : [])]}
                    onChange={(value) => updateNodeParameters(id, { y: value })}
                    disabled={!canColumnSelect}
                    disabledText={!canColumnSelect ? 'Run the previous node to enable' : 'Select a column'}
                />
            </>
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-visualization-bar-plot'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        >
        </BaseNode>
    );
};

export default BarPlotNode;