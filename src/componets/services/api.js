import axios from 'axios';

// 1. Cria uma instância do axios com a URL base da nossa API Spring Boot.
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// 2. Interceptor de Requisição (Request Interceptor)
// Este código é executado ANTES de cada requisição ser enviada.
api.interceptors.request.use(
    (config) => {
        // Pega o token do localStorage
        const token = localStorage.getItem('jwt_token');

        // Se o token existir, adiciona ao cabeçalho de Authorization
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        // Em caso de erro na configuração da requisição
        return Promise.reject(error);
    }
);

// 3. Interceptor de Resposta (Response Interceptor) - PARTE NOVA E PODEROSA
// Este código é executado DEPOIS que uma resposta do back-end é recebida.
api.interceptors.response.use(
    // Se a resposta for um sucesso (status 2xx), apenas a repassa.
    (response) => {
        return response;
    },
    // Se a resposta for um erro...
    (error) => {
        // Verificamos se o erro é um 401 Unauthorized (token inválido ou expirado)
        if (error.response && error.response.status === 401) {
            // Limpa o localStorage (remove o usuário e o token inválido)
            localStorage.removeItem('user');
            localStorage.removeItem('jwt_token');

            // Redireciona o usuário para a tela de login, com uma mensagem de erro
            window.location.href = '/?erro=token-invalido';
        }

        // Repassa o erro para que a tela que fez a chamada possa tratá-lo também
        return Promise.reject(error);
    }
);

export default api;