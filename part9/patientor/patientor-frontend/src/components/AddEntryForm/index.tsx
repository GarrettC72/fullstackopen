import { Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";

import { Diagnosis, EntryFormValues } from "../../types";
import HospitalForm from "./HospitalForm";
import OccupationalHealthcareForm from "./OccupationalHealthcareForm";
import HealthCheckForm from "./HealthCheckForm";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  diagnosisCodeList: Array<Diagnosis['code']>;
}

export type EntryFormHandle = {
  toggleVisibility: () => void;
}

const AddEntryForm = forwardRef<EntryFormHandle, Props>(({ onSubmit, diagnosisCodeList }, refs) => {
  const [visible, setVisible] = useState(false);
  const [entryType, setEntryType] = useState('Hospital');

  const hideWhenVisible = {
    marginTop: 10,
    display: visible ? 'none' : ''
  };

  const formStyle = {
    padding: 10,
    border: 'dotted',
    marginTop: 10,
    display: visible ? '' : 'none'
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  });

  const getEntryFormByType = (entryType: string) => {
    switch (entryType) {
      case "Hospital":
        return (
          <HospitalForm
            onSubmit={onSubmit}
            toggleVisibility={toggleVisibility}
            diagnosisCodeList={diagnosisCodeList}
          />
        );
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcareForm
            onSubmit={onSubmit}
            toggleVisibility={toggleVisibility}
            diagnosisCodeList={diagnosisCodeList}
          />
        );
      case "HealthCheck":
        return (
          <HealthCheckForm
            onSubmit={onSubmit}
            toggleVisibility={toggleVisibility}
            diagnosisCodeList={diagnosisCodeList}
          />
        );
      default:
        return <div></div>
    };
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: '5px' }}
          onClick={toggleVisibility}
        >
          Add New Entry
        </Button>
      </div>
      <div style={formStyle}>
        <FormControl fullWidth>
          <InputLabel id="entry-type-label">Entry Type</InputLabel>
          <Select
            labelId="entry-type-label"
            label="Entry Type"
            value={entryType}
            onChange={({ target }) => setEntryType(target.value)}
          >
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">OccupationalHealthcare</MenuItem>
            <MenuItem value="HealthCheck">HealthCheck</MenuItem>
          </Select>
        </FormControl>
        {getEntryFormByType(entryType)}
      </div>
    </div>
  )
});

export default AddEntryForm;