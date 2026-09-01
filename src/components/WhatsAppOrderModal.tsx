import React, { useState } from 'react';
import { Product, UserProfile } from '../types';
import { saveOrderToFirestore } from '../services/firebaseService';

interface WhatsAppOrderModalProps {
  orderData: {
    product: Product;
    quantity: number;
    color: string;
    storage: string;
    totalPrice: number;
  };
  currentUser?: UserProfile | null;
  onClose: () => void;
  onOrderSaved?: (orderId: string) => void;
}

export const WhatsAppOrderModal: React.FC<WhatsAppOrderModalProps> = ({
  orderData,
  currentUser,
  onClose,
  onOrderSaved,
}) => {
  const [customerName, setCustomerName] = useState(currentUser?.displayName || 'Asif Hamza');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '+880 1700-000000');
  const [deliveryAddress, setDeliveryAddress] = useState(currentUser?.address || 'Dhaka, Bangladesh');
  const [notes, setNotes] = useState('Please confirm shipping ETA.');
  const [copied, setCopied] = useState(false);
  const [savingToDb, setSavingToDb] = useState(false);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);

  const { product, quantity, color, storage, totalPrice } = orderData;

  // Build structured order message
  const rawMessage = `🛍️ *LUMA STORE ORDER REQUEST*
-----------------------------
*Order ID:* ${savedOrderId ? `#${savedOrderId.slice(0, 6).toUpperCase()}` : 'PENDING'}
*Product:* ${product.name}
*Color:* ${color}
*Option:* ${storage}
*Quantity:* ${quantity}
*Unit Price:* ${product.currency} ${(totalPrice / quantity).toLocaleString()}
*Total Amount:* ${product.currency} ${totalPrice.toLocaleString()}

👤 *Customer Details:*
• Name: ${customerName}
• Phone: ${customerPhone}
• Delivery Address: ${deliveryAddress}
${notes ? `• Note: ${notes}` : ''}

Please confirm availability and dispatch schedule. Thank you!`;

  const handleOpenWhatsApp = async () => {
    setSavingToDb(true);
    let orderId = savedOrderId;
    try {
      if (!orderId) {
        orderId = await saveOrderToFirestore({
          userId: currentUser?.uid,
          customerName,
          customerPhone,
          deliveryAddress,
          notes,
          items: [
            {
              productId: product.id,
              name: product.name,
              image: product.image,
              price: product.price,
              quantity,
              color,
              storage,
            },
          ],
          totalPrice,
          status: 'pending',
          paymentMethod: 'whatsapp',
          createdAt: new Date().toISOString(),
        });
        setSavedOrderId(orderId);
        if (onOrderSaved) onOrderSaved(orderId);
      }
    } catch (err) {
      console.warn('Order saved to local state fallback:', err);
    } finally {
      setSavingToDb(false);
      // Store WhatsApp number provided: 01319967499 (intl: 8801319967499) or product's seller whatsapp
      const targetWhatsAppNumber = product.sellerWhatsApp || '8801319967499';
      const encodedText = encodeURIComponent(rawMessage);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetWhatsAppNumber}&text=${encodedText}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(rawMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-5 sm:p-6 w-full max-w-md shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
              <span
                className="material-symbols-outlined text-[22px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                chat
              </span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#141b2b]">Order via WhatsApp</h3>
              <p className="text-xs text-[#3c4a3d]">
                Auto-synced with Firebase Database & WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Order Summary Card */}
        <div className="my-4 bg-[#f9f9ff] p-3.5 rounded-2xl border border-[#bbcbb9]/30 flex items-center gap-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#141b2b] truncate">{product.name}</h4>
            <div className="flex flex-wrap gap-1.5 mt-1 text-[11px] text-[#3c4a3d]">
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                {color}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                {storage}
              </span>
              <span className="bg-white px-2 py-0.5 rounded border border-slate-200 font-medium">
                Qty: {quantity}
              </span>
            </div>
            <p className="text-sm font-extrabold text-[#006d2f] mt-1">
              Total: {product.currency} {totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Customer Info Form */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#3c4a3d] uppercase mb-1">Your Name *</label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
              Contact Phone *
            </label>
            <input
              type="tel"
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
              Delivery Address *
            </label>
            <input
              type="text"
              required
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
            />
          </div>

          <div>
            <label className="block font-bold text-[#3c4a3d] uppercase mb-1">
              Special Instructions
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-10 px-3 bg-[#e9edff] rounded-xl text-sm font-medium text-[#141b2b] outline-none focus:ring-2 focus:ring-[#006d2f]"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={handleOpenWhatsApp}
            disabled={savingToDb}
            className="w-full h-12 bg-[#25D366] text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-md hover:bg-[#20ba59] active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {savingToDb ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  chat
                </span>
                <span>Save to Database & Launch WhatsApp</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            className="w-full h-10 bg-[#e9edff] hover:bg-[#dce2f7] text-[#141b2b] rounded-2xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              {copied ? 'check' : 'content_copy'}
            </span>
            <span>{copied ? 'Order Message Copied!' : 'Copy Order Text'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
