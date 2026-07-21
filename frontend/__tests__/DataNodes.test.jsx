import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import { NodeConfig } from '../src/config/NodeConfig';

// Store'un her testten önce sıfırlanacağı başlangıç hali
const initialStoreState = usePlaygroundStore.getState();

describe('Veri (Data) Düğümleri İş Mantığı Testleri', () => {

  // Her testten önce store'u temizle ve yan etkileri mock'la
  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, false);
    });
    
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground')
        .mockImplementation(() => Promise.resolve());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // --- Test 1: File Düğümü ---
  test('File düğümünün parametreleri doğru bir şekilde güncellenmeli', () => {
    const fileNodeId = 'test-file-node-1';
    const initialNode = {
      id: fileNodeId,
      type: 'node-data-file',
      data: {
        parameters: { file_name: '', features: [], target: '' }
      }
    };
    
    // Hazırlık: State'e bir File düğümü ekle
    act(() => {
      usePlaygroundStore.setState({ nodes: [initialNode] });
    });

    // Eylem: Düğümün parametrelerini güncelle
    const newParameters = {
      file_name: 'iris.csv',
      features: ['sepal.length', 'sepal.width'],
      target: 'variety'
    };
    act(() => {
      usePlaygroundStore.getState().updateNodeParameters(fileNodeId, newParameters);
    });

    // Doğrulama: State'deki düğümün parametrelerinin güncellendiğini kontrol et
    const updatedNode = usePlaygroundStore.getState().nodes.find(n => n.id === fileNodeId);
    expect(updatedNode.data.parameters.file_name).toBe('iris.csv');
    expect(updatedNode.data.parameters.target).toBe('variety');
    expect(updatedNode.data.parameters.features).toEqual(['sepal.length', 'sepal.width']);
  });

  // --- Test 2: Save Data Düğümü ---
  test('Save Data düğümü, bir veri kaynağına doğru şekilde bağlanabilmeli', () => {
    // Hazırlık: Bir veri kaynağı (FileNode) ve bir Save Data düğümü oluştur
    const fileNode = { id: 'file-1', type: 'node-data-file', data: { outputs: { data: {} } } };
    const saveDataNode = { id: 'save-1', type: 'node-data-save-data', data: {} };
    act(() => {
      usePlaygroundStore.setState({ nodes: [fileNode, saveDataNode] });
    });

    // Eylem: İki düğümü birbirine bağla
    const connection = { source: fileNode.id, sourceHandle: 'data', target: saveDataNode.id, targetHandle: 'data' };
    act(() => {
      usePlaygroundStore.getState().addEdge(connection);
    });

    // Doğrulama: Bağlantının oluştuğunu kontrol et
    const { edges } = usePlaygroundStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].source).toBe(fileNode.id);
    expect(edges[0].target).toBe(saveDataNode.id);
  });

  // --- Test 3: Feature Statistics Düğümü ---
  test('Feature Statistics düğümü, bir veri kaynağına doğru şekilde bağlanabilmeli', () => {
    // Hazırlık: Bir veri kaynağı (FileNode) ve bir Feature Statistics düğümü oluştur
    const fileNode = { id: 'file-1', type: 'node-data-file', data: { outputs: { data: {} } } };
    const statsNode = { id: 'stats-1', type: 'node-data-feature-statistics', data: {} };
    act(() => {
      usePlaygroundStore.setState({ nodes: [fileNode, statsNode] });
    });

    // Eylem: İki düğümü birbirine bağla
    const connection = { source: fileNode.id, sourceHandle: 'data', target: statsNode.id, targetHandle: 'data' };
    act(() => {
      usePlaygroundStore.getState().addEdge(connection);
    });

    // Doğrulama: Bağlantının oluştuğunu kontrol et
    const { edges } = usePlaygroundStore.getState();
    expect(edges).toHaveLength(1);
    expect(edges[0].target).toBe(statsNode.id);
  });
});