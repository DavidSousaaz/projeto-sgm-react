import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";

export default function Coordenadores() {
    const navigate = useNavigate();
    const [coordenadores, setCoordenadores] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carregarCoordenadores();
    }, []);

    function carregarCoordenadores() {
        setLoading(true);

        api.get("/professores")
            .then((response) => {

                const

                    professoresCoordenadores = response.data.filter(
                        (prof) => prof.cursosResponseDTO && prof.cursosResponseDTO.length > 0
                    );
                setCoordenadores(professoresCoordenadores);
            })
            .catch((err) => {
                console.error("Erro ao buscar coordenadores:", err);
                setError("Erro ao carregar a lista de coordenadores.");
            })
            .finally(() => {
                setLoading(false);
            });
    }

    function removerCargo(professor) {
        if (window.confirm(`Tem certeza que deseja remover o cargo de coordenador do(a) professor(a) ${professor.nome}?`)) {

            const dadosAtualizados = { cursosId: [] };

            api.put(`/professores/${professor.id}`, dadosAtualizados)
                .then(() => {

                    carregarCoordenadores();
                })
                .catch((err) => {
                    console.error("Erro ao remover cargo de coordenador:", err);
                    alert("Erro ao remover o cargo do coordenador.");
                });
        }
    }

    if (loading) return <p className="text-center mt-8">Carregando...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gerenciar Coordenadores</h1>
                <Button onClick={() => navigate("/coordenadores/novo")}>
                    Adicionar Coordenador
                </Button>
            </div>

            {coordenadores.length === 0 ? (
                <p>Nenhum professor atuando como coordenador.</p>
            ) : (
                <table className="min-w-full border border-gray-300 rounded">
                    <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 border-b border-gray-300 text-left">Nome</th>
                        <th className="p-3 border-b border-gray-300 text-left">Email</th>
                        <th className="p-3 border-b border-gray-300 text-left">Cursos Coordenados</th>
                        <th className="p-3 border-b border-gray-300 text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {coordenadores.map((coord) => (
                        <tr key={coord.id} className="hover:bg-gray-50">
                            <td className="p-3 border-b border-gray-300">{coord.nome}</td>
                            <td className="p-3 border-b border-gray-300">{coord.email}</td>
                            <td className="p-3 border-b border-gray-300">
                                {coord.cursosResponseDTO.map(c => c.nome).join(', ')}
                            </td>
                            <td className="p-3 border-b border-gray-300 text-center space-x-2">
                                <Button
                                    onClick={() => navigate(`/coordenadores/editar/${coord.id}`)}
                                    color="color"
                                >
                                    Editar
                                </Button>
                                <Button
                                    onClick={() => removerCargo(coord)}
                                    color="red"
                                >
                                    Remover Cargo
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}