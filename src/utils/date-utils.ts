export const formatCurrentDate = (): string => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth();
  const monthStr = getMonthWithDeclension(month);
  const year = date.getFullYear();
  const time = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day} ${monthStr} ${year} ${time}`;
};

export const getMonthWithDeclension = (month: number): string => {
  const months = [
    { name: "січень", declension: "січня" },
    { name: "лютий", declension: "лютого" },
    { name: "березень", declension: "березня" },
    { name: "квітень", declension: "квітня" },
    { name: "травень", declension: "травня" },
    { name: "червень", declension: "червня" },
    { name: "липень", declension: "липня" },
    { name: "серпень", declension: "серпня" },
    { name: "вересень", declension: "вересня" },
    { name: "жовтень", declension: "жовтня" },
    { name: "листопад", declension: "листопада" },
    { name: "грудень", declension: "грудня" },
  ];

  return months[month]?.declension || "";
};

const ukrainianMonths = {
  nominative: [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ],
  genitive: [
    "Січня",
    "Лютого",
    "Березня",
    "Квітня",
    "Травня",
    "Червня",
    "Липня",
    "Серпня",
    "Вересня",
    "Жовтня",
    "Листопада",
    "Грудня",
  ],
};

export const formatDate = (date: string | Date, locale = "en") => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (locale === "ua") {
    const day = dateObj.getDate();
    const month = ukrainianMonths.genitive[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${month} ${year}`;
  }

  return dateObj.toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
