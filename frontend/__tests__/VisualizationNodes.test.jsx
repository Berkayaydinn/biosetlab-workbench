import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Görselleştirme (Visualization) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Bu dizi, test edilecek tüm görselleştirme düğümlerini içerir
  const visualizationNodeTypes = [
    'node-visualization-distributions',
    'node-visualization-bar-plot',
    'node-visualization-box-plot',
    'node-visualization-line-plot',
    'node-visualization-scatter-plot',
    'node-visualization-heatmap'
  ];

  // Veri girişi alan genel görselleştirme düğümleri için dinamik test oluştur
  visualizationNodeTypes.forEach(nodeType => {
    describe(`Düğüm: ${NodeConfig[nodeType].name}`, () => {
      
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
        const vizNode = { id: 'target-1', type: nodeType, data: {} };
        act(() => {
          usePlaygroundStore.setState({ nodes: [sourceNode, vizNode] });
        });

        const connection = { source: sourceNode.id, sourceHandle: 'data', target: vizNode.id, targetHandle: 'data' };
        act(() => {
          usePlaygroundStore.getState().addEdge(connection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(1);
        expect(edges[0].target).toBe(vizNode.id);
      });
    });
  });

  // --- Özel Düğümler için Ayrı Testler ---

  describe('Düğüm: Tree Viewer', () => {
    const nodeType = 'node-visualization-tree-viewer';

    test('model girişine (model input) doğru şekilde bağlanabilmeli', () => {
      // Hazırlık: Bir model üreten kaynak düğüm ve bir Tree Viewer düğümü
      const sourceNode = { id: 'source-1', type: 'node-prediction-decision-tree', data: { outputs: { 'model': {} } } };
      const treeViewerNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode, treeViewerNode] });
      });

      // Eylem: İki düğümü bağla
      const connection = { source: sourceNode.id, sourceHandle: 'model', target: treeViewerNode.id, targetHandle: 'model' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(1);
      expect(edges[0].target).toBe(treeViewerNode.id);
    });
  });
  
  describe('Düğüm: Venn Diagram', () => {
    const nodeType = 'node-visualization-venn-diagram';

    test('iki farklı veri girişine (data1, data2) doğru şekilde bağlanabilmeli', () => {
      // Hazırlık
      const sourceNode1 = { id: 'source-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const sourceNode2 = { id: 'source-2', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const vennNode = { id: 'target-1', type: nodeType, data: {} };
      act(() => {
        usePlaygroundStore.setState({ nodes: [sourceNode1, sourceNode2, vennNode] });
      });

      // Eylem
      const connection1 = { source: sourceNode1.id, sourceHandle: 'data', target: vennNode.id, targetHandle: 'data1' };
      const connection2 = { source: sourceNode2.id, sourceHandle: 'data', target: vennNode.id, targetHandle: 'data2' };
      act(() => {
        usePlaygroundStore.getState().addEdge(connection1);
        usePlaygroundStore.getState().addEdge(connection2);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(2);
      expect(edges.every(e => e.target === vennNode.id)).toBe(true);
    });
  });
});