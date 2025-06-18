import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import HaneyPlanner from './HaneyPlanner';

// Simula constante global usada no Vite
vi.stubGlobal('__DATA_PATH__', '/fake/data.json');

// Simula resposta do backend
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            {
                semana: 'Semana 1',
                inicio: '2025-06-10',
                fim: '2025-06-14',
                atividades: [
                    { descricao: 'Trocar óleo', concluido: false, topico: '' }
                ]
            }
        ])
    })
);

describe('HaneyPlanner', () => {
    it('exibe o título principal', () => {
        render(<HaneyPlanner />);
        expect(screen.getByText(/Planner Interativo/i)).toBeInTheDocument();
    });

    it('exibe a tarefa ao expandir semana', async () => {
        render(<HaneyPlanner />);

        const expandirBtn = await screen.findByRole('button', {
            name: /expandir semana/i,
        });
        expandirBtn.click();

        const tarefa = await screen.findByText(/Trocar óleo/i);
        expect(tarefa).toBeInTheDocument();
    });

    it('permite marcar uma tarefa como concluída', async () => {
        render(<HaneyPlanner />);

        const expandirBtn = await screen.findByRole('button', {
            name: /expandir semana/i,
        });
        expandirBtn.click();

        const checkbox = await screen.findByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        checkbox.click();
        expect(checkbox).toBeChecked();
    });

    it('permite editar o campo de tópico', async () => {
        render(<HaneyPlanner />);

        // Expande a semana
        const expandirSemana = await screen.findByRole('button', {
            name: /expandir semana/i,
        });
        await expandirSemana.click();

        // Espera tarefa aparecer
        const tarefa = await screen.findByText(/Trocar óleo/i);
        expect(tarefa).toBeInTheDocument();

        // Encontra o botão de expandir tarefa com título "Expandir"
        const expandirTarefa = await screen.findByRole('button', {
            name: /expandir$/i,
        });
        await expandirTarefa.click();

        // Aguarda renderização do campo de tópico
        const textarea = await screen.findByPlaceholderText(/Adicione tópicos/i);
        expect(textarea).toBeInTheDocument();

        // Interage com o textarea dentro de um act()
        await screen.findByPlaceholderText(/Adicione tópicos/i);
        await act(() => {
            textarea.value = 'Cliente solicitou revisão extra';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        });

        expect(textarea.value).toBe('Cliente solicitou revisão extra');
    });

    it('salva o progresso corretamente ao clicar no botão de salvar', async () => {
        // Mock do fetch: GET para carregar + POST para salvar
        global.fetch = vi.fn()
            // Resposta do GET
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    {
                        semana: 'Semana 1',
                        inicio: '2025-06-10',
                        fim: '2025-06-14',
                        atividades: [
                            { descricao: 'Trocar óleo', concluido: false, topico: '' }
                        ]
                    }
                ])
            })
            // Resposta do POST
            .mockResolvedValueOnce({
                json: () => Promise.resolve({ sucesso: true })
            });

        render(<HaneyPlanner />);

        // Expande a semana
        const btnExpandir = await screen.findByRole('button', {
            name: /expandir semana/i,
        });
        btnExpandir.click();

        // Marca tarefa
        const checkbox = await screen.findByRole('checkbox');
        checkbox.click();

        // Expande o detalhe
        const expandirTarefa = await screen.findByRole('button', {
            name: /expandir$/i,
        });
        expandirTarefa.click();

        // Edita o campo
        const textarea = await screen.findByPlaceholderText(/Adicione tópicos/i);
        await act(() => {
            textarea.value = 'Filtro vencido';
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
        });

        // Clica no botão de salvar
        const salvarBtn = screen.getByTitle(/salvar progresso/i);
        await act(() => salvarBtn.click());

        // Verifica se o fetch de POST foi chamado com os dados esperados
        expect(global.fetch).toHaveBeenCalledWith(
            'http://localhost:4000/api/save',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                }),
                body: expect.stringContaining('"descricao":"Trocar óleo"')
            })
        );
    });

    it('renderiza botão de salvar e permite clique', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    {
                        semana: 'Semana 1',
                        inicio: '2025-06-10',
                        fim: '2025-06-14',
                        atividades: []
                    }
                ])
            })
            .mockResolvedValueOnce({
                ok: false,
                json: () => Promise.resolve({ erro: 'Simulado' }) // POST
            });

        render(<HaneyPlanner />);

        const salvarBtn = await screen.findByTitle(/salvar progresso/i);
        expect(salvarBtn).toBeInTheDocument();

        await act(() => salvarBtn.click());

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/api/save'),
            expect.objectContaining({ method: 'POST' })
        );
    });
    it('exibe mensagem de erro ao falhar ao salvar', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    {
                        semana: 'Semana 1',
                        inicio: '2025-06-10',
                        fim: '2025-06-14',
                        atividades: []
                    }
                ])
            })
            .mockRejectedValueOnce(new Error('Falha ao salvar'));

        render(<HaneyPlanner />);

        const salvarBtn = await screen.findByTitle(/salvar progresso/i);
        await act(() => salvarBtn.click());
    });

    it('dispara erro ao salvar quando response.ok é false', async () => {
        global.fetch = vi.fn()
            .mockResolvedValueOnce({
                json: () => Promise.resolve([
                    {
                        semana: 'Semana 1',
                        inicio: '2025-06-10',
                        fim: '2025-06-14',
                        atividades: []
                    }
                ])
            })
            .mockResolvedValueOnce({
                ok: false, // força erro nas linhas 57–60
                json: () => Promise.resolve({})
            });

        render(<HaneyPlanner />);

        const salvarBtn = await screen.findByTitle(/salvar progresso/i);

        await act(async () => {
            try {
                await salvarBtn.click();
            } catch (err) {
                expect(err.message).toMatch(/Erro ao salvar progresso/i);
            }
        });

        expect(global.fetch).toHaveBeenCalledTimes(2);
    });



});
