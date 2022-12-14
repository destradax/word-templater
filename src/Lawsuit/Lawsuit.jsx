import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import { useState } from "react";
import { FIELDS } from "../constants";
import styles from "./Lawsuit.module.scss";
import { getFileName } from "./service";

const Lawsuit = ({ data, template }) => {
  const [lawsuit, setLawsuit] = useState(data);
  const [fileName, setFileName] = useState(getFileName(data));

  const handleChangeField = (field, value) => {
    const updatedLawsuit = { ...lawsuit, [field]: value };
    setLawsuit(updatedLawsuit);
    setFileName(getFileName(updatedLawsuit));
  };

  const handleDownload = () => {
    const zip = new PizZip(template);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    doc.render(lawsuit);

    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // compression: DEFLATE adds a compression step.
      // For a 50MB output document, expect 500ms additional CPU time
      compression: "DEFLATE",
    });

    saveAs(blob, fileName);
  };

  return (
    <div className={styles.lawsuit}>
      <div>Nombre del archivo: {fileName}</div>

      <div className={styles.scrollWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              {FIELDS.map((field) => (
                <th>{field}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {FIELDS.map((field) => (
                <td key={field}>
                  <input
                    type="text"
                    value={lawsuit[field]}
                    onChange={(e) => handleChangeField(field, e.target.value)}
                    className={styles.input}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <button
        onClick={handleDownload}
        disabled={!template}
        className={styles.downloadButton}
      >
        DESCARGAR {fileName}
      </button>
    </div>
  );
};

export default Lawsuit;
