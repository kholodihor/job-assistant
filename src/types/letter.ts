export interface LetterData {
  title?: string;
  name: string;
  profession: string;
  position: string;
  company: string;
  location?: string;
  phone?: string;
  email?: string;
  nameRecipient: string;
  positionRecipient?: string;
  text: string;
  template?: string;
}

export interface ILetter extends LetterData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditorFormProps {
  letterData: LetterData;
  setLetterData: (data: LetterData) => void;
}
