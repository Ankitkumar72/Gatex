import React from 'react';

const FeatureCard = ({ title, desc, icon: Icon, size = "small", children }: any) => (
    <div className={`bg-[#0A0A0A] border border-gray-800 rounded-xl p-6 flex flex-col gap-4 ${size === 'large' ? 'md:col-span-2' : ''}`}>
        <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700">
            <Icon size={20} className="text-blue-500" />
        </div>
        <div>
            <h3 className="text-white font-semibold mb-2">{title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
        </div>
        <div className="mt-auto pt-4">
            {children}
        </div>
    </div>
);

export default FeatureCard;
