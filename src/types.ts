export type QuestionType = {
    label: string;
    id: number;
    imageUrl: string;

    answers: Array<{
        correct?: boolean;
        label: string;
        id: number;
    }>
};