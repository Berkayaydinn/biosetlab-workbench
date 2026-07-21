// runflow.js

export const runFlow = async (flowData, nodeId) => {
    console.log('Running flow:', flowData);
    try {
      const response = await fetch('http://localhost:3000/api/v1/graph/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(flowData),
      });
  
      if (!response.ok) {
        throw new Error('Failed to run flow');
      }
  
      const result = await response.json();
      
      // Find the node with the specified ID and return its output
      const node = result.nodes.find((node) => node.id === nodeId);
      if (node && node.outputs) {
        return node.outputs;
      } else {
        throw new Error('Node with specified ID not found or no outputs available');
      }
    } catch (error) {
      console.error('Error in runFlow function:', error);
      return null;
    }
  };
  