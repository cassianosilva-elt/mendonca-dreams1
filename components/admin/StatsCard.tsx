import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'navy' | 'green' | 'orange' | 'red' | 'purple';
}

const colorClasses = {
    navy: 'bg-navy/10 text-navy',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
};

const StatsCard: React.FC<StatsCardProps> = ({
    icon: Icon,
    title,
    value,
    subtitle,
    trend,
    color = 'navy',
}) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <Icon size={24} />
                </div>
                {trend && (
                    <span
                        className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                    >
                        {trend.isPositive ? '+' : ''}{trend.value}%
                    </span>
                )}
            </div>
            <div className="mt-4">
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-sm text-gray-500 mt-1">{title}</p>
                {subtitle && (
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
