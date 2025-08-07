import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function EditarCoordenador() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({ nome: "", email: "", cursoId: "" });
    const [cursos, setCursos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profResponse, cursosResponse] = await Promise.all([
                    api.get(`/professores/${id}`),
                    api.get("/cursos"),
                ]);
                const prof = profResponse.data;
                setFormData({
                    nome: prof.nome || "",
                    email: prof.email || "",

                    cursoId: prof.cursosResponseDTO[0]?.id || ""
                });
                setCursos(cursosResponse.data);
            } catch (err) {
                console.error("Erro ao carregar dados para edição:", err);
                setError("Não foi possível carregar os dados.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        const dadosParaEnviar = {
            nome: formData.nome,
            email: formData.email,
            cursosId: [formData.cursoId]
        };

        api.put(`/professores/${id}`, dadosParaEnviar)
            .then(() => navigate("/coordenadores"))
            .catch((err) => {
                console.error("Erro ao atualizar coordenador:", err);
                setError("Erro ao salvar as alterações.");
            });
    };

    if (loading) return <p className="text-center mt-8">Carregando...</p>;
    if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;

    return (
        <div className="flex justify-center mt-10">
            <form onSubmit={handleSubmit} className="border p-6 rounded w-full max-w-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Editar Coordenador</h2>
                <Campo label="Nome Completo" name="nome" value={formData.nome} onChange={handleChange} required />
                <Campo label="Email Pessoal" name="email" type="email" value={formData.email} onChange={handleChange} required />

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Curso Coordenado</label>
                    <select name="cursoId" value={formData.cursoId} onChange={handleChange} className="mt-0.5 p-[8px] border-2 border-[#ccc] rounded w-full" required>
                        <option value="">Selecione um curso</option>
                        {cursos.map((curso) => (<option key={curso.id} value={curso.id}>{curso.nome}</option>))}
                    </select>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    <Button type="button" color="color" onClick={() => navigate("/coordenadores")}>Cancelar</Button>
                    <Button type="submit">Salvar Alterações</Button>
                </div>
            </form>
        </div>
    );
}