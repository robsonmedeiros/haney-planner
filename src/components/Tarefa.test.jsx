import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';
import Tarefa from './Tarefa';

describe('Tarefa', () => {
    const mockCheck = jest.fn();
    const mockTopico = jest.fn();
    const mockToggle = jest.fn();

    beforeEach(() => {
        render(
            <Tarefa
                descricao="Troca de óleo"
                concluido={false}
                topico=""
                expandido={true}
                onCheck={mockCheck}
                onTopicoChange={mockTopico}
                onToggleExpand={mockToggle}
            />
        );
    });

    it('renderiza descrição e textarea', () => {
        expect(screen.getByText(/Troca de óleo/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Adicione tópicos/i)).toBeInTheDocument();
    });

    it('dispara onCheck quando checkbox é clicado', () => {
        fireEvent.click(screen.getByRole('checkbox'));
        expect(mockCheck).toHaveBeenCalled();
    });

    it('dispara onTopicoChange quando textarea é modificada', () => {
        fireEvent.change(screen.getByPlaceholderText(/Adicione tópicos/i), {
            target: { value: 'Novo tópico' }
        });
        expect(mockTopico).toHaveBeenCalledWith('Novo tópico');
    });

    it('dispara onToggleExpand ao clicar no botão de expandir', () => {
        fireEvent.click(screen.getByTitle(/Recolher/i));
        expect(mockToggle).toHaveBeenCalled();
    });
});