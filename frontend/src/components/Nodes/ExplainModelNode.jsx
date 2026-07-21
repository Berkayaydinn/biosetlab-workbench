import React, { useMemo, useState, useEffect } from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ParamInputNumber, ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { ModalName } from '../NodeModal/NodeModalItem';
import ReactECharts from 'echarts-for-react';
import { ModalHeatmap } from '../NodeModal/NodeModalItem';
import { COLOR_MAP } from '../../utils/colorMap';

const DecisionPlot = ({ data, baseValue }) => {
    if (!data) return null;

    // Sort features by importance (mean absolute SHAP value)
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.importance - a.importance);
    }, [data]);

    const features = sortedData.map(item => item.feature);
    
    // Calculate min and max SHAP values for scaling
    const allShapValues = useMemo(() => {
        return sortedData.flatMap(item => item.values.map(([_, shapValue]) => shapValue));
    }, [sortedData]);

    const maxShapValue = Math.max(...allShapValues);

    const getCumulativeValues = (sortedData, baseValue) => {
        const cumulativeValues = [];
        for (let sampleIndex = 0; sampleIndex < sortedData[0].values.length; sampleIndex++) {
            let cumulativeValue = baseValue;
            for (let featureIndex = 0; featureIndex < sortedData.length; featureIndex++) {
                const [_, shapValue] = sortedData[featureIndex].values[sampleIndex];
                cumulativeValue += shapValue;
                cumulativeValues.push(cumulativeValue);
            }
        }
        return cumulativeValues;
    };
    
    
    
    
    


    // Min cumulative value
    const cumulativeValues = getCumulativeValues(sortedData, baseValue);
    const xAxisMin = Math.min(Math.min(...cumulativeValues), baseValue);
    const xAxisMax = Math.max(Math.max(...cumulativeValues), baseValue);

    // Create custom color mapper function
    const customColorMapper = (value, min, max) => {
        // Normalize the value between 0 and 1
        const normalizedValue = Math.max(0, Math.min(1, (value - min) / (max - min)));
        
        // Safety check: if the color map is undefined or empty, return a default color
        if (!COLOR_MAP || !COLOR_MAP["Red-Blue"] || COLOR_MAP["Red-Blue"].length === 0) {
            return "#ff0000"; // Default to red if color map is unavailable
        }
        
        // Get the exact position in the color array (as a float)
        const position = normalizedValue * (COLOR_MAP["Red-Blue"].length - 1);
        
        // Get the two closest colors
        const index1 = Math.floor(position);
        const index2 = Math.min(COLOR_MAP["Red-Blue"].length - 1, index1 + 1);
        
        // Calculate interpolation factor between the two colors
        const factor = position - index1;
        
        // Get the two colors
        const color1 = COLOR_MAP["Red-Blue"][index1];
        const color2 = COLOR_MAP["Red-Blue"][index2];
        
        // Check if colors are valid hex colors
        if (!color1 || !color2 || typeof color1 !== 'string' || typeof color2 !== 'string' ||
            !color1.startsWith('#') || !color2.startsWith('#') || 
            color1.length !== 7 || color2.length !== 7) {
            return "#ff0000"; // Default to red if colors are invalid
        }
        
        // Parse the RGB values
        const parseColor = (color) => {
            try {
                const r = parseInt(color.slice(1, 3), 16);
                const g = parseInt(color.slice(3, 5), 16);
                const b = parseInt(color.slice(5, 7), 16);
                return [r, g, b];
            } catch (e) {
                console.error("Error parsing color:", color, e);
                return [255, 0, 0]; // Default to red
            }
        };
        
        const [r1, g1, b1] = parseColor(color1);
        const [r2, g2, b2] = parseColor(color2);
        
        // Interpolate between the colors
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        // Format as hex color
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    // Create line data for each sample
    const lineData = useMemo(() => {
        const result = [];
        const numFeatures = features.length;
        
        // For each sample point
        for (let sampleIndex = 0; sampleIndex < sortedData[0].values.length; sampleIndex++) {
            const coords = [];
            let cumulativeValue = baseValue;  // Start from base value, not 0
            
            // Get the feature value for coloring
            const featureValue = sortedData[0].values[sampleIndex][0]; // Use first feature's value for coloring
            
            // Add base value as starting point
            coords.push([cumulativeValue, 0, featureValue]);
            
            // For each feature
            for (let featureIndex = 0; featureIndex < numFeatures; featureIndex++) {
                const [_, shapValue] = sortedData[featureIndex].values[sampleIndex];
                cumulativeValue += shapValue;
                coords.push([cumulativeValue, featureIndex + 1, featureValue]);
            }
            
            // Get color based on final cumulative value
            const finalCumulativeValue = coords[coords.length - 1][0];
            const lineColor = customColorMapper(finalCumulativeValue, xAxisMin, xAxisMax);
            
            result.push({
                type: 'line',
                data: coords,
                symbol: 'none',
                lineStyle: {
                    width: 1.2,
                    color: lineColor
                },
            });
        }
        
        return result;
    }, [sortedData, features, baseValue, xAxisMin, xAxisMax]);

    const option = {
        title: {
            text: 'SHAP Decision Plot',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const featureIndex = Math.round(params[0].value[1]) - 1;
                const feature = features[featureIndex] || 'Base';
                const shapValue = params[0].value[0].toFixed(4);
                const featureValue = featureIndex >= 0 ? sortedData[featureIndex].values[params[0].seriesIndex][0].toFixed(4) : 'N/A';
                return `Feature: ${feature}<br/>Cumulative SHAP: ${shapValue}<br/>Feature Value: ${featureValue}`;
            }
        },
        grid: {
            left: '15%',
            right: '15%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'Model output value',
            nameLocation: 'middle',
            nameGap: 30,
            min: xAxisMin,
            max: xAxisMax,
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true }
        },
        yAxis: {
            type: 'value',
            name: 'Feature',
            nameLocation: 'middle',
            nameGap: 100,
            min: 0,
            max: features.length,
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true },
            axisLabel: {
                formatter: function(value) {
                    if (value === 0) return 'Base';
                    const index = Math.round(value) - 1;
                    if (index >= 0 && index < features.length) {
                        return features[index];
                    }
                    return '';
                },
                interval: 0
            }
        },
        visualMap: {
            type: 'continuous',
            min: xAxisMin,
            max: xAxisMax,
            text: ['High', 'Low'],
            inRange: {
                color: COLOR_MAP["Red-Blue"]
            },
            calculable: false,
            dimension: 1,
            orient: 'horizontal',
            top: 35,
            left: 'center',
            itemWidth: 15,
            itemHeight: 650,
            textStyle: {
                color: '#333'
            }
        },
        series: lineData
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

