import React from 'react';

interface SkeletonProps {
    className?: string;
    variant?: 'text' | 'rect' | 'circle';
    width?: string | number;
    height?: string | number;
}

const Skeleton: React.FC<SkeletonProps> = ({
    className = '',
    variant = 'rect',
    width,
    height
}) => {
    const baseClasses = 'animate-pulse bg-gray-200';
    const variantClasses = {
        text: 'rounded h-4 w-full mb-2',
        rect: 'rounded',
        circle: 'rounded-full'
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{ width, height }}
        />
    );
};

export const ProductSkeleton = () => (
    <div className="space-y-4">
        <Skeleton variant="rect" className="aspect-[3/4] w-full" />
        <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="30%" />
        </div>
    </div>
);

export default Skeleton;
