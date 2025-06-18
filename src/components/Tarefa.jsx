import React from 'react';

function Tarefa({ descricao, concluido, topico, expandido, onCheck, onTopicoChange, onToggleExpand }) {
    return (
        <li className="atividadeItem">
            <div className="atividadeHeader">
                <input type="checkbox" checked={concluido} onChange={onCheck} />
                <button className="iconeToggleBtn" onClick={onToggleExpand} title={expandido ? "Recolher" : "Expandir"}>
                    <i className={`bi ${expandido ? "bi-chevron-up" : "bi-chevron-down"}`}></i>
                </button>
                <span className="descricaoTarefa">{descricao}</span>
            </div>

            {expandido && (
                <textarea
                    value={topico}
                    onChange={(e) => onTopicoChange(e.target.value)}
                    placeholder="Adicione tópicos ou observações..."
                />
            )}
        </li>
    );
}

export default Tarefa;