import React from 'react';
import Button from './Button';







export default function Modal({ isOpen, onClose, onConfirm, title, children }) {
    if (!isOpen) {
        return null;
    }

    return (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            {}
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold">{title}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                </div>

                {}
                <div>{children}</div>

                {}
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