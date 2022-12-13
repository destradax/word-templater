export const getFileName = (lawsuit) =>
  lawsuit?.nombre
    .normalize("NFKD")
    .replace(/\s/g, "_")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
