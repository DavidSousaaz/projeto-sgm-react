import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function EditarInstituicao() {

  const { id } = useParams();
  const navigate = useNavigate();


  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
  });


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    setLoading(true);
    api.get(`/instituicoes/${id}`)
        .then((response) => {

          setFormData({
            nome: response.data.nome,
            cnpj: response.data.cnpj,
            email: response.data.email,
          });
        })
        .catch((err) => {
          console.error("Erro ao carregar instituição:", err);
          setError("Não foi possível carregar os dados da instituição.");
        })
        .finally(() => {
          setLoading(false);
        });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await api.put(`/instituicoes/${id}`, formData);
      navigate("/instituicoes");
    } catch (err) {
      console.error("Erro ao atualizar instituição:", err);
      const errorMsg = err.response?.data?.message || "Erro ao salvar as alterações.";
      setError(errorMsg);
    }
  };

  if (loading) return <p className="text-center mt-8">Carregando...</p>;

  return (
      <div className="flex justify-center mt-10">
        <form
            onSubmit={handleSubmit}
            className="border p-6 rounded w-full max-w-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Editar Instituição</h2>

          {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded">{error}</p>}

          <Campo
              label="Nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
          />
          <Campo
              label="CNPJ"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              required
          />
          <Campo
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
          />

          {}

          <div className="flex justify-center gap-2 mt-4">
            <Button
                type="button"
                color="color"
                onClick={() => navigate("/instituicoes")}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </div>
  );
}