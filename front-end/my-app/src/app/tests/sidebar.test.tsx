/**
 * @jest-environment jsdom
 */

import { render, screen, act, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import React from 'react';
import Sidebar from '../../Components/sidebar';
import { useRouter } from 'next/navigation';
import useFetchRoadmaps from '../../hooks/useFetchRoadmaps';

vi.mock('../../hooks/useFetchRoadmaps', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../hooks/useFetchRoadmaps')>();
  return {
    ...actual,
    default: vi.fn(),
  };
});



vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}));

const mockRoadmaps = [
  { _id: '1', progress: 30, title: 'Roadmap 1' },
  { _id: '2', progress: 75, title: 'Roadmap 2' },
];

describe('Sidebar Component', () => {
  const mockSetIsSidebarOpen = vi.fn();
  const mockRouterPush = vi.fn();
  const useFetchRoadmapsMock = vi.mocked(useFetchRoadmaps);
  
  beforeEach(() => {
    (useRouter as Mock).mockReturnValue({ push: mockRouterPush });
    useFetchRoadmapsMock.mockImplementation(() => ({
      roadmaps: mockRoadmaps,
      loading: false,
      error: null,
      setRoadmaps: vi.fn(),
    }));
  });

  const renderComponent = (props?: Partial<React.ComponentProps<typeof Sidebar>>) => {
    const defaultProps = {
      isMobile: false,
      isSidebarOpen: true,
      setIsSidebarOpen: mockSetIsSidebarOpen,
      userId: 'user123',
    };
    
    return render(<Sidebar {...defaultProps} {...props} />);
  };

  it('deve exibir loading state', () => {
    useFetchRoadmapsMock.mockImplementationOnce(() => ({
      roadmaps: [],
      loading: true,
      error: null,
      setRoadmaps: vi.fn(),
    }));

    renderComponent();
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  it('deve exibir error state', () => {
    useFetchRoadmapsMock.mockImplementationOnce(() => ({
      roadmaps: [],
      loading: false,
      error: 'Erro de rede',
      setRoadmaps: vi.fn(),
    }));

    renderComponent();
    expect(screen.getByText(/Erro de rede/i)).toBeTruthy();
  });

  it('deve renderizar corretamente no desktop', () => {
    renderComponent();
    expect(screen.getByText('Meus Roadmaps')).toBeTruthy();
    expect(screen.getAllByTestId('roadmap-item')).toHaveLength(2);
    expect(screen.getByText('75%')).toBeTruthy();
  });

  it('deve alternar visibilidade no mobile', () => {
    renderComponent({ isMobile: true });
    const toggleButton = screen.getByTestId('toggle-sidebar');
    fireEvent.click(toggleButton);
    expect(mockSetIsSidebarOpen).toHaveBeenCalledWith(false);
  });

  it('deve navegar ao clicar em um roadmap', () => {
    renderComponent();
    const roadmapButtons = screen.getAllByTestId('roadmap-item');
    fireEvent.click(roadmapButtons[1]);
    expect(mockRouterPush).toHaveBeenCalledWith('/roadMap/1');
  });

  it('deve atualizar progresso via custom event', () => {
    const mockSetRoadmaps = vi.fn();
    useFetchRoadmapsMock.mockImplementation(() => ({
      roadmaps: mockRoadmaps,
      loading: false,
      error: null,
      setRoadmaps: mockSetRoadmaps,
    }));
    
    renderComponent();
    
    act(() => {
      window.dispatchEvent(
        new CustomEvent('updateSidebarProgress', {
          detail: { roadMapId: '1', newProgress: 50 }
        })
      );
    });
    
    const expectedResult = [
      { _id: '1', progress: 50, title: 'Roadmap 1' },
      { _id: '2', progress: 75, title: 'Roadmap 2' }
    ];
    
    expect(mockSetRoadmaps).toHaveBeenCalledWith(expect.any(Function));
    
    const updaterFunction = mockSetRoadmaps.mock.calls[0][0];
    const result = updaterFunction(mockRoadmaps);
    expect(result).toEqual(expectedResult);
  });

  it('deve ordenar roadmaps do mais recente para o mais antigo', () => {
    renderComponent();
    const roadmaps = screen.getAllByTestId('roadmap-item');

    const firstRoadmap = within(roadmaps[0]).getByText(/Roadmap 2/i);
    const secondRoadmap = within(roadmaps[1]).getByText(/Roadmap 1/i);

    expect(firstRoadmap).toBeTruthy();
    expect(secondRoadmap).toBeTruthy();
  });

  it('não deve exibir overlay quando não é mobile', () => {
    renderComponent({ isMobile: false });
    expect(screen.queryByRole('presentation')).toBeNull();
  });

  it('deve exibir overlay quando é mobile e sidebar está aberta', () => {
    renderComponent({
      isMobile: true,
      isSidebarOpen: true
    });

    const overlays = screen.queryAllByTestId('sidebar-overlay');
    expect(overlays.length).toBe(2);
    expect(overlays[0]).toBeDefined();
  });
});