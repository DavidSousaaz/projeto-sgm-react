import { useAuth } from "../AuthContext";
import NavItem from "./NavItem";
import ScrollContainer from "./ScrollContainer";

function NavBar() {
  const { profile, user, isMonitor } = useAuth();


  const navLinksPorPerfil = {
    monitor: [
      { to: "/monitor", label: "Monitoria" }
    ],
    professor: [
      { to: "/professor", label: "Painel Professor" }
    ],
    aluno: [
      { to: "/editais", label: "Editais" },
      { to: "/monitorias", label: "Agenda" }
    ],
    admin: [
      { to: "/admin", label: "Painel Admin" },
      { to: "/instituicoes", label: "Instituições" },
      { to: "/coordenadores", label: "Coordenadores" },
      { to: "/alunos", label: "Alunos" },
      { to: "/disciplinas", label: "Disciplinas" }
    ],
    coordenador: [
      { to: "/coordenador", label: "Coordenação" },
      { to: "/alunos", label: "Alunos" },
      { to: "/disciplinas", label: "Disciplinas" },
    ]
  };


  const renderNavItems = (items) => {
    return items.map(item => <NavItem key={item.to} to={item.to} label={item.label} />);
  };

  return (
      <nav>
        {profile && (
            <ScrollContainer>
              {user && <NavItem to={`/perfil/${user.id}`} label="Meu Perfil" />}
              {user && <div className="border-l border-gray-400 h-6 self-center mx-2"></div>}

              {}
              {}
              {isMonitor && (
                  <NavItem to="/monitor" label="Minha Monitoria" />
              )}

              {}
              {navLinksPorPerfil[profile] && renderNavItems(navLinksPorPerfil[profile])}
            </ScrollContainer>
        )}
      </nav>
  );
}

export default NavBar;