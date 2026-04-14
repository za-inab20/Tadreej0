import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userReducer from '../../features/UserSlice';
import FreelancerStudio from '../../pages/FreelancerStudio';
import { api } from '../../utils/api';

jest.mock('../../utils/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  getUserConfig: jest.fn((user) => ({
    headers: {
      'x-user-email': user?.email || '',
    },
  })),
}));

const createTestStore = (userOverrides = {}) => {
  const user = {
    _id: 'freelancer-1',
    uname: 'Salim',
    email: 'salim@example.com',
    accountType: 'freelancer',
    freelancerApprovalStatus: 'pending',
    role: 'user',
    theme: 'dark',
    ...userOverrides,
  };

  return configureStore({
    reducer: {
      users: userReducer,
    },
    preloadedState: {
      users: {
        user,
        message: '',
        isLoading: false,
        isSuccess: true,
        isError: false,
        resetEmail: '',
        resetStatus: 'idle',
        resetMessage: '',
        otpStatus: 'idle',
        otpMessage: '',
        passwordResetStatus: 'idle',
        passwordResetMessage: '',
        updateStatus: 'idle',
        updateMessage: '',
      },
    },
  });
};

const renderFreelancerStudio = (userOverrides = {}) => {
  const store = createTestStore(userOverrides);

  return render(
    <Provider store={store}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <FreelancerStudio />
      </MemoryRouter>
    </Provider>
  );
};

describe('Freelancer Studio Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders freelancer studio with pending approval data', async () => {
    api.get.mockResolvedValueOnce({
      data: {
        approvalStatus: 'pending',
        items: [
          {
            _id: 'service-1',
            name: 'Salim',
            roleTitle: 'Full Stack Developer',
            publicVisibility: 'private',
            skills: ['React', 'Node.js'],
            languages: ['English'],
          },
        ],
      },
    });

    renderFreelancerStudio();

    expect(await screen.findByRole('heading', { name: /freelancer studio/i })).toBeInTheDocument();
    expect(screen.getByText(/pending admin approval/i)).toBeInTheDocument();
    expect(screen.getByText(/private until admin approval/i)).toBeInTheDocument();
    expect(screen.getByText(/total services/i)).toBeInTheDocument();

    expect(await screen.findByText(/full stack developer/i)).toBeInTheDocument();
    expect(
      await screen.findByText((_, node) => node?.textContent?.replace(/\s+/g, ' ').trim() === '1 service')
    ).toBeInTheDocument();
  });

  test('creates a new freelancer service', async () => {
    api.get.mockResolvedValue({
      data: {
        approvalStatus: 'pending',
        items: [],
      },
    });
    api.post.mockResolvedValueOnce({ data: { message: 'created' } });

    renderFreelancerStudio();

    expect(await screen.findByRole('heading', { name: /freelancer studio/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add service/i })).not.toBeDisabled();
    });

    fireEvent.change(screen.getByPlaceholderText(/your public freelancer name/i), {
      target: { value: 'Salim Studio' },
    });
    fireEvent.change(screen.getByPlaceholderText(/full stack developer/i), {
      target: { value: 'Backend Engineer' },
    });
    fireEvent.change(screen.getByPlaceholderText(/development, design, marketing/i), {
      target: { value: 'Development' },
    });
    fireEvent.change(screen.getByPlaceholderText('45'), {
      target: { value: '80' },
    });
    fireEvent.change(screen.getByPlaceholderText(/react, node\.js, ui design/i), {
      target: { value: 'Node.js, Testing' },
    });
    fireEvent.change(screen.getByPlaceholderText(/describe the value you deliver/i), {
      target: { value: 'I build scalable APIs and dashboards.' },
    });

    fireEvent.click(screen.getByRole('button', { name: /add service/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalled();
    });

    const [endpoint, payload, config] = api.post.mock.calls[0];

    expect(endpoint).toBe('/api/catalog/my/freelancers');
    expect(payload).toEqual(
      expect.objectContaining({
        name: 'Salim Studio',
        roleTitle: 'Backend Engineer',
        category: 'Development',
        hourlyRate: 80,
        about: 'I build scalable APIs and dashboards.',
      })
    );

    if (config) {
      expect(config).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-user-email': 'salim@example.com',
          }),
        })
      );
    }
  });
});
