import React from 'react';
import { VideoType } from '../types';
import { Sparkles, Compass } from 'lucide-react';

interface InputFormProps {
    topic: string;
    setTopic: (topic: string) => void;
    videoType: VideoType;
    setVideoType: (type: VideoType) => void;
    onGenerate: () => void;
    isLoading: boolean;
    onFindTrends: () => void;
    isLoadingTrends: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ topic, setTopic, videoType, setVideoType, onGenerate, isLoading, onFindTrends, isLoadingTrends }) => {
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
            <div>
                <label htmlFor="topic" className="block text-sm font-medium text-indigo-300 mb-2">
                    Tópico ou Nicho
                </label>
                <input
                    id="topic"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Ex: Culinária vegana, programação, finanças pessoais"
                    className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                    disabled={isLoading || isLoadingTrends}
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-indigo-300 mb-2">
                    Formato do Vídeo
                </label>
                <div className="flex bg-slate-900 border border-slate-700 rounded-lg p-1">
                    <button
                        type="button"
                        onClick={() => setVideoType(VideoType.LONG_FORM)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${videoType === VideoType.LONG_FORM ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                        disabled={isLoading || isLoadingTrends}
                    >
                        Vídeo Longo
                    </button>
                    <button
                        type="button"
                        onClick={() => setVideoType(VideoType.SHORTS)}
                        className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors duration-300 ${videoType === VideoType.SHORTS ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-700'}`}
                        disabled={isLoading || isLoadingTrends}
                    >
                        Shorts
                    </button>
                </div>
            </div>

            <div className="flex flex-col space-y-3">
                <button 
                    type="submit" 
                    className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 disabled:bg-indigo-800 disabled:cursor-not-allowed transform hover:scale-105"
                    disabled={isLoading || isLoadingTrends}
                >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {isLoading ? 'Gerando...' : 'Gerar Ideias'}
                </button>
                <button
                    type="button"
                    onClick={onFindTrends}
                    className="w-full flex items-center justify-center bg-transparent border border-indigo-500 text-indigo-400 font-bold py-3 px-4 rounded-lg hover:bg-indigo-500/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading || isLoadingTrends}
                >
                    <Compass className="w-5 h-5 mr-2" />
                    {isLoadingTrends ? 'Buscando...' : 'Descobrir Tendências'}
                </button>
            </div>
        </form>
    );
};

export default InputForm;