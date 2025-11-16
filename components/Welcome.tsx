
import React from 'react';
import { Sparkles, Youtube, Edit } from 'lucide-react';

const Welcome: React.FC = () => {
    return (
        <div className="text-center py-16 px-4">
            <Sparkles className="mx-auto h-16 w-16 text-indigo-400 opacity-80" />
            <h2 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Seu Assistente de Criação para o YouTube
            </h2>
            <p className="mt-4 max-w-xl mx-auto text-lg text-slate-400">
                Insira um tópico ou nicho acima para começar. Gere ideias para vídeos longos ou Shorts, crie roteiros, encontre o título perfeito e imagine a thumbnail ideal.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-8 text-slate-300">
                <div className="flex items-center space-x-2">
                    <Youtube className="w-6 h-6 text-indigo-400" />
                    <span>Ideias para Vídeos e Shorts</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Edit className="w-6 h-6 text-indigo-400" />
                    <span>Roteiros e Títulos Otimizados</span>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
