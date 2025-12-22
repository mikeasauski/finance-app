import React from 'react';
import { X, Download, Printer, FileText } from 'lucide-react';
import { Document } from '@/types';

interface DocumentViewerProps {
    document: Document;
    onClose: () => void;
}

export default function DocumentViewer({ document, onClose }: DocumentViewerProps) {
    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && document.fileUrl) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>${document.title} - ${document.type}</title>
                        <style>
                            body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f0f0f0; }
                            img { max-width: 100%; max-height: 100%; object-fit: contain; }
                        </style>
                    </head>
                    <body>
                        <img src="${document.fileUrl}" onload="window.print();window.close()" />
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    const handleDownload = () => {
        if (document.fileUrl) {
            const link = window.document.createElement('a');
            link.href = document.fileUrl;
            link.download = document.fileName || `document-${document.id}`;
            link.click();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-card w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${document.color} bg-opacity-20`}>
                            <FileText className="text-foreground" size={20} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-foreground">{document.title}</h3>
                            <p className="text-sm text-muted-foreground">{document.type} • {document.number}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            title="Imprimir / PDF"
                        >
                            <Printer size={20} />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors"
                            title="Baixar"
                        >
                            <Download size={20} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full text-muted-foreground transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-6 bg-muted/50 flex items-center justify-center min-h-[400px]">
                    {document.fileUrl ? (
                        <img
                            src={document.fileUrl}
                            alt={document.title}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        />
                    ) : (
                        <div className="text-center text-muted-foreground">
                            <FileText size={64} className="mx-auto mb-4 opacity-20" />
                            <p>Nenhum arquivo anexado a este documento.</p>
                        </div>
                    )}
                </div>

                {/* Footer Details */}
                {(document.issueDate || document.expiryDate || document.issuingAuthority || document.notes) && (
                    <div className="p-4 bg-card border-t border-border grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        {document.issueDate && (
                            <div>
                                <span className="block text-muted-foreground text-xs">Data de Emissão</span>
                                <span className="font-medium text-foreground">{new Date(document.issueDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        )}
                        {document.expiryDate && (
                            <div>
                                <span className="block text-muted-foreground text-xs">Validade</span>
                                <span className="font-medium text-foreground">{new Date(document.expiryDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                        )}
                        {document.issuingAuthority && (
                            <div>
                                <span className="block text-muted-foreground text-xs">Órgão Emissor</span>
                                <span className="font-medium text-foreground">{document.issuingAuthority}</span>
                            </div>
                        )}
                        {document.notes && (
                            <div className="col-span-full mt-2 pt-2 border-t border-border/50">
                                <span className="block text-muted-foreground text-xs">Notas</span>
                                <p className="text-foreground mt-1">{document.notes}</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
