export type QuestionType = {
    label: string;
    id: number;

    answers: Array<{
        correct?: boolean;
        label: string;
        id: number;
    }>
};