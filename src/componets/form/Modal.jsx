import React from 'react';
import Button from './Button';

// Este componente recebe:
// - isOpen: um booleano que diz se o modal está visível ou não
// - onClose: uma função para fechar o modal (ex: ao clicar no 'X' ou em 'Cancelar')
// - onConfirm: uma função para executar quando o botão principal é clicado
// - title: o título do modal
// - children: o conteúdo que vai dentro do modal (ex: os campos do formulário)
export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) {
        return null;
    }

    return (
        // Backdrop (fundo escurecido)
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {/* Conteúdo do Modal */}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                {/* Conteúdo dinâmico (nosso formulário de escolha) */}
                <div>{children}</div>

                {/* Botões de ação */}
                <div className="flex justify-end gap-4 mt-6">
                    <Button type="button" color="color" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="button" onClick={onConfirm}>
                        Confirmar Inscrição
                    </Button>
                </div>
            </div>
        </div>
    );
}