import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Male, Female } from "@mui/icons-material";
import axios from 'axios';

import { Gender, Patient } from "../../types";

import patientService from "../../services/patients";

const PatientPage = () => {
  const [patient, setPatient] = useState<Patient | null>(null)
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
  }, [id])

  if (!patient) {
    return (
      <h2>Patient not found</h2>
    );
  }

  const genderIcon = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return <Male />;
      case Gender.Female:
        return <Female />;
      case Gender.Other:
        return;
    }
  }

  return (
    <div>
      <h2>{patient.name} {genderIcon(patient.gender)}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>
    </div>
  );
};

export default PatientPage;