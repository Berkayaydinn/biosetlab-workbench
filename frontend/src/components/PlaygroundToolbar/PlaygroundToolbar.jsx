import React, { useState } from 'react';
import { FloatButton, Dropdown, Badge, Space, Popover, Modal, Input, Button, Typography, Alert, Select } from 'antd';
import { NodeIndexOutlined, RobotOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { NodeConfig, toolbarNodeGroups, toolbarNodeGroupList, toolbarNodeGroupItemMap, GroupColorMap } from '../../config/NodeConfig';
import ProjectCardContent from './ProjectCardContent';

const { TextArea } = Input;
const { Paragraph, Text } = Typography;

const Toolbar = () => {
    // Open state for the toolbar
    const [openToolbar, setOpenToolbar] = useState(true);
    const handleOpenToolbar = () => {
        setOpenToolbar(!openToolbar);
    };

    // Click node menu item
    const { addNode, generateAIWorkflow } = usePlaygroundStore();

    const [isAIModalOpen, setIsAIModalOpen] = useState(false);
    const [aiPrompt, setAIPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState('');
    const [explanation, setExplanation] = useState('');

    const [datasets, setDatasets] = useState([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState(null);
    const [columns, setColumns] = useState([]);
    const [targetColumn, setTargetColumn] = useState(null);
    const [isLoadingDatasets, setIsLoadingDatasets] = useState(false);
    const [isLoadingColumns, setIsLoadingColumns] = useState(false);

    const apiBaseUrl = "http://localhost:3838";

    const getAuthHeaders = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("Please sign in first.");
        }
        return { Authorization: `Bearer ${token}` };
    };

    const loadDatasets = async () => {
        setIsLoadingDatasets(true);
        setGenerationError('');
        setDatasets([]);
        setSelectedDatasetId(null);
        setColumns([]);
        setTargetColumn(null);

        try {
            const response = await fetch(
                `${apiBaseUrl}/api/llm/datasets/authorized`,
                { headers: getAuthHeaders() }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load datasets.");
            }

            setDatasets(Array.isArray(result.datasets) ? result.datasets : []);
        } catch (error) {
            setGenerationError(error.message || "Unable to load datasets.");
        } finally {
            setIsLoadingDatasets(false);
        }
    };

    const handleDatasetChange = async (datasetId) => {
        setSelectedDatasetId(datasetId);
        setColumns([]);
        setTargetColumn(null);
        setGenerationError('');
        setIsLoadingColumns(true);

        try {
            const response = await fetch(
                `${apiBaseUrl}/api/llm/datasets/${encodeURIComponent(datasetId)}/columns`,
                { headers: getAuthHeaders() }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Unable to load columns.");
            }

            setColumns(Array.isArray(result.columns) ? result.columns : []);
        } catch (error) {
            setGenerationError(error.message || "Unable to load columns.");
        } finally {
            setIsLoadingColumns(false);
        }
    };


    const handleGenerateWorkflow = async () => {
        const normalizedPrompt = aiPrompt.trim();

        if (!normalizedPrompt) {
            setGenerationError(
                'Please describe the biomedical analysis workflow.'
            );
            return;
        }

        setIsGenerating(true);
        setGenerationError('');
        setExplanation('');

        try {
            const result = await generateAIWorkflow(
                normalizedPrompt,
                selectedDatasetId,
                targetColumn
            );

            setExplanation(
                result?.explanation ||
                'The workflow was generated and added to the canvas.'
            );
        } catch (error) {
            setGenerationError(
                error instanceof Error
                    ? error.message
                    : 'Workflow generation failed.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

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
        <>
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

            <FloatButton
                icon={<RobotOutlined />}
                title='Generate with AI'
                type='primary'
                onClick={() => {
                    setGenerationError('');
                    setExplanation('');
                    setIsAIModalOpen(true);
                    loadDatasets();
                }}
            />

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

        <Modal
            title={
                <Space>
                    <RobotOutlined />
                    Generate Workflow with AI
                </Space>
            }
            open={isAIModalOpen}
            width={620}
            onCancel={() => {
                if (!isGenerating) {
                    setIsAIModalOpen(false);
                }
            }}
            footer={[
                <Button
                    key='cancel'
                    disabled={isGenerating}
                    onClick={() => setIsAIModalOpen(false)}
                >
                    Close
                </Button>,
                <Button
                    key='generate'
                    type='primary'
                    icon={<ThunderboltOutlined />}
                    loading={isGenerating}
                    onClick={handleGenerateWorkflow}
                >
                    Generate Workflow
                </Button>
            ]}
        >
            <Paragraph type='secondary'>
                Describe the biomedical analysis you want to perform.
                The generated workflow will be added to the canvas.
            </Paragraph>


            <div style={{ marginBottom: 16 }}>
                <Text strong>Dataset</Text>
                <Select
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Select an accessible dataset"
                    loading={isLoadingDatasets}
                    disabled={isGenerating || isLoadingDatasets}
                    value={selectedDatasetId}
                    options={datasets.map(dataset => ({
                        value: dataset._id,
                        label: dataset.name || dataset._id
                    }))}
                    onChange={handleDatasetChange}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <Text strong>Target Column</Text>
                <Select
                    showSearch
                    optionFilterProp="label"
                    style={{ width: '100%', marginTop: 8 }}
                    placeholder="Select the prediction target"
                    loading={isLoadingColumns}
                    disabled={
                        isGenerating ||
                        !selectedDatasetId ||
                        isLoadingColumns
                    }
                    value={targetColumn}
                    options={columns.map(column => ({
                        value: column,
                        label: column
                    }))}
                    onChange={setTargetColumn}
                />
            </div>

            <Text strong>Workflow description</Text>

            <TextArea
                value={aiPrompt}
                placeholder='Example: Create a classification workflow with preprocessing and evaluation'
                autoSize={{ minRows: 5, maxRows: 9 }}
                maxLength={1000}
                showCount
                disabled={isGenerating}
                style={{
                    marginTop: 8,
                    marginBottom: 16
                }}
                onChange={(event) => {
                    setAIPrompt(event.target.value);
                    setGenerationError('');
                }}
                onPressEnter={(event) => {
                    if (
                        (event.metaKey || event.ctrlKey) &&
                        !isGenerating
                    ) {
                        handleGenerateWorkflow();
                    }
                }}
            />

            {generationError && (
                <Alert
                    type='error'
                    showIcon
                    message='Workflow could not be generated'
                    description={generationError}
                    style={{ marginBottom: 12 }}
                />
            )}

            {explanation && (
                <Alert
                    type='success'
                    showIcon
                    message='Workflow generated'
                    description={explanation}
                />
            )}
        </Modal>
        </>
    );
}

export { Toolbar };