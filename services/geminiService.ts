import { GoogleGenAI, Type } from "@google/genai";
import { VideoIdea, VideoType, TrendingTopic } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const videoIdeaSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "Um título de vídeo curto, cativante e otimizado para SEO."
        },
        description: {
            type: Type.STRING,
            description: "Uma breve descrição do conceito do vídeo, com 2-3 frases."
        },
        type: {
            type: Type.STRING,
            enum: [VideoType.LONG_FORM, VideoType.SHORTS],
            description: "O formato do vídeo."
        }
    },
    required: ["title", "description", "type"],
};

export const getTrendingTopics = async (topic: string): Promise<TrendingTopic[]> => {
    const prompt = `Usando a busca na web, encontre os 5 principais tópicos ou notícias em alta relacionados ao nicho de "${topic}".
Para cada um, forneça um título curto e um resumo de uma frase.
Formate a sua resposta como um objeto JSON contendo uma única chave "trends", que é um array de objetos. Cada objeto deve ter as chaves "title" e "summary".
Exemplo de formato de saída:
{
  "trends": [
    {
      "title": "Título da tendência 1",
      "summary": "Resumo da tendência 1."
    }
  ]
}
Sua resposta DEVE ser apenas o JSON, sem nenhum texto ou formatação adicional como \`\`\`json.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            }
        });
        
        // Clean the response to ensure it's valid JSON
        let jsonString = response.text.trim();
        const jsonStartIndex = jsonString.indexOf('{');
        const jsonEndIndex = jsonString.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            jsonString = jsonString.substring(jsonStartIndex, jsonEndIndex + 1);
        } else {
            throw new Error("Could not find a valid JSON object in the response.");
        }

        const jsonResponse = JSON.parse(jsonString);
        return jsonResponse.trends;

    } catch (error) {
        console.error("Error getting trending topics:", error);
        throw new Error("Failed to communicate with Gemini API for trends");
    }
};


export const generateVideoIdeas = async (topic: string, videoType: VideoType, trend?: TrendingTopic): Promise<VideoIdea[]> => {
    const prompt = trend
        ? `Gere 5 ideias criativas e envolventes para vídeos do YouTube sobre o tópico "${topic}", aproveitando a seguinte tendência: "${trend.title} - ${trend.summary}". As ideias devem ser especificamente para o formato ${videoType}. Para cada ideia, forneça um título e uma breve descrição.`
        : `Gere 5 ideias criativas e envolventes para vídeos do YouTube sobre o tópico "${topic}". As ideias devem ser especificamente para o formato ${videoType}. Considere temas que estão em alta e com potencial de viralização dentro deste nicho. Para cada ideia, forneça um título e uma breve descrição.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        ideas: {
                            type: Type.ARRAY,
                            items: videoIdeaSchema
                        }
                    },
                    required: ["ideas"]
                }
            }
        });

        const jsonResponse = JSON.parse(response.text);
        return jsonResponse.ideas;

    } catch (error) {
        console.error("Error generating video ideas:", error);
        throw new Error("Failed to communicate with Gemini API");
    }
};

const generateDetailedContent = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });
        return response.text;
    } catch (error) {
        console.error("Error generating detailed content:", error);
        throw new Error("Failed to communicate with Gemini API for detailed content");
    }
}

