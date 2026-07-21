import React, { useCallback, useMemo } from 'react';
import { Menu } from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  CopyOutlined 
} from '@ant-design/icons';
import { usePlaygroundStore } from '../../../store/playgroundStore';

const NodeContextMenu = React.memo(({ node, closeContextMenu }) => {
  const { removeNode, duplicateNode } = usePlaygroundStore();

  const handleRemoveNode = useCallback(() => {
    removeNode(node.id);
    closeContextMenu();
  }, [node.id, removeNode, closeContextMenu]);

  const handleDuplicateNode = useCallback(() => {
    duplicateNode(node.id);
    closeContextMenu();
  }, [node.id, duplicateNode, closeContextMenu]);

  const handleEditNode = useCallback(() => {
    const editButton = document.querySelector(`[data-node-id="${node.id}"] .ant-card-extra [data-testid="expand-details"]`);
    if (editButton) {
      editButton.click();
    }
    closeContextMenu();
  }, [node.id, closeContextMenu]);

  const items = useMemo(() => [
    {
      label: 'Edit',
      icon: <EditOutlined />,
      key: '0',
      onClick: handleEditNode,
      disabled: true
    },
    {
      label: 'Duplicate',
      icon: <CopyOutlined />,
      key: '1',
      onClick: handleDuplicateNode
    },
    {
      label: 'Delete',
      icon: <DeleteOutlined />,
      key: '2',
      onClick: handleRemoveNode,
      danger: true
    }
  ], [handleEditNode, handleDuplicateNode, handleRemoveNode]);

  return (
    <Menu 
      items={items}
      style={{
        boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
        borderRadius: '8px',
        minWidth: '160px',
      }}
    />
  );
});

NodeContextMenu.displayName = 'NodeContextMenu';

export { NodeContextMenu };
