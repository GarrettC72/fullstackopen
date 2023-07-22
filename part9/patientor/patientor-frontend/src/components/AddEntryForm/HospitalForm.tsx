import { useState } from "react";
import { Box, Button, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  toggleVisibility: () => void;
  diagnosisCodeList: Array<Diagnosis['code']>;
}

const HospitalForm = ({ onSubmit, toggleVisibility, diagnosisCodeList }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const buttonStyle = {
    display: 'flex',
    marginTop: 20
  };

  const diagnosisCodeOptions = diagnosisCodeList.map(code => ({
    value: code,
    label: code
  }));

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      discharge: {
        date: dischargeDate,
        criteria
      },
      diagnosisCodes,
      type: 'Hospital'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setDischargeDate('');
    setCriteria('');
    setDiagnosisCodes([]);
  };

  const handleDiagnosisCodesChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value
    );
  }

  return (
    <div>
      <h4>New Hospital entry</h4>
      <form onSubmit={addEntry}>
        <div>
          <TextField
            fullWidth
            value={description}
            label="Description"
            variant="standard"
            onChange={({ target }) => setDescription(target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <InputLabel>Date</InputLabel>
          <Input
            fullWidth
            type="date"
            value={date}
            onChange={({ target }) => setDate(target.value)}
          />
        </div>
        <div>
          <TextField
            fullWidth
            value={specialist}
            label="Specialist"
            variant="standard"
            onChange={({ target }) => setSpecialist(target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
            label="Diagnosis codes"
            fullWidth
            value={diagnosisCodes}
            onChange={handleDiagnosisCodesChange}
            multiple
            variant="standard"
          >
          {diagnosisCodeOptions.map(option => 
            <MenuItem
              key={option.label}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          )}
          </Select>
        </div>
        <InputLabel sx={{ mt: 2 }}>Discharge</InputLabel>
        <Box sx={{ ml: '10px' }}>
          <InputLabel>date</InputLabel>
          <Input
            fullWidth
            type="date"
            value={dischargeDate}
            onChange={({ target }) => setDischargeDate(target.value)}
          />
          <TextField
            fullWidth
            value={criteria}
            label="criteria"
            variant="standard"
            onChange={({ target }) => setCriteria(target.value)}
          />
        </Box>
        <div style={buttonStyle}>
          <Button
            variant="contained"
            color="error"
            onClick={toggleVisibility}
          >
            Cancel
          </Button>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Add
          </Button>
        </div>
      </form>
    </div>
  )
};

export default HospitalForm;