export type QuestionType = {
    label: string;
    id: number;
    imageUrl: string;

    answers: Array<{
        remove?: boolean;
        status?: boolean;
        label: string;
        id: number;
    }>
};