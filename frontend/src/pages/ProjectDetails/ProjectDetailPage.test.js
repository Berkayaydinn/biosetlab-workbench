
// Prevent real API requests during component tests.
jest.mock('axios', () => {
  const request = jest.fn(() => Promise.resolve({ data: {} }));

  request.get = jest.fn(() =>
    Promise.resolve({ data: [] })
  );

  request.post = jest.fn(() =>
    Promise.resolve({ data: {} })
  );

  request.put = jest.fn(() =>
    Promise.resolve({ data: {} })
  );

  request.delete = jest.fn(() =>
    Promise.resolve({ data: {} })
  );

  return {
    __esModule: true,
    default: request,
  };
});

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import ProjectDetailPage from './ProjectDetailPage';

describe('ProjectDetailPage component', () => {
  test('renders loading message if project is null', () => {
    const { getByText } = render(
      <Router>
        <ProjectDetailPage />
      </Router>
    );
    const loadingElement = getByText(/Loading.../i);
    expect(loadingElement).toBeInTheDocument();
  });
});
