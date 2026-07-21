import Icon, { EditOutlined,  DeleteOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Modal } from 'antd';
import { usePlaygroundStore } from '../../../store/playgroundStore';


export const NodeSettingsDropdown = ({ id }) => {
    const { removeNode } = usePlaygroundStore();
    
    const handleRemoveNode = () => {
        removeNode(id);
    }
    
    const items = [
        {
            label: 'Edit',
            icon: <EditOutlined />,
            key: '0',
        },
        {
            label: 'Delete',
            icon: <DeleteOutlined />,
            key: '1',
            onClick: handleRemoveNode,
        }
      ];
    
    return (
        <Dropdown menu={ {items} } trigger={['click']}>
            <EllipsisOutlined />
        </Dropdown>
    );
};
