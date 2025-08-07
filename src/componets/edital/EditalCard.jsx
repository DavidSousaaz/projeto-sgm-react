import Button from "../form/Button";
import { useNavigate } from "react-router-dom";

// O card agora recebe 'processo' (Processo Seletivo) como propriedade
export default function EditalCard({ processo }) {
    const navigate = useNavigate();

    // Função para formatar a data para o padrão brasileiro (dd/mm/yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return 'Data não definida';
        const date = new Date(dateString);
        // Adiciona um dia para corrigir problemas comuns de fuso horário com datas da API
        date.setDate(date.getDate() + 1);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    return (
        <div className="border-primaria border-2 rounded-[10px] p-[10px] mb-1 mt-1 min-w-[320px] max-w-[800px] w-[50vw]">
            <h2 className="font-bold text-lg">Edital Nº {processo.numero}</h2>
            <p className="text-sm text-gray-600">
                Período de Inscrição: {formatDate(processo.inicio)} a {formatDate(processo.fim)}
            </p>
            <div className="flex justify-end mt-2">
                {/* O botão "Visualizar" agora navega para a página de detalhes do edital */}
                <Button color='color' onClick={() => navigate(`/editais/${processo.id}`)}>
                    Visualizar Monitorias
                </Button>
                {/* O botão "Inscrever-se" foi removido daqui, pois a inscrição é por monitoria */}
            </div>
        </div>
    );
}