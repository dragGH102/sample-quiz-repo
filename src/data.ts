import { QuestionType } from "./types";

export const questions: QuestionType[] = [
    { 
      label: 'whatever?',
      id: 1,
      imageUrl: "https://picsum.photos/id/237/100",
      answers: [
        {
          id: 1,
          label: 'A'
        },
        { 
          id: 2,
          label: 'B',
          correct: true
        },
      ]
    },
    { 
      label: 'whatever2?',
      id: 2,
      imageUrl: "https://picsum.photos/id/500/100",
      answers: [
        { 
          id: 3,
          label: 'A2',
          correct: true
        },
        { 
          id: 4,
          label: 'B'
        },
      ]
    }
  ];