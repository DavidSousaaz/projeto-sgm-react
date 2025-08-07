import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import MonitorCard from "../monitoria/MonitorCard";

export default function EditalDetalhes() {
    const { id } = useParams();
    const [processo, setProcesso] = useState(null);
    const [monitorias, setMonitorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const [processoResponse, monitoriasResponse] = await Promise.all([

                    api.get(`/processos-seletivos/${id}`),

                    api.get(`/monitorias?processoId=${id}`)
                ]);

                setProcesso(processoResponse.data);
                setMonitorias(monitoriasResponse.data);

            } catch (err) {
                console.error("Erro ao buscar detalhes do edital:", err);
                setError("Não foi possível carregar os dados do edital.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    if (loading) return <p className="text-center mt-8 text-lg">Carregando detalhes do edital...</p>;
    if (error) return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;

    return (
        <div className="w-full flex flex-col justify-start items-center p-6">
            <div className="w-full max-w-4xl mb-6">
                <Link to="/editais" className="text-secundaria hover:underline">
                    &larr; Voltar para todos os editais
                </Link>
            </div>

            {processo && (
                <div className="w-full max-w-4xl text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Edital Nº {processo.numero}</h1>
                    <p className="text-gray-600">
                        Inscrições de {formatDate(processo.inicio)} até {formatDate(processo.fim)}
                    </p>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">Monitorias Disponíveis</h2>
            <div className="flex flex-col items-center pb-[10px] w-full">
                {monitorias.length > 0 ? (
                    monitorias.map(monitoria => (

                        <MonitorCard key={monitoria.id} monitoria={monitoria} />
                    ))
                ) : (
                    <p className="text-gray-500">Nenhuma monitoria cadastrada para este edital no momento.</p>
                )}
            </div>
        </div>
    );
}