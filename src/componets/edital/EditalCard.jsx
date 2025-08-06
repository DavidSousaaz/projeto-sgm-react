import Button from "../form/Button";

// O card agora recebe 'processo' em vez de 'edital'
export default function EditalCard({ processo }) {

    // Função para formatar a data para o padrão brasileiro
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // Adiciona um dia para corrigir problemas de fuso horário (comum com datas sem hora)
        date.setDate(date.getDate() + 1);
        return new Intl.DateTimeFormat('pt-BR').format(date);
    }

    return (
        <div className="border-primaria border-2 rounded-[10px] p-[10px] mb-1 mt-1 min-w-[320px] max-w-[800px] w-[50vw]">
            {/* Usando os campos do DTO do back-end */}
            <h2 className="font-bold text-lg">Edital Nº {processo.numero}</h2>
            <p className="text-sm text-gray-600">
                Período de Inscrição: {formatDate(processo.inicio)} a {formatDate(processo.fim)}
            </p>
            <div className="flex justify-end mt-2">
                <Button color='color'>
                    Visualizar
                </Button>
                <Button>
                    Inscrever-se
                </Button>
            </div>
        </div>
    );
}