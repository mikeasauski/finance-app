import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Document } from "@/components/documents/DocumentList";

interface DocumentFormProps {
    onClose?: () => void;
    onSave: (document: Document) => void;
    initialData?: Document;
}

export default function DocumentForm({ onClose, onSave, initialData }: DocumentFormProps) {
    const { showToast } = useToast();

    const [type, setType] = useState<Document['type']>(initialData?.type || 'RG');
    const [title, setTitle] = useState(initialData?.title || "");
    const [number, setNumber] = useState(initialData?.number || "");

    const getRandomColor = () => {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !number) {
            alert("Preencha todos os campos!");
            return;
        }

        const newDoc: Document = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            type,
            title,
            number,
            color: initialData ? initialData.color : getRandomColor()
        };

        onSave(newDoc);
        showToast('success', initialData ? 'Documento atualizado!' : 'Documento adicionado!');
        if (onClose) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-lg font-bold text-gray-800">
                {initialData ? "Editar Documento" : "Novo Documento"}
            </h3>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg appearance-none"
                >
                    <option value="RG">RG</option>
                    <option value="CPF">CPF</option>
                    <option value="CNH">CNH</option>
                    <option value="CNPJ">CNPJ</option>
                    <option value="OTHER">Outro</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Meu RG"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="00.000.000-0"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Salvar Documento
            </button>
        </form>
    );
}
