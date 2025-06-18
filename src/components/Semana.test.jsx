import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Semana from './Semana';


const semanaMock = {
    semana: 'Semana 1',
    inicio: '2024-06-01',
    fim: '2024-06-07',
    atividades: [
        { descricao: 'Troca de óleo' },
        { descricao: 'Alinhamento' }
    ]
};

describe('Semana', () => {
    it('renderiza e permite expandir semana', () => {
        const toggleSemana = jest.fn();

        render(
            <Semana
                dados={semanaMock}
                index={0}
                visivel={false}
                progresso={50}
                progressoState={[false, false]}
                topicosState={['', '']}
                expandidoState={[false, false]}
                onToggleSemana={toggleSemana}
                onToggleExpand={() => { }}
                onCheck={() => { }}
                onTopicoChange={() => { }}
                formatarData={d => d}
            />
        );

        const btn = screen.getByTitle(/Expandir semana/i);
        fireEvent.click(btn);
        expect(toggleSemana).toHaveBeenCalledWith(0);
    });
});