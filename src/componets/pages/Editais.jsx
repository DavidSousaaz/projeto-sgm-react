import React, { useEffect, useState } from "react";
import EditalCard from "../edital/EditalCard";
// 1. Importar nosso serviço de API
import api from "../services/api";

export default function Editais() {
  // 2. Renomear o estado para refletir a entidade do back-end
  const [processosSeletivos, setProcessosSeletivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 3. Chamar a API real
    api.get('/processos-seletivos')
        .then(response => {
          setProcessosSeletivos(response.data);
        })
        .catch(err => {
          console.error("Erro ao buscar processos seletivos:", err);
          setError("Não foi possível carregar os editais.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, []);

  return (
      <div className="w-full flex flex-col justify-start items-center">
        <h1 className="text-2xl font-bold mb-4 text-center pt-[10px]">Lista de Editais</h1>

        {loading && <p>Carregando editais...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && (
            <div className="flex justify-center">
              <div className="flex flex-col pb-[10px]">
                {processosSeletivos.length > 0 ? (
                    // 4. Mapear a lista correta e passar o 'processo' como prop
                    processosSeletivos.map((processo) => (
                        <EditalCard key={processo.id} processo={processo} />
                    ))
                ) : (
                    <p>Nenhum edital aberto no momento.</p>
                )}
              </div>
            </div>
        )}
      </div>
  );
}