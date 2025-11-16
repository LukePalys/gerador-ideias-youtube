import React from 'react';
import { VideoIdea, VideoType } from '../types';
import { BookText, Edit3, Image, Hash } from 'lucide-react';

interface IdeaCardProps {
    idea: VideoIdea;
    onGenerateScript: (idea: VideoIdea) => void;
    onGenerateTitles: (idea: VideoIdea) => void;
    onGenerateThumbnails: (idea: VideoIdea) => void;
    onGenerateHashtags: (idea: VideoIdea) => void;
}

const ActionButton: React.FC<{ onClick: () => void, children: React.ReactNode, icon: React.ReactNode }> = ({ onClick, children, icon }) => (
    <button 
        onClick={onClick}
        className="flex items-center justify-center w-full px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-600 transition-colors duration-200"
    >
        {icon}
        <span className="ml-2">{children}</span>
    </button>
);


const IdeaCard: React.FC<IdeaCardProps> = ({ idea, onGenerateScript, onGenerateTitles, onGenerateThumbnails, onGenerateHashtags }) => {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:shadow-indigo-500/10 hover:border-indigo-700 transition-all duration-300 transform hover:-translate-y-1">
            <div>
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full mb-3 ${idea.type === VideoType.SHORTS ? 'bg-rose-500/20 text-rose-300' : 'bg-cyan-500/20 text-cyan-300'}`}>
                    {idea.type}
                </span>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{idea.title}</h3>
                <p className="text-sm text-slate-400 mb-5">{idea.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-slate-700/50">
                 <ActionButton onClick={() => onGenerateScript(idea)} icon={<BookText className="w-3.5 h-3.5" />}>
                    Criar Roteiro
                </ActionButton>
                <ActionButton onClick={() => onGenerateTitles(idea)} icon={<Edit3 className="w-3.5 h-3.5" />}>
                    Sugerir Títulos
                </ActionButton>
                <ActionButton onClick={() => onGenerateThumbnails(idea)} icon={<Image className="w-3.5 h-3.5" />}>
                    Ideias de Thumbnail
                </ActionButton>
                 <ActionButton onClick={() => onGenerateHashtags(idea)} icon={<Hash className="w-3.5 h-3.5" />}>
                    Gerar Hashtags
                </ActionButton>
            </div>
        </div>
    );
};

export default IdeaCard;