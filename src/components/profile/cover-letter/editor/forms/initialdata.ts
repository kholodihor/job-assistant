import { lettersTemplates } from "@/constants";
import { LetterData } from "@/types/letter";

export const initialData: LetterData = {
  title: "",
  template: lettersTemplates.SHORT,
  name: "",
  profession: "",
  position: "",
  location: "",
  company: "",
  phone: "",
  email: "",
  nameRecipient: "",
  positionRecipient: "",
  text: "",
};
