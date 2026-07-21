import { useState } from 'react';
import axios from 'axios';

import { Modal, Form, Input, Dropdown } from 'antd';
import { toast } from 'react-toastify';
import { EditOutlined,  DeleteOutlined, MoreOutlined } from '@ant-design/icons';

export const PlaygroundProjectSettingsDropdown = ({ project }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleRemoveProject = async () => {
        const response = await axios.delete(`http://localhost:3000/api/v1/project/${project.doc_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });
        
        if (response.status === 204) {
            window.location.reload();
        } else {
            toast.error("Failed to delete project");
        }
    }
    
    const handleUpdate = async () => {
        const projectName = document.getElementById('editProjectName');
        const description = document.getElementById('editDescription');
        const response = await axios.put(`http://localhost:3000/api/v1/project/${project.doc_id}`, {
            name: projectName.value,
            description: description.value
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        });

        if (response.status === 200) {
            window.location.reload();
        } else {
            toast.error("Failed to update project");
        }
        
        setIsModalOpen(false);
    }

    const items = [
        {
            label: 'Edit',
            icon: <EditOutlined />,
            key: '0',
            onClick: () => setIsModalOpen(true)
        },
        {
            label: 'Delete',
            icon: <DeleteOutlined />,
            key: '1',
            onClick: handleRemoveProject
        }
    ];
    
    const handleDropdownClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    
    return (
        <div onClick={handleDropdownClick}>
            <Dropdown menu={{ items }} trigger={['click']}>
                <MoreOutlined />
            </Dropdown>
            <Modal 
                title="Edit Project" 
                open={isModalOpen} 
                onCancel={() => setIsModalOpen(false)} 
                onOk={handleUpdate}
            >
                <Form>
                    <Form.Item label="Name" name="name">
                        <Input id="editProjectName" defaultValue={project.name} />
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
                            id="editDescription"
                            placeholder="Enter project description"
                            defaultValue={project.description}
                            autoSize={{
                                minRows: 3,
                                maxRows: 5,
                              }}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};
        