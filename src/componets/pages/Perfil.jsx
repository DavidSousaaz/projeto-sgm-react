import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Campo from "../form/Campo";
import { useAuth } from "../AuthContext";

export default function Perfil() {
  const { id } = useParams();
  const { profile } = useAuth();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const endpoint = profile === 'aluno' ? `/alunos/${id}` : `/professores/${id}`;

    api.get(endpoint)
        .then(response => {
          setUserData(response.data);
        })
        .catch(err => {
          console.error("Erro ao carregar dados do perfil:", err);
          setError("Não foi possível carregar os dados do perfil.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, [id, profile]);

  if (loading) return <p className="text-center mt-10 text-lg">Carregando perfil...</p>;
  if (error) return <p className="text-red-500 text-center mt-10 text-lg">{error}</p>;
  if (!userData) return <p className="text-center mt-10 text-lg">Usuário não encontrado.</p>;

  return (
      <div className="flex justify-center p-4">
        <div className="max-w-2xl w-full mx-auto mt-10 mb-10 p-6 rounded-2xl shadow-2xl border-2 border-primaria">
          <h2 className="text-2xl font-semibold mb-6 text-center">Meu Perfil</h2>

          <form>
            {/* CORREÇÃO: Removidas as classes de grid daqui para alinhar em uma coluna */}
            <div>
              <Campo
                  label="Nome Completo"
                  name="nome"
                  value={userData.nome || ''}
                  disabled={true}
              />
              <Campo
                  label="CPF"
                  name="cpf"
                  value={userData.cpf || ''}
                  disabled={true}
              />
              <Campo
                  label="Matrícula"
                  name="matricula"
                  value={userData.matricula || ''}
                  disabled={true}
              />
              <Campo
                  label="Email Pessoal"
                  name="email"
                  value={userData.email || ''}
                  disabled={true}
              />
              <Campo
                  label="Email Acadêmico"
                  name="emailAcademico"
                  value={userData.emailAcademico || ''}
                  disabled={true}
              />
              <Campo
                  label="Instituição"
                  name="instituicao"
                  value={userData.instituicaoResponseDTO?.nome || ''}
                  disabled={true}
              />
            </div>

            {profile === 'aluno' && userData.disciplinasPagasResponseDTO && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold border-t pt-4">Disciplinas Concluídas</h3>
                  {userData.disciplinasPagasResponseDTO.length > 0 ? (
                      <ul className="list-disc list-inside mt-2 text-gray-700">
                        {userData.disciplinasPagasResponseDTO.map(d => <li key={d.id}>{d.nome}</li>)}
                      </ul>
                  ) : (
                      <p className="text-gray-500 mt-2">Nenhuma disciplina concluída registrada.</p>
                  )}
                </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <Link to={-1} className="text-secundaria hover:underline">
              Voltar
            </Link>
          </div>
        </div>
      </div>
  );
}