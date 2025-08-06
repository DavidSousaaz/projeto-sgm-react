import { useEffect, useState } from "react";
import AlunoCard from "../aluno/AlunoCard";
import api from "../services/api";

export default function Alunos() {
    const [alunos, setAlunos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/alunos') // Chamando o endpoint real
            .then((response) => {
                setAlunos(response.data);
            })
            .catch((error) => {
                console.error("Erro ao buscar alunos:", error);
                setError("Erro ao buscar os dados dos alunos. Verifique suas permissões.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p className="text-center mt-8">Carregando alunos...</p>;
    }

    if (error) {
        return <p className="text-center mt-8 text-red-500">{error}</p>;
    }

    return (
        <div className="w-full flex flex-col justify-start items-center">
            <h1 className="text-2xl font-bold mb-4 text-center pt-[10px]">
                Lista de Alunos
            </h1>
            <div className="flex justify-center">
                <div className="flex flex-col pb-[10px]">
                    {alunos.length > 0 ? (
                        alunos.map((aluno) => (
                            <AlunoCard key={aluno.id} aluno={aluno} />
                        ))
                    ) : (
                        <p>Nenhum aluno cadastrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
}