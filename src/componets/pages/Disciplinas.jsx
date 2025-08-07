import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";

export default function Disciplinas() {
  const navigate = useNavigate();
  const [disciplinas, setDisciplinas] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/disciplinas")
        .then((response) => {
          setDisciplinas(response.data);
        })
        .catch((err) => {
          console.error("Erro ao buscar disciplinas:", err);
          setError("Não foi possível carregar as disciplinas.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  function deletarDisciplina(id) {
    if (window.confirm("Atenção! Excluir esta disciplina também excluirá todas as monitorias associadas a ela. Deseja continuar?")) {
      api.delete(`/disciplinas/${id}`)
          .then(() => {
            setDisciplinas(disciplinas.filter((d) => d.id !== id));
          })
          .catch((error) => {
            console.error("Erro ao deletar disciplina:", error);
            const errorMsg = error.response?.data?.message || "Erro ao deletar disciplina. Verifique as dependências.";
            alert(errorMsg);
          });
    }
  }

  if (loading) return <p className="text-center mt-8">Carregando disciplinas...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Disciplinas</h1>
          <Button onClick={() => navigate("/disciplinas/novo")}>
            Nova Disciplina
          </Button>
        </div>

        {disciplinas.length === 0 ? (
            <p>Nenhuma disciplina cadastrada.</p>
        ) : (
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300 text-left">Nome</th>
                <th className="p-3 border-b border-gray-300 text-left">Carga Horária</th>
                <th className="p-3 border-b border-gray-300 text-left">Curso</th>
                <th className="p-3 border-b border-gray-300 text-center">Ações</th>
              </tr>
              </thead>
              <tbody>
              {disciplinas.map((disc) => (
                  <tr key={disc.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300">{disc.nome}</td>
                    <td className="p-3 border-b border-gray-300">{disc.cargaHoraria}h</td>
                    <td className="p-3 border-b border-gray-300">{disc.cursoResponseDTO?.nome ?? "N/A"}</td>
                    <td className="p-3 border-b border-gray-300 text-center space-x-2">
                      <Button
                          onClick={() => navigate(`/disciplinas/${disc.id}`)}
                          color="color"
                      >
                        Editar
                      </Button>
                      <Button
                          onClick={() => deletarDisciplina(disc.id)}
                          color="red"
                      >
                        Excluir
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