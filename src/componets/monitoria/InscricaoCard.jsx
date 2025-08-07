import React from 'react';
import Button from '../form/Button';
import {useNavigate} from "react-router-dom";

// Este card é feito para receber um objeto de Inscrição da API
export default function InscricaoCard({ inscricao }) {
    const navigate = useNavigate();
    const monitoria = inscricao.monitoriaResponseDTO;

    // Função para formatar o status da inscrição
    const getStatus = () => {
        if (inscricao.selecionado) {
            return <span className="font-bold text-green-600">Selecionado</span>;
        }
        return <span className="font-bold text-yellow-600">Inscrição Pendente</span>;
    };

    return (
        <div className="border-primaria border-2 rounded-[10px] p-[10px] mb-2 mt-1 min-w-[320px] max-w-[500px] w-[50vw]">
            <h2 className="text-xl font-bold">{monitoria.disciplinaResponseDTO.nome}</h2>
            <p className="text-gray-600">Professor: {monitoria.professorResponseDTO.nome}</p>
            <div className="mt-2">
                <p>Status da sua Inscrição: {getStatus()}</p>
                <p>Tipo de Vaga: <span className="font-semibold">{inscricao.tipoVaga}</span></p>
            </div>
            <div className="flex justify-end mt-2">
                {/* 3. Faça o botão usar o navigate */}
                <Button color="color" onClick={() => navigate(`/monitorias/${monitoria.id}`)}>
                    Ver Detalhes
                </Button>
            </div>
        </div>
    );
}