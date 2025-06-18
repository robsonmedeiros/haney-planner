import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import HaneyPlanner from './HaneyPlanner';

// Mock global para a função window.alert, evitando pop-ups durante os testes.
window.alert = jest.fn();

// Dados mockados para simular a resposta da API, utilizados na maioria dos testes.
const mockData = [
    {
        semana: 'Semana 1',
        inicio: '2024-06-01',
        fim: '2024-06-07',
        atividades: [
            { descricao: 'Troca de óleo', concluido: false, topico: '' },
            { descricao: 'Alinhamento', concluido: true, topico: 'Dianteira' }
        ]
    }
];

// Define a variável global que o componente espera para o fetch inicial.
global.__DATA_PATH__ = 'http://localhost/data.json';

describe('HaneyPlanner', () => {

    // `beforeEach` é executado antes de cada teste, garantindo um ambiente limpo e consistente.
    beforeEach(() => {
        // Limpa todos os mocks para evitar que um teste influencie o outro.
        jest.clearAllMocks();

        // Mock centralizado para a função `fetch`.
        global.fetch = jest.fn((url) => {
            if (url === global.__DATA_PATH__) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve(mockData),
                });
            }
            if (url.includes('/api/save')) {
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({ message: 'Salvo com sucesso' }),
                });
            }
            return Promise.reject(new Error(`Fetch não mockado para a URL: ${url}`));
        });
    });

    it('renderiza título e logo corretamente', async () => {
        render(<HaneyPlanner />);
        expect(await screen.findByText(/Planner Interativo - Tech Challenge Haney Motorsync/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Logo Haney Motorsync/i)).toBeInTheDocument();
    });

    it('renderiza progresso total inicial corretamente', async () => {
        render(<HaneyPlanner />);
        expect(await screen.findByText(/Progresso Total: 50%/)).toBeInTheDocument();
    });

    it('expande a semana e renderiza as tarefas contidas nela', async () => {
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        expect(await screen.findByText(/Troca de óleo/)).toBeInTheDocument();
        expect(screen.getByText(/Alinhamento/)).toBeInTheDocument();
    });

    it('marca tarefa como concluída e atualiza o progresso total', async () => {
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const checkboxes = await screen.findAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        await waitFor(() => {
            expect(screen.getByText(/Progresso Total: 100%/)).toBeInTheDocument();
        });
    });

    it('permite a edição de um tópico em uma tarefa', async () => {
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const expandirTopicoBtns = await screen.findAllByTitle(/Expandir/);
        fireEvent.click(expandirTopicoBtns[0]);
        const textarea = await screen.findByPlaceholderText(/Adicione tópicos/i);
        fireEvent.change(textarea, { target: { value: 'Verificar filtro de ar' } });
        expect(textarea.value).toBe('Verificar filtro de ar');
    });

    it('deve formatar e exibir as datas da semana corretamente', async () => {
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const semanaContainer = await screen.findByText(/Semana 1/i);
        expect(semanaContainer).toHaveTextContent(/Semana 1 - 01\/06\/2024 a 07\/06\/2024/i);
    });

    it('deve exibir a data como recebida se ela não contiver hífen', async () => {
        const dadosComDataInvalida = [{
            semana: 'Semana Especial',
            inicio: 'Data Flexível',
            fim: '2024-06-14',
            atividades: [{ descricao: 'Planejamento', concluido: false }]
        }];
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(dadosComDataInvalida) }));
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const semanaContainer = await screen.findByText(/Semana Especial/i);
        expect(semanaContainer).toHaveTextContent(/Semana Especial - Data Flexível a 14\/06\/2024/i);
    });

    it('deve renderizar corretamente quando a data de início é nula', async () => {
        const dadosComDataNula = [{
            semana: 'Semana Nula',
            inicio: null,
            fim: '2025-01-10',
            atividades: [{ descricao: 'Planejamento', concluido: false }]
        }];
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(dadosComDataNula) }));
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const semanaContainer = await screen.findByText(/Semana Nula/i);
        expect(semanaContainer).toHaveTextContent(/Semana Nula - a 10\/01\/2025/i);
    });

    // NOVO TESTE PARA COBERTURA DE BRANCH
    it('deve calcular o progresso da semana como 0% se não houver tarefas', async () => {
        const mockComSemanaVazia = [{
            semana: 'Semana Vazia',
            inicio: '2025-01-01',
            fim: '2025-01-07',
            atividades: [] // Semana sem atividades para testar o fallback `|| 1`
        }];
        global.fetch.mockImplementationOnce(() => Promise.resolve({ json: () => Promise.resolve(mockComSemanaVazia) }));
        render(<HaneyPlanner />);
        const semanaContainer = await screen.findByText(/Semana Vazia/i);
        // Em uma semana sem tarefas, o progresso deve ser 0% para evitar divisão por zero.
        expect(semanaContainer).toHaveTextContent(/Progresso: 0%/i);
    });

    it('deve chamar a API de salvamento e enviar o estado atualizado', async () => {
        render(<HaneyPlanner />);
        fireEvent.click(await screen.findByTitle(/Expandir semana/i));
        const checkboxes = await screen.findAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);
        fireEvent.click(screen.getByTitle(/Salvar progresso/i));
        await waitFor(() => {
            const saveCall = global.fetch.mock.calls.find(call => call[0].includes('/api/save'));
            expect(saveCall).toBeDefined();
            const body = JSON.parse(saveCall[1].body);
            expect(body[0].atividades[0].concluido).toBe(true);
        });
        expect(window.alert).toHaveBeenCalledWith('Progresso salvo com sucesso!');
    });

    it('deve exibir um alerta de erro se a API de salvamento falhar', async () => {
        global.fetch.mockImplementation((url) => {
            if (url === global.__DATA_PATH__) {
                return Promise.resolve({ json: () => Promise.resolve(mockData) });
            }
            if (url.includes('/api/save')) {
                return Promise.reject(new Error('Erro de rede simulado'));
            }
        });
        render(<HaneyPlanner />);
        fireEvent.click(screen.getByTitle(/Salvar progresso/i));
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Erro ao salvar progresso.');
        });
    });
});