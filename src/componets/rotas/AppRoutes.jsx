import { Route, Routes, useLocation } from "react-router-dom";


import Conteiner from "../layout/Conteiner";
import RotaProtegida from "./RotaProtegida";


import Login from "../pages/Login";
import CadastroAluno from "../pages/CadastroAluno";
import SenhaEsquecida from "../pages/SenhaEsquecida";


import Admin from "../pages/Admin";
import Aluno from "../pages/Aluno";
import Alunos from "../pages/Alunos";
import Coordenador from "../pages/Coordenador";
import Coordenadores from "../pages/Coordenadores";
import NovoCoordenador from "../pages/NovoCoordenador";
import EditarCoordenador from "../pages/EditarCoordenador";
import Disciplinas from "../pages/Disciplinas";
import NovaDisciplina from "../pages/NovaDisciplina";
import EditarDisciplina from "../pages/EditarDisciplina";
import Editais from "../pages/Editais";
import EditalDetalhes from "../pages/EditalDetalhes";
import Instituicoes from "../pages/Instituicoes";
import NovaInstituicao from "../pages/NovaInstituicao";
import EditarInstituicao from "../pages/EditarInstituicao";
import Monitor from "../pages/Monitor";
import Monitorias from "../pages/Monitorias";
import NovaMonitoria from "../pages/NovaMonitoria";
import MonitoriaDetalhes from "../pages/MonitoriaDetalhes";
import Perfil from "../pages/Perfil";
import Professor from "../pages/Professor";


function AppRoutes() {
    const location = useLocation();


    const rotasSemLayout = ["/", "/senhaEsquecida", "/cadastrarAluno"];
    const mostrarLayout = !rotasSemLayout.includes(location.pathname);


    const RotasComLayout = () => (
        <Conteiner>
            <Routes>
                {}
                <Route path="/admin" element={<RotaProtegida perfilPermitido="admin"><Admin /></RotaProtegida>} />
                <Route path="/coordenador" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Coordenador /></RotaProtegida>} />
                <Route path="/professor" element={<RotaProtegida perfilPermitido={["professor", "coordenador", "admin"]}><Professor /></RotaProtegida>} />
                <Route path="/monitor" element={<RotaProtegida perfilPermitido="monitor"><Monitor /></RotaProtegida>} />

                {}
                <Route path="/aluno/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Aluno /></RotaProtegida>} />
                <Route path="/perfil/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno"]}><Perfil /></RotaProtegida>} />

                {}
                <Route path="/editais" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno", "monitor"]}><Editais /></RotaProtegida>} />
                <Route path="/editais/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno", "monitor"]}><EditalDetalhes /></RotaProtegida>} />
                <Route path="/monitorias" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno", "monitor"]}><Monitorias /></RotaProtegida>} />
                <Route path="/monitorias/:id" element={<RotaProtegida perfilPermitido={["admin", "coordenador", "professor", "aluno", "monitor"]}><MonitoriaDetalhes /></RotaProtegida>} />
                <Route path="/monitorias/nova" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><NovaMonitoria /></RotaProtegida>} />

                {}
                <Route path="/alunos" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Alunos /></RotaProtegida>} />
                <Route path="/disciplinas" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><Disciplinas /></RotaProtegida>} />
                <Route path="/disciplinas/novo" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><NovaDisciplina /></RotaProtegida>} />
                <Route path="/disciplinas/:id" element={<RotaProtegida perfilPermitido={["coordenador", "admin"]}><EditarDisciplina /></RotaProtegida>} />

                {}
                <Route path="/instituicoes" element={<RotaProtegida perfilPermitido="admin"><Instituicoes /></RotaProtegida>} />
                <Route path="/instituicoes/novo" element={<RotaProtegida perfilPermitido="admin"><NovaInstituicao /></RotaProtegida>} />
                <Route path="/instituicoes/:id" element={<RotaProtegida perfilPermitido="admin"><EditarInstituicao /></RotaProtegida>} />
                <Route path="/coordenadores" element={<RotaProtegida perfilPermitido="admin"><Coordenadores /></RotaProtegida>} />
                <Route path="/coordenadores/novo" element={<RotaProtegida perfilPermitido="admin"><NovoCoordenador /></RotaProtegida>} />
                <Route path="/coordenadores/editar/:id" element={<RotaProtegida perfilPermitido="admin"><EditarCoordenador /></RotaProtegida>} />

                {}
            </Routes>
        </Conteiner>
    );

    return (
        <Routes>
            {}
            <Route path="/" element={<Login />} />
            <Route path="/cadastrarAluno" element={<CadastroAluno />} />
            <Route path="/senhaEsquecida" element={<SenhaEsquecida />} />

            {}
            <Route path="/*" element={mostrarLayout ? <RotasComLayout /> : null} />
        </Routes>
    );
}

export default AppRoutes;