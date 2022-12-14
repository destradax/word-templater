import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { read, utils } from "xlsx";
import styles from "./App.module.scss";
import example from "./assets/plantilla_datos.xlsx?url";
import { STATUS } from "./constants";
import Lawsuit from "./Lawsuit/Lawsuit";

const App = () => {
  const [lawsuits, setLawsuits] = useState([]);
  const [template, setTemplate] = useState();

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
      console.log(`🚀 ~ json`, json);
      loadLawsuits(json);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleReadTemplate = (changeEvent) => {
    const file = changeEvent.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setTemplate(e.target.result);
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className={styles.app}>
      <div>
        <h1>Selecciona la plantilla de Word</h1>
        <input
          type="file"
          name=""
          id="inputFile"
          onChange={handleReadTemplate}
          accept=".doc,.docx"
        />
      </div>

      <div>
        <h1>Selecciona el archivo de Excel</h1>
        <input
          type="file"
          name=""
          id="inputFile"
          onChange={handleReadExcelFile}
          accept=".xls,.xlsx"
        />
        <a href={example} download className={styles.exampleFileLink}>
          Descargar archivo de ejemplo
        </a>
      </div>

      {!!lawsuits.length && (
        <div className={styles.lawsuits}>
          <h1>Verifica, corrige y descarga</h1>
          {lawsuits.map((lawsuit) => (
            <Lawsuit key={lawsuit.id} data={lawsuit} template={template} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
