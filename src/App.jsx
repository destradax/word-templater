import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";
import PizZip from "pizzip";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";
import styles from "./App.module.scss";
import { FIELDS, STATUS } from "./constants";
import Lawsuit from "./Lawsuit/Lawsuit";
import { getFileName } from "./utils";

const App = () => {
  const [lawsuits, setLawsuits] = useState([]);
  const [template, setTemplate] = useState();
  const [zip, setZip] = useState(new PizZip());

  const handleChangeLawsuit = (lawsuitId, changes) => {
    const updatedLawsuits = lawsuits.map((lawsuit) => {
      if (lawsuit.id === lawsuitId) {
        return { ...lawsuit, ...changes };
      }

      return lawsuit;
    });

    setLawsuits(updatedLawsuits);
  };

  const loadLawsuits = (array) => {
    setLawsuits(
      array.map((l) => ({
        id: uuidv4(),
        status: STATUS.PENDING,
        ...l,
      }))
    );
  };

  const handleReadExcelFile = (changeEvent) => {
    const file = changeEvent.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      /* reader.readAsArrayBuffer(file) -> data will be an ArrayBuffer */
      const workbook = read(e.target.result);

      const json = utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
      loadLawsuits(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleReadTemplate = (changeEvent) => {
    const file = changeEvent.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      console.log("zipping template");
      const zip = new PizZip(e.target.result);

      console.log("creating templater");

      setTemplate(zip);
    };

    reader.readAsBinaryString(file);
  };

  const handleProcess = () => {
    for (const lawsuit of lawsuits) {
      console.log("processing");
      console.log(lawsuit);
      const doc = new Docxtemplater(template, {
        paragraphLoop: true,
        linebreaks: true,
      });

      doc.render(lawsuit);

      const outputFile = doc.getZip().generate({
        type: "blob",
        mimeType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: "DEFLATE",
      });

      const fileName = `${getFileName(lawsuit)}.docx`;
      console.log(`saving to ${fileName}`);
      // saveAs(outputFile, fileName);

      zip.file(fileName, outputFile);
    }
    const content = zip.generate({ type: "blob" });
    saveAs(zip, "docs.zip");
  };

  return (
    <div className={styles.app}>
      <h1>1. Selecciona la plantilla de Word</h1>
      <input
        type="file"
        name=""
        id="inputFile"
        onChange={handleReadTemplate}
        accept=".doc,.docx"
      />

      <hr />

      <h1>2. Selecciona el archivo de Excel</h1>
      <input
        type="file"
        name=""
        id="inputFile"
        onChange={handleReadExcelFile}
        accept=".xls,.xlsx"
      />

      <hr />

      <h1>3. Verifica y corrige los datos</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th></th>
            {FIELDS.map((field) => (
              <th key={field}>{field}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {lawsuits.map((lawsuit) => (
            <Lawsuit
              key={lawsuit.id}
              lawsuit={lawsuit}
              onChange={handleChangeLawsuit}
            />
          ))}
        </tbody>
      </table>

      <hr />

      <h1>4. Click en procesar</h1>
      <button onClick={handleProcess} disabled={!template || !lawsuits?.length}>
        PROCESAR
      </button>

      <hr />

      <h1>5. Descarga el resultado</h1>

      <hr />

      <pre>{JSON.stringify(lawsuits, null, 2)}</pre>
    </div>
  );
};

export default App;
