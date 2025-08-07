import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "../form/Button";
import { useAuth } from "../AuthContext";

export default function Monitor() {
    const { isMonitor } = useAuth();

    const [minhaMonitoria, setMinhaMonitoria] = useState(null);
    const [atividades, setAtividades] = useState([]);
    const [novaAtividade, setNovaAtividade] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const carregarDados = () => {
        setLoading(true);
        api.get("/alunos/me/inscricoes")
            .then(response => {
                const inscricaoAtiva = response.data.find(insc => insc.selecionado);
                if (inscricaoAtiva) {
                    const monitoria = inscricaoAtiva.monitoriaResponseDTO;
                    setMinhaMonitoria(monitoria);
                    return api.get(`/atividades?monitoriaId=${monitoria.id}`);
                }
                throw new Error("Nenhuma monitoria ativa encontrada para você.");
            })
            .then(atividadesResponse => {
                setAtividades(atividadesResponse.data);
            })
            .catch(err => {
                console.error("Erro ao carregar painel do monitor:", err);
                setError(err.message || "Não foi possível carregar seus dados de monitoria.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (isMonitor) {
            carregarDados();
        } else {
            setLoading(false);
        }
    }, [isMonitor]);

    const handleSubmitAtividade = async (e) => {
        e.preventDefault();
        if (!novaAtividade.trim()) return;

        try {
            await api.post('/atividades', {
                descricao: novaAtividade,
                monitoriaId: minhaMonitoria.id,
            });
            alert('Atividade registrada com sucesso!');
            setNovaAtividade('');
            carregarDados();
        } catch (err) {
            console.error("Erro ao registrar atividade:", err);
            alert("Falha ao registrar atividade.");
        }
    };

    // Função auxiliar para criar um "badge" de status colorido
    const renderStatusBadge = (status) => {
        const styleMap = {
            PENDENTE: 'bg-yellow-100 text-yellow-800',
            APROVADA: 'bg-green-100 text-green-800',
            REPROVADA: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${styleMap[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    if (loading) return <p className="text-center mt-8">Verificando seu status de monitor...</p>;

    if (!isMonitor) {
        return (
            <div className="p-6 max-w-4xl mx-auto text-center">
                <h1 className="text-2xl font-bold mb-4">Painel do Monitor</h1>
                <p className="text-lg text-gray-600">Você não está selecionado como monitor em nenhuma disciplina no momento.</p>
            </div>
        );
    }

    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Painel do Monitor</h1>
            {minhaMonitoria && (
                <div className="bg-white p-4 rounded-lg shadow-md border mb-6">
                    <h2 className="text-xl font-semibold">{minhaMonitoria.disciplinaResponseDTO.nome}</h2>
                    <p className="text-gray-600">Professor Responsável: {minhaMonitoria.professorResponseDTO.nome}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-md border mb-8">
                <h3 className="text-lg font-semibold mb-4">Registrar Nova Atividade</h3>
                <form onSubmit={handleSubmitAtividade}>
                    <textarea
                        value={novaAtividade}
                        onChange={(e) => setNovaAtividade(e.target.value)}
                        className="w-full border-2 border-gray-200 p-2 rounded-md mb-2 focus:border-primaria focus:outline-none"
                        placeholder="Descreva a atividade realizada (ex: Ajudei 3 alunos com a Lista de Exercícios 2)"
                        rows="3"
                        required
                    ></textarea>
                    <div className="text-right">
                        <Button type="submit">Registrar Atividade</Button>
                    </div>
                </form>
            </div>

            <div>
                <h3 className="text-2xl font-bold mb-4">Minhas Atividades Registradas</h3>
                {atividades.length > 0 ? (
                    <ul className="divide-y bg-white p-4 rounded-lg shadow-md border">
                        {atividades.map(ativ => (
                            <li key={ativ.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="text-gray-800">{ativ.descricao}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Registrado em: {new Date(ativ.dataHora).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                {/* ** A MUDANÇA É AQUI: Exibindo o status ** */}
                                {renderStatusBadge(ativ.status)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-center py-4">Nenhuma atividade registrada ainda.</p>
                )}
            </div>
        </div>
    );
}