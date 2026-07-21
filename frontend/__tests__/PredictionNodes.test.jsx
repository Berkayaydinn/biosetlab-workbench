import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

const initialStoreState = usePlaygroundStore.getState();

describe('Tahmin (Prediction) Düğümleri İş Mantığı Testleri', () => {

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Test edilecek standart prediction düğümlerinin listesi (veri al, model üret)
  const standardPredictionNodes = [
    'node-prediction-logistic-regression',
    'node-prediction-linear-regression',
    'node-prediction-svm', 
    'node-prediction-random-forest', 
    'node-prediction-gradient-boosting', 
    'node-supervised-neural-network', 
    'node-prediction-decision-tree', 
    'node-prediction-adaboost'
  ];

  // Standart prediction düğümleri için dinamik olarak test oluştur
  standardPredictionNodes.forEach(nodeType => {
    const config = NodeConfig[nodeType];
    
    describe(`Düğüm: ${config.name}`, () => {
      
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
        const predictionNode = { id: 'target-1', type: nodeType, data: {} };
        act(() => {
          usePlaygroundStore.setState({ nodes: [sourceNode, predictionNode] });
        });

        const connection = { source: sourceNode.id, sourceHandle: 'data', target: predictionNode.id, targetHandle: 'data' };
        act(() => {
          usePlaygroundStore.getState().addEdge(connection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(1);
        expect(edges[0].target).toBe(predictionNode.id);
      });

       test('model çıkışından (model output) bağlantı yapılabilmeli', () => {
        const predictionNode = { id: 'source-1', type: nodeType, data: { outputs: { 'model': {} } } };
        const targetNode = { id: 'target-1', type: 'node-evaluation-test-and-score', data: {} };
        act(() => {
          usePlaygroundStore.setState({ nodes: [predictionNode, targetNode] });
        });

        const connection = { source: predictionNode.id, sourceHandle: 'model', target: targetNode.id, targetHandle: 'model' };
        act(() => {
          usePlaygroundStore.getState().addEdge(connection);
        });

        const { edges } = usePlaygroundStore.getState();
        expect(edges).toHaveLength(1);
        expect(edges[0].source).toBe(predictionNode.id);
    });
    });
  });

  // --- Stacking Düğümü için Özel Test (birden fazla girişi var) ---
  describe('Düğüm: Stacking', () => {
    const nodeType = 'node-prediction-stacking';

    test('çoklu model ve veri girişlerine doğru şekilde bağlanabilmeli', () => {
      // Hazırlık: 2 model üreten düğüm, 1 veri üreten düğüm ve 1 Stacking düğümü
      const modelNode1 = { id: 'model-1', type: 'node-prediction-svm', data: { outputs: { 'model': {} } } };
      const modelNode2 = { id: 'model-2', type: 'node-prediction-random-forest', data: { outputs: { 'model': {} } } };
      const dataNode = { id: 'data-1', type: 'node-data-file', data: { outputs: { 'data': {} } } };
      const stackingNode = { id: 'stacking-1', type: nodeType, data: {} };

      act(() => {
        usePlaygroundStore.setState({ nodes: [modelNode1, modelNode2, dataNode, stackingNode] });
      });

      // Eylem: Tüm girişlere bağlantı yap
      const connection1 = { source: modelNode1.id, sourceHandle: 'model', target: stackingNode.id, targetHandle: 'models' };
      const connection2 = { source: modelNode2.id, sourceHandle: 'model', target: stackingNode.id, targetHandle: 'models' };
      const connection3 = { source: dataNode.id, sourceHandle: 'data', target: stackingNode.id, targetHandle: 'data' };
      
      act(() => {
        usePlaygroundStore.getState().addEdge(connection1);
        usePlaygroundStore.getState().addEdge(connection2);
        usePlaygroundStore.getState().addEdge(connection3);
      });

      // Doğrulama
      const { edges } = usePlaygroundStore.getState();
      expect(edges).toHaveLength(3); // Toplam 3 bağlantı olmalı
      expect(edges.filter(e => e.target === stackingNode.id).length).toBe(3); // Hepsinin hedefi stacking düğümü olmalı
    });
  });
});