import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Typography } from "@mui/material";
import { Male, Female } from "@mui/icons-material";
import axios from 'axios';

import { Diagnosis, Gender, Patient } from "../../types";

import patientService from "../../services/patients";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const id = useParams().id;

  useEffect(() => {
    if (id) {
      const fetchPatientInfo = async (id: string) => {
        try {
          const patient = await patientService.get(id);
          setPatient(patient);
        } catch (e: unknown) {
          if (axios.isAxiosError(e)) {
            if (e?.response?.data && typeof e?.response?.data === "string") {
              const message = e.response.data.replace('Something went wrong. Error: ', '');
              console.error(message);
            } else {
              console.error("Unrecognized axios error");
            }
          } else {
            console.error("Unknown error", e);
          }
          setPatient(null);
        }
      }
      void fetchPatientInfo(id);
    }
  }, [id]);

  if (!patient) {
    return (
      <h2>Patient not found</h2>
    );
  }

  const getGenderIcon = (gender: Gender) => {
    switch (gender) {
      case "male":
        return <Male />;
      case "female":
        return <Female />;
      case "other":
        return;
    }
  }

  const getCodeDescription = (code: Diagnosis['code']) => {
    const diagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
    return diagnosis ? diagnosis.name : '';
  }

  return (
    <div>
      <Typography variant="h5" style={{ fontWeight: "bold", margin: "1.25em 0 0.75em" }}>
        {patient.name} {getGenderIcon(patient.gender)}
      </Typography>
      <Typography variant="body2">
        ssn: {patient.ssn}<br />
        occupation: {patient.occupation}
      </Typography>
      <Typography variant="h6" style={{ fontWeight: "bold", margin: "1.5em 0 0.9em" }}>
        entries
      </Typography>
      {patient.entries.map(entry =>
        <div key={entry.id}>
          <Typography variant="body2">
            {entry.date} <i>{entry.description}</i>
          </Typography>
          {entry.diagnosisCodes &&
            <ul>
              {entry.diagnosisCodes.map(diagnosisCode =>
                <li key={diagnosisCode}>
                  <Typography variant="body2">
                    {diagnosisCode} {getCodeDescription(diagnosisCode)}
                  </Typography>
                </li>
              )}
            </ul>
          }
        </div>
      )}
    </div>
  );
};

export default PatientPage;