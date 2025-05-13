import dayjs from "dayjs";

// Função que retorna uma string representando o tempo decorrido desde a data informada
const getTime = (date: Date): string => {
  const now = dayjs(); // Data e hora atual

  const diff = now.diff(date, "minute"); // Diferença em minutos

  // Se for menos de 60 minutos, retorna em minutos
  if (diff < 60) {
    return `${diff} min`;
  }

  const diffHour = now.diff(date, "hour"); // Diferença em horas

  // Se for menos de 24 horas, retorna em horas (singular ou plural)
  if (diffHour < 24) {
    return `${diffHour} hora${diffHour > 1 ? "s" : ""}`;
  }

  const diffDay = now.diff(date, "day"); // Diferença em dias

  // Se for menos de 7 dias, retorna em dias (singular ou plural)
  if (diffDay < 7) {
    return `${diffDay} dia${diffDay > 1 ? "s" : ""}`;
  }

  // Se for há mais de 7 dias, retorna a data formatada (DD/MM/AAAA)
  return dayjs(date).add(1, "day").format("DD/MM/YYYY");
};

export { getTime };