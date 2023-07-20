import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Alert } from "@mui/material";
import { Male, Female } from "@mui/icons-material";
import axios from 'axios';

import { Diagnosis, EntryFormValues, Gender, Patient } from "../../types";

import patientService from "../../services/patients";
import EntryDetails from "./EntryDetails";
import AddEntryForm, { EntryFormHandle } from "../AddEntryForm";

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [error, setError] = useState('');
  const entryFormRef = useRef<EntryFormHandle>(null);
  const { id } = useParams();

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
  };

  const createEntry = async (values: EntryFormValues) => {
    console.log(values);
    try {
      const addedEntry = await patientService.addEntry(patient.id, values);
      setPatient({
        ...patient,
        entries: patient.entries.concat(addedEntry)
      });
      if (entryFormRef.current) {
        entryFormRef.current.toggleVisibility();
      }
      setError('');
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace('Something went wrong. Error: ', '');
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };

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
      {error && <Alert severity="error">{error}</Alert>}
      <AddEntryForm
        onSubmit={createEntry}
        ref={entryFormRef}
      />
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