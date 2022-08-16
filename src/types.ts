export type QuestionType = {
    label: string;
    id: number;
    imageUrl: string;

    answers: Array<{
        remove?: boolean;
        correct?: boolean;
        label: string;
        id: number;
    }>
};