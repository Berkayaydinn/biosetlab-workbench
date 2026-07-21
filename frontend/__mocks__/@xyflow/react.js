// frontend/__mocks__/@xyflow/react.js

// Bu dosya, @xyflow/react kütüphanesi için manuel bir mock görevi görür.

// Gerçek kütüphanenin bir kopyasını alıyoruz.
const actual = jest.requireActual('@xyflow/react');

// Kütüphanenin tamamını dışa aktarırken, sadece 'useReactFlow' hook'unu
// kendi mock versiyonumuzla eziyoruz.
module.exports = {
  ...actual,
  useReactFlow: () => ({
    project: (position) => position,
  }),
};