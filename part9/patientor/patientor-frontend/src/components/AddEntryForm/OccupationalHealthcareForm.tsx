import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  toggleVisibility: () => void;
  diagnosisCodeList: Array<Diagnosis['code']>;
}

const OccupationalHealthcareForm = ({ onSubmit, toggleVisibility, diagnosisCodeList }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
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
      employerName,
      sickLeave: !sickLeave ? undefined : {
        startDate,
        endDate
      },
      diagnosisCodes,
      type: 'OccupationalHealthcare'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setEmployerName('');
    setSickLeave(false);
    setStartDate('');
    setEndDate('');
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
      <h4>New OccupationalHealthcare entry</h4>
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
        <div>
          <TextField
            fullWidth
            value={employerName}
            label="Employer name"
            variant="standard"
            onChange={({ target }) => setEmployerName(target.value)}
          />
        </div>
        <div style={{ marginTop: 10 }}>
          <InputLabel>Diagnosis codes</InputLabel>
          <Select
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
        <FormControlLabel
          control={
            <Checkbox
              checked={sickLeave}
              onChange={({ target }) => setSickLeave(target.checked)}
            />
          }
          label="Sickleave"
          sx={{ mt: 1 }}
        />
        <Box sx={{ ml: '10px' }}>
          <InputLabel>start</InputLabel>
          <Input
            fullWidth
            type="date"
            value={startDate}
            onChange={({ target }) => setStartDate(target.value)}
            disabled={!sickLeave}
          />
          <InputLabel>end</InputLabel>
          <Input
            fullWidth
            type="date"
            value={endDate}
            onChange={({ target }) => setEndDate(target.value)}
            disabled={!sickLeave}
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

export default OccupationalHealthcareForm;