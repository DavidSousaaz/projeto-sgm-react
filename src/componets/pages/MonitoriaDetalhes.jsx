import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../AuthContext";
import Button from "../form/Button";

export default function MonitoriaDetalhes() {
    const { id } = useParams();
    const { profile } = useAuth();
    const [monitoria, setMonitoria] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para buscar os dados, para que possamos reutilizá-la
    const fetchMonitoria = () => {
        setLoading(true);
        api.get(`/monitorias/${id}`)
            .then(response => {
                setMonitoria(response.data);
            })
            .catch(err => {
                console.error("Erro ao buscar detalhes da monitoria:", err);
                setError("Não foi possível carregar os dados da monitoria.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    // Busca os dados quando o componente é montado
    useEffect(() => {
        fetchMonitoria();
    }, [id]);

    // 1. NOVA FUNÇÃO para chamar a API de seleção de monitor
    const handleSelecionarMonitor = (alunoId) => {
        if (window.confirm("Tem certeza que deseja selecionar este aluno como monitor?")) {
            api.put(`/monitorias/${id}/inscricoes/${alunoId}/selecionar`)
                .then(() => {
                    alert("Aluno selecionado com sucesso!");
                    // Recarrega os dados da monitoria para atualizar o status na tela
                    fetchMonitoria();
                })
                .catch(err => {
                    console.error("Erro ao selecionar monitor:", err);
                    const errorMsg = err.response?.data?.message || "Não foi possível selecionar o monitor.";
                    alert(errorMsg);
                });
        }
    };


    if (loading) return <p className="text-center mt-8 text-lg">Carregando detalhes...</p>;
    if (error) return <p className="text-red-500 text-center mt-8 text-lg">{error}</p>;
    if (!monitoria) return <p className="text-center mt-8 text-lg">Monitoria não encontrada.</p>;

    const podeVerInscritos = profile === 'admin' || profile === 'coordenador' || profile === 'professor';
    // 2. NOVA VARIÁVEL para controlar quem pode clicar no botão
    const podeSelecionar = profile === 'admin' || profile === 'coordenador';

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to={-1} className="text-secundaria hover:underline">
                    &larr; Voltar
                </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                <h1 className="text-3xl font-bold mb-2">{monitoria.disciplinaResponseDTO.nome}</h1>
                <p className="text-lg text-gray-600 mb-4">Coordenada por: {monitoria.professorResponseDTO.nome}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <p><strong>Curso:</strong> {monitoria.disciplinaResponseDTO.cursoResponseDTO.nome}</p>
                    <p><strong>Edital:</strong> Nº {monitoria.processoSeletivoResponseDTO.numero}</p>
                    <p><strong>Carga Horária:</strong> {monitoria.cargaHoraria}h</p>
                    <p><strong>Vagas Totais:</strong> {monitoria.numeroVaga}</p>
                    <p><strong>Vagas com Bolsa:</strong> {monitoria.numeroVagaBolsa}</p>
                </div>
            </div>

            {podeVerInscritos && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Alunos Inscritos</h2>
                    {monitoria.monitoriaInscritosResponseDTO.length > 0 ? (
                        <ul className="bg-white p-4 rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
                            {monitoria.monitoriaInscritosResponseDTO.map(inscricao => (
                                <li key={inscricao.alunoResponseDTO.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">{inscricao.alunoResponseDTO.nome}</p>
                                        <p className="text-sm text-gray-500">{inscricao.alunoResponseDTO.matricula} - Vaga: {inscricao.tipoVaga}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 text-sm rounded-full ${inscricao.selecionado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {inscricao.selecionado ? 'Selecionado' : 'Pendente'}
                                        </span>

                                        {/* 3. BOTÃO DE SELEÇÃO com lógica de permissão e visibilidade */}
                                        {podeSelecionar && !inscricao.selecionado && (
                                            <Button onClick={() => handleSelecionarMonitor(inscricao.alunoResponseDTO.id)}>
                                                Selecionar
                                            </Button>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">Nenhum aluno inscrito até o momento.</p>
                    )}
                </div>
            )}
        </div>
    );
}