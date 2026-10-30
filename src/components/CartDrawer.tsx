import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ShieldCheck,
  CheckCircle,
  Truck
} from 'lucide-react';
import { OrderItem, Product, Language } from '../types/nammaraitha';
import { t, getCommodityName } from '../utils/translations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onPlaceOrder: (customer: { name: string; phone: string; address: string }) => void;
  lang: Language;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onPlaceOrder,
  lang,
}) => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Close drawer on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone || !address) return;

    onPlaceOrder({ name: customerName, phone, address });
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckingOut(false);
      setCustomerName('');
      setPhone('');
      setAddress('');
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Agricultural Cart"
    >
      <div
        className="w-full max-w-full sm:max-w-md bg-white h-full max-h-[100dvh] shadow-2xl flex flex-col justify-between overflow-hidden relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-stone-900 text-base">
                {t('cartHeading', lang)}
              </h2>
              <span className="text-xs text-stone-500 font-medium">
                {cartItems.length} {t('itemsSelectedText', lang)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {orderSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-stone-900">{t('orderPlacedSuccess', lang)}</h3>
              <p className="text-xs text-stone-500">
                {t('orderSuccessDesc', lang)}
              </p>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-medium">
                {t('codNotice', lang)}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('buyerNameLabel', lang)}
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Anand Gowda"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('contactMobileLabel', lang)}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t('deliveryAddressLabel', lang)}
                </label>
                <textarea
                  rows={3}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Village, Taluk, District, Landmark..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="px-4 py-2 text-stone-600 text-xs font-semibold hover:bg-stone-100 rounded-xl"
                >
                  {t('backToCart', lang)}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
                >
                  {t('confirmOrder', lang)}
                </button>
              </div>
            </form>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mb-2 text-stone-300" />
              <h4 className="font-bold text-stone-600">{t('cartEmpty', lang)}</h4>
              <p className="text-xs text-stone-400 mt-1">{t('cartEmptyBrowse', lang)}</p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-2xl border border-stone-200 bg-stone-50/60"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-stone-900 truncate">
                    {lang === 'kn' && item.product.nameKn ? item.product.nameKn : getCommodityName(item.product.name, lang)}
                  </h4>
                  <div className="text-xs text-emerald-800 font-extrabold mt-0.5">
                    ₹{item.product.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[10px] text-stone-400 font-normal">/ {item.product.unit}</span>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, -1)}
                      className="w-6 h-6 rounded-lg bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-xs font-bold text-stone-900 px-1">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.product.id, 1)}
                      className="w-6 h-6 rounded-lg bg-white border border-stone-300 text-stone-700 flex items-center justify-center text-xs font-bold hover:bg-stone-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => onRemoveItem(item.product.id)}
                      className="ml-auto text-stone-400 hover:text-rose-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {!isCheckingOut && !orderSuccess && cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 font-medium">{t('subtotal', lang)}</span>
              <span className="font-bold text-stone-900">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500 font-medium">{t('deliveryToFarm', lang)}</span>
              <span className="text-emerald-700 font-semibold">{t('freeFarmerDirect', lang)}</span>
            </div>
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <span className="font-bold text-base text-stone-900">{t('totalPayable', lang)}</span>
              <span className="text-xl font-extrabold text-emerald-800">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/20 transition flex items-center justify-center gap-2"
            >
              <span>{t('proceedToCheckout', lang)}</span>
              <Truck className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
