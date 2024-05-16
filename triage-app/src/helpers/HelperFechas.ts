// helper.ts
export const getFormatBirthDate = (birth__date: string): string => {
  const originalBirthDate = new Date(birth__date);
  const birthFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true
  };
  const formatoNacimiento = new Intl.DateTimeFormat('es-AR', birthFormat);
  const formatBirthDate = formatoNacimiento.format(originalBirthDate);
  return formatBirthDate;
};

export const getFormatDate = (entry__time: string): string => {
  const entryTimeOriginal = new Date(entry__time);
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  const formatoFechaHora = new Intl.DateTimeFormat('es-AR', dateFormat);
  const formatEntryTime = formatoFechaHora.format(entryTimeOriginal);
  return formatEntryTime;
};
