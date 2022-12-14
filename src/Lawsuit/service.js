export const getFileName = (lawsuit) => {
  const baseName = normalizeString(lawsuit?.["nombreDemandante"]);
  return baseName + ".docx";
};

const normalizeString = (string) =>
  string
    .normalize("NFKD")
    .replace(/\s/g, "_")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
