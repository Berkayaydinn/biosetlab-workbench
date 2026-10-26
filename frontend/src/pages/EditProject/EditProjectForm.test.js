
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
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EditProjectForm from './EditProjectForm';

describe('EditProjectForm', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <EditProjectForm />
      </MemoryRouter>
    );
  });

  it('displays loading text when project is null', () => {
    const { getByText } = render(
      <MemoryRouter>
        <EditProjectForm />
      </MemoryRouter>
    );
    expect(getByText('Loading...')).toBeInTheDocument();
  });

});
