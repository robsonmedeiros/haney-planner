import React from 'react';
import Tarefa from './Tarefa';

function Semana({
    dados,
    index,
    visivel,
    progresso,
    expandidoState,
    topicosState,
    progressoState,
    onToggleSemana,
    onToggleExpand,
    onCheck,
    onTopicoChange,
    formatarData
}) {
    return (
        <div>
            <div className="semana">
                <button onClick={() => onToggleSemana(index)} className="toggleSemanaBtn" title={visivel ? 'Recolher semana' : 'Expandir semana'}>
                    <i className={`bi ${visivel ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
                </button>
                <span>{dados.semana} - {formatarData(dados.inicio)} a {formatarData(dados.fim)}</span>
                <span className="progresso">Progresso: {progresso}%</span>
            </div>

            {visivel && (
                <ul>
                    {dados.atividades.map((a, j) => (
                        <Tarefa
                            key={j}
                            descricao={a.descricao}
                            concluido={progressoState[j]}
                            topico={topicosState[j]}
                            expandido={expandidoState[j]}
                            onCheck={() => onCheck(index, j)}
                            onTopicoChange={(val) => onTopicoChange(index, j, val)}
                            onToggleExpand={() => onToggleExpand(index, j)}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Semana;
