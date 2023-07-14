import { Work } from '@mui/icons-material';

import { Diagnosis, OccupationalHealthcareEntry } from "../../types";

interface Props {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

const OccupationalHealthcareEntryDetails = ({ entry, diagnoses }: Props) => {
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
        {entry.date} <Work /> <i>{entry.employerName}</i>
      </div>
      <div style={ margined }>
        <i>{entry.description}</i>
      </div>
      {entry.sickLeave &&
        <div style={ margined }>
          Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
        </div>
      }
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

export default OccupationalHealthcareEntryDetails;