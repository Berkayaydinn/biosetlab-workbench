import '@testing-library/jest-dom';

class ResizeObserver {
    callback: globalThis.ResizeObserverCallback;
   
    constructor(callback: globalThis.ResizeObserverCallback) {
      this.callback = callback;
    }
   
    observe(target: Element) {
      // Test için basit bir implementasyon yeterli
    }
   
    unobserve() {
      // Boş bırakılabilir
    }
   
    disconnect() {
      // Boş bırakılabilir
    }
}
   
class DOMMatrixReadOnly {
    m22: number;
    constructor(transform: string) {
      const scale = transform?.match(/scale\(([1-9.])\)/)?.[1];
      this.m22 = scale !== undefined ? +scale : 1;
    }
}
   
export const mockReactFlow = () => {
    global.ResizeObserver = ResizeObserver;
   
    // @ts-ignore
    global.DOMMatrixReadOnly = DOMMatrixReadOnly;
   
    Object.defineProperties(global.HTMLElement.prototype, {
      offsetHeight: {
        get() {
          return parseFloat(this.style.height) || 1;
        },
      },
      offsetWidth: {
        get() {
          return parseFloat(this.style.width) || 1;
        },
      },
    });
   
    (global.SVGElement as any).prototype.getBBox = () => ({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
};

// --- EN ÖNEMLİ KISIM ---
// Tanımlanan fonksiyonu çağırarak mock'ları test ortamı için etkinleştir.
mockReactFlow();
// Mock matchMedia for jsdom-based component tests.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
