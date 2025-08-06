import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function NovaInstituicao() {
  const navigate = useNavigate();

  // O estado do formulário agora reflete o DTO simples do back-end
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
  });

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    try {
      await api.post("/instituicoes", formData);
      // Se a criação for bem-sucedida, navega de volta para a lista
      navigate("/instituicoes");
    } catch (err) {
      console.error("Erro ao criar instituição:", err);
      const errorMsg = err.response?.data?.message || "Erro ao salvar. Verifique os dados e tente novamente.";
      setError(errorMsg);
    }
  };

  return (
      <div className="flex justify-center mt-10">
        <form
            onSubmit={handleSubmit}
            className="border p-6 rounded w-full max-w-xl shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-4">Nova Instituição</h2>

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

          <div className="flex justify-center gap-2 mt-4">
            <Button
                type="button"
                color="color"
                onClick={() => navigate("/instituicoes")}
            >
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </div>
        </form>
      </div>
  );
}