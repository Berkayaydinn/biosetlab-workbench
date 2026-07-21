import React from 'react';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// Context
import { useTheme } from '../../../context/ThemeContext';

const PlaygroundLoadingSpinner = () => {

  // Theme context
  const { isDarkMode } = useTheme();

    return (
        <div className='relative h-full'>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
            <ReactFlow
                nodes={[]}
                edges={[]}
                nodeTypes={[]}
                style={{ filter: 'blur(0.8px)', zIndex: 1 }}
                colorMode={isDarkMode ? 'dark' : 'light'}
            >
                <Background variant="dots" gap={16} size={1} />
                <Controls />
            </ReactFlow>
      </div>
    );
};

export default PlaygroundLoadingSpinner;