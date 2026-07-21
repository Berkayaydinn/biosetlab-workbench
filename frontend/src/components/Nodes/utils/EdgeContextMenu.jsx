import React, { useCallback, useMemo } from 'react';
import { Menu } from 'antd';
import { 
  DeleteOutlined 
} from '@ant-design/icons';
import { usePlaygroundStore } from '../../../store/playgroundStore';

const EdgeContextMenu = React.memo(({ edge, closeContextMenu }) => {
  const { removeEdge } = usePlaygroundStore();

  const handleRemoveEdge = useCallback(() => {
    removeEdge(edge.id);
    closeContextMenu();
  }, [edge.id, removeEdge, closeContextMenu]);

  const items = useMemo(() => [
    {
      label: 'Delete',
      icon: <DeleteOutlined />,
      key: '1',
      onClick: handleRemoveEdge,
      danger: true
    }
  ], [handleRemoveEdge]);

  return (
    <Menu
      items={items}
      style={{
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
        borderRadius: '8px',
        minWidth: '160px',
      }}
    />
  );
});

EdgeContextMenu.displayName = 'EdgeContextMenu';

export { EdgeContextMenu };