export const generateScriptOutline = async (title: string, description: string, durationInMinutes: number | undefined, videoType: VideoType): Promise<string> => {
    let prompt: string;
    const durationText = durationInMinutes 
        ? `A duração máxima é de ${Math.round(durationInMinutes * 60)} segundos. Se o usuário pedir uma duração maior que 60 segundos, explique que Shorts têm no máximo 60 segundos e crie um roteiro de 60 segundos.`
        : `O roteiro deve ser conciso e ideal para o formato de vídeo curto (máximo de 60 segundos).`;

    if (videoType === VideoType.SHORTS) {
        // Prompt SUPER especializado para YouTube Shorts
        prompt = `Crie um roteiro para um YouTube Short com o título "${title}" e descrição "${description}". ${durationText}

**REGRAS ESTRITAS PARA ROTEIRO DE SHORTS (SEGUIR OBRIGATORIAMENTE):**

1.  **FORMATO CENA-A-CENA:** O roteiro deve ser uma sequência de cenas curtas e cronometradas. Para CADA cena, descreva a AÇÃO VISUAL e o DIÁLOGO/NARRAÇÃO correspondente.
2.  **RITMO ALUCINANTE:** O ritmo é TUDO. Use cortes rápidos, frases curtas e diretas. SEM ENROLAÇÃO. O vídeo deve ser compreensível mesmo sem som.
3.  **GANCHO IMEDIATO (0-3s):** O vídeo DEVE começar no meio da ação ou com uma declaração/pergunta extremamente forte. Proibido usar "Olá" ou introduções.
4.  **DESENVOLVIMENTO VISUAL:** As ações visuais são mais importantes que o texto. Sugira textos animados na tela, zooms, efeitos sonoros (Ex: *whoosh*, *ding*).
5.  **PUNCHLINE/CLÍMAX RÁPIDO:** O final deve ser impactante, satisfatório e direto ao ponto.
6.  **CTA MÍNIMO (Últimos 2s):** Uma chamada para ação de 1-2 segundos no máximo.

**EXEMPLO DE FORMATAÇÃO DA SAÍDA (SIGA ESTE MODELO):**

---
**CENA 1 (0-3s) - O GANCHO**
*   **AÇÃO VISUAL:** Close-up extremo em um ingrediente bizarro. Câmera treme. Texto na tela: "NUNCA FAÇA ISSO!"
*   **NARRAÇÃO:** (Voz energética) "Você não vai acreditar no que acontece se misturar isso..."

**CENA 2 (4-8s) - O DESENVOLVIMENTO**
*   **AÇÃO VISUAL:** Corte rápido. Mãos misturando o ingrediente numa tigela. Fumaça saindo. Efeito sonoro *whoosh*.
*   **NARRAÇÃO:** "...com um ovo de codorna!"

**CENA 3 (9-12s) - O CLÍMAX**
*   **AÇÃO VISUAL:** Corte rápido. O resultado é algo inesperado e incrível. Zoom lento no resultado. Efeito sonoro de *brilho*.
*   **NARRAÇÃO:** "Você cria um portal para outra dimensão!"

**CENA 4 (13-15s) - O CTA**
*   **AÇÃO VISUAL:** Texto grande na tela: "QUER TENTAR?".
*   **NARRAÇÃO:** "Comenta aí se você teria coragem!"
---

Agora, gere o roteiro para "${title}" seguindo EXATAMENTE este formato e estas regras.`;
    } else {
        // Prompt para vídeos longos
        const longFormDurationText = durationInMinutes
            ? `O vídeo deve ter uma duração aproximada de ${durationInMinutes} minutos.`
            : ``;

        prompt = `Crie um roteiro detalhado para um vídeo do YouTube com o título "${title}" e a descrição "${description}". ${longFormDurationText}
Estruture o roteiro com as seguintes seções bem definidas:

-   **Introdução (Gancho - aprox. 30 segundos):** Apresente o tema, prometa o valor do vídeo e crie curiosidade para que o espectador continue assistindo.
-   **Desenvolvimento (Conteúdo Principal):** Divida o conteúdo em tópicos ou seções lógicas. Para cada seção, liste os pontos principais a serem abordados e forneça um tempo estimado. Esta deve ser a maior parte do vídeo.
-   **Conclusão (aprox. 1 minuto):** Faça um resumo dos pontos principais, reforce a mensagem central e inclua uma chamada para ação clara (ex: 'se inscreva', 'assista ao próximo vídeo', 'deixe um comentário').

**IMPORTANTE**: Formate a saída usando Markdown. Use títulos de segundo nível (##) para seções principais (Introdução, Desenvolvimento, Conclusão) e títulos de terceiro nível (###) para subseções dentro do Desenvolvimento. Use listas com asteriscos (* ) para os pontos principais.`;
    }

    return generateDetailedContent(prompt);
};

export const generateTitles = async (title: string, description: string): Promise<string> => {
    const prompt = `Gere 5 títulos alternativos, cativantes e otimizados para SEO para um vídeo do YouTube com o título original "${title}" e a descrição "${description}". Liste os títulos, cada um em uma nova linha.`;
    return generateDetailedContent(prompt);
};

export const generateThumbnailIdeas = async (title: string, description: string): Promise<string> => {
    const prompt = `Descreva 3 ideias visuais distintas e impactantes para a thumbnail de um vídeo do YouTube com o título "${title}" e descrição "${description}". Para cada ideia, descreva os elementos visuais, o texto e o estilo geral.`;
    return generateDetailedContent(prompt);
};

export const generateHashtags = async (title: string, description: string): Promise<string> => {
    const prompt = `Sugira 10 hashtags relevantes para um vídeo do YouTube com o título "${title}" e descrição "${description}". Inclua uma mistura de hashtags populares e amplas, hashtags de nicho (específicas do tópico) e, se aplicável, hashtags para YouTube Shorts (como #shorts, #shortsvideo). Liste as hashtags, cada uma em uma nova linha, começando com #.`;
    return generateDetailedContent(prompt);
};