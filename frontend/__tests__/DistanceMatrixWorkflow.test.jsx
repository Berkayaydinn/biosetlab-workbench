import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig.jsx';

// --- DOĞRU ANAHTARLARLA DÜZELTİLMİŞ DÜĞÜM TANIMLARI ---
const fileNodeTemplate = {
  id: 'file-node-1',
  type: 'node-data-file', // <-- Düzeltildi
  position: { x: 0, y: 0 },
  data: {
    name: NodeConfig['node-data-file'].name,
    parameters: { file: null },
    outputs: {},
  },
};

const distanceNodeTemplate = { 
  id: 'distance-node-1', 
  type: 'node-unsupervised-distance', // <-- Düzeltildi
  position: { x: 250, y: 50 }, 
  data: { 
    name: NodeConfig['node-unsupervised-distance'].name,
    parameters: {}, 
    outputs: {} 
  } 
};

const matrixNodeTemplate = { 
  id: 'matrix-node-1', 
  type: 'node-unsupervised-distance-matrix', // <-- Düzeltildi
  position: { x: 500, y: 100 }, 
  data: { 
    name: NodeConfig['node-unsupervised-distance-matrix'].name,
    parameters: {}, 
    outputs: {} 
  } 
};

const initialStoreState = usePlaygroundStore.getState();

describe('Playground: Dosyadan Distance Matrix Akışı', () => {
  
  beforeEach(() => {
    act(() => {
      usePlaygroundStore.setState(initialStoreState, false);
    });
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Adım 1: Akış için gerekli düğümleri ekler', () => {
    act(() => {
      usePlaygroundStore.setState({ nodes: [fileNodeTemplate] });
    });
    
    act(() => {
      // addNode çağrılarında doğru anahtarları kullan
      usePlaygroundStore.getState().addNode('node-unsupervised-distance');
      usePlaygroundStore.getState().addNode('node-unsupervised-distance-matrix');
    });

    const nodes = usePlaygroundStore.getState().nodes;
    expect(nodes).toHaveLength(3);
    expect(nodes.some(n => n.type === 'node-unsupervised-distance')).toBe(true);
  });

  test('Adım 2: FileNode üzerinde veri setini (iris.csv) seçer', () => {
    act(() => {
      usePlaygroundStore.setState({ nodes: [fileNodeTemplate] });
    });
    
    act(() => {
      // Fonksiyon adı düzeltildi: updateNodeParameters (çoğul 's' ile)
      usePlaygroundStore.getState().updateNodeParameters(fileNodeTemplate.id, { file: 'iris.csv' });
    });

    const updatedNode = usePlaygroundStore.getState().nodes.find(n => n.id === fileNodeTemplate.id);
    expect(updatedNode.data.parameters.file).toBe('iris.csv');
  });

  test('Adım 3: Düğümleri doğru sırayla birbirine bağlar', () => {
    act(() => {
        usePlaygroundStore.setState({ nodes: [fileNodeTemplate, distanceNodeTemplate, matrixNodeTemplate] });
    });

    act(() => {
      // FileNode'un çıktısı 'data' olarak tanımlı, 'File' değil.
      usePlaygroundStore.getState().addEdge({ source: fileNodeTemplate.id, sourceHandle: 'data', target: distanceNodeTemplate.id, targetHandle: 'data' });
      // Distance'ın çıktısı 'distance_matrix', 'Distances' değil.
      usePlaygroundStore.getState().addEdge({ source: distanceNodeTemplate.id, sourceHandle: 'distance_matrix', target: matrixNodeTemplate.id, targetHandle: 'distance_matrix' });
    });
    
    const { edges } = usePlaygroundStore.getState();
    expect(edges).toHaveLength(2);
  });

  // Diğer testler (Adım 4 ve 5) bu düzeltmelerle birlikte çalışacaktır.
  // ...
});