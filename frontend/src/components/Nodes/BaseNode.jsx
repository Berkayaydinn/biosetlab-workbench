import React, { memo, useCallback, useMemo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { usePlaygroundStore } from '../../store/playgroundStore';
import { NodeConfig } from '../../config/NodeConfig';
import { NodeSettingsDropdown } from './utils/NodeSettings';
import { toast } from 'react-toastify';
import NodeModal from '../NodeModal/NodeModal';
import { PlayCircleOutlined, ExpandAltOutlined, ThunderboltOutlined, ThunderboltFilled, LoadingOutlined } from '@ant-design/icons';
import { Space, Card, Tooltip, Collapse, Button, Alert } from 'antd';
import { ModalName } from '../NodeModal/NodeModalItem';
const { Meta } = Card;

// Custom comparison function for memo
const areEqual = (prevProps, nextProps) => {
  // Compare basic properties and serializable data
  const dataComparison = 
    prevProps.id === nextProps.id &&
    prevProps.type === nextProps.type &&
    prevProps.data.updated === nextProps.data.updated &&
    prevProps.data.success === nextProps.data.success &&
    JSON.stringify(prevProps.data.errors) === JSON.stringify(nextProps.data.errors) &&
    JSON.stringify(prevProps.data.parameters) === JSON.stringify(nextProps.data.parameters) &&
    JSON.stringify(prevProps.data.outputs) === JSON.stringify(nextProps.data.outputs) &&
    JSON.stringify(prevProps.data.position) === JSON.stringify(nextProps.data.position);

  // For React elements and components, we'll do a shallow comparison
  const modalContentEqual = prevProps.modalContent === nextProps.modalContent;
  const childrenEqual = prevProps.children === nextProps.children;

  return dataComparison && modalContentEqual && childrenEqual;
};

// Create memoized components for static parts
const MemoizedHandles = memo(({ node_config, portStyle }) => (
  <>
    {node_config.inputs.map((input, index) => (
      <Tooltip title={`${input.label} (${input.type})${input.multi ? " [multi]" : ""}`} key={`input-tooltip-${index}`}>
        <Handle
          key={`input-${index}`}
          type="target"
          id={input.name}
          position={Position.Left}
          style={{ 
            ...portStyle, 
            top: `${index * 25 + 15}px`, 
            backgroundColor: input.multi ? '#faad14' : '#4CAF50' 
          }}
        />
      </Tooltip>
    ))}
    {node_config.outputs.map((output, index) => (
      <Tooltip title={output.label+" ("+output.type+")"} key={`output-tooltip-${index}`}>
        <Handle
          key={`output-${index}`}
          type="source"
          id={output.name}
          position={Position.Right}
          style={{ 
            ...portStyle, 
            top: `${index * 25 + 15}px` 
          }}
        />
      </Tooltip>
    ))}
  </>
));

const MemoizedNodeContent = memo(({ meta, modalContent, isModalOpen, closeModal, data, updatedIcon }) => (
  <>
    {meta}
    <NodeModal 
      nodeName={<>{data?.name + (data?.name_count > 0 ? " (" + data?.name_count + ")" : "") || node_config.name}  {updatedIcon(data)}</>} 
      isOpen={isModalOpen} 
      closeModal={closeModal} 
      modalContent={modalContent} 
    />
  </>
));

const errorMessages = (errors) => {
  const errorTypes = {
    "failure": "FAILURE",
    "warning": "WARNING",
    "info": "INFO",
  }
  return errors.map((error, index) => (
    <div key={index}>
      • {errorTypes[error.type]}: {error.message}
    </div>
  ));
};

// Memoize the Alert component
const MemoizedAlert = memo(({ errors }) => {
  if (!errors || errors.length === 0) return null;

  const failureMessages = errors.filter((error) => error.type === 'failure');
  const failureAlert = (failureMessages.length > 0) ? (
    <Alert
      className='mb-2'
      message="Error"
      description={errorMessages(failureMessages)}
      type="error"
      showIcon
    />
  ) : null
  const warningMessages = errors.filter((error) => error.type === 'warning');
  const warningAlert = (warningMessages.length > 0) ? (
    <Alert
      className='mb-2'
      message="Warning"
      description={errorMessages(warningMessages)}
      type="warning"
      showIcon
    />
  ) : null
  const infoMessages = errors.filter((error) => error.type === 'info');
  const infoAlert = (infoMessages.length > 0) ? (
    <Alert
      className='mb-2'
      message="Info"
      description={errorMessages(infoMessages)}
      type="info"
      showIcon
    />
  ) : null
  return (
    <>
      {failureAlert}
      {warningAlert}
      {infoAlert}
    </>
  );
});

// Memoize the Parameters section
const MemoizedParameters = memo(({ children, handleRunPlaygroundGraph, id }) => (
  <>
    <ModalName name="Parameters" />
    <Card bordered={true} style={{ width: 300 }}>
      <div className="max-w-sm">
        {children}
      </div>
      <Button 
        className="mt-4" 
        type="default" 
        icon={<PlayCircleOutlined />} 
        onClick={() => handleRunPlaygroundGraph(id)}
      >
        Run
      </Button>
    </Card>
  </>
));

// Memoize the Collapse component
const MemoizedCollapse = memo(({ children }) => (
  <Collapse 
    size="small" 
    bordered={false} 
    items={[{
      key: '1',
      label: 'Parameters',
      children: children,
    }]} 
  />
));

// BaseNode bileşeni, etiket, renk, bağlantı noktaları ve ikon gibi temel özellikleri alır
const BaseNode = memo(({ id, data, children, modalContent, type}) => {
  
  const { compactMode, runPlaygroundGraph, getNodeState } = usePlaygroundStore();
  const node_config = NodeConfig[type];

  // Memoize handlers and styles first
  const handleRunPlaygroundGraph = useCallback(async () => {
    try {
      const data = await runPlaygroundGraph(id);
      if (data.errors.length === 0) {
        toast.success("Graph ran successfully")
      } else {
        const failureMessages = data?.errors.some((error) => error.type === 'failure');
        if (failureMessages) {
          toast.error("A node failed to run. Please check the node for details.")
        }
        const warningMessages = data?.errors.some((error) => error.type === 'warning');
        if (warningMessages) {
          toast.success("Graph ran successfully")
          toast.warning("A node has warnings. Please check the node for details.")
        }
        const infoMessages = data?.errors.some((error) => error.type === 'info');
        if (infoMessages) {
          toast.success("Graph ran successfully")
          toast.info("A node has info. Please check the node for details.")
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [id, runPlaygroundGraph]);


  // Memoize static styles
  const portStyle = React.useMemo(() => ({
    width: '14px',
    height: '14px',
    backgroundColor: '#4CAF50',
    borderRadius: '50%',
    border: '2px solid #fff',
  }), []);

  const cardStyle = React.useMemo(() => {
    const width = compactMode ? 150 : 300;
    return {
      width,
      borderColor: node_config.color,
      transition: 'width 0.3s ease',
    };
  }, [compactMode, node_config.color]);

  const bodyStyle = React.useMemo(() => ({
    padding: compactMode ? '12px 8px' : '24px',
    transition: 'padding 0.3s ease',
  }), [compactMode]);

  const iconStyle = React.useMemo(() => ({
    fontSize: compactMode ? '24px' : '16px',
    transition: 'font-size 0.3s ease',
  }), [compactMode]);

  const descriptionStyle = React.useMemo(() => ({
    overflow: compactMode ? 'hidden' : 'visible',
    textOverflow: compactMode ? 'ellipsis' : 'clip',
    whiteSpace: compactMode ? 'nowrap' : 'normal',
    maxWidth: '100%',
    left: 0,
    right: 0,
  }), [compactMode]);

  // Modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Icont that represents the state of the node
  const updatedIcon = (data) => {
    const state = getNodeState(id);
    
    // Show running state with Antd spinner
    if (state === 'running') {
      return <LoadingOutlined/>
    }
    
    // Default behavior for idle/completed nodes
    let color = 'grey';
    if (!data?.updated) return <ThunderboltOutlined style={{ color }} />
    const hasFailure = data.errors.some((error) => error.type === 'failure');
    const hasWarning = data.errors.some((error) => error.type === 'warning');
    const hasInfo = data.errors.some((error) => error.type === 'info');
    if (hasFailure) {
      color = 'red';
    } else if (hasWarning) {
      color = 'orange';
    } else if (hasInfo) {
      color = '#1677FF';
    } else {
      color = 'green';
    }
    const messages = errorMessages(data?.errors);
    if (messages.length > 0) {
      return <Tooltip title={messages}><ThunderboltFilled style={{ color }} /></Tooltip>
    }
    return <ThunderboltFilled style={{ color }} />
  };

  // Memoize actions array - after modal state is defined
  const actions = useMemo(() => {
    const baseActions = [
      <PlayCircleOutlined key="run" onClick={handleRunPlaygroundGraph} />,
      updatedIcon(data),
      <ExpandAltOutlined key="details" onClick={openModal} />,
    ];
    
    if (!compactMode) {
      baseActions.push(<NodeSettingsDropdown key="settings" id={id} />);
    }
    
    return baseActions;
  }, [compactMode, id, handleRunPlaygroundGraph, openModal, data]);

  // Memoize meta content - after modal state is defined
  const meta = React.useMemo(() => {
    if (compactMode) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          {React.cloneElement(node_config.icon, { style: { ...iconStyle, marginBottom: '4px' } })}
          <span style={{fontSize: '12px' }}>{data?.name + (data?.name_count > 0 ? " (" + data?.name_count + ")" : "") || node_config.name}</span>
        </div>
      );
    }
    
    return (
      <Meta
        avatar={React.cloneElement(node_config.icon, { style: iconStyle })}
        title={data?.name + (data?.name_count > 0 ? " (" + data?.name_count + ")" : "") || node_config.name}
        description={
          <div style={descriptionStyle}>
            {data?.description || node_config.description}
          </div>
        }
      />
    );
  }, [compactMode, data, node_config, iconStyle, descriptionStyle]);

  const modalContentExtended = useMemo(() => (
    <div>
      <MemoizedAlert errors={data?.errors} />
      {modalContent}
      <MemoizedParameters 
        children={children}
        handleRunPlaygroundGraph={handleRunPlaygroundGraph}
        id={id}
      />
    </div>
  ), [data?.updated, data?.success, data?.errors, modalContent, children, handleRunPlaygroundGraph, id]);

  return (
    <Card
      style={cardStyle}
      actions={actions}
      styles={{
        body: bodyStyle,
      }}
    >
      <MemoizedNodeContent 
        meta={meta}
        modalContent={modalContentExtended}
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        data={data}
        updatedIcon={updatedIcon}
      />
      {!compactMode && (
        <>
          <div className='h-6'></div>
          <MemoizedCollapse children={children} />
        </>
      )}
      <MemoizedHandles node_config={node_config} portStyle={portStyle} />
    </Card>
  );
}, areEqual);

export default BaseNode;
