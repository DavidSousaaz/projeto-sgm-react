import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Button from "../form/Button";
import Campo from "../form/Campo";

export default function NovaMonitoria() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        disciplinaId: '',
        professorId: '',
        processoSeletivoId: '',
        numeroVaga: 1,
        numeroVagaBolsa: 0,
        cargaHoraria: 4,
    });


    const [disciplinas, setDisciplinas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [processosSeletivos, setProcessosSeletivos] = useState([]);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const [disciplinasRes, professoresRes, processosRes] = await Promise.all([
                    api.get('/disciplinas'),
                    api.get('/professores'),
                    api.get('/processos-seletivos'),
                ]);
                setDisciplinas(disciplinasRes.data);
                setProfessores(professoresRes.data);
                setProcessosSeletivos(processosRes.data);
            } catch (err) {
                console.error("Erro ao carregar dados para o formulário:", err);
                setError("Não foi possível carregar os dados necessários.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await api.post("/monitorias", formData);
            alert("Monitoria criada com sucesso!");
            navigate("/coordenador");
        } catch (err) {
            console.error("Erro ao criar monitoria:", err);
            setError(err.response?.data?.message || "Erro ao salvar a monitoria.");
        }
    };

    if (loading) return <p className="text-center mt-8">Carregando formulário...</p>;

    return (
        <div className="flex justify-center mt-10">
            <form onSubmit={handleSubmit} className="border p-6 rounded w-full max-w-2xl shadow-lg">
                <h2 className="text-2xl font-bold mb-6">Criar Nova Monitoria</h2>
                {error && <p className="text-red-500 mb-4 text-center bg-red-100 p-3 rounded">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Processo Seletivo (Edital)</label>
                        <select name="processoSeletivoId" value={formData.processoSeletivoId} onChange={handleChange} className="mt-0.5 p-2 border-2 border-[#ccc] rounded w-full" required>
                            <option value="">Selecione um edital</option>
                            {processosSeletivos.map(p => <option key={p.id} value={p.id}>{p.numero}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Disciplina</label>
                        <select name="disciplinaId" value={formData.disciplinaId} onChange={handleChange} className="mt-0.5 p-2 border-2 border-[#ccc] rounded w-full" required>
                            <option value="">Selecione uma disciplina</option>
                            {disciplinas.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 text-gray-600">Professor Responsável</label>
                        <select name="professorId" value={formData.professorId} onChange={handleChange} className="mt-0.5 p-2 border-2 border-[#ccc] rounded w-full" required>
                            <option value="">Selecione um professor</option>
                            {professores.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>
                    <Campo label="Carga Horária Semanal" name="cargaHoraria" type="number" value={formData.cargaHoraria} onChange={handleChange} required />
                    <Campo label="Número de Vagas (Total)" name="numeroVaga" type="number" value={formData.numeroVaga} onChange={handleChange} required />
                    <Campo label="Vagas com Bolsa" name="numeroVagaBolsa" type="number" value={formData.numeroVagaBolsa} onChange={handleChange} required />
                </div>

                <div className="flex justify-center gap-2 mt-6">
                    <Button type="button" color="color" onClick={() => navigate("/coordenador")}>Cancelar</Button>
                    <Button type="submit">Criar Monitoria</Button>
                </div>
            </form>
        </div>
    );
}