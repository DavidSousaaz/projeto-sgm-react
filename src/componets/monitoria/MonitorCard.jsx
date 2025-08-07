import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Modal from "../form/Modal";

export default function MonitorCard({ monitoria }) {
    const navigate = useNavigate();


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tipoVaga, setTipoVaga] = useState("VOLUNTARIA");
    const [error, setError] = useState(null);

    const handleOpenModal = () => {
        setError(null);
        setIsModalOpen(true);
    };


    const handleInscricao = async () => {
        try {

            await api.post(`/monitorias/${monitoria.id}/inscricoes`, { tipoVaga });
            alert("Inscrição realizada com sucesso!");
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro na inscrição:", err);
            const errorMsg = err.response?.data?.message || "Não foi possível realizar a inscrição.";
            setError(errorMsg);
        }
    };

    return (
        <>
            <div className="border-primaria border-2 rounded-[10px] p-[10px] mb-1 mt-1 min-w-[320px] max-w-[500px] w-[50vw]">
                <h2 className="text-xl font-bold">{monitoria.disciplinaResponseDTO.nome}</h2>
                <p className="text-gray-600">Professor: {monitoria.professorResponseDTO.nome}</p>
                <p>Vagas Totais: {monitoria.numeroVaga}</p>
                <p>Vagas com Bolsa: {monitoria.numeroVagaBolsa}</p>
                <div className="flex justify-end">
                    {}
                    <Button onClick={() => navigate(`/monitorias/${monitoria.id}`)}>
                        Visualizar
                    </Button>
                    {}
                    <Button onClick={handleOpenModal}>
                        Inscrever-se
                    </Button>
                </div>
            </div>

            {}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleInscricao}
                title={`Inscrição em ${monitoria.disciplinaResponseDTO.nome}`}
            >
                {}
                <p className="mb-4">Selecione o tipo de vaga que você deseja concorrer:</p>

                {}
                <div className="space-y-2">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="tipoVaga"
                            value="VOLUNTARIA"
                            checked={tipoVaga === "VOLUNTARIA"}
                            onChange={(e) => setTipoVaga(e.target.value)}
                            className="mr-2"
                        />
                        Vaga Voluntária
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="tipoVaga"
                            value="BOLSA"
                            checked={tipoVaga === "BOLSA"}
                            onChange={(e) => setTipoVaga(e.target.value)}
                            className="mr-2"
                            disabled={monitoria.numeroVagaBolsa === 0}
                        />
                        Vaga com Bolsa {monitoria.numeroVagaBolsa === 0 && "(Indisponível)"}
                    </label>
                </div>
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </Modal>
        </>
    );
}