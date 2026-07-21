import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Açıklama (Explain) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test 1: Feature Importance Düğümü ---
  describe('Düğüm: Feature Importance', () => {
    const nodeType = 'node-explain-feature-importance';

    test('başarılı bir şekilde oluşturulabilmeli', () => {
      act(() => {
        usePlaygroundStore.getState().addNode(nodeType);
      });
      const nodes = usePlaygroundStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe(nodeType);
    });

    test('veri ve model girişlerine doğru şekilde bağlanabilmeli', () => {
      // Hazırlık: Bir veri ve bir model kaynağı, bir de Feature Importance düğümü
      const dataNode = { id: 'data-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const modelNode = { id: 'model-1', type: 'node-prediction-svm', data: { outputs: { 'model': {} } } };
      const featureImpNode = { id: 'explain-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [dataNode, modelNode, featureImpNode] });
      });

      // Eylem: Gerekli tüm bağlantıları yap
      const dataConnection = { source: dataNode.id, sourceHandle: 'data', target: featureImpNode.id, targetHandle: 'data' };
      const modelConnection = { source: modelNode.id, sourceHandle: 'model', target: featureImpNode.id, targetHandle: 'model' };
      act(() => {
        usePlaygroundStore.getState().addEdge(dataConnection);
        usePlaygroundStore.getState().addEdge(modelConnection);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(2);
      expect(edges.every(e => e.target === featureImpNode.id)).toBe(true);
    });
  });

  // --- Test 2: Explain Model Düğümü ---
  describe('Düğüm: Explain Model', () => {
    const nodeType = 'node-explain-explain-model';
    
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
        const modelNode = { id: 'model-1', type: 'node-prediction-random-forest', data: { outputs: { 'model': {} } } };
        const explainNode = { id: 'explain-1', type: nodeType, data: {} };
        act(() => {
            usePlaygroundStore.setState({ nodes: [dataNode, modelNode, explainNode] });
        });

        const dataConnection = { source: dataNode.id, sourceHandle: 'data', target: explainNode.id, targetHandle: 'data' };
        const modelConnection = { source: modelNode.id, sourceHandle: 'model', target: explainNode.id, targetHandle: 'model' };
        act(() => {
            usePlaygroundStore.getState().addEdge(dataConnection);
            usePlaygroundStore.getState().addEdge(modelConnection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(2);
    });
  });
});