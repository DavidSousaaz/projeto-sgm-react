import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function EditarDisciplina() {
  const { id } = useParams(); // Pega o ID da disciplina da URL
  const navigate = useNavigate();

  // 1. Estado do formulário inicializado corretamente
  const [formData, setFormData] = useState({
    nome: "",
    cargaHoraria: "",
    cursoId: "",
  });

  // 2. Só precisamos da lista de cursos para o dropdown
  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 3. Busca os dados da disciplina específica E a lista de todos os cursos
    const fetchDados = async () => {
      try {
        const [disciplinaResponse, cursosResponse] = await Promise.all([
          api.get(`/disciplinas/${id}`),
          api.get("/cursos"),
        ]);

        // 4. Popula o formulário com os dados da disciplina que está sendo editada
        const disciplina = disciplinaResponse.data;
        setFormData({
          nome: disciplina.nome,
          cargaHoraria: disciplina.cargaHoraria,
          cursoId: disciplina.cursoResponseDTO.id,
        });
        setCursos(cursosResponse.data);

      } catch (err) {
        console.error("Erro ao carregar dados para edição:", err);
        setError("Não foi possível carregar os dados da disciplina.");
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [id]); // Executa sempre que o ID mudar

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.put(`/disciplinas/${id}`, formData);
      navigate("/disciplinas");
    } catch (err) {
      console.error("Erro ao atualizar disciplina:", err);
      const errorMsg = err.response?.data?.message || "Erro ao salvar as alterações.";
      setError(errorMsg);
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando dados da disciplina...</p>;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

  return (
      <div className="flex justify-center mt-10">
        <form
            onSubmit={handleSubmit}
            className="border p-6 rounded w-full max-w-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Editar Disciplina</h2>

          <Campo
              label="Nome da Disciplina"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
          />

          <Campo
              label="Carga Horária"
              name="cargaHoraria"
              type="number"
              value={formData.cargaHoraria}
              onChange={handleChange}
              required
          />

          {/* 5. Dropdown de Professor foi removido */}
          <div className="mb-4">
            <label className="block mb-1 text-gray-600">Curso</label>
            <select
                name="cursoId"
                value={formData.cursoId}
                onChange={handleChange}
                className="mt-0.5 p-[8px] border-2 border-[#ccc] focus:border-primaria focus:outline-none rounded w-full"
                required
            >
              <option value="">Selecione um curso</option>
              {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.nome}
                  </option>
              ))}
            </select>
          </div>

          <div className="flex justify-center gap-2 mt-4">
            <Button
                type="button"
                color="color"
                onClick={() => navigate("/disciplinas")}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </div>
  );
}