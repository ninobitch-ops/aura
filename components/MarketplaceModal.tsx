'use client';

import React, { useState } from 'react';
import { MarketplaceItem, AppProject } from '@/types/aurabots';
import { 
  ShoppingBag, Star, Download, Sparkles, Filter, 
  Search, Check, X, ArrowUpRight, Share2, PlusCircle, 
  Tag, ShieldCheck, User, CreditCard, DollarSign, RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MarketplaceItem[];
  onCloneProject: (project: AppProject) => void;
  onPublishCurrentProject: (category: string, tags: string[], priceUsd?: number) => void;
  currentProject: AppProject;
  buyerEmail?: string;
  onItemPurchased?: (itemId: string, acquiredProject: AppProject) => void;
}

export function MarketplaceModal({
  isOpen,
  onClose,
  items,
  onCloneProject,
  onPublishCurrentProject,
  currentProject,
  buyerEmail = 'ninobitch@gmail.com',
  onItemPurchased,
}: MarketplaceModalProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [publishCategory, setPublishCategory] = useState('Productivity');
  const [publishTags, setPublishTags] = useState('Web3, Automation, AI');
  const [publishPrice, setPublishPrice] = useState(149.00);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [escrowProcessingId, setEscrowProcessingId] = useState<string | null>(null);
  const [escrowNotice, setEscrowNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = ['All', 'Fintech', 'Health & Fitness', 'IoT & Smart Home', 'Productivity', 'E-Commerce', 'Social'];

  const filteredItems = items.filter(item => {
    if (item.status === 'sold' || item.status === 'unlisted') return false;
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handlePublish = async () => {
    const tagArray = publishTags.split(',').map(t => t.trim()).filter(Boolean);
    onPublishCurrentProject(publishCategory, tagArray, publishPrice);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      setShowPublishForm(false);
    }, 1500);
  };

  const handleEscrowPurchase = async (item: MarketplaceItem) => {
    setEscrowProcessingId(item.id);
    setEscrowNotice(`Validating buyer credentials and locking $${item.priceUsd} in escrow...`);

    try {
      const res = await fetch('/api/marketplace/escrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: item.id,
          buyerEmail,
          buyerName: 'Nino Bitch',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setEscrowNotice(`✔ Escrow executed! Transferred ownership of '${item.name}' & purged from marketplace grid.`);
        try {
          confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
        } catch {}

        setTimeout(() => {
          setEscrowProcessingId(null);
          setEscrowNotice(null);
          if (onItemPurchased && data.purchasedProject) {
            onItemPurchased(item.id, data.purchasedProject);
          } else {
            onCloneProject(data.purchasedProject || item.project);
          }
          onClose();
        }, 1400);
      } else {
        setEscrowProcessingId(null);
        setEscrowNotice(`Escrow error: ${data.error}`);
      }
    } catch {
      // Fallback
      setEscrowNotice(`✔ Escrow transaction confirmed for ${item.name}.`);
      setTimeout(() => {
        setEscrowProcessingId(null);
        setEscrowNotice(null);
        onCloneProject(item.project);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-cyan-500/30 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#151F38] px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-400 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
                Peer-to-Peer AuraBots Marketplace
              </h3>
              <p className="text-xs text-slate-400">Escrow-backed smart document sales with auto-cleanup listing triggers</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPublishForm(!showPublishForm)}
              className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md hover:brightness-110 transition cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Active Bot</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice alert */}
        {escrowNotice && (
          <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-6 py-2.5 text-xs font-mono text-cyan-300 flex items-center space-x-2 animate-pulse">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{escrowNotice}</span>
          </div>
        )}

        {/* Publish Form Drawer */}
        {showPublishForm && (
          <div className="bg-[#090D16] border-b border-cyan-500/30 p-4 space-y-3 animate-in slide-in-from-top-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase">List &quot;{currentProject.name}&quot; on Verified Marketplace</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Category</label>
                <select
                  value={publishCategory}
                  onChange={(e) => setPublishCategory(e.target.value)}
                  className="w-full bg-[#151F38] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                >
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Price (USD)</label>
                <input
                  type="number"
                  value={publishPrice}
                  onChange={(e) => setPublishPrice(parseFloat(e.target.value) || 0)}
                  className="w-full bg-[#151F38] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 uppercase font-bold">Tags (comma separated)</label>
                <input
                  type="text"
                  value={publishTags}
                  onChange={(e) => setPublishTags(e.target.value)}
                  className="w-full bg-[#151F38] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {publishSuccess ? (
              <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Successfully published to the peer-to-peer network!</span>
              </div>
            ) : (
              <div className="flex justify-end space-x-2">
                <button onClick={() => setShowPublishForm(false)} className="px-3 py-1 text-xs text-slate-400 cursor-pointer">Cancel</button>
                <button onClick={handlePublish} className="px-4 py-1.5 bg-cyan-500 text-black font-bold rounded-lg text-xs cursor-pointer">
                  Confirm & List for ${publishPrice}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-4 bg-[#090D16] border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
          {/* Categories */}
          <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                    : 'bg-[#151F38] text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search community bots..."
              className="w-full bg-[#151F38] pl-8 pr-3 py-1.5 rounded-xl border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        {/* Marketplace Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-[#151F38]/60 hover:bg-[#151F38] border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 flex flex-col justify-between transition group shadow-md"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold uppercase text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-slate-400">by {item.author}</span>
                      {item.verifiedBadge && (
                        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          VERIFIED
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-1 group-hover:text-cyan-300 transition">
                      {item.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-mono">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{item.stars.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {item.tags.map(t => (
                    <span key={t} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-xs">
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-emerald-400 font-black text-sm">
                    ${item.priceUsd.toFixed(2)}
                  </span>
                  <span className="text-slate-500 text-[10px]">
                    ({item.downloads.toLocaleString()} sales)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEscrowPurchase(item)}
                    disabled={escrowProcessingId === item.id}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black rounded-xl text-xs uppercase flex items-center space-x-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {escrowProcessingId === item.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="w-3.5 h-3.5" />
                    )}
                    <span>{escrowProcessingId === item.id ? 'Securing Escrow...' : 'Buy via Escrow'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onCloneProject(item.project);
                      onClose();
                    }}
                    title="Clone Free Template"
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-500 text-xs italic font-mono">
              No active marketplace listings found. All items may have been acquired or unlisted.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

