import Button from "../form/Button";
import { useNavigate } from "react-router-dom";

export default function MonitorCard({ monitoria }) {
    const navigate = useNavigate();

    return (
        <div className="border-primaria border-2 rounded-[10px] p-[10px] mb-1 mt-1 min-w-[320px] max-w-[500px] w-[50vw]">
            <h2 className="text-xl font-bold">{monitoria.disciplinaResponseDTO.nome}</h2>
            <p className="text-gray-600">Professor: {monitoria.professorResponseDTO.nome}</p>
            <p>Vagas: {monitoria.numeroVaga}</p>
            <p>Bolsas: {monitoria.numeroVagaBolsa}</p>
            <div className="flex justify-end">
                {/* Agora o botão usa a função navigate diretamente. O aviso vai sumir. */}
                <Button onClick={() => navigate(`/monitorias/${monitoria.id}`)}>
                    Visualizar
                </Button>
            </div>
        </div>
    );
}