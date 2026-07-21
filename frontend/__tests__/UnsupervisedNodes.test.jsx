import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Gözetimsiz Öğrenme (Unsupervised) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test 1: PCA Düğümü ---
  describe('Düğüm: PCA', () => {
    const nodeType = 'node-unsupervised-pca';

    test('başarılı bir şekilde oluşturulabilmeli', () => {
      act(() => {
        usePlaygroundStore.getState().addNode(nodeType);
      });
      const nodes = usePlaygroundStore.getState().nodes;
      expect(nodes).toHaveLength(1);
      expect(nodes[0].type).toBe(nodeType);
    });

    test('veri girişine (data input) doğru şekilde bağlanabilmeli', () => {
      const sourceNode = { id: 'source-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const pcaNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, pcaNode] });
      });

      const connection = { source: sourceNode.id, sourceHandle: 'data', target: pcaNode.id, targetHandle: 'data' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(pcaNode.id);
    });
  });

  // --- Test 2: K-Means Düğümü ---
  describe('Düğüm: K-Means', () => {
    const nodeType = 'node-unsupervised-kmeans';
    
    test('başarılı bir şekilde oluşturulabilmeli', () => {
        act(() => {
          usePlaygroundStore.getState().addNode(nodeType);
        });
        const nodes = usePlaygroundStore.getState().nodes;
        expect(nodes).toHaveLength(1);
        expect(nodes[0].type).toBe(nodeType);
    });

    test('veri girişine (data input) doğru şekilde bağlanabilmeli', () => {
        const sourceNode = { id: 'data-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
        const kmeansNode = { id: 'kmeans-1', type: nodeType, data: {} };
        act(() => {
            usePlaygroundStore.setState({ nodes: [sourceNode, kmeansNode] });
        });

        const connection = { source: sourceNode.id, sourceHandle: 'data', target: kmeansNode.id, targetHandle: 'data' };
        act(() => {
            usePlaygroundStore.getState().addEdge(connection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(1);
    });
  });

  // --- Test 3: Hierarchical Clustering Düğümü ---
  describe('Düğüm: Hierarchical Clustering', () => {
    const nodeType = 'node-unsupervised-hierarchical-clustering';

    test('distance_matrix girişine doğru şekilde bağlanabilmeli', () => {
      // Bu düğüm 'distance' tipinde bir girdi bekler.
      const sourceNode = { id: 'source-1', type: 'node-unsupervised-distance', data: { outputs: { 'distance_matrix': {} } } };
      const hcNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, hcNode] });
      });

      const connection = { source: sourceNode.id, sourceHandle: 'distance_matrix', target: hcNode.id, targetHandle: 'distance_matrix' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(hcNode.id);
    });
  });
});