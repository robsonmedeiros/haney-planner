
import { useEffect, useState } from 'react';
import './HaneyPlanner.css';

function HaneyPlanner() {
  const [semanas, setSemanas] = useState([]);
  const [progressoState, setProgressoState] = useState([]);
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
        setProgressoState(progresso);

        const total = data.reduce((acc, s) => acc + s.atividades.length, 0);
        setTotalTarefas(total);

        const concluidas = progresso.flat().filter(Boolean).length;
        setTotalConcluidas(concluidas);
      });
  }, []);

  const handleCheck = (semanaIdx, tarefaIdx) => {
    const newState = progressoState.map((semana, i) =>
      semana.map((checked, j) =>
        i === semanaIdx && j === tarefaIdx ? !checked : checked
      )
    );
    setProgressoState(newState);
    const total = newState.flat().filter(Boolean).length;
    setTotalConcluidas(total);
  };

  const salvarProgresso = () => {
    const dadosAtualizados = semanas.map((s, i) => ({
      ...s,
      atividades: s.atividades.map((a, j) => ({
        descricao: a.descricao,
        concluido: progressoState[i][j]
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

  const formatarData = (data) => {
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const getPct = (semanaIdx) => {
    const completadas = progressoState[semanaIdx]?.filter(Boolean).length || 0;
    const total = progressoState[semanaIdx]?.length || 1;
    return Math.round((completadas / total) * 100);
  };

  return (
    <div className="App">
      <header className="header">
        <img src="logo.png" alt="Logo Haney Motorsync" className="logo" />
        <h1>Planner Interativo - Tech Challenge Haney Motorsync</h1>
      </header>

      <div className="progressoTotal">
        Progresso Total: {Math.round((totalConcluidas / totalTarefas) * 100)}%
      </div>

      {semanas.map((s, i) => (
        <div key={i}>
          <div className="semana">
            <span>{s.semana} - {formatarData(s.inicio)} a {formatarData(s.fim)}</span>
            <span className="progresso">Progresso: {getPct(i)}%</span>
          </div>
          <ul>
            {s.atividades.map((a, j) => (
              <li key={j}>
                <input
                  type="checkbox"
                  checked={progressoState[i]?.[j] || false}
                  onChange={() => handleCheck(i, j)}
                />
                {a.descricao}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <button className="salvarBtn" onClick={salvarProgresso}>
        Salvar Progresso
      </button>
    </div>
  );
}

export default HaneyPlanner;
