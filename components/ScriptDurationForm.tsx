import React, { useState } from 'react';
import { VideoIdea, VideoType } from '../types';
import { Sparkles } from 'lucide-react';

interface ScriptDurationFormProps {
    idea: VideoIdea;
    onSubmit: (idea: VideoIdea, duration?: number) => void;
    isLoading: boolean;
}

const ScriptDurationForm: React.FC<ScriptDurationFormProps> = ({ idea, onSubmit, isLoading }) => {
    const isShort = idea.type === VideoType.SHORTS;
    const [duration, setDuration] = useState<string>(isShort ? '0.5' : '5');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const durationValue = duration ? parseFloat(duration) : undefined;
        if(durationValue !== undefined && durationValue <= 0) {
            // Não envia se a duração for inválida
            return;
        }
        onSubmit(idea, durationValue);
    };
    
    return (
        <div>
            <h3 className="text-xl font-bold text-indigo-400 mb-2">Criar Roteiro</h3>
            <p className="text-slate-400 mb-6">Para o vídeo: <span className="font-semibold text-slate-300">"{idea.title}"</span></p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-indigo-300 mb-2">
                        Duração desejada (em minutos) - <span className="italic text-slate-400">Opcional</span>
                    </label>
                    <input
                        id="duration"
                        type="number"
                        step="0.5"
                        min="0.5"
                        max="60"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Deixe em branco para duração automática"
                        className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                        disabled={isLoading}
                        aria-describedby="duration-help"
                    />
                    <p id="duration-help" className="text-xs text-slate-500 mt-2">
                        Para Shorts, use valores como 0.5 (30s) ou 1 (60s). Se deixar em branco, a IA sugere a duração.
                    </p>
                </div>
                <button 
                    type="submit" 
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 disabled:bg-indigo-800 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isLoading ? 'Gerando Roteiro...' : 'Gerar Roteiro'}
                </button>
            </form>
        </div>
    );
};

export default ScriptDurationForm;