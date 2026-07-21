import React from 'react';
import { Tag } from 'antd';
import { 
  AimOutlined, 
  CompassOutlined, 
  FieldBinaryOutlined, 
  FieldNumberOutlined, 
  FieldStringOutlined, 
  FieldTimeOutlined, 
  GroupOutlined,
  QuestionCircleOutlined, 
  EyeInvisibleOutlined,
  BulbOutlined
} from '@ant-design/icons';

// Column Type definitions
export const COLUMN_TYPE_COLOR = {
  'categorical': 'green',
  'text': 'volcano',
  'numeric': 'red',
  'boolean': 'cyan',
  'date': 'purple',
  'unknown': '',
};

export const COLUMN_TYPE_NAME = {
  'categorical': 'Categorical',
  'text': 'Text',
  'numeric': 'Numeric',
  'boolean': 'Boolean',
  'date': 'Date',
  'unknown': 'Unknown',
};

export const COLUMN_TYPE_ICON = {
  'categorical': <GroupOutlined />,
  'text': <FieldStringOutlined />,
  'numeric': <FieldNumberOutlined />,
  'boolean': <FieldBinaryOutlined />,
  'date': <FieldTimeOutlined />,
  'unknown': <QuestionCircleOutlined />,
};

// Column Class definitions
export const COLUMN_CLASS_COLOR = {
  'target': 'gold',
  'feature': 'geekblue',
  'meta': 'blue',
  'skip': 'magenta',
  'unknown': '',
};

export const COLUMN_CLASS_NAME = {
  'target': 'Target',
  'feature': 'Feature',
  'meta': 'Meta',
  'skip': 'Skip',
  'unknown': 'Unknown',
};

export const COLUMN_CLASS_ICON = {
  'target': <AimOutlined />,
  'feature': <CompassOutlined />,
  'meta': <BulbOutlined />,
  'skip': <EyeInvisibleOutlined />,
  'unknown': <QuestionCircleOutlined />,
};

// Custom renderers for Select dropdowns
export const renderTypeOption = (item) => ({
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tag color={COLUMN_TYPE_COLOR[item.value]} icon={COLUMN_TYPE_ICON[item.value]} style={{ margin: 0 }}>
        {COLUMN_TYPE_NAME[item.value]}
      </Tag>
    </div>
  ),
  value: item.value,
});

export const renderClassOption = (item) => ({
  label: (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <Tag color={COLUMN_CLASS_COLOR[item.value]} icon={COLUMN_CLASS_ICON[item.value]} style={{ margin: 0 }}>
        {COLUMN_CLASS_NAME[item.value]}
      </Tag>
    </div>
  ),
  value: item.value,
});

// Export options for Select components
export const columnTypes = [
  { value: 'numeric', label: COLUMN_TYPE_NAME['numeric'] },
  { value: 'categorical', label: COLUMN_TYPE_NAME['categorical'] },
  { value: 'text', label: COLUMN_TYPE_NAME['text'] },
  { value: 'date', label: COLUMN_TYPE_NAME['date'] },
  { value: 'boolean', label: COLUMN_TYPE_NAME['boolean'] },
  { value: 'unknown', label: COLUMN_TYPE_NAME['unknown'] }
].map(renderTypeOption);

export const columnClasses = [
  { value: 'feature', label: COLUMN_CLASS_NAME['feature'] },
  { value: 'target', label: COLUMN_CLASS_NAME['target'] },
  { value: 'meta', label: COLUMN_CLASS_NAME['meta'] },
  { value: 'skip', label: COLUMN_CLASS_NAME['skip'] },
  { value: 'unknown', label: COLUMN_CLASS_NAME['unknown'] }
].map(renderClassOption);

// Component for rendering a column type badge
export const ColumnTypeBadge = ({ type }) => (
  <Tag color={COLUMN_TYPE_COLOR[type]} icon={COLUMN_TYPE_ICON[type]} style={{ margin: 0, display: 'inline-flex', alignItems: 'center' }}>
    {COLUMN_TYPE_NAME[type]}
  </Tag>
);

// Component for rendering a column class badge
export const ColumnClassBadge = ({ classType }) => (
  <Tag color={COLUMN_CLASS_COLOR[classType]} icon={COLUMN_CLASS_ICON[classType]} style={{ margin: 0, display: 'inline-flex', alignItems: 'center' }}>
    {COLUMN_CLASS_NAME[classType]}
  </Tag>
);

// Helper function to create table columns with formatted badges
export const createTableColumns = (columns) => {
  return columns.map((column) => {
    if (column === 'Type') {
      return {
        title: column,
        dataIndex: column,
        render: (text) => <ColumnTypeBadge type={text} />,
      };
    } else if (column === 'Class') {
      return {
        title: column,
        dataIndex: column,
        render: (text) => <ColumnClassBadge classType={text} />,
      };
    } else if (column === 'Missing Ratio') {
      return {
        title: column,
        dataIndex: column,
        render: (text) => <>{text}%</>,
      };
    }
    return { title: column, dataIndex: column };
  });
}; 