import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamMultiSelect, ParamName, ParamSelect, ParamCheckbox } from '../NodeParameter/NodeParameter';

const KMeansNode = ({ id, data, selected }) => {
    const { getInputParameters, updateNodeParameters } = usePlaygroundStore();
    const columnData = getInputParameters(id, 'data');
    const canColumnSelect = columnData && columnData.metadata && columnData.metadata.columns;

    const children = (
        <div className="flex flex-col mt-2">
            {canColumnSelect ? (
                <>
                    {/* Features Selection */}
                    <ParamName name="Features" />
                    <ParamMultiSelect
                        value={data.parameters.features || []}
                        options={columnData.metadata.columns.map((col) => ({ value: col, label: col }))}
                        onChange={(value) => updateNodeParameters(id, { features: value })}
                    />

                    {/* Cluster Mode Selection */}
                    <ParamName name="Cluster Mode" />
                    <ParamSelect
                        value={data.parameters.clusterMode || 'fixed'}
                        options={[
                            { value: 'fixed', label: 'Fixed Number of Clusters' },
                            { value: 'range', label: 'Find Best k (Min to Max)' },
                        ]}
                        onChange={(value) => updateNodeParameters(id, { clusterMode: value })}
                    />

                    {/* Fixed Number of Clusters */}
                    {data.parameters.clusterMode === 'fixed' && (
                        <>
                            <ParamName name="Number of Clusters (k)" />
                            <ParamInputNumber
                                value={data.parameters.n_clusters || 3}
                                onChange={(value) => updateNodeParameters(id, { n_clusters: value })}
                                min={1}
                                max={100}
                                step={1}
                            />
                        </>
                    )}

                    {/* Range-based Cluster Selection */}
                    {data.parameters.clusterMode === 'range' && (
                        <>
                            <ParamName name="Minimum Clusters (k_min)" />
                            <ParamInputNumber
                                value={data.parameters.k_min || 2}
                                onChange={(value) => updateNodeParameters(id, { k_min: value })}
                                min={1}
                                max={100}
                                step={1}
                            />
                            <ParamName name="Maximum Clusters (k_max)" />
                            <ParamInputNumber
                                value={data.parameters.k_max || 8}
                                onChange={(value) => updateNodeParameters(id, { k_max: value })}
                                min={1}
                                max={100}
                                step={1}
                            />
                        </>
                    )}

                    {/* Preprocessing */}
                    <ParamName name="Preprocessing" />
                    <ParamCheckbox
                        label="Normalize Columns"
                        checked={data.parameters.normalize || false}
                        onChange={(value) => updateNodeParameters(id, { normalize: value })}
                    />

                    {/* Initialization Method */}
                    <ParamName name="Initialization" />
                    <ParamSelect
                        value={data.parameters.init || 'k-means++'}
                        options={[
                            { value: 'k-means++', label: 'Initialize with K-Means++' },
                            { value: 'random', label: 'Random Initialization' },
                        ]}
                        onChange={(value) => updateNodeParameters(id, { init: value })}
                    />

                    {/* Number of Re-Runs */}
                    <ParamName name="Re-Runs (n_init)" />
                    <ParamInputNumber
                        value={data.parameters.n_init || 10}
                        onChange={(value) => updateNodeParameters(id, { n_init: value })}
                        min={1}
                        max={100}
                        step={1}
                    />

                    {/* Maximum Iterations */}
                    <ParamName name="Maximum Iterations" />
                    <ParamInputNumber
                        value={data.parameters.max_iter || 300}
                        onChange={(value) => updateNodeParameters(id, { max_iter: value })}
                        min={5}
                        max={10000}
                        step={50}
                    />
                </>
            ) : (
                <>Please connect a data node to this node to select features.</>
            )}
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-unsupervised-kmeans'}
            parameters={data.parameters}
            
            children={children}
        />
    );
};

export default KMeansNode;
