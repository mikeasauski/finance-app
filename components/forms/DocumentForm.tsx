<<<<<<< HEAD
import React, { useState, useRef } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Document, DocumentType } from "@/types";
import { DOCUMENT_CATEGORIES } from "@/lib/constants";
import { Upload, X, FileText, Image as ImageIcon } from "lucide-react";
=======
import React, { useState } from "react";
import { useToast } from "@/contexts/ToastContext";
import { Document } from "@/components/documents/DocumentList";
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc

interface DocumentFormProps {
    onClose?: () => void;
    onSave: (document: Document) => void;
    initialData?: Document;
}

export default function DocumentForm({ onClose, onSave, initialData }: DocumentFormProps) {
    const { showToast } = useToast();
<<<<<<< HEAD
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [category, setCategory] = useState<string>(initialData?.category || 'PERSONAL');
    const [type, setType] = useState<DocumentType>(initialData?.type || 'RG');
    const [title, setTitle] = useState(initialData?.title || "");
    const [number, setNumber] = useState(initialData?.number || "");

    // New fields
    const [issueDate, setIssueDate] = useState(initialData?.issueDate || "");
    const [expiryDate, setExpiryDate] = useState(initialData?.expiryDate || "");
    const [issuingAuthority, setIssuingAuthority] = useState(initialData?.issuingAuthority || "");
    const [notes, setNotes] = useState(initialData?.notes || "");

    // File upload
    const [fileUrl, setFileUrl] = useState<string | undefined>(initialData?.fileUrl);
    const [fileName, setFileName] = useState<string | undefined>(initialData?.fileName);

=======

    const [type, setType] = useState<Document['type']>(initialData?.type || 'RG');
    const [title, setTitle] = useState(initialData?.title || "");
    const [number, setNumber] = useState(initialData?.number || "");

>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const getRandomColor = () => {
        const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500'];
        return colors[Math.floor(Math.random() * colors.length)];
    };

<<<<<<< HEAD
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                showToast('error', 'Arquivo muito grande. Máximo 5MB.');
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFileUrl(reader.result as string);
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeFile = () => {
        setFileUrl(undefined);
        setFileName(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !number) {
            alert("Preencha todos os campos obrigatórios!");
=======
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !number) {
            alert("Preencha todos os campos!");
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            return;
        }

        const newDoc: Document = {
            id: initialData ? initialData.id : crypto.randomUUID(),
            type,
<<<<<<< HEAD
            category,
            title,
            number,
            color: initialData ? initialData.color : getRandomColor(),
            issueDate,
            expiryDate,
            issuingAuthority,
            notes,
            fileUrl,
            fileName
=======
            title,
            number,
            color: initialData ? initialData.color : getRandomColor()
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
        };

        onSave(newDoc);
        showToast('success', initialData ? 'Documento atualizado!' : 'Documento adicionado!');
        if (onClose) onClose();
    };

    return (
<<<<<<< HEAD
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-sm border border-border space-y-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-foreground">
                    {initialData ? "Editar Documento" : "Novo Documento"}
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Category Selection */}
                <div className="col-span-full md:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">Categoria</label>
                    <select
                        value={category}
                        onChange={(e) => {
                            setCategory(e.target.value);
                            // Reset type to first in new category
                            const firstType = (DOCUMENT_CATEGORIES as any)[e.target.value].types[0].value;
                            setType(firstType);
                        }}
                        className="w-full p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
                    >
                        {Object.entries(DOCUMENT_CATEGORIES).map(([key, cat]) => (
                            <option key={key} value={key}>{cat.label}</option>
                        ))}
                    </select>
                </div>

                {/* Type Selection */}
                <div className="col-span-full md:col-span-1">
                    <label className="block text-sm font-medium text-foreground mb-2">Tipo de Documento</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value as DocumentType)}
                        className="w-full p-2 bg-background border border-border rounded-lg appearance-none text-foreground"
                    >
                        {(DOCUMENT_CATEGORIES as any)[category]?.types.map((t: any) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium text-foreground mb-1">Título (Apelido)</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Ex: Meu RG"
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                        required
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium text-foreground mb-1">Número do Documento</label>
                    <input
                        type="text"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                        placeholder="00.000.000-0"
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                        required
                    />
                </div>

                {/* Additional Fields */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Data de Emissão</label>
                    <input
                        type="date"
                        value={issueDate}
                        onChange={(e) => setIssueDate(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Validade</label>
                    <input
                        type="date"
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium text-foreground mb-1">Órgão Emissor</label>
                    <input
                        type="text"
                        value={issuingAuthority}
                        onChange={(e) => setIssuingAuthority(e.target.value)}
                        placeholder="Ex: SSP/SP, DETRAN..."
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground"
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-medium text-foreground mb-1">Notas</label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Observações adicionais..."
                        rows={3}
                        className="w-full p-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-background text-foreground resize-none"
                    />
                </div>

                {/* File Upload Section */}
                <div className="col-span-full">
                    <label className="block text-sm font-medium text-foreground mb-2">Imagem do Documento</label>

                    {!fileUrl ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                <Upload size={24} />
                            </div>
                            <p className="text-sm font-medium text-foreground">Clique para fazer upload</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG até 5MB</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    ) : (
                        <div className="relative rounded-xl overflow-hidden border border-border bg-muted/30 group">
                            <div className="aspect-video w-full flex items-center justify-center bg-black/5">
                                <img src={fileUrl} alt="Preview" className="max-h-48 object-contain" />
                            </div>
                            <div className="absolute top-2 right-2">
                                <button
                                    type="button"
                                    onClick={removeFile}
                                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="p-3 flex items-center gap-2 bg-card border-t border-border">
                                <ImageIcon size={16} className="text-blue-500" />
                                <span className="text-xs font-medium truncate flex-1">{fileName}</span>
                            </div>
                        </div>
                    )}
                </div>
=======
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
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
            </div>

            <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                Salvar Documento
            </button>
        </form>
    );
}
