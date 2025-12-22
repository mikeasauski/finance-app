"use client";

import { useState } from "react";
import { Plus, X, CreditCard as CardIcon, Landmark, FileText } from "lucide-react";
import CreditCardList from "@/components/credit-card/CreditCardList";
import AccountList from "@/components/accounts/AccountList";
import DocumentList, { Document } from "@/components/documents/DocumentList";
import { useFinance } from "@/contexts/FinanceContext";
import CreditCardForm from "@/components/forms/CreditCardForm";
import AccountForm from "@/components/forms/AccountForm";
import DocumentForm from "@/components/forms/DocumentForm";
import { CreditCard, Account } from "@/types";
import { cn } from "@/lib/utils";

<<<<<<< HEAD
import { useLanguage } from "@/contexts/LanguageContext";

type TabType = 'cards' | 'accounts' | 'documents';

export default function CardsPage() {
    const { t } = useLanguage();
=======
type TabType = 'cards' | 'accounts' | 'documents';

export default function CardsPage() {
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
    const { cards, transactions, accounts, removeAccount } = useFinance();
    const [activeTab, setActiveTab] = useState<TabType>('cards');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<CreditCard | null>(null);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);

    // Document state managed here to allow modal access
    const [documents, setDocuments] = useState<Document[]>([]);
    const [editingDocument, setEditingDocument] = useState<Document | null>(null);

    const handleEditCard = (card: CreditCard) => {
        setEditingCard(card);
        setIsModalOpen(true);
    };

    const handleEditAccount = (account: Account) => {
        setEditingAccount(account);
        setIsModalOpen(true);
    };

    const handleEditDocument = (document: Document) => {
        setEditingDocument(document);
        setIsModalOpen(true);
    };

    const handleSaveDocument = (doc: Document) => {
        setDocuments(prev => {
            const exists = prev.find(d => d.id === doc.id);
            if (exists) {
                return prev.map(d => d.id === doc.id ? doc : d);
            }
            return [...prev, doc];
        });
    };

    const handleDeleteAccount = (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta conta?')) {
            removeAccount(id);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCard(null);
        setEditingAccount(null);
        setEditingDocument(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
<<<<<<< HEAD
                    <h1 className="text-2xl font-bold text-foreground">{t('wallet')}</h1>
                    <p className="text-muted-foreground">{t('wallet_subtitle')}</p>
=======
                    <h1 className="text-2xl font-bold text-gray-800">Minha Carteira</h1>
                    <p className="text-gray-500">Gerencie seus cartões e limites</p>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <Plus size={20} />
<<<<<<< HEAD
                    <span>{activeTab === 'cards' ? t('new_card') : activeTab === 'accounts' ? t('new_account') : t('new_document')}</span>
=======
                    <span>{activeTab === 'cards' ? 'Novo Cartão' : activeTab === 'accounts' ? 'Nova Conta' : 'Novo Documento'}</span>
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
            </div>

            {/* Tabs */}
<<<<<<< HEAD
            <div className="flex p-1 bg-muted rounded-xl w-full max-w-md">
=======
            <div className="flex p-1 bg-gray-100 rounded-xl w-full max-w-md">
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                <button
                    onClick={() => setActiveTab('cards')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'cards'
<<<<<<< HEAD
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <CardIcon size={18} />
                    {t('credit_cards')}
=======
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <CardIcon size={18} />
                    Cartões de Crédito
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
                <button
                    onClick={() => setActiveTab('accounts')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'accounts'
<<<<<<< HEAD
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <Landmark size={18} />
                    {t('bank_accounts')}
=======
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <Landmark size={18} />
                    Contas Bancárias
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all",
                        activeTab === 'documents'
<<<<<<< HEAD
                            ? "bg-card text-primary shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <FileText size={18} />
                    {t('documents')}
=======
                            ? "bg-white text-blue-600 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                    )}
                >
                    <FileText size={18} />
                    Documentos
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                </button>
            </div>

            <div className="space-y-8">
                {activeTab === 'cards' ? (
                    <>
                        {/* Pessoa Física */}
                        <section>
<<<<<<< HEAD
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                {t('personal_context')}
                            </h2>
                            <CreditCardList
                                cards={cards.filter(c => c.context === 'PF')}
                                onEdit={handleEditCard}
                                onDelete={(id) => { /* Handle delete if needed, or pass empty function if handled in list */ }}
=======
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                Pessoa Física
                            </h2>
                            <CreditCardList
                                cards={cards.filter(c => c.context === 'PF')}
                                transactions={transactions}
                                onEdit={handleEditCard}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            />
                        </section>

                        {/* Empresarial */}
                        <section>
<<<<<<< HEAD
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                {t('business_context')}
                            </h2>
                            <CreditCardList
                                cards={cards.filter(c => c.context === 'PJ')}
                                onEdit={handleEditCard}
                                onDelete={(id) => { /* Handle delete if needed */ }}
=======
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                Empresarial
                            </h2>
                            <CreditCardList
                                cards={cards.filter(c => c.context === 'PJ')}
                                transactions={transactions}
                                onEdit={handleEditCard}
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            />
                        </section>
                    </>
                ) : activeTab === 'accounts' ? (
                    <>
                        {/* Pessoa Física */}
                        <section>
<<<<<<< HEAD
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                {t('personal_context')}
=======
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                                Pessoa Física
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            </h2>
                            <AccountList
                                accounts={accounts.filter(a => a.context === 'PF')}
                                onEdit={handleEditAccount}
                                onDelete={handleDeleteAccount}
                            />
                        </section>

                        {/* Empresarial */}
                        <section>
<<<<<<< HEAD
                            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                {t('business_context')}
=======
                            <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                                Empresarial
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            </h2>
                            <AccountList
                                accounts={accounts.filter(a => a.context === 'PJ')}
                                onEdit={handleEditAccount}
                                onDelete={handleDeleteAccount}
                            />
                        </section>
                    </>
                ) : (
                    <DocumentList
                        documents={documents}
                        setDocuments={setDocuments}
                        onEdit={handleEditDocument}
                    />
                )}
            </div>

            {/* Add/Edit Card Modal */}
            {
                isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
<<<<<<< HEAD
                        <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
=======
                        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl">
                            <button
                                onClick={handleCloseModal}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
>>>>>>> 20c76385b3b74a669ce585ebdf2328dab29f21dc
                            >
                                <X size={24} />
                            </button>
                            {activeTab === 'cards' ? (
                                <CreditCardForm
                                    onClose={handleCloseModal}
                                    initialData={editingCard || undefined}
                                />
                            ) : activeTab === 'accounts' ? (
                                <AccountForm
                                    onClose={handleCloseModal}
                                    initialData={editingAccount || undefined}
                                />
                            ) : activeTab === 'documents' ? (
                                <DocumentForm
                                    onClose={handleCloseModal}
                                    onSave={handleSaveDocument}
                                    initialData={editingDocument || undefined}
                                />
                            ) : null}
                        </div>
                    </div>
                )
            }
        </div >
    );
}
