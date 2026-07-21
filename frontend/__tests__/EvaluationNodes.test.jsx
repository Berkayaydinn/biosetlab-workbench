import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Değerlendirme (Evaluation) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
      usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test 1: Test and Score Düğümü ---
  describe('Düğüm: Test and Score', () => {
    const nodeType = 'node-evaluation-test-and-score';

    test('başarılı bir şekilde oluşturulabilmeli', () => {
      act(() => {
        usePlaygroundStore.getState().addNode(nodeType);
      });
      const nodes = usePlaygroundStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe(nodeType);
    });

    test('veri ve model girişlerine doğru şekilde bağlanabilmeli', () => {
      const dataNode = { id: 'data-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const modelNode = { id: 'model-1', type: 'node-prediction-svm', data: { outputs: { 'model': {} } } };
      const testAndScoreNode = { id: 'eval-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [dataNode, modelNode, testAndScoreNode] });
      });

      const dataConnection = { source: dataNode.id, sourceHandle: 'data', target: testAndScoreNode.id, targetHandle: 'data' };
      const modelConnection = { source: modelNode.id, sourceHandle: 'model', target: testAndScoreNode.id, targetHandle: 'model' };
      act(() => {
        usePlaygroundStore.getState().addEdge(dataConnection);
        usePlaygroundStore.getState().addEdge(modelConnection);
      });

      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(2);
      expect(edges.every(e => e.target === testAndScoreNode.id)).toBe(true);
    });
  });

  // --- Test 2: Predictions Düğümü ---
  describe('Düğüm: Predictions', () => {
    const nodeType = 'node-evaluation-predictions';
    
    test('başarılı bir şekilde oluşturulabilmeli', () => {
        act(() => {
          usePlaygroundStore.getState().addNode(nodeType);
        });
        const nodes = usePlaygroundStore.getState().nodes;
        expect(nodes).toHaveLength(1);
        expect(nodes[0].type).toBe(nodeType);
    });

    test('veri ve model girişlerine doğru şekilde bağlanabilmeli', () => {
        const dataNode = { id: 'data-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
        const modelNode = { id: 'model-1', type: 'node-prediction-svm', data: { outputs: { 'model': {} } } };
        const predictionsNode = { id: 'pred-1', type: nodeType, data: {} };
        act(() => {
            usePlaygroundStore.setState({ nodes: [dataNode, modelNode, predictionsNode] });
        });

        const dataConnection = { source: dataNode.id, sourceHandle: 'data', target: predictionsNode.id, targetHandle: 'data' };
        const modelConnection = { source: modelNode.id, sourceHandle: 'model', target: predictionsNode.id, targetHandle: 'model' };
        act(() => {
            usePlaygroundStore.getState().addEdge(dataConnection);
            usePlaygroundStore.getState().addEdge(modelConnection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(2);
    });
  });

  // --- Test 3: Confusion Matrix Düğümü ---
  describe('Düğüm: Confusion Matrix', () => {
    const nodeType = 'node-evaluation-confusion-matrix';

    test('evaluation_results girişine doğru şekilde bağlanabilmeli', () => {
      const sourceNode = { id: 'source-1', type: 'node-evaluation-test-and-score', data: { outputs: { 'evaluation_results': {} } } };
      const matrixNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, matrixNode] });
      });

      const connection = { source: sourceNode.id, sourceHandle: 'evaluation_results', target: matrixNode.id, targetHandle: 'evaluation_results' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(matrixNode.id);
    });
  });

  // --- Test 4: ROC Curve Düğümü ---
  describe('Düğüm: ROC Curve', () => {
    const nodeType = 'node-evaluation-roc-curve';

    test('evaluation_results girişine doğru şekilde bağlanabilmeli', () => {
      const sourceNode = { id: 'source-1', type: 'node-evaluation-test-and-score', data: { outputs: { 'evaluation_results': {} } } };
      const rocNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, rocNode] });
      });

      const connection = { source: sourceNode.id, sourceHandle: 'evaluation_results', target: rocNode.id, targetHandle: 'evaluation_results' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(rocNode.id);
    });
  });
});