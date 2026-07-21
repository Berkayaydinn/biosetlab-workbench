import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Playground from '../src/pages/Playground/Playground';
import { usePlaygroundStore } from '../src/store/playgroundStore';
import '@testing-library/jest-dom';

// Store'u manuel olarak mock'luyoruz. Jest, __mocks__ klasöründeki dosyayı kullanacak.
jest.mock('../src/store/playgroundStore');

describe('Playground Component', () => {
const initialNodes = [
{ id: 'node-1', type: 'FileNode', data: { label: 'Dosya 1' }, position: { x: 0, y: 0 } },
{ id: 'node-2', type: 'PCANode', data: { label: 'PCA Analizi' }, position: { x: 250, y: 50 } },
];
const initialEdges = [{ id: 'edge-1-2', source: 'node-1', target: 'node-2' }];

beforeEach(() => {
// Her testten önce, mock'lanmış store'umuzun nasıl davranacağını tanımlıyoruz.
usePlaygroundStore.mockImplementation((selector) => {
// Test için tam bir state nesnesi oluşturuyoruz.
const state = {
nodes: initialNodes,
edges: initialEdges,
nodeTypes: {
FileNode: ({ data }) => <div>{data.label}</div>,
PCANode: ({ data }) => <div>{data.label}</div>,
},
getPlaygroundById: jest.fn().mockResolvedValue(true),
onNodesChange: jest.fn(),
onEdgesChange: jest.fn(),
onConnect: jest.fn(),
onViewportChange: jest.fn(),
setCompactMode: jest.fn(),
compactMode: true,
isProjectLoaded: true,
name: 'Test Project',
description: 'Test Description',
};

// --- ÇÖZÜM BURADA ---
// Eğer bir selector fonksiyonu varsa, state'i o fonksiyona uygula.
// Eğer selector yoksa (component usePlaygroundStore() şeklinde çağırdıysa), state'in tamamını döndür.
if (typeof selector === 'function') {
return selector(state);
}
return state;
});
});

afterEach(() => {
usePlaygroundStore.mockClear();
});

test('should render initial nodes from the store', async () => {
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
render(
<MemoryRouter>
<Playground />
</MemoryRouter>
);

await waitFor(() => {
expect(screen.getByText('Dosya 1')).toBeInTheDocument();
expect(screen.getByText('PCA Analizi')).toBeInTheDocument();
});
});
});