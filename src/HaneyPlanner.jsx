import React from 'react';
import { useEffect, useState } from 'react';
import './HaneyPlanner.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Semana from './components/Semana';

function HaneyPlanner() {
    const [semanas, setSemanas] = useState([]);
    const [progressoState, setProgressoState] = useState([]);
    const [topicosState, setTopicosState] = useState([]);
    const [expandidoState, setExpandidoState] = useState([]);
    const [semanasVisiveis, setSemanasVisiveis] = useState([]);
    const [totalConcluidas, setTotalConcluidas] = useState(0);
    const [totalTarefas, setTotalTarefas] = useState(0);

    useEffect(() => {
        fetch(__DATA_PATH__)
            .then(res => res.json())
            .then(data => {
                setSemanas(data);

                const progresso = data.map(s =>
                    s.atividades.map(a => a.concluido === true)
                );
                const topicos = data.map(s =>
                    s.atividades.map(a => a.topico || '')
                );
                const expandido = data.map(s =>
                    s.atividades.map(() => false)
                );

                setProgressoState(progresso);
                setTopicosState(topicos);
                setExpandidoState(expandido);
                setSemanasVisiveis(data.map(() => false));

                const total = data.reduce((acc, s) => acc + s.atividades.length, 0);
                const concluidas = progresso.flat().filter(Boolean).length;

                setTotalTarefas(total);
                setTotalConcluidas(concluidas);
            });
    }, []);

    const handleCheck = (semanaIdx, tarefaIdx) => {
        const updated = progressoState.map((semana, i) =>
            semana.map((checked, j) =>
                i === semanaIdx && j === tarefaIdx ? !checked : checked
            )
        );
        setProgressoState(updated);
        setTotalConcluidas(updated.flat().filter(Boolean).length);
    };

    const handleTopicoChange = (semanaIdx, tarefaIdx, value) => {
        const updated = [...topicosState];
        updated[semanaIdx][tarefaIdx] = value;
        setTopicosState(updated);
    };

    const toggleExpandir = (semanaIdx, tarefaIdx) => {
        const updated = [...expandidoState];
        updated[semanaIdx][tarefaIdx] = !updated[semanaIdx][tarefaIdx];
        setExpandidoState(updated);
    };

    const toggleSemana = (idx) => {
        const updated = [...semanasVisiveis];
        updated[idx] = !updated[idx];
        setSemanasVisiveis(updated);
    };

    const salvarProgresso = () => {
        const dadosAtualizados = semanas.map((s, i) => ({
            ...s,
            atividades: s.atividades.map((a, j) => ({
                descricao: a.descricao,
                concluido: progressoState[i][j],
                topico: topicosState[i][j]
            }))
        }));

        fetch('http://localhost:4000/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dadosAtualizados)
        })
            .then(res => res.json())
            .then(data => {
                console.log('✅ Progresso salvo no backend:', data);
                alert('Progresso salvo com sucesso!');
            })
            .catch(err => {
                console.error('❌ Erro ao salvar:', err);
                alert('Erro ao salvar progresso.');
            });
    };

    const calcularProgressoSemana = (semanaIdx) => {
        const concluido = progressoState[semanaIdx]?.filter(Boolean).length || 0;
        const total = progressoState[semanaIdx]?.length || 1;
        return Math.round((concluido / total) * 100);
    };

    const formatarData = (data) => {
        if (!data?.includes('-')) return data;
        const [ano, mes, dia] = data.split('-');
        return `${dia}/${mes}/${ano}`;
    };

    return (
        <div className="App">
            <header className="header">
                <img src="logo.png" alt="Logo Haney Motorsync" className="logo" />
                <h1>Planner Interativo - Tech Challenge Haney Motorsync</h1>
            </header>

            <div className="progressoTotal">
                Progresso Total: {totalTarefas > 0 ? Math.round((totalConcluidas / totalTarefas) * 100) : 0}%
            </div>

            {semanas.map((s, i) => (
                <Semana
                    key={i}
                    dados={s}
                    index={i}
                    visivel={semanasVisiveis[i]}
                    progresso={calcularProgressoSemana(i)}
                    progressoState={progressoState[i]}
                    topicosState={topicosState[i]}
                    expandidoState={expandidoState[i]}
                    onToggleSemana={toggleSemana}
                    onToggleExpand={toggleExpandir}
                    onCheck={handleCheck}
                    onTopicoChange={handleTopicoChange}
                    formatarData={formatarData}
                />
            ))}

            <button className="salvarBtn" onClick={salvarProgresso} title="Salvar progresso">
                <i className="bi bi-save"></i>
            </button>
        </div>
    );
}

export default HaneyPlanner;
