import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../../pages/AdminDashboard';
import { api } from '../../utils/api';
import { useUserAuth } from '../../context/UserAuthContext';

jest.mock('../../context/UserAuthContext', () => ({
  useUserAuth: jest.fn(),
}));

jest.mock('../../utils/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
  getAdminConfig: jest.fn((user) => ({
    headers: {
      'x-user-email': user?.email || '',
    },
  })),
}));

const mockOverview = {
  metrics: {
    usersCount: 3,
    adminsCount: 1,
    coursesCount: 2,
    freelancersCount: 4,
    pendingFreelancerApprovals: 1,
  },
  recentUsers: [
    { _id: 'user-1', uname: 'Salim', email: 'salim@example.com', role: 'user' },
  ],
  recentCourses: [
    { _id: 'course-1', title: 'React Basics', instructor: 'Coach A', category: 'Development' },
  ],
  recentFreelancers: [
    { _id: 'freelancer-1', name: 'Salim', roleTitle: 'Backend Engineer', publicVisibility: 'private' },
  ],
};

const mockUsers = [
  {
    _id: 'freelancer-user-1',
    uname: 'Salim',
    email: 'salim@example.com',
    role: 'user',
    accountType: 'freelancer',
    freelancerApprovalStatus: 'pending',
    createdAt: '2026-03-01T10:00:00.000Z',
  },
];

const mockCourses = [
  {
    _id: 'course-1',
    title: 'React Basics',
    instructor: 'Coach A',
    category: 'Development',
    level: 'Beginner',
    price: 15,
    duration: '2h',
    rating: 4.7,
    reviews: 23,
    description: 'Intro course',
  },
];

const mockFreelancers = [
  {
    _id: 'service-1',
    name: 'Salim',
    roleTitle: 'Backend Engineer',
    category: 'Development',
    hourlyRate: 80,
    rating: 4.9,
    reviews: 10,
    completedJobs: 7,
    location: 'Muscat',
    skills: ['Node.js'],
    languages: ['English'],
    responseTime: '~ 1 hour',
    memberSince: 'Mar 2026',
    about: 'API development',
  },
];

const mockReports = {
  monthlyReport: {
    label: 'March 2026',
    newUsers: 5,
    newCourses: 2,
    newFreelancers: 3,
    approvedFreelancersThisMonth: 1,
    totalUsers: 15,
    totalCourses: 4,
    totalFreelancers: 6,
    totalPublicFreelancers: 2,
    pendingFreelancerApprovals: 1,
  },
  sixMonthReport: [
    { label: 'Mar 2026', users: 5, courses: 2, freelancers: 3, freelancerApprovals: 1 },
  ],
};

const renderAdminDashboard = () => {
  useUserAuth.mockReturnValue({
    isLoggedIn: true,
    user: {
      _id: 'admin-1',
      uname: 'Admin',
      email: 'admin@example.com',
      role: 'admin',
    },
  });

  api.get.mockImplementation((url) => {
    switch (url) {
      case '/api/admin/overview':
        return Promise.resolve({ data: mockOverview });
      case '/api/admin/users':
        return Promise.resolve({ data: mockUsers });
      case '/api/admin/courses':
        return Promise.resolve({ data: mockCourses });
      case '/api/admin/freelancers':
        return Promise.resolve({ data: mockFreelancers });
      case '/api/admin/reports':
        return Promise.resolve({ data: mockReports });
      default:
        return Promise.reject(new Error(`Unhandled GET ${url}`));
    }
  });

  return render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminDashboard />
    </MemoryRouter>
  );
};

describe('Admin Dashboard Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders admin dashboard overview data', async () => {
    renderAdminDashboard();

    expect(await screen.findByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/manage users, courses, freelancer services/i)).toBeInTheDocument();
    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/pending approvals/i)).toBeInTheDocument();
    expect(screen.getByText(/recent users/i)).toBeInTheDocument();
  });

  test('approves a freelancer request from the users tab', async () => {
    api.put.mockResolvedValue({ data: { message: 'updated' } });

    renderAdminDashboard();

    expect(await screen.findByRole('heading', { name: /admin dashboard/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^users$/i }));
    fireEvent.click(await screen.findByRole('button', { name: /approve/i }));

    await waitFor(() => {
      expect(api.put).toHaveBeenCalled();
    });

    const [endpoint, payload, config] = api.put.mock.calls[0];

    expect(endpoint).toBe('/api/admin/users/freelancer-user-1');
    expect(payload).toEqual(
      expect.objectContaining({
        uname: 'Salim',
        email: 'salim@example.com',
        role: 'user',
        accountType: 'freelancer',
        freelancerApprovalStatus: 'approved',
      })
    );

    if (config) {
      expect(config).toEqual(
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-user-email': 'admin@example.com',
          }),
        })
      );
    }
  });
});
