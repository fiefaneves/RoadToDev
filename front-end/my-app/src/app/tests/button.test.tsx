/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../../Components/ui/button';
import { describe, it, expect } from 'vitest';

describe('Button', () => {
  it('deve renderizar o botão corretamente', () => {
    render(<Button onClick={() => {}}>Clique aqui</Button>);
    const button = screen.getByText(/Clique aqui/i);
    expect(button).not.toBeNull();
  });
});