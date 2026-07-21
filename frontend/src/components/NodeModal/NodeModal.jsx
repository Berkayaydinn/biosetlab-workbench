import { Drawer, Spin } from 'antd';
import { useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';

const NodeModal = ({ isOpen, closeModal, nodeName="", modalContent}) => {
    const [shouldRenderContent, setShouldRenderContent] = useState(false);

    return (
        <Drawer
            title={nodeName}
            placement="right"
            closable={true}
            onClose={closeModal}
            afterOpenChange={(visible) => {
                if (visible) {
                    // Wait for drawer animation to complete before rendering content
                    setTimeout(() => setShouldRenderContent(true), 100);
                } else {
                    // Set to false only after drawer is fully closed
                    setShouldRenderContent(false);
                }
            }}
            open={isOpen}
            width='60%'
            // Destroy the modal content when it is closed
            // to prevent the modal from re-rendering the content
            // for all DOM updates
            destroyOnClose
        >
            <div style={{ maxHeight: '100%', overflowY: 'auto' }}>
                {!shouldRenderContent ? (
                    <>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10'>
                            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
                        </div>
                    </>
                ) : (
                    modalContent
                )}
            </div>
        </Drawer>
    );
};

export default NodeModal;
