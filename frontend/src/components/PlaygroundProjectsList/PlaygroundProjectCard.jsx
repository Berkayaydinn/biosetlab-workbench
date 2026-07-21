import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import { Modal, Form, Input, Card, Radio, Tooltip } from 'antd';
import { PlaygroundProjectSettingsDropdown } from './PlaygroundProjectSettingsDropdown';
import { exampleBlank } from '../../store/playgroundExamples/blank';
import { exampleBasic } from '../../store/playgroundExamples/basic';
import { exampleCrossValidation } from '../../store/playgroundExamples/crossValidation';
import { examplePrincipalComponentAnalysis } from '../../store/playgroundExamples/principalComponentAnalysis';
import { exampleFeatureExplain } from '../../store/playgroundExamples/featureExplain';
import { exampleHierarchicalClustering } from '../../store/playgroundExamples/hierarchicalClustering';


const PlaygroundProjectCard = ({ project }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).replace(/ /g, ' ');
    };

    return (
    <Link
        to={
        '/playground/' + project.doc_id
        }
        key={project._id}
    >
    <div className="border border-gray-300 p-2 rounded-md mb-4 hover:border-blue-500 transition duration-300 h-[200px] flex flex-col">
        <div className="flex items-center justify-between">
            <h3 className="text-md font-semibold mb-0.5">
            {project.name.length > 300
                ? project.name.substring(0, 300) + "..."
                : project.name}
            </h3>
            <PlaygroundProjectSettingsDropdown project={project} />
        </div>
        <div className="text-sm text-gray-900 space-y-0.5">
            <p>{project.ownerName} {project.ownerSurname}</p>
            <p className="text-gray-700">Created: {formatDate(project.created_at)}</p>
            <p className="text-gray-700">Last Updated: {formatDate(project.updated_at)}</p>
        </div>
        <div className="text-sm text-gray-700 flex-1 overflow-hidden mt-2 max-w-full">
            <p className="line-clamp-4 whitespace-pre-wrap break-words">
                {project.description}
            </p>
        </div>
    </div>
    </Link>
    );
};


const PlaygroundProjectCreateCard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedExample, setSelectedExample] = useState('blank');
    const [form] = Form.useForm();
    
    const examples = [
        {
            key: 'blank',
            ...exampleBlank,
        },
        {
            key: 'basic',
            ...exampleBasic,
        },
        {
            key: 'crossValidation',
            ...exampleCrossValidation,
        },
        {
            key: 'principalComponentAnalysis',
            ...examplePrincipalComponentAnalysis,
        },
        {
            key: 'featureExplain',
            ...exampleFeatureExplain,
        },
        {
            key: 'hierarchicalClustering',
            ...exampleHierarchicalClustering,
        },
    ];

    const showModal = () => {
        setIsModalOpen(true);
        form.resetFields();
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            const selectedTemplate = examples.find(ex => ex.key === selectedExample);
            
            const response = await axios.post('http://localhost:3000/api/v1/project/', {
                name: values.projectName,
                description: values.description,
                graph: selectedTemplate.graph,
                collaborators: [],
                tags: []
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const doc_id = response.data.doc_id;
            window.location.href = `/playground/${doc_id}`;

        } catch (error) {
            if (error.errorFields) {
                // Form validation error
                return;
            }
            console.error(error);
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    return (
        <>
            <div className="border border-gray-300 p-2 rounded-md mb-4 hover:border-blue-500 transition 
            duration-300 flex items-center justify-center bg-gray-100 h-[200px] cursor-pointer" onClick={showModal}>
                <h3 className="text-6xl font-thin text-gray-500">
                    +
                </h3>
            </div>
            <Modal 
                title="Create New Project" 
                open={isModalOpen} 
                onOk={handleOk} 
                onCancel={handleCancel}
                width={800}
            >
                <Form 
                    form={form}
                    layout="vertical"
                    initialValues={{
                        projectName: '',
                        description: ''
                    }}
                >
                    <Form.Item
                        label="Project Name"
                        name="projectName"
                        rules={[
                            { required: true, message: 'Please input your project name' },
                            { min: 3, message: 'Project name must be at least 3 characters' },
                            { max: 50, message: 'Project name cannot be longer than 50 characters' },
                            { whitespace: true, message: 'Project name cannot be empty' }
                        ]}
                    >
                        <Input placeholder="Enter project name" />
                    </Form.Item>
                    <Form.Item
                        label="Description"
                        name="description"
                        rules={[
                            { max: 500, message: 'Description cannot be longer than 500 characters' },
                            { whitespace: true, message: 'Description cannot be empty' }
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter project description"
                            autoSize={{
                                minRows: 3,
                                maxRows: 5,
                              }}
                        />
                    </Form.Item>
                    <Form.Item label="Select Template">
                        <Radio.Group 
                            value={selectedExample} 
                            onChange={(e) => setSelectedExample(e.target.value)}
                            className="w-full"
                        >
                            <div className="grid grid-cols-3 gap-4">
                                {examples.map((example) => (
                                    <div key={example.key} onClick={() => setSelectedExample(example.key)}>
                                        <Radio.Button 
                                            value={example.key}
                                            className="w-full h-full hidden"
                                        >
                                            <div></div>
                                        </Radio.Button>
                                        <Card
                                            hoverable
                                            cover={
                                                <div className="aspect-[16/9] overflow-hidden bg-gray-100 rounded-t-lg">
                                                    <img
                                                        alt={example.name}
                                                        src={example.cover}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            }
                                            bodyStyle={{ padding: '12px' }}
                                            className={`h-[250px] transition-all duration-200 hover:border-blue-500 hover:border-1 hover:shadow-none
                                                ${selectedExample === example.key ? 'border-blue-500 border-1' : ''} overflow-hidden`}
                                        >
                                            <Card.Meta
                                                title={example.name}
                                                description={
                                                    <div className="h-16 overflow-hidden text-xs">
                                                        <Tooltip title={example.description}>
                                                            {example.description}
                                                        </Tooltip>
                                                    </div>
                                                }
                                            />
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export { PlaygroundProjectCard, PlaygroundProjectCreateCard };