const BeeswarmChart = ({ data }) => {
    if (!data) return null;

    // Sort features by importance (mean absolute SHAP value)
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => b.importance - a.importance);
    }, [data]);

    const features = sortedData.map(item => item.feature);
    
    // Calculate min and max feature values for color scaling
    const allFeatureValues = useMemo(() => {
        return sortedData.flatMap(item => item.values.map(([value]) => value));
    }, [sortedData]);
    
    const minFeatureValue = Math.min(...allFeatureValues);
    const maxFeatureValue = Math.max(...allFeatureValues);

    // Create scatter data with smart jitter for overlapping points
    const scatterData = useMemo(() => {
        // First, create a map to track points at each feature index
        const pointsByFeature = {};
        
        // Initialize the map
        sortedData.forEach((featureData, featureIndex) => {
            pointsByFeature[featureIndex] = [];
        });
        
        // Group points by feature and x-value (SHAP value)
        sortedData.forEach((featureData, featureIndex) => {
            featureData.values.forEach(([featureValue, shapValue], pointIndex) => {
                // Round SHAP value to 2 decimal places for grouping
                const roundedShapValue = Math.round(shapValue * 100) / 100;
                
                if (!pointsByFeature[featureIndex][roundedShapValue]) {
                    pointsByFeature[featureIndex][roundedShapValue] = [];
                }
                
                pointsByFeature[featureIndex][roundedShapValue].push({
                    featureValue,
                    shapValue,
                    pointIndex
                });
            });
        });
        
        // Apply jitter only to overlapping points
        const result = [];
        
        sortedData.forEach((featureData, featureIndex) => {
            featureData.values.forEach(([featureValue, shapValue], pointIndex) => {
                // Round SHAP value to 2 decimal places for grouping
                const roundedShapValue = Math.round(shapValue * 100) / 100;
                
                // Get all points with the same SHAP value for this feature
                const overlappingPoints = pointsByFeature[featureIndex][roundedShapValue] || [];
                
                // If there's only one point, no jitter needed
                let jitter = 0;
                
                if (overlappingPoints.length > 1) {
                    // Find the position of this point in the overlapping group
                    const positionInGroup = overlappingPoints.findIndex(p => p.pointIndex === pointIndex);
                    
                    // Apply jitter based on position in group
                    // Even indices go up, odd indices go down
                    const direction = positionInGroup % 2 === 0 ? 1 : -1;
                    const magnitude = (Math.floor(positionInGroup / 2) * 0.009);
                    jitter = direction * magnitude;
                }
                
                // Use featureIndex + 1 to start from index 1
                result.push({
                    value: [shapValue, featureIndex + 1 + jitter, featureValue],
                    symbolSize: 8,
                    // Round feature value to 3 decimal places
                    featureValue: Math.round(featureValue * 1000) / 1000 // Store the feature value for tooltip
                });
            });
        });
        
        return result;
    }, [sortedData, minFeatureValue, maxFeatureValue]);

    const option = {
        title: {
            text: 'SHAP Beeswarm Plot',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                // Adjust the index calculation to account for starting at 1
                const feature = features[Math.round(params.value[1]) - 1];
                return `Feature: ${feature}<br/>SHAP Value: ${params.value[0].toFixed(4)}<br/>Feature Value: ${params.data.featureValue}`;
            }
        },
        grid: {
            left: '15%',
            right: '5%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'SHAP Value',
            nameLocation: 'middle',
            nameGap: 30,
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true }
        },
        yAxis: {
            type: 'value',
            name: 'Feature',
            nameLocation: 'middle',
            nameGap: 100,
            min: 0.3, // Start from 0.3 to accommodate index 1
            max: features.length + 0.5, // Adjust max to account for starting at 1
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true },
            axisLabel: {
                formatter: function(value) {
                    // Adjust the index calculation to account for starting at 1
                    const index = Math.round(value) - 1;
                    if (index >= 0 && index < features.length) {
                        return features[index];
                    }
                    return '';
                },
                interval: 0
            }
        },
        visualMap: {
            type: 'continuous',
            min: minFeatureValue,
            max: maxFeatureValue,
            calculable: true,
            orient: 'vertical',
            right: '-0.5%',
            bottom: '30%',
            inRange: {
                color: COLOR_MAP["Red-Blue"]
            },
            text: ['High', 'Low'],
            textStyle: {
                color: '#333'
            },
            seriesIndex: 0
        },
        series: [{
            type: 'scatter',
            data: scatterData,
            emphasis: {
                focus: 'series',
                itemStyle: {
                    opacity: 1
                }
            }
        }]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

