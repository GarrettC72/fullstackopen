import { MedicalServices, Favorite } from '@mui/icons-material';
import { green, orange, red, yellow } from '@mui/material/colors';

import { Diagnosis, HealthCheckEntry, HealthCheckRating } from "../../types";

interface Props {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}

const HealthCheckEntryDetails = ({ entry, diagnoses }: Props) => {
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

  const getHealthRatingColor = (rating: HealthCheckRating): string => {
    switch(rating) {
      case 0:
        return green[800];
      case 1:
        return yellow[500];
      case 2:
        return orange[500];
      case 3:
        return red[700];
      default:
        return yellow[500];
    };
  };
  
  return (
    <div style={entryDetailsStyle}>
      <div style={ margined }>
        {entry.date} <MedicalServices />
      </div>
      <div style={ margined }>
        <i>{entry.description}</i>
      </div>
      <div style={ margined }>
        <Favorite sx={{ color: getHealthRatingColor(entry.healthCheckRating) }}/>
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

export default HealthCheckEntryDetails;