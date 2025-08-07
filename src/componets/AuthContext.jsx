import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from './services/api';

export const AuthContext = createContext();

const mapRoleToProfile = (roles) => {
  if (!roles || roles.length === 0) return null;
  const profilePriority = ["admin", "coordenador", "professor", "aluno"];
  const userProfiles = roles.map(role => {
    switch (role.role) {
      case "ROLE_ADMIN": return "admin";
      case "ROLE_COORDENADOR": return "coordenador";
      case "ROLE_DOCENTE": return "professor";
      case "ROLE_DISCENTE": return "aluno";
      default: return null;
    }
  }).filter(Boolean);

  for (const profile of profilePriority) {
    if (userProfiles.includes(profile)) {
      return profile;
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isMonitor, setIsMonitor] = useState(false); // Novo estado
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Nova função para verificar se o aluno é um monitor ativo
  const verificarStatusMonitor = async () => {
    try {
      const inscricoesResponse = await api.get(`/alunos/me/inscricoes`);
      const inscricaoAtiva = inscricoesResponse.data.find(insc => insc.selecionado);
      setIsMonitor(!!inscricaoAtiva); // Converte para booleano (true se encontrou, false se não)
    } catch (error) {
      console.error("Não foi possível verificar o status de monitor.", error);
      setIsMonitor(false); // Garante que o padrão é 'false' em caso de erro
    }
  };

  useEffect(() => {
    const bootstrapAuth = async () => {
      setLoading(true);
      const storedToken = localStorage.getItem("jwt_token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const decoded = jwtDecode(storedToken);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
          } else {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
            const userProfile = mapRoleToProfile(parsedUser.roles);
            setProfile(userProfile);

            // Se o usuário carregado for um aluno, verifica seu status de monitor
            if (userProfile === 'aluno') {
              await verificarStatusMonitor();
            }
          }
        } catch (error) {
          console.error("Erro ao processar token armazenado:", error);
          localStorage.clear();
        }
      }
      setLoading(false);
    };
    bootstrapAuth();
  }, []);

  const login = async (matricula, password) => {
    setAuthError(null);
    try {
      const response = await api.post("/auth/login", { matricula, password });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("jwt_token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      const userProfile = mapRoleToProfile(userData.roles);
      setProfile(userProfile);

      // Após o login, se for aluno, verifica o status de monitor
      if (userProfile === 'aluno') {
        await verificarStatusMonitor();
      }

      const rotasPorPerfil = {
        aluno: "/editais",
        professor: "/professor",
        monitor: "/monitor",
        coordenador: "/coordenador",
        admin: "/admin",
      };
      navigate(rotasPorPerfil[userProfile] || "/");

    } catch (error) {
      console.error("Falha no login:", error);
      if (error.response && (error.response.status === 400 || error.response.status === 401)) {
        setAuthError("Matrícula ou senha inválida.");
      } else {
        setAuthError("Ocorreu um erro no servidor. Tente novamente mais tarde.");
      }
    }
  };

  const logout = () => {
    api.post('/auth/logout').catch(err => console.error("Erro no logout da API:", err));
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setProfile(null);
    setIsMonitor(false); // Limpa o status de monitor no logout
    navigate("/");
  };

  const authContextValue = {
    token,
    user,
    profile,
    isMonitor, // Expondo o novo estado para a aplicação
    isAuthenticated: !!token,
    loading,
    authError,
    login,
    logout,
  };

  return (
      <AuthContext.Provider value={authContextValue}>
        {!loading && children}
      </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};