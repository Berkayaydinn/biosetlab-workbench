import React, { useState } from 'react';
import { FloatButton, Dropdown, Badge, Space, Popover } from 'antd';
import { NodeIndexOutlined } from '@ant-design/icons';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { NodeConfig, toolbarNodeGroups, toolbarNodeGroupList, toolbarNodeGroupItemMap, GroupColorMap } from '../../config/NodeConfig';
import ProjectCardContent from './ProjectCardContent';

const Toolbar = () => {
    // Open state for the toolbar
    const [openToolbar, setOpenToolbar] = useState(true);
    const handleOpenToolbar = () => {
        setOpenToolbar(!openToolbar);
    };

    // Click node menu item
    const { addNode } = usePlaygroundStore();
    const handleClick = (type) => {
        addNode(type);
    };

    const menuItemsMap = toolbarNodeGroupList.reduce((acc, group) => {
        const items = toolbarNodeGroupItemMap[group]?.map((type) => {
            return {
                key: type,
                icon: NodeConfig[type].icon,
                label: NodeConfig[type].name,
                onClick: () => handleClick(type),
            };
        }) || [];
        return { ...acc, [group]: items };
    }, {});

    return (
        <FloatButton.Group
            shape='square'
            style={{
                position: 'fixed',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 40,
                height: 40*toolbarNodeGroupList.length,
            }}
        >
            <Popover 
                content={ProjectCardContent}
                placement="right"
                trigger="hover"
            >
                <FloatButton
                    icon={<NodeIndexOutlined />}
                    title='Project'
                />
            </Popover>
            {toolbarNodeGroups && toolbarNodeGroupList.map((type) => (
                <Dropdown key={type} 
                    menu={{
                        items: [
                            {
                                key: `${type}-header`,
                                label: <Space>
                                    <Badge color={GroupColorMap[type]} />
                                    {toolbarNodeGroups[type].name}
                                </Space>,
                                type: 'group',
                            },
                            ...menuItemsMap[type]
                        ]
                    }}
                    placement='right'>

                    <FloatButton
                        key={type}
                        icon={toolbarNodeGroups[type].icon}
                        title={toolbarNodeGroups[type].name}
                    />
                </Dropdown>
            ))}
        </FloatButton.Group>
    );
}

export { Toolbar };