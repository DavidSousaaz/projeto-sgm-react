import { useState } from "react";
import { Link } from "react-router-dom";
import FormularioLogin from "../componets/login/FormularioLogin"; // Corrigindo o caminho se necessário
import { useAuth } from "../componets/AuthContext";

function Login() {
  const [matricula, setMatricula] = useState("");
  const [senha, setSenha] = useState("");
  // O erro agora vem diretamente do nosso AuthContext
  const { login, authError } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    // A lógica complexa foi movida para o AuthContext, aqui só chamamos a função.
    await login(matricula, senha);
  };

  return (
      <div className="w-screen h-screen flex justify-center items-center bg-gradient-custom shadow-2xl p-[20px]">
        <main className="text-center max-w-[1400px] w-[74vw] min-w-[330px] mb-12 mt-12 bg-slate-200 rounded-[10px]">
          <h1 className="p-[50px] font-bold text-5xl cursor-default">SGM</h1>

          {/* Exibe o erro de autenticação que vem do nosso context */}
          {authError && (
              <div className="text-red-600 p-2 bg-red-100 border border-red-400 rounded mb-4 max-w-[80%] mx-auto">
                {authError}
              </div>
          )}

          <FormularioLogin
              onSubmit={handleLogin}
              matricula={matricula}
              setMatricula={setMatricula}
              senha={senha}
              setSenha={setSenha}
          />

          <div className="pb-[50px] pt-[15px]">
            <Link
                to="/senhaEsquecida"
                className="text-secundaria hover:text-green-800 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>
        </main>
      </div>
  );
}

export default Login;