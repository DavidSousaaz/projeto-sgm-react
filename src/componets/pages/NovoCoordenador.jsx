import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";

export default function NovoCoordenador() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ professorId: '', cursoId: '' });
    const [professores, setProfessores] = useState([]);
    const [cursos, setCursos] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca professores e cursos para preencher os dropdowns
        const fetchData = async () => {
            try {
                const [profResponse, cursosResponse] = await Promise.all([
                    api.get("/professores"),
                    api.get("/cursos"),
                ]);
                setProfessores(profResponse.data);
                setCursos(cursosResponse.data);
            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setError("Não foi possível carregar os professores ou cursos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);

        // Para tornar um professor coordenador, atualizamos seu registro com o ID do curso
        const dadosParaEnviar = { cursosId: [formData.cursoId] };

        api.put(`/professores/${formData.professorId}`, dadosParaEnviar)
            .then(() => navigate("/coordenadores"))
            .catch((err) => {
                console.error("Erro ao designar coordenador:", err);
                setError("Erro ao salvar. Verifique se o professor já não coordena este curso.");
            });
    };

    if (loading) return <p className="text-center mt-8">Carregando...</p>;

    return (
        <div className="flex justify-center mt-10">
            <form onSubmit={handleSubmit} className="border p-6 rounded w-full max-w-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Designar Novo Coordenador</h2>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Professor</label>
                    <select name="professorId" value={formData.professorId} onChange={handleChange} className="mt-0.5 p-[8px] border-2 border-[#ccc] rounded w-full" required>
                        <option value="">Selecione um professor</option>
                        {professores.map((prof) => (<option key={prof.id} value={prof.id}>{prof.nome}</option>))}
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-1 text-gray-600">Curso a Coordenar</label>
                    <select name="cursoId" value={formData.cursoId} onChange={handleChange} className="mt-0.5 p-[8px] border-2 border-[#ccc] rounded w-full" required>
                        <option value="">Selecione um curso</option>
                        {cursos.map((curso) => (<option key={curso.id} value={curso.id}>{curso.nome}</option>))}
                    </select>
                </div>

                <div className="flex justify-center gap-2 mt-4">
                    <Button type="button" color="color" onClick={() => navigate("/coordenadores")}>Cancelar</Button>
                    <Button type="submit">Salvar</Button>
                </div>
            </form>
        </div>
    );
}