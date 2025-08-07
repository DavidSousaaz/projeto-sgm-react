import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";

export default function Coordenador() {
    const navigate = useNavigate();
    const [dashboardData, setDashboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        api.get("/monitorias/dashboard")
            .then(response => {
                setDashboardData(response.data);
            })
            .catch(err => {
                console.error("Erro ao buscar dados do dashboard:", err);
                setError("Não foi possível carregar os dados do painel.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-8 text-lg">Carregando painel...</p>;
    if (error) return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Painel do Coordenador</h1>
                <Button onClick={() => navigate("/monitorias/nova")}>
                    Nova Monitoria
                </Button>
            </div>

            {dashboardData.length === 0 ? (
                <p>Nenhuma monitoria cadastrada no sistema.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded shadow-md">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b border-gray-300 text-left">Disciplina</th>
                            <th className="p-3 border-b border-gray-300 text-left">Professor Responsável</th>
                            <th className="p-3 border-b border-gray-300 text-center">Vagas (Inscritos / Total)</th>
                            <th className="p-3 border-b border-gray-300 text-center">Ações</th>
                        </tr>
                        </thead>
                        <tbody>
                        {dashboardData.map((monitoria) => (
                            <tr key={monitoria.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b border-gray-300">{monitoria.nomeDisciplina}</td>
                                <td className="p-3 border-b border-gray-300">{monitoria.nomeProfessor}</td>
                                <td className="p-3 border-b border-gray-300 text-center">
                                    {monitoria.vagasOcupadas} / {monitoria.vagasTotais}
                                </td>
                                <td className="p-3 border-b border-gray-300 text-center">
                                    {}
                                    <Button
                                        onClick={() => navigate(`/monitorias/${monitoria.id}`)}
                                        color="color"
                                    >
                                        Gerenciar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}