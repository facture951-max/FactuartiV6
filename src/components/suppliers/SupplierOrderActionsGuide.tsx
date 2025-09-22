import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Info, 
  X, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  HelpCircle,
  Lightbulb,
  Target,
  Truck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  FileText,
  DollarSign,
  Calendar,
  Package,
  CreditCard,
  Download,
  Printer,
  Building2
} from 'lucide-react';

export default function SupplierOrderActionsGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const actions = [
    {
      id: 'view',
      icon: Eye,
      title: 'Voir Détails Commande',
      description: 'Consultez tous les détails de la commande fournisseur avec bon de réception',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-700',
      features: [
        'Informations complètes de la commande',
        'Détails fournisseur et coordonnées',
        'Liste des articles avec quantités et prix',
        'Calculs de totaux HT et TTC',
        'Dates de commande et livraison prévue'
      ]
    },
    {
      id: 'status',
      icon: Package,
      title: 'Gérer le Statut',
      description: 'Modifiez le statut de la commande (brouillon, envoyé, reçu, payé)',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-200 dark:border-purple-700',
      features: [
        'Brouillon → Envoyé → Reçu → Payé',
        'Suivi du cycle de vie complet',
        'Notifications automatiques de changement',
        'Historique des modifications',
        'Impact sur la balance fournisseur'
      ]
    },
    {
      id: 'payment',
      icon: CreditCard,
      title: 'Enregistrer Paiement',
      description: 'Enregistrez les paiements effectués au fournisseur',
      color: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700',
      features: [
        'Différents moyens de paiement (virement, chèque, espèces)',
        'Date et référence de paiement',
        'Calcul automatique de la balance',
        'Historique des paiements',
        'Rapprochement avec les commandes'
      ]
    },
    {
      id: 'print',
      icon: Printer,
      title: 'Bon de Commande',
      description: 'Imprimez ou téléchargez le bon de commande professionnel',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      borderColor: 'border-indigo-200 dark:border-indigo-700',
      features: [
        'Bon de commande conforme aux standards',
        'Impression directe ou export PDF',
        'Conditions de paiement incluses',
        'Mentions légales automatiques',
        'Format professionnel prêt à envoyer'
      ]
    },
    {
      id: 'edit',
      icon: Edit,
      title: 'Modifier Commande',
      description: 'Modifiez les détails de la commande (articles, quantités, prix)',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-700',
      features: [
        'Modifier les articles et quantités',
        'Ajuster les prix unitaires',
        'Changer les dates de livraison',
        'Recalcul automatique des totaux',
        'Validation des modifications'
      ]
    },
    {
      id: 'delete',
      icon: Trash2,
      title: 'Supprimer Commande',
      description: 'Supprimez définitivement une commande fournisseur',
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-700',
      features: [
        'Suppression définitive de la commande',
        'Confirmation de sécurité requise',
        'Impact sur la balance fournisseur',
        'Historique conservé pour audit',
        'Action irréversible'
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
      }
    }
  };

  return (
    <>
      {/* Bouton d'aide flottant */}
      <motion.div 
        className="fixed bottom-6 right-6 z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
          variants={pulseVariants}
          animate="pulse"
          title="Guide des actions fournisseurs"
        >
          <HelpCircle className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
        </motion.button>
      </motion.div>

      {/* Modal d'aide */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
              <motion.div
                className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-2xl rounded-2xl"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <motion.div 
                        className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Lightbulb className="w-6 h-6" />
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold">🏢 Guide des Actions Fournisseurs</h2>
                        <p className="text-sm opacity-90">Maîtrisez la gestion de vos commandes fournisseurs</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-8">
                  {/* Introduction */}
                  <motion.div 
                    className="text-center mb-8"
                    variants={itemVariants}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building2 className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                      Optimisez la Gestion de vos Fournisseurs
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Chaque commande fournisseur dispose de 6 actions principales pour un suivi complet. 
                      Cliquez sur une action pour découvrir ses fonctionnalités.
                    </p>
                  </motion.div>

                  {/* Actions Grid */}
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    variants={itemVariants}
                  >
                    {actions.map((action) => {
                      const Icon = action.icon;
                      const isActive = activeAction === action.id;
                      
                      return (
                        <motion.div
                          key={action.id}
                          className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                            isActive 
                              ? `${action.borderColor} ${action.bgColor} shadow-lg scale-105` 
                              : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                          }`}
                          onClick={() => setActiveAction(isActive ? null : action.id)}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start space-x-4">
                            <motion.div 
                              className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                isActive ? 'bg-white shadow-md' : action.bgColor
                              }`}
                              whileHover={{ rotate: 5 }}
                            >
                              <Icon className={`w-6 h-6 ${action.color}`} />
                            </motion.div>
                            <div className="flex-1">
                              <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                                {action.description}
                              </p>
                              
                              <AnimatePresence>
                                {isActive && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                      <h5 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center space-x-2">
                                        <Target className="w-4 h-4 text-green-600" />
                                        <span>Fonctionnalités incluses :</span>
                                      </h5>
                                      <ul className="space-y-2">
                                        {action.features.map((feature, index) => (
                                          <motion.li
                                            key={index}
                                            className="flex items-start space-x-2 text-sm text-gray-700 dark:text-gray-300"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                          >
                                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                          </motion.li>
                                        ))}
                                      </ul>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Workflow Section */}
                  <motion.div 
                    className="mt-8 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-teal-200 dark:border-teal-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-teal-900 dark:text-teal-100 mb-4 flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>🔄 Workflow Recommandé</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">1</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Créer commande</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Avec fournisseur</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">2</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Envoyer</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Au fournisseur</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">3</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Réceptionner</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Marquer reçu</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">4</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Payer</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Enregistrer paiement</p>
                      </div>
                      <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg border border-teal-200 dark:border-teal-600">
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-white font-bold">5</span>
                        </div>
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-200">Archiver</p>
                        <p className="text-xs text-teal-600 dark:text-teal-300">Finaliser</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Types de commandes */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center space-x-2">
                      <FileText className="w-5 h-5" />
                      <span>📋 Types de Commandes Supportées</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-600">
                        <div className="flex items-center space-x-3 mb-3">
                          <Package className="w-6 h-6 text-blue-600" />
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100">Commandes de Marchandises</h5>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Produits pour revente</li>
                          <li>• Matières premières</li>
                          <li>• Fournitures et consommables</li>
                          <li>• Gestion des quantités et prix</li>
                        </ul>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-indigo-200 dark:border-indigo-600">
                        <div className="flex items-center space-x-3 mb-3">
                          <Building2 className="w-6 h-6 text-green-600" />
                          <h5 className="font-semibold text-gray-900 dark:text-gray-100">Commandes de Services</h5>
                        </div>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          <li>• Prestations de service</li>
                          <li>• Maintenance et réparations</li>
                          <li>• Consulting et formation</li>
                          <li>• Facturation au temps ou forfait</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>

                  {/* Gestion financière */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-green-900 dark:text-green-100 mb-4 flex items-center space-x-2">
                      <DollarSign className="w-5 h-5" />
                      <span>💰 Gestion Financière Automatique</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <FileText className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">Balance Fournisseur</p>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Calcul automatique : Total commandes - Total paiements = Solde à payer
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">Suivi des Paiements</p>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Historique complet avec dates, montants et moyens de paiement
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-900 dark:text-green-100">Échéances</p>
                            <p className="text-sm text-green-800 dark:text-green-200">
                              Suivi des délais de paiement selon les conditions négociées
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Conseils d'utilisation */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700"
                    variants={itemVariants}
                  >
                    <h4 className="font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center space-x-2">
                      <Lightbulb className="w-5 h-5" />
                      <span>💡 Conseils d'Utilisation</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Printer className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Bon de Commande</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Imprimez le bon avant envoi pour avoir une trace officielle de votre commande.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Délais de Paiement</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Respectez les conditions de paiement négociées avec chaque fournisseur.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <DollarSign className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Suivi Financier</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Consultez régulièrement la balance pour optimiser votre trésorerie.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <Truck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-amber-900 dark:text-amber-100">Réception</p>
                            <p className="text-sm text-amber-800 dark:text-amber-200">
                              Marquez "Reçu" dès réception pour un suivi précis de vos stocks.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Information importante */}
                  <motion.div 
                    className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700"
                    variants={itemVariants}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <Info className="w-6 h-6 text-blue-600" />
                      <h4 className="font-bold text-blue-900 dark:text-blue-100">ℹ️ Information Importante</h4>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-200 dark:border-blue-600">
                      <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                        <strong>🔗 Intégration Complète :</strong> Vos commandes fournisseurs sont automatiquement liées à votre comptabilité. 
                        La balance de chaque fournisseur se calcule en temps réel : Total des commandes - Total des paiements = Solde à payer. 
                        Utilisez les rapports pour analyser vos relations fournisseurs et optimiser vos achats.
                      </p>
                    </div>
                  </motion.div>

                  {/* Bouton de fermeture */}
                  <motion.div 
                    className="text-center mt-8"
                    variants={itemVariants}
                  >
                    <button
                      onClick={() => setIsOpen(false)}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      <span className="flex items-center justify-center space-x-2">
                        <CheckCircle className="w-5 h-5" />
                        <span>Parfait, j'ai compris !</span>
                      </span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}