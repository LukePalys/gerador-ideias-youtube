export enum VideoType {
    LONG_FORM = 'Long-form Video',
    SHORTS = 'YouTube Shorts'
}

export interface VideoIdea {
    title: string;
    description: string;
    type: VideoType;
}

export interface ModalContent {
    title: string;
    content: string;
}

export interface TrendingTopic {
    title: string;
    summary: string;
}
