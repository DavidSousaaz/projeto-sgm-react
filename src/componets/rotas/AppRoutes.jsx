import { Route, Routes, useLocation } from "react-router-dom";
import Login from "../pages/Login";
import Aluno from "../pages/Aluno";
import Professor from "../pages/Professor";
import Coordenador from "../pages/Coordenador";
import Monitor from "../pages/Monitor";
import Admin from "../pages/Admin";
import CadastroAluno from "../pages/CadastroAluno";
import SenhaEsquecida from "../pages/SenhaEsquecida";
import RotaProtegida from "./RotaProtegida"; // Este já estava certo (mesma pasta)
import Conteiner from "../layout/Conteiner";
import Perfil from "../pages/Perfil";
import Editais from "../pages/Editais";
import Monitorias from "../pages/Monitorias";
import Alunos from "../pages/Alunos";
import Instituicoes from "../pages/Instituicoes";
import NovaInstituicao from "../pages/NovaInstituicao";
import EditarInstituicao from "../pages/EditarInstituicao";
import Disciplinas from "../pages/Disciplinas";
import NovaDisciplina from "../pages/NovaDisciplina";
import EditarDisciplina from "../pages/EditarDisciplina";
import Coordenadores from "../pages/Coordenadores";
import NovoCoordenador from "../pages/NovoCoordenador";
import EditarCoordenador from "../pages/EditarCoordenador";

function AppRoutes() {
    const location = useLocation();

    // Rotas que não devem exibir o layout principal (NavBar, etc.)
    const rotasSemLayout = ["/", "/senhaEsquecida", "/cadastrarAluno"];
    const mostrarLayout = !rotasSemLayout.includes(location.pathname);

    // Envolvemos as rotas protegidas em um único elemento de layout
    const RotasComLayout = () => (
        <Conteiner>
            <Routes>
                {/* Aluno */}
                <Route path="/aluno/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Aluno /></RotaProtegida>} />
                <Route path="/perfil/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Perfil /></RotaProtegida>} />
                <Route path="/editais" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Editais /></RotaProtegida>} />
                <Route path="/monitorias" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Monitorias /></RotaProtegida>} />

                {/* Professor */}
                <Route path="/professor" element={<RotaProtegida perfilPermitido={["professor", "coordenador", "admin"]}><Professor /></RotaProtegida>} />

                {/* Coordenador */}
                <Route path="/coordenador" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Coordenador /></RotaProtegida>} />
                <Route path="/alunos" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Alunos /></RotaProtegida>} />
                <Route path="/disciplinas" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Disciplinas /></RotaProtegida>} />
                <Route path="/disciplinas/novo" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><NovaDisciplina /></RotaProtegida>} />
                <Route path="/disciplinas/:id" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><EditarDisciplina /></RotaProtegida>} />

                {/* Admin */}
                <Route path="/admin" element={<RotaProtegida perfilPermitido="admin"><Admin /></RotaProtegida>} />
                <Route path="/instituicoes" element={<RotaProtegida perfilPermitido="admin"><Instituicoes /></RotaProtegida>} />
                <Route path="/instituicoes/novo" element={<RotaProtegida perfilPermitido="admin"><NovaInstituicao /></RotaProtegida>} />
                <Route path="/instituicoes/:id" element={<RotaProtegida perfilPermitido="admin"><EditarInstituicao /></RotaProtegida>} />
                <Route path="/coordenadores" element={<RotaProtegida perfilPermitido="admin"><Coordenadores /></RotaProtegida>} />
                <Route path="/coordenadores/novo" element={<RotaProtegida perfilPermitido="admin"><NovoCoordenador /></RotaProtegida>} />
                <Route path="/coordenadores/editar/:id" element={<RotaProtegida perfilPermitido="admin"><EditarCoordenador /></RotaProtegida>} />

                {/* Monitor */}
                <Route path="/monitor" element={<RotaProtegida perfilPermitido="monitor"><Monitor /></RotaProtegida>} />

                {/* TODO: Adicionar uma rota de fallback para acesso negado ou página não encontrada */}
            </Routes>
        </Conteiner>
    );

    return (
        <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Login />} />
            <Route path="/senhaEsquecida" element={<SenhaEsquecida />} />
            <Route path="/cadastrarAluno" element={<CadastroAluno />} />

            {/* Rotas Privadas que usam o layout */}
            {mostrarLayout && <Route path="/*" element={<RotasComLayout />} />}
        </Routes>
    );
}

export default AppRoutes;