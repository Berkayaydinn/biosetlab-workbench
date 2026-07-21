import { useState } from 'react';

import { Divider,  Tag, Table } from 'antd';
import ReactECharts from 'echarts-for-react';
import { ParamName, ParamSelect } from '../NodeParameter/NodeParameter';
import { COLOR_MAP } from '../../utils/colorMap';

export const ModalName = ({ name }) => {
    return (
        <Divider orientation="left" style={{ fontSize: '16px', marginBottom: '8px', marginTop: '24px' }}>{name}</Divider>
    )
}

export const ModalTable = ({ title, data, columns, nRows=null, details=true }) => {
    return (
        <div className="grid grid-cols-1 gap-4">
            {details && (
                <div>
                    <div>
                        <Tag color="orange" bordered={false}>{title}</Tag>
                        <Tag color="geekblue" bordered={false}>{nRows || data.length} rows</Tag>
                        <Tag color="geekblue" bordered={false}>{columns.length} columns</Tag>
                    </div>
                </div>
            )}
            <div className="overflow-auto max-w-full">
                <Table
                dataSource={data}
                columns={columns}
                pagination={false}
                size="small"
                />
            </div>
        </div>
    );
}

export const ModalChart = ({ 
    type = 'line',  // line, scatter, bar, stacked_bar, etc.
    title = '',
    xAxisType = 'value',
    yAxisType = 'value',
    xAxisName = 'X',
    yAxisName = 'Y',
    xData = [],
    yData = [],
    groups = null,  // Optional groups for scatter/line/stacked bar plots
    series = null,  // Optional custom series configuration
    grid = {
        left: '15%',
        right: '15%',
        top: '10%',
        bottom: '20%'
    }
}) => {
    // Normalize input data to support multiple formats
    const normalizeData = () => {
        // Handle stacked bar chart data
        if (type === 'stacked_bar' && Array.isArray(xData) && xData.length > 0 && typeof xData[0] === 'object') {
            const categories = xData.map(item => item.name || item.bin);
            const seriesData = [];
            
            // If groups are provided, create series for each group
            if (groups && groups.length) {
                groups.forEach(group => {
                    seriesData.push({
                        name: group,
                        type: 'bar',
                        stack: 'total',
                        data: xData.map(item => item[group] || 0)
                    });
                });
            }
            
            return {
                xAxisData: categories,
                series: seriesData
            };
        }
        
        // If xData is a 2D array, it means we have multiple series
        if (Array.isArray(xData[0])) {
            return {
                xAxisData: null,
                series: xData.map((xSeries, index) => ({
                    type: type === 'stacked_bar' ? 'bar' : type,
                    name: groups ? groups[index] : `Series ${index + 1}`,
                    data: xSeries.map((x, i) => [x, yData[index][i]]),
                    smooth: type === 'line',
                    stack: type === 'stacked_bar' ? 'total' : undefined
                }))
            };
        }
        
        // Single series case
        return {
            xAxisData: null,
            series: [{
                data: xData.map((x, i) => [x, yData[i]]),
                type: type === 'stacked_bar' ? 'bar' : type,
                smooth: type === 'line'
            }]
        };
    };

    const { xAxisData, series: normalizedSeries } = normalizeData();
    
    return (
        <div className="max-w-2xl">
            <ReactECharts
                option={{
                    title: {
                        text: title,
                        left: 'center'
                    },
                    tooltip: {
                        trigger: type === 'stacked_bar' ? 'axis' : 'item',
                        axisPointer: {
                            type: 'shadow'
                        },
                        confine: true
                    },
                    legend: groups && groups.length > 1 ? {
                        data: groups,
                        top: 35,
                        left: 'center'
                    } : undefined,
                    grid: {
                        ...grid,
                        top: groups && groups.length > 1 ? '20%' : '15%',
                        right: '10%',
                        bottom: '20%'
                    },
                    dataZoom: [
                        {
                            type: 'inside',
                            xAxisIndex: 0,
                            filterMode: 'none'
                        },
                        {
                            type: 'inside',
                            yAxisIndex: 0,
                            filterMode: 'none'
                        }
                    ],
                    xAxis: {
                        type: xAxisType,
                        name: xAxisName,
                        nameLocation: 'middle',
                        nameGap: 30,
                        data: xAxisData,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    yAxis: {
                        type: yAxisType,
                        name: yAxisName,
                        nameLocation: 'middle',
                        nameGap: 45,
                        splitLine: {
                            show: true,
                            lineStyle: {
                                type: 'dashed'
                            }
                        }
                    },
                    series: series || normalizedSeries
                }}
                style={{
                    height: '450px',
                    width: '100%'
                }}
            />
        </div>
    );
};



export const ModalHeatmap = ({ data, xColumns, yColumns, defaultColor='Blue', defaultShowValues=true, defaultOrientation='horizontal' }) => {
    if (data.length === 0 || xColumns.length === 0 || yColumns.length === 0) {
        return (
            <div className='mt-4'>
                <p>No data to display</p>
            </div>
        );
    }

    //---------------------------------------------------------------------------------//
    //                              Color Map Options                                  //
    //---------------------------------------------------------------------------------//
    const [colorMap, setColorMap] = useState(defaultColor);

    // Options as a gradient circle that indicates the color and the name of the color
    const colorMapOptions = Object.entries(COLOR_MAP).map(([key, value]) => ({
        value: key,
        label: (
            <div className="flex items-center space-x-2">
                <div 
                    className="w-8 h-4 rounded-md"
                    style={{
                        background: value.length > 2 
                            ? `linear-gradient(to right, ${value.join(', ')})` 
                            : `linear-gradient(to right, ${value[0]}, ${value[1]})`
                    }}
                />
                <div>{key}</div>
            </div>
        )
    }));

    //---------------------------------------------------------------------------------//
    //                                  Orientation                                    //
    //---------------------------------------------------------------------------------//
    const [orientation, setOrientation] = useState(defaultOrientation);
    const [valuesVisible, setValuesVisible] = useState(defaultShowValues);

    // Separate data for heatmap and annotations
    const heatmapData = data.map(item => item.slice(0, 3));
    const annotationsMap = data.reduce((acc, item) => {
        const key = `${item[0]}-${item[1]}`;
        acc[key] = item[3] || '';
        return acc;
    }, {});

    // Prepare data for different orientations
    const preparedData = orientation === 'horizontal' 
        ? heatmapData 
        : heatmapData.map(item => [item[1], item[0], item[2]]);

    // Prepare columns for different orientations
    const preparedXColumns = orientation === 'horizontal' ? xColumns : yColumns;
    const preparedYColumns = orientation === 'horizontal' ? yColumns : xColumns;

    return (
        <div>
            <div className='flex items-center space-x-2'>
                <div className='w-64'>
                    <ParamName name="Color Map" />
                    <ParamSelect
                        value={colorMap}
                        onChange={setColorMap}
                        options={colorMapOptions}
                    />
                </div>
                <div className='w-64'>
                    <ParamName name="Orientation" />
                    <ParamSelect
                        value={orientation}
                        onChange={setOrientation}
                        options={[
                            { value: 'horizontal', label: 'Horizontal' },
                            { value: 'vertical', label: 'Vertical' },
                        ]}
                    />
                </div>
                <div className='w-64'>
                    <ParamName name="Show Values" />
                    <ParamSelect
                        value={valuesVisible}
                        onChange={setValuesVisible}
                        options={[
                            { value: true, label: 'Yes' },
                            { value: false, label: 'No' },
                        ]}
                    />
                </div>
            </div>
            <ReactECharts
                option={{
                    tooltip: {
                        position: 'top',
                        formatter: function(params) {
                            const key = orientation === 'horizontal' 
                                ? `${params.data[0]}-${params.data[1]}`
                                : `${params.data[1]}-${params.data[0]}`;
                            const annotation = annotationsMap[key] || '';
                            return `
                                <b>X: </b>${params.data[0]}<br>
                                <b>Y: </b>${params.data[1]}<br>
                                <b>Value: </b>${params.data[2].toFixed(2)}<br>
                                ${annotation ? `<b>Annotation: </b>${annotation}` : ''}
                            `;
                        }
                    },
                    xAxis: {
                        type: 'category',
                        data: preparedXColumns,
                        nameLocation: 'center',
                        nameGap: 30,
                        axisLabel: {
                            formatter: '{value}',
                            rotate: preparedXColumns.length > 10 ? 45 : 0,
                        },
                    },
                    yAxis: {
                        type: 'category',
                        data: preparedYColumns,
                        nameLocation: 'center',
                        nameGap: 30,
                        axisLabel: {
                            formatter: '{value}',
                            rotate: preparedYColumns.length > 10 ? 45 : 0,
                        },
                    },
                    visualMap: {
                        min: 0,
                        max: Math.max(...preparedData.map((item) => item[2])),
                        calculable: true,
                        orient: 'horizontal',
                        left: 'center',
                        bottom: 5,
                        inRange: {
                            color: COLOR_MAP[colorMap]
                        },
                    },
                    series: [
                        {
                            data: preparedData,
                            type: 'heatmap',
                            label: {
                                show: valuesVisible,
                                formatter: (params) => {
                                    return params.value[2].toFixed(2);
                                }
                            },
                        },
                    ],
                }}
                style={{ height: '400px', width: '100%' }}
            />
        </div>
    );
};