import React, { useState, useCallback } from 'react';
import { generateVideoIdeas, generateScriptOutline, generateTitles, generateThumbnailIdeas, generateHashtags, getTrendingTopics } from './services/geminiService';
import { VideoIdea, VideoType, ModalContent, TrendingTopic } from './types';
import Header from './components/Header';
import InputForm from './components/InputForm';
import IdeaCard from './components/IdeaCard';
import Modal from './components/Modal';
import LoadingSpinner from './components/LoadingSpinner';
import Welcome from './components/Welcome';
import ScriptDurationForm from './components/ScriptDurationForm';
import ScriptRenderer from './components/ScriptRenderer';
import TrendingTopicCard from './components/TrendingTopicCard';
import { Copy, Compass } from 'lucide-react';

const App: React.FC = () => {
    const [topic, setTopic] = useState<string>('');
    const [videoType, setVideoType] = useState<VideoType>(VideoType.LONG_FORM);
    const [ideas, setIdeas] = useState<VideoIdea[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<ModalContent | null>(null);
    const [loadingModal, setLoadingModal] = useState<boolean>(false);
    const [ideaForScript, setIdeaForScript] = useState<VideoIdea | null>(null);
    const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
    const [isLoadingTrends, setIsLoadingTrends] = useState<boolean>(false);
    const [activeTrend, setActiveTrend] = useState<TrendingTopic | null>(null);

    const handleGenerateIdeas = useCallback(async (trend?: TrendingTopic) => {
        if (!topic.trim()) {
            setError('Por favor, insira um tópico ou nicho.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setIdeas([]);
        setTrendingTopics([]);
        setActiveTrend(trend || null);
        try {
            const generatedIdeas = await generateVideoIdeas(topic, videoType, trend);
            setIdeas(generatedIdeas);
        } catch (err) {
            setError('Falha ao gerar ideias. Tente novamente mais tarde.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [topic, videoType]);

    const handleFindTrends = useCallback(async () => {
        if (!topic.trim()) {
            setError('Por favor, insira um tópico para buscar tendências relacionadas.');
            return;
        }
        setIsLoadingTrends(true);
        setError(null);
        setIdeas([]);
        setTrendingTopics([]);
        setActiveTrend(null);
        try {
            const trends = await getTrendingTopics(topic);
            setTrendingTopics(trends);
        } catch (err) {
            setError('Falha ao buscar tendências. Tente novamente mais tarde.');
            console.error(err);
        } finally {
            setIsLoadingTrends(false);
        }
    }, [topic]);

    const handleGenerateDetails = useCallback(async (
        idea: VideoIdea,
        generator: (title: string, description: string) => Promise<string>,
        title: string
    ) => {
        setLoadingModal(true);
        setModalContent({ title, content: '' });
        setIsModalOpen(true);
        try {
            const content = await generator(idea.title, idea.description);
            setModalContent({ title, content });
        } catch (err) {
            setModalContent({ title, content: 'Erro ao gerar conteúdo.' });
            console.error(err);
        } finally {
            setLoadingModal(false);
        }
    }, []);
    
    const onGenerateScript = (idea: VideoIdea) => {
        setIdeaForScript(idea);
        setIsModalOpen(true);
    };

    const handleGenerateScriptWithDuration = async (idea: VideoIdea, duration?: number) => {
        setLoadingModal(true);
        setModalContent(null);
        try {
            const content = await generateScriptOutline(idea.title, idea.description, duration, idea.type);
            setModalContent({ title: `📜 Roteiro para: "${idea.title}"`, content });
        } catch (err) {
            setModalContent({ title: `📜 Roteiro para: "${idea.title}"`, content: 'Erro ao gerar roteiro.' });
            console.error(err);
        } finally {
            setLoadingModal(false);
            setIdeaForScript(null);
        }
    };

    const onGenerateTitles = (idea: VideoIdea) => handleGenerateDetails(idea, generateTitles, `✒️ Títulos para: "${idea.title}"`);
    const onGenerateThumbnails = (idea: VideoIdea) => handleGenerateDetails(idea, generateThumbnailIdeas, `🖼️ Ideias de Thumbnail para: "${idea.title}"`);
    const onGenerateHashtags = (idea: VideoIdea) => handleGenerateDetails(idea, generateHashtags, `＃ Hashtags para: "${idea.title}"`);

    const copyToClipboard = (text: string) => {
        if(text) navigator.clipboard.writeText(text);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIdeaForScript(null);
        setModalContent(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-3xl mx-auto">
                    <InputForm
                        topic={topic}
                        setTopic={setTopic}
                        videoType={videoType}
                        setVideoType={setVideoType}
                        onGenerate={() => handleGenerateIdeas()}
                        isLoading={isLoading}
                        onFindTrends={handleFindTrends}
                        isLoadingTrends={isLoadingTrends}
                    />
                    
                    {error && (
                        <div className="mt-6 bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>

                {isLoadingTrends && (
                    <div className="flex justify-center items-center py-16">
                        <LoadingSpinner message="Buscando o que está em alta..." />
                    </div>
                )}

                {trendingTopics.length > 0 && (
                    <div className="max-w-3xl mx-auto mt-10">
                        <div className="flex items-center space-x-2 mb-4">
                            <Compass className="w-6 h-6 text-indigo-400" />
                            <h2 className="text-xl font-bold">Tendências Encontradas</h2>
                        </div>
                        <div className="space-y-4">
                            {trendingTopics.map((trend, index) => (
                                <TrendingTopicCard 
                                    key={index} 
                                    topic={trend} 
                                    onSelect={() => handleGenerateIdeas(trend)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-10">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-16">
                            <LoadingSpinner message={activeTrend ? `Gerando ideias sobre "${activeTrend.title}"...` : "Gerando ideias incríveis..."} />
                        </div>
                    ) : ideas.length > 0 ? (
                        <>
                            {activeTrend && (
                                <div className="max-w-4xl mx-auto mb-6 text-center">
                                    <h2 className="text-2xl font-bold">Ideias baseadas na tendência: <span className="text-indigo-400">{activeTrend.title}</span></h2>
                                </div>
                             )}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {ideas.map((idea, index) => (
                                    <IdeaCard
                                        key={index}
                                        idea={idea}
                                        onGenerateScript={onGenerateScript}
                                        onGenerateTitles={onGenerateTitles}
                                        onGenerateThumbnails={onGenerateThumbnails}
                                        onGenerateHashtags={onGenerateHashtags}
                                    />
                                ))}
                            </div>
                        </>
                    ) : (
                        !error && !isLoadingTrends && trendingTopics.length === 0 && <Welcome />
                    )}
                </div>
            </main>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {(() => {
                    if (ideaForScript && !modalContent) {
                        return (
                            <ScriptDurationForm 
                                idea={ideaForScript}
                                onSubmit={handleGenerateScriptWithDuration}
                                isLoading={loadingModal}
                            />
                        );
                    }
                    
                    if (modalContent) {
                        return (
                            <div>
                                <div className="flex justify-between items-start">
                                     <h3 className="text-xl font-bold text-indigo-400 mb-4 pr-4">{modalContent.title}</h3>
                                     <button onClick={() => copyToClipboard(modalContent.content)} className="p-2 rounded-md hover:bg-slate-600 transition-colors duration-200" aria-label="Copiar para a área de transferência">
                                        <Copy className="w-5 h-5 text-slate-400" />
                                    </button>
                                </div>
                                {loadingModal ? (
                                    <div className="flex justify-center items-center h-48">
                                        <LoadingSpinner message="Gerando conteúdo..." />
                                    </div>
                                ) : (
                                    <div className="bg-slate-800/50 p-4 rounded-md max-h-[60vh] overflow-y-auto">
                                        <ScriptRenderer content={modalContent.content} />
                                    </div>
                                )}
                            </div>
                        );
                    }

                    return (
                        <div className="flex justify-center items-center h-48">
                            <LoadingSpinner message="Carregando..." />
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default App;