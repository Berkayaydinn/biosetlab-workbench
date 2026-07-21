import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Dönüşüm (Transform) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test 1: Train Test Split Düğümü ---
  describe('Düğüm: Train Test Split', () => {
    const nodeType = 'node-data-train-test-split';

    test('başarılı bir şekilde oluşturulabilmeli', () => {
      act(() => {
        usePlaygroundStore.getState().addNode(nodeType);
      });
      
      const nodes = usePlaygroundStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe(nodeType);
    });

    test('veri girişine (data input) doğru şekilde bağlanabilmeli', () => {
      // Hazırlık: Bir kaynak düğüm (örn: FileNode) ve bir TrainTestSplit düğümü
      const sourceNode = { id: 'source-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const trainTestNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, trainTestNode] });
      });

      // Eylem: İki düğümü bağla
      const connection = { source: sourceNode.id, sourceHandle: 'data', target: trainTestNode.id, targetHandle: 'data' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(trainTestNode.id);
    });

    test('eğitim verisi çıkışından (train output) bağlantı yapılabilmeli', () => {
      // Hazırlık: Bir TrainTestSplit düğümü ve bir hedef düğüm (örn: LogisticRegression)
      const trainTestNode = { id: 'source-1', type: nodeType, data: { outputs: { 'train': {} } } };
      const targetNode = { id: 'target-1', type: 'node-prediction-logistic-regression', data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [trainTestNode, targetNode] });
      });

      // Eylem: İki düğümü bağla
      const connection = { source: trainTestNode.id, sourceHandle: 'train', target: targetNode.id, targetHandle: 'data' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].source).toBe(trainTestNode.id);
    });
  });

  // --- Test 2: Impute Düğümü ---
  describe('Düğüm: Impute', () => {
    const nodeType = 'node-transform-impute';

    test('başarılı bir şekilde oluşturulabilmeli', () => {
      act(() => {
        usePlaygroundStore.getState().addNode(nodeType);
      });
      
      const nodes = usePlaygroundStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe(nodeType);
    });

    test('veri girişine (data input) doğru şekilde bağlanabilmeli', () => {
      // Hazırlık
      const sourceNode = { id: 'source-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const imputeNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, imputeNode] });
      });

      // Eylem
      const connection = { source: sourceNode.id, sourceHandle: 'data', target: imputeNode.id, targetHandle: 'data' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(imputeNode.id);
    });
  });
});