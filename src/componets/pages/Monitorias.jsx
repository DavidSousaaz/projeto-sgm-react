import { useEffect, useState } from "react";
import api from "../services/api";
// 1. Importando nosso novo card específico para inscrições
import InscricaoCard from "../monitoria/InscricaoCard";

export default function Monitorias() {
    const [inscricoes, setInscricoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        api.get("/alunos/me/inscricoes")
            .then(response => {
                setInscricoes(response.data);
            })
            .catch(err => {
                console.error("Erro ao buscar inscrições:", err);
                setError("Não foi possível carregar sua agenda de inscrições.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) return <p className="text-center mt-8">Carregando sua agenda...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="w-full flex flex-col justify-start items-center p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Minha Agenda de Inscrições
            </h1>
            <div className="flex flex-col pb-[10px]">
                {inscricoes.length > 0 ? (
                    // 2. Usando o InscricaoCard em vez do MonitorCard
                    inscricoes.map((inscricao) => (
                        <InscricaoCard key={inscricao.id.monitoriaId} inscricao={inscricao} />
                    ))
                ) : (
                    <p>Você ainda não se inscreveu em nenhuma monitoria.</p>
                )}
            </div>
        </div>
    );
}