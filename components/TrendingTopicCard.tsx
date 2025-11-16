import React from 'react';
import { TrendingTopic } from '../types';
import { TrendingUp } from 'lucide-react';

interface TrendingTopicCardProps {
    topic: TrendingTopic;
    onSelect: (topic: TrendingTopic) => void;
}

const TrendingTopicCard: React.FC<TrendingTopicCardProps> = ({ topic, onSelect }) => {
    return (
        <div 
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-700/50 hover:border-indigo-600 transition-all duration-200"
            onClick={() => onSelect(topic)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(topic)}
            aria-label={`Gerar ideias sobre: ${topic.title}`}
        >
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                    <TrendingUp className="w-5 h-5 text-indigo-400 mt-1" />
                </div>
                <div>
                    <h4 className="font-bold text-slate-200">{topic.title}</h4>
                    <p className="text-sm text-slate-400 mt-1">{topic.summary}</p>
                </div>
            </div>
        </div>
    );
};

export default TrendingTopicCard;
