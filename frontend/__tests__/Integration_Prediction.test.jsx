import { act } from '@testing-library/react';
import { usePlaygroundStore } from '../src/store/playgroundStore';

// Jest'e, bu test dosyası için __mocks__ klasörünü görmezden gelmesini
// ve ../src/store/playgroundStore'un orijinal versiyonunu yüklemesini söylüyoruz.
jest.unmock('../src/store/playgroundStore');

// Olası yavaşlıklar ve asenkron işlemler için testin zaman aşımı süresini 15 saniyeye çıkarıyoruz.
jest.setTimeout(15000);

// --- Geliştirilmiş WebSocket Mock'u ---
// Olay yöneticilerini (onopen, onmessage) saklamak için bir nesne
const mockSocketHandlers = {};
const mockSocket = {
  send: jest.fn(),
  close: jest.fn(),
};
// `runPlaygroundGraph` fonksiyonu `socket.onopen = ...` ataması yaptığında,
// bu atanan fonksiyonu `mockSocketHandlers` nesnesinde saklıyoruz.
Object.defineProperty(mockSocket, 'onopen', {
  configurable: true,
  set: (fn) => {
    mockSocketHandlers.onopen = fn;
  },
});
// Aynı şekilde `socket.onmessage = ...` atamasını da yakalıyoruz.
Object.defineProperty(mockSocket, 'onmessage', {
  configurable: true,
  set: (fn) => {
    mockSocketHandlers.onmessage = fn;
  },
});
Object.defineProperty(mockSocket, 'onerror', {
  configurable: true,
  set: (fn) => {
    mockSocketHandlers.onerror = fn;
  },
});
// Global WebSocket'i bizim mock'umuzla değiştiriyoruz.
global.WebSocket = jest.fn(() => mockSocket);


describe('Uçtan Uca: Tam Bir Tahmin Modeli Akışı', () => {
  // Store'un her testten önce sıfırlanacağı başlangıç hali
  const initialStoreState = usePlaygroundStore.getState();

  beforeEach(() => {
    act(() => {
        usePlaygroundStore.setState(initialStoreState, true);
    });
    jest.clearAllMocks();
    // savePlayground gibi testin odağında olmayan yan etkileri mock'la
    jest.spyOn(usePlaygroundStore.getState(), 'savePlayground').mockImplementation(() => Promise.resolve());
  });


  test('dosyadan confusion matrix\'e kadar olan akışı kurmalı, çalıştırmalı ve doğrulamalı', async () => {

    // --- 1. KURULUM (Arrange): Düğümleri `position` özelliği ile birlikte tanımla ---
    const nodes = [
      { id: 'file-1', type: 'node-data-file', data: { parameters: { file_name: 'iris.csv' }, outputs: {} }, position: { x: 0, y: 50 } },
      { id: 'split-1', type: 'node-data-train-test-split', data: { parameters: { test_size: 0.3 }, outputs: {} }, position: { x: 250, y: 50 } },
      { id: 'lr-1', type: 'node-prediction-logistic-regression', data: { name: 'Logistic Regression', parameters: { features: ['sepal.length'], target: 'variety' }, outputs: {} }, position: { x: 500, y: 0 } },
      { id: 'test-1', type: 'node-evaluation-test-and-score', data: { parameters: {}, outputs: {} }, position: { x: 750, y: 50 } },
      { id: 'cm-1', type: 'node-evaluation-confusion-matrix', data: { parameters: {}, outputs: {} }, position: { x: 1000, y: 50 } },
    ];
    const edges = [
      { id: 'e1', source: 'file-1', sourceHandle: 'data', target: 'split-1', targetHandle: 'data' },
      { id: 'e2', source: 'split-1', sourceHandle: 'train', target: 'lr-1', targetHandle: 'data' },
      { id: 'e3', source: 'lr-1', sourceHandle: 'model', target: 'test-1', targetHandle: 'model' },
      { id: 'e4', source: 'split-1', sourceHandle: 'test', target: 'test-1', targetHandle: 'data' },
      { id: 'e5', source: 'test-1', sourceHandle: 'evaluation_results', target: 'cm-1', targetHandle: 'evaluation_results' },
    ];
    act(() => {
      usePlaygroundStore.setState({ nodes, edges });
    });

    // --- 2. SİMÜLASYON (Arrange): Backend Yanıtlarını Doğru Yapıda Hazırla ---
    const mockInitialResponse = {
        task_id: 'test-task-123',
        status: 'running',
        nodes_to_run: nodes.map(n => n.id)
    };
    
    // `runPlaygroundGraph` fonksiyonunun beklediği "düz" node yapısına uygun mock sonuç üretiyoruz.
    const mockFinalResult = {
      nodes: nodes.map(node => {
        let baseNode = {
            id: node.id,
            type: node.type,
            position: node.position,
            name: node.data.name || 'Node',
            name_count: 0,
            parameters: node.data.parameters,
            errors: [],
            updated: true,
            success: true,
            outputs: node.data.outputs || {},
        };

        if (node.id === 'cm-1') {
            baseNode.outputs = { confusion_matrix: { value: 'başarılı-test-sonucu' } };
        } else {
            baseNode.outputs = { status: 'ok' };
        }
        
        return baseNode;
      }),
      edges: edges,
      viewport: { x: 0, y: 0, zoom: 1 },
    };

    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockInitialResponse) }));

    // --- 3. ÇALIŞTIRMA (Act): Akışı çalıştır ve asenkron olayları doğru şekilde simüle et ---
    await act(async () => {
      const runPromise = usePlaygroundStore.getState().runPlaygroundGraph('cm-1');

      // Yarış durumunu (race condition) önlemek için olay döngüsüne anlık bekleme ekliyoruz.
      await new Promise(resolve => setTimeout(resolve, 0));

      // Artık olay yöneticilerinin atandığından emin olarak onları tetikleyebiliriz.
      if (mockSocketHandlers.onopen) {
        mockSocketHandlers.onopen();
      }
      if (mockSocketHandlers.onmessage) {
        mockSocketHandlers.onmessage({
          data: JSON.stringify({ status: 'completed', result: mockFinalResult })
        });
      }

      // Başlatılan işlemin tamamlanmasını bekle
      await runPromise;
    });

    // --- 4. DOĞRULAMA (Assert): Sonucu kontrol et ---
    const finalNode = usePlaygroundStore.getState().nodes.find(n => n.id === 'cm-1');
    console.log(
      'DEBUG: finalNode.data.outputs ->',
      JSON.stringify(finalNode.data.outputs, null, 2)
    );
    expect(finalNode.data.outputs.confusion_matrix.value).toBe('başarılı-test-sonucu');
  });
});