const SHAPHeatmap = ({ data }) => {
    if (!data) return null;

    // Prepare data for heatmap
    const heatmapData = useMemo(() => {
        if (!data?.data) return [];
        
        const result = [];
        const features = data.data.map(item => item.feature);
        const numInstances = data.data[0].values.length;
        
        // For each feature
        for (let featureIndex = 0; featureIndex < features.length; featureIndex++) {
            const feature = features[featureIndex];
            const values = data.data[featureIndex].values;
            
            // For each instance
            for (let instanceIndex = 0; instanceIndex < numInstances; instanceIndex++) {
                const [featureValue, shapValue] = values[instanceIndex];
                result.push([instanceIndex, feature, shapValue]);
            }
        }
        
        return result;
    }, [data]);

    return (
        <ModalHeatmap 
            data={heatmapData} 
            xColumns={Array.from({ length: data?.data[0]?.values.length || 0 }, (_, i) => `${i+1}`)}
            yColumns={data?.data?.map(item => item.feature) || []}
            defaultColor="Red-White-Blue"
            defaultShowValues={false}
            defaultOrientation="horizontal"
        />
    );
};

const SHAPBar = ({ data }) => {
    if (!data) return null;

    // Calculate mean absolute SHAP values for each feature
    const barData = useMemo(() => {
        if (!data?.data) return [];
        
        return data.data.map(featureData => {
            const meanAbsShap = featureData.values.reduce((sum, [_, shapValue]) => 
                sum + Math.abs(shapValue), 0) / featureData.values.length;
            
            return {
                feature: featureData.feature,
                value: meanAbsShap
            };
        }).sort((a, b) => b.value - a.value); // Sort by importance
    }, [data]);

    const option = {
        title: {
            text: 'Feature Importance (Mean |SHAP|)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                return `Feature: ${params[0].name}<br/>Mean |SHAP|: ${params[0].value.toFixed(4)}`;
            }
        },
        grid: {
            left: '15%',
            right: '5%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'Mean |SHAP|',
            nameLocation: 'middle',
            nameGap: 30,
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true }
        },
        yAxis: {
            type: 'category',
            data: barData.map(item => item.feature),
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true },
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        series: [{
            type: 'bar',
            data: barData.map(item => item.value),
            itemStyle: {
                color: '#ff0051'
            },
            label: {
                show: true,
                position: 'right',
                formatter: function(params) {
                    return params.value.toFixed(4);
                }
            }
        }]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

