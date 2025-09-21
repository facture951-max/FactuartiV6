import React from 'react';
import { X, FilePlus2, Loader2 } from 'lucide-react';
import { useOrder } from '../../contexts/OrderContext';
import { useData } from '../../contexts/DataContext';
import type { Order } from '../../contexts/DataContext';

type Props = {
  orderId: string;
  isOpen: boolean;
  onClose: () => void;
  onInvoiceCreated?: (invoiceId: string) => void;
};

const nf2 = new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function CreateInvoiceFromOrderModal({ orderId, isOpen, onClose, onInvoiceCreated }: Props) {
  const { getOrderById } = useOrder();
  const { addInvoiceFromOrder } = useData();
  const [submitting, setSubmitting] = React.useState(false);

  if (!isOpen) return null;

  const order = getOrderById(orderId) as Order | null;

  const handleCreate = async () => {
    if (!order) return;
    setSubmitting(true);
    try {
      const inv = await addInvoiceFromOrder(order);
      onInvoiceCreated?.(inv.id);
      onClose();
    } catch {
      alert('Erreur lors de la création de la facture.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Créer une facture {order ? `depuis la commande ${order.number}` : ''}
          </h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
        </div>

        {!order ? (
          <p className="mt-4 text-red-600">Commande introuvable.</p>
        ) : (
          <>
            <div className="mt-4 rounded-lg border overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-gray-500">Produit</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-gray-500">Qté</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-gray-500">PU HT</th>
                    <th className="px-3 py-2 text-left text-xs uppercase tracking-wider text-gray-500">Total HT</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items.map((it, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{it.productName}</td>
                      <td className="px-3 py-2">{it.quantity} {it.unit || ''}</td>
                      <td className="px-3 py-2">{nf2.format(it.unitPrice)} MAD</td>
                      <td className="px-3 py-2 font-semibold">{nf2.format(it.total)} MAD</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 bg-gray-50">
                <div className="text-sm text-gray-600">Client</div>
                <div className="font-medium">{order.client?.name || order.clientName || 'Client particulier'}</div>
              </div>
              <div className="rounded-lg border p-3 bg-gray-50">
                <div className="text-sm text-gray-600">Montants</div>
                <div className="text-sm">Sous-total HT: <b>{nf2.format(order.subtotal)} MAD</b></div>
                {order.totalVat > 0 && <div className="text-sm">TVA: <b>{nf2.format(order.totalVat)} MAD</b></div>}
                <div className="text-sm">TOTAL TTC: <b className="text-blue-600">{nf2.format(order.totalTTC)} MAD</b></div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={onClose} className="px-4 py-2 rounded-lg border">Annuler</button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FilePlus2 className="w-4 h-4" />}
                <span>Créer la facture</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}