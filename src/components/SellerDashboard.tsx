import React, { useState } from 'react';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  DollarSign,
  AlertCircle,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone
} from 'lucide-react';
import { Product, Order, Language } from '../types/nammaraitha';
import { t, getCommodityName } from '../utils/translations';

interface SellerDashboardProps {
  products: Product[];
  orders: Order[];
  lang: Language;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onOpenAddProduct: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({
  products,
  orders,
  lang,
  onEditProduct,
  onDeleteProduct,
  onOpenAddProduct,
  onUpdateOrderStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'orders'>('inventory');

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalStockItems = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Explaining No-Login Direct Editing */}
      <div className="bg-emerald-950 text-white p-6 sm:p-7 rounded-3xl border border-emerald-800 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-500/40 text-amber-300 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('producerManagement', lang)}</span>
            </div>
            <h2 className="text-2xl font-extrabold font-heading">
              {t('sellerPortalTitle', lang)}
            </h2>
            <p className="text-emerald-200 text-xs sm:text-sm max-w-xl">
              {t('directAccessNotice', lang)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddProduct}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm shadow-md transition"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addNewListing', lang)}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-emerald-800/80">
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <div className="text-stone-400 text-xs flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('totalListings', lang)}</span>
            </div>
            <div className="text-xl font-bold mt-1 text-white">{products.length} {t('itemsListedCount', lang)}</div>
          </div>
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <div className="text-stone-400 text-xs flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('availableUnits', lang)}</span>
            </div>
            <div className="text-xl font-bold mt-1 text-white">{totalStockItems.toLocaleString()} Units</div>
          </div>
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <div className="text-stone-400 text-xs flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('inventoryValuation', lang)}</span>
            </div>
            <div className="text-xl font-bold mt-1 text-emerald-300">₹{totalValue.toLocaleString('en-IN')}</div>
          </div>
          <div className="bg-emerald-900/60 p-3 rounded-2xl border border-emerald-800">
            <div className="text-stone-400 text-xs flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('activeOrders', lang)}</span>
            </div>
            <div className="text-xl font-bold mt-1 text-white">{orders.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Inventory vs Orders */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeSubTab === 'inventory'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Product Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
            activeSubTab === 'orders'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Incoming Buyer Orders ({orders.length})</span>
        </button>
      </div>

      {/* Inventory Table / Cards */}
      {activeSubTab === 'inventory' ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">
              Live Product Listings (Click Edit to modify without login)
            </h3>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
              ✓ Instant Live Sync
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Unit</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Seller Contact</th>
                  <th className="py-3 px-4 text-right">Direct Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 leading-snug">
                            {lang === 'kn' && p.nameKn ? p.nameKn : getCommodityName(p.name, lang)}
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">{p.location}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-medium uppercase text-stone-500">
                      {p.category}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-800">
                      ₹{p.price.toLocaleString('en-IN')}{' '}
                      <span className="text-xs text-stone-500 font-normal">/ {p.unit}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          p.stock > 10
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.stock > 0
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} in stock` : t('outOfStock', lang)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <div className="font-medium text-stone-800">{p.sellerName}</div>
                      <div className="text-stone-500">{p.sellerPhone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditProduct(p)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold transition"
                          title="Direct Edit without login"
                        >
                          <Edit className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-stone-400 hover:text-rose-600 transition"
                          title="Delete item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Orders list */
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-stone-200">
              <Truck className="w-12 h-12 text-stone-300 mx-auto mb-2" />
              <h4 className="font-bold text-stone-700">No buyer orders yet</h4>
              <p className="text-xs text-stone-500 mt-1">Orders placed by customers in the marketplace will appear here.</p>
            </div>
          ) : (
            orders.map((o) => (
              <div
                key={o.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-stone-500">#{o.id}</span>
                    <span className="text-stone-300">&bull;</span>
                    <span className="text-xs text-stone-500">{o.orderDate}</span>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {o.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-bold text-stone-900">
                    Buyer: {o.customerName} ({o.phone})
                  </div>
                  <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{o.deliveryAddress}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="bg-stone-100 px-2 py-1 rounded-md text-stone-700">
                        {item.product.name} &times; {item.quantity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xs text-stone-400">Total Bill</div>
                    <div className="text-lg font-bold text-emerald-800">
                      ₹{o.totalAmount.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onUpdateOrderStatus(o.id, 'Confirmed')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        o.status === 'Confirmed'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(o.id, 'Dispatched')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        o.status === 'Dispatched'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Dispatch
                    </button>
                    <button
                      onClick={() => onUpdateOrderStatus(o.id, 'Delivered')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-700 text-white border-emerald-700'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Delivered
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