const SHAPWaterfall = ({ data }) => {
    if (!data?.data) return null;

    const waterfallData = useMemo(() => {
        // Get base value and final value from the backend
        const expectedValue = data.base_value;
        const finalValue = data.final_value;

        // Get feature contributions for first instance
        const features = data.data.map(featureData => ({
            feature: featureData.feature,
            value: featureData.values[0][1], // SHAP value
            featureValue: featureData.values[0][0] // actual feature value
        })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Sort by absolute impact

        // Calculate cumulative values for the waterfall, starting from 0 (relative to E[f(x)])
        let cumulative = 0;
        const chartData = features.map(f => {
            const start = cumulative;
            cumulative += f.value;
            return {
                ...f,
                start,
                end: cumulative
            };
        });

        return {
            chartData,
            expectedValue,
            finalValue
        };
    }, [data]);

    const option = {
        title: {
            text: 'SHAP Waterfall Plot',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const data = params[0].data;
                if (data.isEndpoint) {
                    return `${data.name}: ${(data.value + waterfallData.expectedValue).toFixed(3)}`;
                }
                return `${data.featureValue} = ${data.feature}<br/>Impact: ${data.value >= 0 ? '+' : ''}${data.value.toFixed(3)}`;
            }
        },
        grid: {
            left: '25%',
            right: '5%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'Model Output',
            nameLocation: 'middle',
            nameGap: 30,
            axisLabel: {
                formatter: value => (value + waterfallData.expectedValue).toFixed(3)
            }
        },
        yAxis: {
            type: 'category',
            data: [
                'E[f(x)]',
                ...waterfallData.chartData.map(d => `${d.featureValue} = ${d.feature}`),
                'f(x)'
            ],
            axisLabel: {
                interval: 0,
                align: 'right'
            }
        },
        series: [
            {
                type: 'bar',
                stack: 'waterfall',
                barWidth: '60%',
                data: [
                    {
                        value: 0, // E[f(x)] is now at x=0
                        name: 'E[f(x)]',
                        isEndpoint: true,
                        itemStyle: { color: '#666666' }
                    },
                    ...waterfallData.chartData.map(d => ({
                        value: d.value,
                        start: d.start,
                        end: d.end,
                        featureValue: d.featureValue,
                        feature: d.feature,
                        itemStyle: { color: d.value >= 0 ? '#ff0051' : '#008afa' }
                    })),
                    {
                        value: waterfallData.finalValue - waterfallData.expectedValue,
                        name: 'f(x)',
                        isEndpoint: true,
                        itemStyle: { color: '#666666' },
                    }
                ],
                label: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        if (params.dataIndex === 0) {
                            return waterfallData.expectedValue.toFixed(3);
                        } else if (params.dataIndex === waterfallData.chartData.length + 1) {
                            return waterfallData.finalValue.toFixed(3);
                        }
                        return (params.data.value >= 0 ? '+' : '') + params.data.value.toFixed(3);
                    }
                }
            }
        ]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

