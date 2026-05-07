import React from 'react';
import { Pizza, Car, Film, ShoppingBag, Lightbulb, Home, HeartPulse, Package } from 'lucide-react';

const categoryConfig = {
  'Food': { color: 'bg-orange-100 text-orange-600', icon: Pizza },
  'Transport': { color: 'bg-blue-100 text-blue-600', icon: Car },
  'Entertainment': { color: 'bg-purple-100 text-purple-600', icon: Film },
  'Shopping': { color: 'bg-pink-100 text-pink-600', icon: ShoppingBag },
  'Utilities': { color: 'bg-yellow-100 text-yellow-600', icon: Lightbulb },
  'Accommodation': { color: 'bg-green-100 text-green-600', icon: Home },
  'Healthcare': { color: 'bg-red-100 text-red-600', icon: HeartPulse },
  'General': { color: 'bg-gray-100 text-gray-600', icon: Package }
};

const CategoryBadge = ({ category }) => {
  const config = categoryConfig[category] || categoryConfig['General'];
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon size={12} className="mr-1.5" />
      {category}
    </div>
  );
};

export default CategoryBadge;
