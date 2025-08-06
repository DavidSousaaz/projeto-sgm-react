import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
// 1. Importando nosso serviço de API centralizado
import api from '../services/api';

export const AuthContext = createContext();

// Função auxiliar para mapear as roles do back-end para os perfis do front-end
const mapRoleToProfile = (roles) => {
  // Pega a primeira role da lista, que geralmente é a principal
  const primaryRole = roles && roles.length > 0 ? roles[0].role : null;
  if (!primaryRole) return null;

  switch (primaryRole) {
    case "ROLE_ADMIN":
      return "admin";
    case "ROLE_DOCENTE":
      return "professor";
    case "ROLE_DISCENTE":
      return "aluno";
    case "ROLE_COORDENADOR":
      return "coordenador";
      // TODO: Adicionar um caso para ROLE_MONITOR quando essa role for implementada no back-end
    default:
      return primaryRole.replace('ROLE_', '').toLowerCase();
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Tenta carregar os dados do usuário do localStorage ao iniciar a aplicação
    const storedToken = localStorage.getItem("jwt_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const decoded = jwtDecode(storedToken);

        // Se o token expirou, limpa tudo
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(storedUser);
        // 2. Padronizando a chave do token
        setToken(storedToken);
        setUser(parsedUser);
        setProfile(mapRoleToProfile(parsedUser.roles));

      } catch (error) {
        console.error("Erro ao processar token armazenado:", error);
        localStorage.clear();
      }
    }
    setLoading(false);
  }, []);

  const login = async (matricula, password) => {
    setAuthError(null);
    try {
      // 3. Usando nosso 'api.js' para a chamada de login
      const response = await api.post("/auth/login", { matricula, password });

      const { token: newToken, user: userData } = response.data;

      // Salva no localStorage
      localStorage.setItem("jwt_token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      // Atualiza o estado global
      setToken(newToken);
      setUser(userData);
      const userProfile = mapRoleToProfile(userData.roles);
      setProfile(userProfile);

      // Lógica de redirecionamento após o login
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
    // 4. Notifica o back-end sobre o logout (boa prática)
    api.post('/auth/logout').catch(err => console.error("Erro no logout da API:", err));

    // Limpa o localStorage
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user");

    // Reseta o estado global
    setToken(null);
    setUser(null);
    setProfile(null);

    // Redireciona para a página de login
    navigate("/");
  };

  const authContextValue = {
    token,
    user,
    profile,
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