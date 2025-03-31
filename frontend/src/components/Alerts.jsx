// src/components/Alert.jsx

import React from 'react';

const Alert = ({ message, type }) => {
    return (
        <div
            className={`p-4 mb-4 text-sm font-semibold rounded-lg ${
                type === 'error'
                    ? 'bg-red-500 text-white'
                    : type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-black'
            }`}
        >
            <p>{message}</p>
        </div>
    );
};

export default Alert;
