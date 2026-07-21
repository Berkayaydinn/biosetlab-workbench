import React from 'react';
import { Space, Divider, Typography, Tooltip, Switch } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { useTheme } from '../../context/ThemeContext';

const ProjectCardContent = () => {
    const { name, description, compactMode, setCompactMode } = usePlaygroundStore();
    const { isDarkMode, toggleTheme } = useTheme();

    const truncatedName = name && name.length > 40
        ? name.substring(0, 40) + '...' 
        : name || "Untitled Project";

    const truncatedDescription = description && description.length > 100
        ? description.substring(0, 100) + '...'
        : description || "No description";

    return (
        <div style={{ width: '400px' }}>
            <Space direction="vertical" size={0}>
                <Divider
                    orientation="left"
                    style={{ fontSize: '12px', marginBottom: '4px' }}
                >
                    Project Info
                </Divider>
                <Typography.Title level={5}
                    ellipsis={{ rows: 1 }}
                    style={{ margin: 0 }}
                >
                    {truncatedName}
                </Typography.Title>
                <Tooltip title={description}>
                    <Typography.Paragraph
                        type="secondary"
                        ellipsis={{ rows: 8 }}
                        style={{ 
                            margin: 0,
                            width: '400px',
                            wordWrap: 'break-word',
                            fontSize: '12px',
                            opacity: 0.9
                        }}
                    >
                        {description || "No description"}
                    </Typography.Paragraph>
                </Tooltip>

                <Divider
                    orientation="left"
                    style={{ fontSize: '12px', marginBottom: '4px', marginTop: '16px' }}
                >
                    Playground Settings
                </Divider>
                <Space direction="vertical" size={8}>
                    <Space direction="horizontal" size={0}>
                        <Typography.Text
                            style={{ fontSize: '12px', opacity: 0.9, marginRight: '4px' }}>
                            Compact Mode
                        </Typography.Text>
                        <Switch
                            size="small"
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            defaultChecked={compactMode}
                            onChange={setCompactMode}
                        />
                    </Space>
                    <Space direction="horizontal" size={0}>
                        <Typography.Text
                            style={{ fontSize: '12px', opacity: 0.9, marginRight: '4px' }}>
                            Dark Mode
                        </Typography.Text>
                        <Switch
                            size="small"
                            checkedChildren={<CheckOutlined />}
                            unCheckedChildren={<CloseOutlined />}
                            checked={isDarkMode}
                            onChange={toggleTheme}
                        />
                    </Space>
                </Space>
            </Space>
        </div>
    );
};

export default ProjectCardContent;