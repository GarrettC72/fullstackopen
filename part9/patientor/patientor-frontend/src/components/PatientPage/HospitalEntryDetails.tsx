import { LocalHospital } from '@mui/icons-material';

import { Diagnosis, HospitalEntry } from "../../types";

interface Props {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const HospitalEntryDetails = ({ entry, diagnoses }: Props) => {
  const entryDetailsStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10
  };

  const margined = { marginBottom: 5 };

  const getCodeDescription = (code: Diagnosis['code']): string => {
    const diagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
    return diagnosis ? diagnosis.name : '';
  };

  return (
    <div style={entryDetailsStyle}>
      <div style={ margined }>
        {entry.date} <LocalHospital />
      </div>
      <div style={ margined }>
        <i>{entry.description}</i>
      </div>
      <div style={ margined }>
        discharged {entry.discharge.date}: {entry.discharge.criteria}
      </div>
      <div>
        diagnose by {entry.specialist}
      </div>
      {entry.diagnosisCodes &&
        <ul>
          {entry.diagnosisCodes.map(diagnosisCode =>
            <li key={diagnosisCode}>
              <span>
                {diagnosisCode} {getCodeDescription(diagnosisCode)}
              </span>
            </li>
          )}
        </ul>
      }
    </div>
  );
};

export default HospitalEntryDetails;