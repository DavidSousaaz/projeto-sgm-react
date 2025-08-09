# SGM - Sistema de Gerenciamento de Monitorias (Front-end)

Interface de usuário (UI) reativa e moderna para o Sistema de Gerenciamento de Monitorias (SGM), construída com **React** e **Vite**. Esta aplicação consome a API do back-end SGM para fornecer uma experiência de usuário completa e segmentada por perfis.

## 🚀 Tecnologias Utilizadas

* **React 18+** (com Hooks)
* **Vite:** Ferramenta de build extremamente rápida para um ambiente de desenvolvimento ágil.
* **React Router Dom:** Para gerenciamento de rotas no lado do cliente e navegação.
* **Axios:** Para fazer as chamadas HTTP para a API do back-end, com interceptors para gerenciamento de token.
* **Tailwind CSS:** Para estilização rápida, responsiva e customizável baseada em classes de utilidade.
* **Context API:** Para gerenciamento do estado global de autenticação (`AuthContext`).
* **ESLint:** Para garantir a qualidade e a padronização do código.

---

## ⚙️ Configuração e Execução do Ambiente

### Pré-requisitos
- Node.js v18 ou superior.
- npm (geralmente já vem com o Node.js).
- O **servidor back-end do SGM deve estar rodando** em `http://localhost:8080`.

### Executando a Aplicação
1.  Clone este repositório:
    ```bash
    git clone https://github.com/DavidSousaaz/projeto-sgm-react
    ```
2.  Acesse a pasta do projeto:
    ```bash
    cd projeto-sgm-react
    ```
3.  Instale as dependências do projeto:
    ```bash
    npm install
    ```
4.  Execute o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```
A aplicação estará rodando e acessível em `http://localhost:5173` (ou outra porta indicada pelo Vite).

---

## 🔗 Conectando ao Back-end

Esta aplicação front-end foi projetada para consumir a API do SGM. Por padrão, ela tentará se conectar ao back-end em `http://localhost:8080/api`.

A URL base da API está configurada no arquivo `src/services/api.js`. O interceptor do Axios neste mesmo arquivo é responsável por anexar automaticamente o token JWT (`Bearer Token`) a todas as requisições para endpoints protegidos. O sistema também lida automaticamente com tokens expirados, redirecionando o usuário para a tela de login.

---

## ✨ Funcionalidades Implementadas

O sistema possui fluxos completos e distintos para cada perfil de usuário, garantindo que cada um veja apenas as informações e ações relevantes para seu papel.

* **Autenticação Segura:** Sistema de login com Token JWT, armazenamento seguro no cliente (`localStorage`) e renovação automática da sessão ao detectar token expirado.
* **Controle de Acesso:** Rotas protegidas que só podem ser acessadas por usuários com o perfil (role) adequado, com redirecionamento automático para a tela de login.
* **Visão do Aluno:** Consulta de editais, visualização de vagas, inscrição com escolha de tipo de vaga (bolsa/voluntária) e uma "Agenda" pessoal para acompanhar o status das inscrições.
* **Painel do Monitor:** Área para registrar e acompanhar o status de suas atividades de monitoria.
* **Painel do Professor:** Ferramentas para acompanhar suas monitorias, visualizar inscritos e aprovar/reprovar as atividades dos monitores.
* **Painel do Coordenador/Admin:** Dashboards para gerenciamento completo de todo o sistema (monitorias, disciplinas, instituições, usuários, etc.), incluindo o processo de seleção de novos monitores.
