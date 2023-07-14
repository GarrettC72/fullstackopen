import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Male, Female } from "@mui/icons-material";
import axios from 'axios';

import { Diagnosis, Gender, Patient } from "../../types";

import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";

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

  return (
    <div>
      <h2>
        {patient.name} {getGenderIcon(patient.gender)}
      </h2>
      <div>
        ssn: {patient.ssn}
      </div>
      <div>
        occupation: {patient.occupation}
      </div>
      <h3>entries</h3>
      {patient.entries.map(entry =>
        <EntryDetails
          key={entry.id}
          entry={entry}
          diagnoses={diagnoses}
        />
      )}
    </div>
  );
};

export default PatientPage;