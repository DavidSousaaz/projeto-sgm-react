import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function NovaDisciplina() {
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    nome: '',
    cargaHoraria: '',
    cursoId: ''
  });


  const [cursos, setCursos] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/cursos")
        .then((res) => setCursos(res.data))
        .catch(() => setError("Erro ao carregar a lista de cursos."))
        .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/disciplinas", formData);
      navigate("/disciplinas");
    } catch (err) {
      console.error("Erro ao criar disciplina:", err);
      const errorMsg = err.response?.data?.message || "Erro ao salvar. Verifique os dados.";
      setError(errorMsg);
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando dados...</p>;

  return (
      <div className="flex justify-center mt-10">
        <form
            onSubmit={handleSubmit}
            className="border p-6 rounded w-full max-w-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Nova Disciplina</h2>

          {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded">{error}</p>}

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

          {}
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
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
  );
}