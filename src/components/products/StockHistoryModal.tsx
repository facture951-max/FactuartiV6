import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useOrder } from '../../contexts/OrderContext';
import { Product } from '../../contexts/DataContext';
import Modal from '../common/Modal';
import EnhancedStockEvolutionChart from './EnhancedStockEvolutionChart';
import { 
  Package, 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  ShoppingCart,
  Download,
  Calendar,
  User,
  FileText,
  BarChart3,
  Clock,
  Eye,
  Filter,
  ExternalLink,
  X
} from 'lucide-react';

interface StockHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

export default function StockHistoryModal({ isOpen, onClose, product }: StockHistoryModalProps) {
  const { stockMovements } = useData();
  const { orders, getOrderById } = useOrder();
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [viewingOrder, setViewingOrder] = useState<string | null>(null);
  
  // Générer l'historique complet du produit
  const generateProductHistory = () => {
    const history = [];
    
    // 1. Stock initial
    if (product.initialStock > 0) {
      history.push({
        id: `initial-${product.id}`,
        type: 'initial',
        date: product.createdAt,
        quantity: product.initialStock,
        previousStock: 0,
        newStock: product.initialStock,
        reason: 'Stock initial',
        userName: 'Système',
        reference: '',
        orderId: null,
        orderDetails: null
      });
    }
    
    // 2. Tous les mouvements de stock (rectifications, commandes, etc.)
    const movements = stockMovements.filter(m => m.productId === product.id);
    
    movements.forEach(movement => {
      history.push({
        id: movement.id,
        type: movement.type,
        date: movement.adjustmentDateTime || movement.date,
        quantity: movement.quantity,
        previousStock: movement.previousStock,
        newStock: movement.newStock,
        reason: movement.reason || 'Mouvement',
        userName: movement.userName,
        reference: movement.reference || '',
        orderId: movement.orderId || null,
        orderDetails: movement.orderDetails || null
      });
    });

    // Trier par date
    return history.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  };
  
  const history = generateProductHistory();
  
  const calculateCurrentStock = () => {
    // Le stock actuel est maintenant géré directement dans le champ product.stock
    return product.stock;
  };

  // Calculer le résumé
  const summary = {
    initialStock: product.initialStock || 0,
    totalOrdersSold: orders.reduce((sum, order) => {
      if (order.status === 'livre') {
        return sum + order.items
          .filter(item => item.productName === product.name)
          .reduce((itemSum, item) => itemSum + item.quantity, 0);
      }
      return sum;
    }, 0),
    totalAdjustments: stockMovements
      .filter(m => m.productId === product.id && m.type === 'adjustment')
      .reduce((sum, m) => sum + m.quantity, 0),
    currentStock: calculateCurrentStock()
  };

  // Filtrer par période
  const filteredHistory = history.filter(movement => {
    if (selectedPeriod === 'all') return true;
    
    const movementDate = new Date(movement.date);
    const now = new Date();
    
    switch (selectedPeriod) {
      case 'week':
        return movementDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case 'month':
        return movementDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'quarter':
        return movementDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      default:
        return true;
    }
  }).filter(movement => {
    if (filterType === 'all') return true;
    if (filterType === 'orders') return movement.type === 'order_out' || movement.type === 'order_cancel_return';
    if (filterType === 'adjustments') return movement.type === 'adjustment';
    if (filterType === 'initial') return movement.type === 'initial';
    return true;
  });

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'initial':
        return <Package className="w-4 h-4 text-blue-600" />;
      case 'order_out':
        return <ShoppingCart className="w-4 h-4 text-red-600" />;
      case 'order_cancel_return':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'adjustment':
        return <RotateCcw className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'initial':
        return 'Stock initial';
      case 'order_out':
        return 'Commande livrée';
      case 'order_cancel_return':
        return 'Commande annulée';
      case 'adjustment':
        return 'Rectification';
      default:
        return 'Mouvement';
    }
  };

  const handleViewOrder = (orderId: string) => {
    setViewingOrder(orderId);
  };

  const getMovementColor = (quantity: number) => {
    return quantity > 0 ? 'text-green-600' : quantity < 0 ? 'text-red-600' : 'text-gray-600';
  };

  const exportStockReport = () => {
    const csvContent = [
      ['Date', 'Heure', 'Type', 'Quantité', 'Stock Précédent', 'Nouveau Stock', 'Motif', 'Référence', 'Utilisateur'].join(','),
      ...filteredHistory.map(h => [
        new Date(h.adjustmentDateTime || h.date).toLocaleDateString('fr-FR'),
        new Date(h.adjustmentDateTime || h.date).toLocaleTimeString('fr-FR'),
        getMovementLabel(h.type),
        h.quantity,
        h.previousStock,
        h.newStock,
        h.reason || '',
        h.reference || '',
        h.userName
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historique_${product.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  // Générer les données pour le mini graphique
  const generateChartData = () => {
    const last30Days = history
      .filter(m => {
        const date = new Date(m.date);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return date >= thirtyDaysAgo;
      })
      .reverse(); // Ordre chronologique

    return last30Days.map(movement => ({
      date: new Date(movement.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
      stock: movement.newStock
    }));
  };

  const chartData = generateChartData();
  const maxStock = Math.max(...chartData.map(d => d.stock), 1);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Historique du Stock" size="xl">
      <div className="space-y-6">
        {/* En-tête avec résumé */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">{product.name}</h3>
                <p className="text-blue-700 dark:text-blue-300">{product.category} • {product.unit}</p>
              </div>
            </div>
            <button
              onClick={exportStockReport}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-600">
                <div className="text-lg font-bold text-blue-600">{summary.initialStock.toFixed(3)}</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">Stock initial</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-600">
                <div className="text-lg font-bold text-red-600">{summary.totalOrdersSold.toFixed(3)}</div>
                <div className="text-xs text-red-700 dark:text-red-300">Total commandé</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-purple-200 dark:border-purple-600">
                <div className={`text-lg font-bold ${summary.totalAdjustments >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {summary.totalAdjustments > 0 ? '+' : ''}{summary.totalAdjustments.toFixed(3)}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300">Rectifications</div>
              </div>
              <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg border border-green-200 dark:border-green-600">
                <div className="text-lg font-bold text-green-600">{summary.currentStock.toFixed(3)}</div>
                <div className="text-xs text-green-700 dark:text-green-300">Stock actuel</div>
              </div>
            </div>
          )}
        </div>

        {/* Filtres */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Période
              </label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Toute la période</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type de mouvement
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="all">Tous les mouvements</option>
                <option value="orders">Commandes uniquement</option>
                <option value="adjustments">Rectifications uniquement</option>
                <option value="initial">Stock initial</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button
                onClick={exportStockReport}
                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
                      {getMovementIcon(movement.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {getMovementLabel(movement.type)}
                        </span>
                        <span className={`font-bold ${getMovementColor(movement.quantity)}`}>
                          {(movement.quantity ?? 0) > 0 ? '+' : ''}{(movement.quantity ?? 0).toFixed(3)} {product.unit}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(movement.adjustmentDateTime || movement.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{new Date(movement.adjustmentDateTime || movement.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{movement.userName}</span>
                        </div>
                        {movement.reason && (
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span>{movement.reason}</span>
                          </div>
                        )}
                        {movement.reference && (
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs bg-gray-200 dark:bg-gray-600 px-1 rounded">
                              {movement.reference}
                            </span>
                          </div>
                        )}
                      </div>
                      {movement.orderId && (
                        <button
                          onClick={() => handleViewOrder(movement.orderId!)}
                          className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                          title="Voir la commande"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Commande</span>
                        </button>
                      )}
                      {movement.orderDetails && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                            {movement.orderDetails.clientName}
                          </span>
                        </div>
                      )}
                      {movement.orderDetails && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
                          <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                            <p><strong>Commande:</strong> {movement.orderDetails.orderNumber}</p>
                            <p><strong>Client:</strong> {movement.orderDetails.clientName} ({movement.orderDetails.clientType === 'personne_physique' ? 'Particulier' : 'Société'})</p>
                            <p><strong>Total commande:</strong> {movement.orderDetails.orderTotal.toLocaleString()} MAD</p>
                            <p><strong>Date commande:</strong> {new Date(movement.orderDetails.orderDate).toLocaleDateString('fr-FR')}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {(movement.previousStock ?? 0).toFixed(3)} → {(movement.newStock ?? 0).toFixed(3)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Stock après mouvement
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">Aucun mouvement de stock</p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  L'historique apparaîtra après les premiers mouvements
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de visualisation de commande */}
        {viewingOrder && (
          <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Détails de la Commande</h3>
                  <button
                    onClick={() => setViewingOrder(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                {(() => {
                  const order = getOrderById(viewingOrder);
                  if (!order) {
                    return (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">Commande non trouvée</p>
                      </div>
                    );
                  }
                  
                  return (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Numéro de commande</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{order.number}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {new Date(order.orderDate).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Client</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {order.clientType === 'personne_physique' ? order.clientName : order.client?.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{order.totalTTC.toLocaleString()} MAD</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Articles commandés</p>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${
                              item.productName === product.name 
                                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' 
                                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
                            }`}>
                              <div className="flex justify-between items-center">
                                <span className="font-medium text-gray-900 dark:text-gray-100">{item.productName}</span>
                                <span className="text-sm text-gray-600 dark:text-gray-300">
                                  {item.quantity.toFixed(3)} × {item.unitPrice.toFixed(2)} MAD = {item.total.toFixed(2)} MAD
                                </span>
                              </div>
                              {item.productName === product.name && (
                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                  ← Ce produit dans cette commande
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setViewingOrder(null)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          Fermer
                        </button>
                        <a
                          href={`/commandes/${order.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Voir commande complète</span>
                        </a>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}