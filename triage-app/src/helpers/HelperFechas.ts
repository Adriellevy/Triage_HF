export const getFormatBirthDate = (birth__date: string): string => {
  const originalBirthDate = new Date(birth__date);
  const utcBirthDate = new Date(originalBirthDate.getTime() + originalBirthDate.getTimezoneOffset() * 60000);
  const birthFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: true
  };
  const formatoNacimiento = new Intl.DateTimeFormat('es-AR', birthFormat);
  const formatBirthDate = formatoNacimiento.format(utcBirthDate);
  return formatBirthDate;
};

export const getFormatDate = (entry__time: string): string => {
  const entryTimeOriginal = new Date(entry__time);
  const utcEntryTime = new Date(entryTimeOriginal.getTime() + entryTimeOriginal.getTimezoneOffset() * 60000);
  const dateFormat: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  };
  const formatoFechaHora = new Intl.DateTimeFormat('es-AR', dateFormat);
  const formatEntryTime = formatoFechaHora.format(utcEntryTime);
  return formatEntryTime;
};

export const getAgeNumber = (edad: number) => {
  if (edad) {
    const hoy = new Date();
    const añoActual = hoy.getFullYear();
    const añoNacimiento = añoActual - edad;
    return new Date(añoNacimiento + '-01-01');
  }
};
