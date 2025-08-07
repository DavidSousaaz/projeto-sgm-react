import { useEffect, useState } from "react";
import api from "../services/api";
import Button from "../form/Button";

export default function Professor() {
  const [monitorias, setMonitorias] = useState([]);
  const [selectedMonitoriaId, setSelectedMonitoriaId] = useState(null);
  const [atividades, setAtividades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Busca as monitorias do professor logado
  useEffect(() => {
    setLoading(true);
    api.get('/professores/me/monitorias')
        .then(res => setMonitorias(res.data))
        .catch(err => {
          console.error("Erro ao buscar monitorias do professor:", err);
          setError("Não foi possível carregar suas monitorias.");
        })
        .finally(() => setLoading(false));
  }, []);

  // Busca as atividades quando uma monitoria é selecionada
  useEffect(() => {
    if (selectedMonitoriaId) {
      api.get(`/atividades?monitoriaId=${selectedMonitoriaId}`)
          .then(res => setAtividades(res.data))
          .catch(err => {
            console.error("Erro ao buscar atividades:", err);
            setError("Não foi possível carregar as atividades desta monitoria.");
          });
    }
  }, [selectedMonitoriaId]);

  const handleStatusUpdate = (atividadeId, newStatus) => {
    if (window.confirm(`Tem certeza que deseja marcar esta atividade como ${newStatus}?`)) {
      api.patch(`/atividades/${atividadeId}/status`, { status: newStatus })
          .then(() => {
            // Atualiza a lista de atividades na tela
            setAtividades(prev => prev.map(ativ =>
                ativ.id === atividadeId ? { ...ativ, status: newStatus } : ativ
            ));
          })
          .catch(err => {
            console.error("Erro ao atualizar status:", err);
            alert("Não foi possível atualizar o status da atividade.");
          });
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando painel...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Painel do Professor</h1>

        {/* Seletor de Monitorias */}
        <div className="mb-6">
          <label className="block text-lg font-medium mb-2">Selecione uma de suas monitorias:</label>
          <select
              onChange={(e) => setSelectedMonitoriaId(e.target.value)}
              value={selectedMonitoriaId || ''}
              className="w-full max-w-sm p-2 border-2 border-gray-300 rounded-md"
          >
            <option value="">-- Minhas Monitorias --</option>
            {monitorias.map(m => (
                <option key={m.id} value={m.id}>{m.disciplinaResponseDTO.nome}</option>
            ))}
          </select>
        </div>

        {/* Tabela de Atividades */}
        {selectedMonitoriaId && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Atividades Registradas pelo Monitor</h2>
              {atividades.length > 0 ? (
                  <table className="min-w-full border rounded">
                    <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">Descrição</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody>
                    {atividades.map(ativ => (
                        <tr key={ativ.id} className="hover:bg-gray-50">
                          <td className="p-3 border-b">{ativ.descricao}</td>
                          <td className="p-3 border-b">
                                            <span className={`px-3 py-1 text-sm rounded-full ${
                                                ativ.status === 'APROVADA' ? 'bg-green-100 text-green-800' :
                                                    ativ.status === 'REPROVADA' ? 'bg-red-100 text-red-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {ativ.status}
                                            </span>
                          </td>
                          <td className="p-3 border-b text-center space-x-2">
                            {ativ.status === 'PENDENTE' && (
                                <>
                                  <Button onClick={() => handleStatusUpdate(ativ.id, 'APROVADA')}>Aprovar</Button>
                                  <Button color="red" onClick={() => handleStatusUpdate(ativ.id, 'REPROVADA')}>Reprovar</Button>
                                </>
                            )}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
              ) : (
                  <p>Nenhuma atividade registrada para esta monitoria.</p>
              )}
            </div>
        )}
      </div>
  );
}