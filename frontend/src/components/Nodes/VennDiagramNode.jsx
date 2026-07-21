import React from 'react';
import ReactECharts from 'echarts-for-react';

import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamSelect, ParamName, ParamCheckbox } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';

const VennDiagramNode = ({ id, data, selected }) => {
    const { updateNodeParameters } = usePlaygroundStore();

    // Kullanıcı parametreleri
    const {
        comparisonMode = 'columns',
        intersection = 'auto',
        normalize = false,
        rowsMatching = 'instance_identity',
        outputDuplicates = false
    } = data.parameters;

    // Modal'daki grafik ayarları
    const modalContent = (
        <div className="max-w-2xl">
            <ModalName name="Venn Diagram" />
            <ReactECharts
                option={{
                    title: {
                        text: 'Venn Diagram',
                        left: 'center',
                        textStyle: { color: '#333' }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: (params) => {
                            // params.name, params.value ve params.data kullanılabilir.
                            // Örneğin: "A, B: 1" şeklinde gösterebiliriz.
                            const setNames = params.data.sets.join(', ');
                            return `${setNames}: ${params.value}`;
                        }
                    },
                    series: [
                        {
                            type: 'venn',
                            data: data.outputs?.venn_visualization?.display_value?.sets || [],
                            
                            label: {
                                show: true,
                                formatter: (params) => {
                                    // Etiket, set adlarını ve değeri gösterebilir.
                                    const setNames = params.data.sets.join(', ');
                                    return `${setNames}\nValue: ${params.value}`;
                                }
                            },
                            itemStyle: {
                                // Renk ve diğer stil ayarlarını isteğe bağlı ekleyebilirsiniz
                            }
                        }
                    ]
                }}
                style={{ height: '500px', width: '100%' }}
            />
        </div>
    );
    

    // Parameter panelı
    const children = (
        <div className="flex flex-col mt-2">
            <ParamName name="Comparison Mode" />
            <ParamSelect
                value={comparisonMode}
                options={[
                    { value: 'columns', label: 'Columns (features)' },
                    { value: 'rows', label: 'Rows (instances)' }
                ]}
                onChange={(value) => updateNodeParameters(id, { comparisonMode: value })}
            />

            {comparisonMode === 'rows' && (
                <>
                    <ParamName name="Row Matching" />
                    <ParamSelect
                        value={rowsMatching}
                        options={[
                            { value: 'instance_identity', label: 'Matched by instance identity' },
                            { value: 'some_other', label: 'Some Other Method' }
                        ]}
                        onChange={(value) => updateNodeParameters(id, { rowsMatching: value })}
                    />

                    <ParamName name="Output Duplicates" />
                    <ParamCheckbox
                        label="Show duplicate rows"
                        checked={outputDuplicates}
                        onChange={(value) => updateNodeParameters(id, { outputDuplicates: value })}
                    />
                </>
            )}

            <ParamName name="Intersection Mode" />
            <ParamSelect
                value={intersection}
                options={[
                    { value: 'auto', label: 'Auto Detect' },
                    { value: 'exact', label: 'Exact Matches Only' },
                    { value: 'partial', label: 'Allow Partial Matches' }
                ]}
                onChange={(value) => updateNodeParameters(id, { intersection: value })}
            />

            <ParamName name="Normalize Sizes" />
            <ParamCheckbox
                label="Normalize Overlapping Regions"
                checked={normalize}
                onChange={(value) => updateNodeParameters(id, { normalize: value })}
            />
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-visualization-venn-diagram'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default VennDiagramNode;
