import { useEffect, useState } from "react";
import MonitorCard from "../monitoria/MonitorCard";
// 1. Importar nosso serviço de API real
import api from "../services/api";

export default function Monitorias() {
  const [monitorias, setMonitorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 2. Chamar a API real para buscar as monitorias
    api.get("/monitorias")
        .then(response => {
          setMonitorias(response.data);
        })
        .catch(err => {
          console.error("Erro ao buscar monitorias:", err);
          setError("Não foi possível carregar as monitorias. Tente novamente mais tarde.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  if (loading) {
    return <p className="text-center mt-8">Carregando monitorias...</p>;
  }

  if (error) {
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  }

  return (
      <div className="w-full flex flex-col justify-start items-center">
        <h1 className="text-2xl font-bold mb-4 text-center pt-[10px]">
          Monitorias Disponíveis
        </h1>
        <div className="flex justify-center">
          <div className="flex flex-col pb-[10px]">
            {monitorias.length > 0 ? (
                monitorias.map((monitoria) => (
                    // 3. Passando o objeto 'monitoria' completo para o card
                    <MonitorCard key={monitoria.id} monitoria={monitoria} />
                ))
            ) : (
                <p>Nenhuma monitoria disponível no momento.</p>
            )}
          </div>
        </div>
      </div>
  );
}