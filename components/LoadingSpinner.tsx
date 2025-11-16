import React from 'react';

interface LoadingSpinnerProps {
    message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Gerando ideias...' }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-indigo-300 text-sm">{message}</p>
        </div>
    );
};

export default LoadingSpinner;