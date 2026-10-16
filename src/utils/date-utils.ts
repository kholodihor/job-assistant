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
