import React, { useMemo } from 'react';
import BaseNode from './BaseNode';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { ModalName, ModalTable } from '../NodeModal/NodeModalItem';

const DistanceMatrixNode = ({ id, data, selected }) => {
  const { nodes } = usePlaygroundStore();
  const currentNode = nodes.find(node => node.id === id);

  const matrixData = currentNode?.data?.outputs?.matrix_data?.display_value || {};
  const statisticsData = currentNode?.data?.outputs?.statistics?.display_value || {};

  const getLabel = (label) => {
    // _ -> " "
    const labelWithSpaces = label.replace(/_/g, ' ');
    // capitalize first letters
    return labelWithSpaces.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Helper function to get color based on distance value
  const getColorForValue = (value, minVal, maxVal) => {
    if (typeof value !== 'number' || minVal === maxVal) {
      return '#ffffff'; // Default white for non-numeric or constant values
    }
    
    // Normalize value between 0 and 1
    const normalized = (value - minVal) / (maxVal - minVal);
    
    // Create color scale from white (low) to dark green (high)
    const intensity = normalized;
    const red = Math.round(255 * (1 - intensity));
    const green = 255;
    const blue = Math.round(255 * (1 - intensity));
    
    return `rgb(${red}, ${green}, ${blue})`;
  };

  // Prepare modal content with distance matrix information
  const modalContent = useMemo(() => {
    if (!matrixData.values) return null;

    const { metric, compare, shape } = matrixData;
    const stats = statisticsData;

    // Calculate min and max values for color scaling
    const allValues = matrixData.values.flat().filter(val => typeof val === 'number');
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // Prepare statistics data for ModalTable
    const statsTableData = stats ? [
      { key: 'min', statistic: 'Min Distance', value: stats.min_distance?.toFixed(4) || 'N/A' },
      { key: 'max', statistic: 'Max Distance', value: stats.max_distance?.toFixed(4) || 'N/A' },
      { key: 'mean', statistic: 'Mean Distance', value: stats.mean_distance?.toFixed(4) || 'N/A' },
      { key: 'std', statistic: 'Std Distance', value: stats.std_distance?.toFixed(4) || 'N/A' },
      { key: 'median', statistic: 'Median Distance', value: stats.median_distance?.toFixed(4) || 'N/A' },
    ] : [];

    const statsColumns = [
      { title: 'Statistic', dataIndex: 'statistic' },
      { title: 'Value', dataIndex: 'value' }
    ];

    // Prepare full matrix data for ModalTable - show ALL rows and columns
    const matrixTableData = [];
    
    for (let i = 0; i < matrixData.values.length; i++) {
      const rowData = { key: i, label: matrixData.labels[i] };
      for (let j = 0; j < matrixData.values[i].length; j++) {
        const rawValue = matrixData.values[i][j];
        rowData[`col_${j}`] = typeof rawValue === 'number' 
          ? rawValue.toFixed(3) 
          : rawValue;
      }
      matrixTableData.push(rowData);
    }

    // Create columns for ALL labels with color rendering
    const matrixColumns = [
      { title: 'Label', dataIndex: 'label', fixed: 'left', width: 120 },
      ...matrixData.labels.map((label, idx) => ({
        title: label,
        dataIndex: `col_${idx}`,
        width: 100,
        render: (text, record, rowIndex) => {
          const rawValue = matrixData.values[rowIndex][idx];
          const backgroundColor = getColorForValue(rawValue, minValue, maxValue);
          const textColor = typeof rawValue === 'number' && rawValue > (minValue + maxValue) / 2 ? '#ffffff' : '#000000';
          
          return (
            <div 
              style={{ 
                backgroundColor,
                color: textColor,
                padding: '4px 8px',
                borderRadius: '2px',
                textAlign: 'center',
                fontWeight: '500'
              }}
            >
              {text}
            </div>
          );
        }
      }))
    ];

    return (
      <div className="max-w-full">
        <ModalName name={`Distance Matrix (${getLabel(metric)} - ${getLabel(compare)})`} />
        
        {/* Matrix Information */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Matrix Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <p><strong>Metric:</strong> {getLabel(metric)}</p>
            <p><strong>Comparison:</strong> {getLabel(compare)}</p>
            <p><strong>Shape:</strong> {shape ? `${shape[0]} × ${shape[1]}` : 'N/A'}</p>
            <p><strong>Labels:</strong> {matrixData.labels?.length || 0}</p>
          </div>
        </div>

        {/* Statistics Table */}
        {statsTableData.length > 0 && (
          <>
            <ModalName name="Distance Statistics" />
            <ModalTable
              data={statsTableData}
              columns={statsColumns}
              title="Distance Statistics"
              nRows={statsTableData.length}
              details={false}
            />
          </>
        )}

        {/* Full Matrix Table */}
        {matrixTableData.length > 0 && (
          <>
            <ModalName name="Distance Matrix" />
            <ModalTable
              data={matrixTableData}
              columns={matrixColumns}
              title={`Distance Matrix (${matrixData.values.length}×${matrixData.labels.length})`}
              nRows={matrixData.values.length}
              details={true}
            />
          </>
        )}

        {/* Color Scale Legend */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Color Scale</h3>
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-2">
                <span>Low Distance</span>
                ({minValue.toFixed(3)})
            </div>
            <div className="flex h-6 w-48 rounded">
              {Array.from({ length: 20 }, (_, i) => (
                <div
                  key={i}
                  className="flex-1 h-full"
                  style={{
                    backgroundColor: getColorForValue(
                      minValue + (i / 19) * (maxValue - minValue),
                      minValue,
                      maxValue
                    )
                  }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
                <span>High Distance</span>
                ({maxValue.toFixed(3)})
            </div>
          </div>
        </div>
      </div>
    );
  }, [matrixData, statisticsData]);

  const children = (
    <div className="flex flex-col mt-2 space-y-2">
      <div className="text-sm text-gray-600">
        Connect a distance matrix to view complete matrix data and statistics.
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      type={'node-unsupervised-distance-matrix'}
      parameters={data.parameters}
      modalContent={modalContent}
      children={children}
    />
  );
};

export default DistanceMatrixNode; 