// Add LIME visualization component
const LIMEBar = ({ data }) => {
    if (!data?.data) return null;

    // Extract LIME values from the data
    const limeData = useMemo(() => {
        return data.data.map(featureData => {
            // For LIME, we only have one instance, so we take the first value
            const limeValue = featureData.values[0][1];
            
            return {
                feature: featureData.feature,
                value: limeValue,
                featureValue: featureData.values[0][0] // Actual feature value
            };
        }).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Sort by absolute impact
    }, [data]);

    const option = {
        title: {
            text: 'LIME Feature Importance',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const value = params[0].value;
                const feature = params[0].name;
                const featureValue = limeData.find(d => d.feature === feature)?.featureValue;
                return `Feature: ${feature}<br/>Value: ${featureValue}<br/>Impact: ${value >= 0 ? '+' : ''}${value.toFixed(4)}`;
            }
        },
        grid: {
            left: '15%',
            right: '5%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'Feature Impact',
            nameLocation: 'middle',
            nameGap: 30,
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true }
        },
        yAxis: {
            type: 'category',
            data: limeData.map(item => item.feature),
            axisLine: { show: true },
            axisTick: { show: true },
            splitLine: { show: true },
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        series: [{
            type: 'bar',
            data: limeData.map(item => ({
                value: item.value,
                itemStyle: {
                    color: item.value >= 0 ? '#ff0051' : '#008afa'
                }
            })),
            label: {
                show: true,
                position: 'right',
                formatter: function(params) {
                    return (params.value >= 0 ? '+' : '') + params.value.toFixed(4);
                }
            }
        }]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

// Add LIME waterfall visualization
const LIMEWaterfall = ({ data }) => {
    if (!data?.data) return null;

    // Extract LIME values from the data
    const limeData = useMemo(() => {
        return data.data.map(featureData => {
            // For LIME, we only have one instance, so we take the first value
            const limeValue = featureData.values[0][1];
            
            return {
                feature: featureData.feature,
                value: limeValue,
                featureValue: featureData.values[0][0] // Actual feature value
            };
        }).sort((a, b) => Math.abs(b.value) - Math.abs(a.value)); // Sort by absolute impact
    }, [data]);

    // Calculate cumulative values for the waterfall
    let cumulative = 0;
    const chartData = limeData.map(f => {
        const start = cumulative;
        cumulative += f.value;
        return {
            ...f,
            start,
            end: cumulative
        };
    });

    const option = {
        title: {
            text: 'LIME Waterfall Plot',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const data = params[0].data;
                if (data.isEndpoint) {
                    return `${data.name}: ${data.value.toFixed(3)}`;
                }
                return `${data.featureValue} = ${data.feature}<br/>Impact: ${data.value >= 0 ? '+' : ''}${data.value.toFixed(3)}`;
            }
        },
        grid: {
            left: '25%',
            right: '5%',
            bottom: '10%',
            top: '15%'
        },
        xAxis: {
            type: 'value',
            name: 'Model Output',
            nameLocation: 'middle',
            nameGap: 30
        },
        yAxis: {
            type: 'category',
            data: [
                'Base',
                ...chartData.map(d => `${d.featureValue} = ${d.feature}`),
                'Final'
            ],
            axisLabel: {
                interval: 0,
                align: 'right'
            }
        },
        series: [
            {
                type: 'bar',
                stack: 'waterfall',
                barWidth: '60%',
                data: [
                    {
                        value: 0, // Base value is 0 for LIME
                        name: 'Base',
                        isEndpoint: true,
                        itemStyle: { color: '#666666' }
                    },
                    ...chartData.map(d => ({
                        value: d.value,
                        start: d.start,
                        end: d.end,
                        featureValue: d.featureValue,
                        feature: d.feature,
                        itemStyle: { color: d.value >= 0 ? '#ff0051' : '#008afa' }
                    })),
                    {
                        value: cumulative,
                        name: 'Final',
                        isEndpoint: true,
                        itemStyle: { color: '#666666' },
                    }
                ],
                label: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        if (params.dataIndex === 0) {
                            return '0.000';
                        } else if (params.dataIndex === chartData.length + 1) {
                            return cumulative.toFixed(3);
                        }
                        return (params.data.value >= 0 ? '+' : '') + params.data.value.toFixed(3);
                    }
                }
            }
        ]
    };

    return (
        <ReactECharts
            option={option}
            style={{ height: '500px', width: '100%' }}
            opts={{ renderer: 'svg' }}
        />
    );
};

