import { FIELDS } from "../constants";

const Lawsuit = ({ lawsuit, onChange }) => {

  const handleChangeField = (field, value) => {
    onChange(lawsuit.id, {[field]: value})
  }

  return (
    <tr>
      <td>{lawsuit.status}</td>
      {FIELDS.map((field) => (
        <td key={field}>
          <input type="text" value={lawsuit[field]} onChange={e => handleChangeField(field, e.target.value)} />
        </td>
      ))}
    </tr>
  );
};

export default Lawsuit;
