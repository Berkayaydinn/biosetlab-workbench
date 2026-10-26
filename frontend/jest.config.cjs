/** @type {import('jest').Config} */
module.exports = {
  testPathIgnorePatterns: ['/node_modules/', '/tests/', '/tests-examples/'],
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    // --- YENİ EKLENEN KURAL ---
    // @ant-design/icons'a yapılan tüm importları yakala ve
    // bizim oluşturduğumuz sahte modülle değiştir.
    '^@ant-design/icons$': '<rootDir>/__mocks__/ant-design-icons.js',

    // Mevcut kurallarınız
    '\\.(css|less)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/test/fileMock.js',
  },
};