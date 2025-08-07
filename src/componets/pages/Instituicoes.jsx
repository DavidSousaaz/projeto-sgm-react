import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";

export default function Instituicoes() {
  const navigate = useNavigate();
  const [instituicoes, setInstituicoes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get("/instituicoes")
        .then((response) => {
          setInstituicoes(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar instituições:", error);
          setError("Erro ao carregar a lista de instituições.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);




  if (loading) return <p className="text-center mt-8">Carregando instituições...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Instituições</h1>
          <Button onClick={() => navigate("/instituicoes/novo")}>
            Criar Instituição
          </Button>
        </div>

        {instituicoes.length === 0 ? (
            <p>Nenhuma instituição cadastrada.</p>
        ) : (
            <table className="min-w-full border border-gray-300 rounded">
              <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b border-gray-300 text-left">Nome</th>
                <th className="p-3 border-b border-gray-300 text-left">CNPJ</th>
                <th className="p-3 border-b border-gray-300 text-left">Email</th>
                <th className="p-3 border-b border-gray-300 text-center">Ações</th>
              </tr>
              </thead>
              <tbody>
              {instituicoes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-gray-50">
                    <td className="p-3 border-b border-gray-300">{inst.nome}</td>
                    <td className="p-3 border-b border-gray-300">{inst.cnpj}</td>
                    <td className="p-3 border-b border-gray-300">{inst.email}</td>
                    <td className="p-3 border-b border-gray-300 text-center space-x-2">
                      <Button
                          onClick={() => navigate(`/instituicoes/${inst.id}`)}
                          color="color"
                      >
                        Editar
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