const ExplainModelNode = ({ id, data, selected }) => {
    const { updateNodeParameters } = usePlaygroundStore();
    const [plotType, setPlotType] = useState('shap-beeswarm'); // 'beeswarm', 'decision', 'heatmap', 'bar', 'waterfall', 'lime-bar', 'lime-waterfall'
    
    const outputData = data?.outputs?.explanation?.display_value;
    const explanationType = outputData?.metadata?.explanation_type || 'shap';

    // Determine available plot types based on explanation type
    const getAvailablePlotTypes = () => {
        if (explanationType === 'shap') {
            return [
                { label: 'SHAP Beeswarm', value: 'shap-beeswarm' },
                { label: 'SHAP Decision', value: 'shap-decision' },
                { label: 'SHAP Heatmap', value: 'shap-heatmap' },
                { label: 'SHAP Bar', value: 'shap-bar' },
                { label: 'SHAP Waterfall', value: 'shap-waterfall' }
            ];
        } else {
            // For LIME, we have dedicated visualizations
            return [
                { label: 'LIME Bar', value: 'lime-bar' },
                { label: 'LIME Waterfall', value: 'lime-waterfall' }
            ];
        }
    };

    // Reset plot type if it's not available for the current explanation type
    useEffect(() => {
        const availableTypes = getAvailablePlotTypes().map(type => type.value);
        if (!availableTypes.includes(plotType)) {
            setPlotType(availableTypes[0]);
        }
    }, [explanationType]);

    const modalContent = (
        <div className="max-w-4xl">
            <ModalName name={` ${explanationType.toUpperCase()} Explanation`} />
            <div className="mb-4 flex justify-start">
                <div className="flex flex-row gap-2">
                    <div className="flex flex-col w-40">
                        <ParamName name="Plot Type" />
                        <ParamSelect
                            value={plotType}
                            onChange={(value) => setPlotType(value)}
                            options={getAvailablePlotTypes()}
                        />
                    </div>
                </div>
            </div>
            {plotType === 'shap-beeswarm' ? (
                <BeeswarmChart data={outputData?.data} />
            ) : plotType === 'shap-decision' ? (
                <DecisionPlot data={outputData?.data} baseValue={outputData?.base_value} />
            ) : plotType === 'shap-heatmap' ? (
                <SHAPHeatmap data={outputData} />
            ) : plotType === 'shap-bar' ? (
                <SHAPBar data={outputData} />
            ) : plotType === 'shap-waterfall' ? (
                <SHAPWaterfall data={outputData} />
            ) : plotType === 'lime-bar' ? (
                <LIMEBar data={outputData} />
            ) : (
                <LIMEWaterfall data={outputData} />
            )}
        </div>
    );

    const children = (
        <div className="flex flex-col mt-2">
            <>
                <ParamName name="Explanation Type" />
                <ParamSelect
                    value={data.parameters.explanation_type || 'shap'}
                    onChange={(value) => updateNodeParameters(id, { explanation_type: value })}
                    options={[
                        { label: 'SHAP', value: 'shap' },
                        { label: 'LIME', value: 'lime' }
                    ]}
                />
                <ParamName name="Number of Samples" />
                <ParamInputNumber
                    value={data.parameters.n_samples || 100}
                    onChange={(value) => updateNodeParameters(id, { n_samples: value })}
                    min={1}
                    max={1000}
                />
                <ParamName name="Background Samples" />
                <ParamInputNumber
                    value={data.parameters.background_samples || 50}
                    onChange={(value) => updateNodeParameters(id, { background_samples: value })}
                    min={1}
                    max={100}
                />
            </>
        </div>
    );

    return (
        <BaseNode
            id={id}
            data={data}
            type={'node-explain-explain-model'}
            parameters={data.parameters}
            modalContent={modalContent}
            children={children}
        />
    );
};

export default ExplainModelNode; 