import React from 'react';

interface ScriptRendererProps {
    content: string;
}

const ScriptRenderer: React.FC<ScriptRendererProps> = ({ content }) => {
    const lines = content.split('\n');

    return (
        <div className="font-sans text-slate-300 space-y-4">
            {lines.map((line, index) => {
                const trimmedLine = line.trim();
                
                if (trimmedLine.startsWith('## ')) {
                    return <h2 key={index} className="text-xl font-bold text-indigo-300 mt-6 mb-2 pb-1 border-b border-slate-600">{trimmedLine.substring(3)}</h2>;
                }
                if (trimmedLine.startsWith('### ')) {
                    return <h3 key={index} className="text-lg font-semibold text-slate-200 mt-4 mb-1">{trimmedLine.substring(4)}</h3>;
                }
                if (trimmedLine.startsWith('*   **AÇÃO VISUAL:**')) {
                     return <p key={index} className="my-1"><strong className="font-semibold text-cyan-400">AÇÃO VISUAL:</strong>{line.substring(22)}</p>
                }
                 if (trimmedLine.startsWith('*   **NARRAÇÃO:**')) {
                     return <p key={index} className="my-1"><strong className="font-semibold text-amber-400">NARRAÇÃO:</strong>{line.substring(19)}</p>
                }
                if (trimmedLine.startsWith('**CENA')) {
                    return <h4 key={index} className="text-md font-bold text-indigo-400 mt-5 mb-1">{trimmedLine.replace(/\*\*/g, '')}</h4>
                }
                if (trimmedLine.startsWith('* ')) {
                    return <li key={index} className="ml-5 list-disc">{trimmedLine.substring(2)}</li>;
                }
                if(trimmedLine === '---') {
                    return <hr key={index} className="border-slate-700 my-6" />
                }
                if (trimmedLine.length > 0) {
                    return <p key={index} className="leading-relaxed">{trimmedLine}</p>;
                }
                return null;
            })}
        </div>
    );
};

export default ScriptRenderer;
