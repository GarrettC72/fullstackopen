import { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, TextField } from "@mui/material";

import { EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  toggleVisibility: () => void;
}

const OccupationalHealthcareForm = ({ onSubmit, toggleVisibility }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [sickLeave, setSickLeave] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  const buttonStyle = {
    display: 'flex',
    marginTop: 20
  };

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
      diagnosisCodes: diagnosisCodes === '' ? [] : diagnosisCodes.split(', '),
      type: 'OccupationalHealthcare'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setEmployerName('');
    setSickLeave(false);
    setStartDate('');
    setEndDate('');
    setDiagnosisCodes('');
  };

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
        <div>
          <TextField
            fullWidth
            value={date}
            label="Date"
            variant="standard"
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
          <TextField
            fullWidth
            value={startDate}
            label="start"
            variant="standard"
            onChange={({ target }) => setStartDate(target.value)}
            disabled={!sickLeave}
          />
          <TextField
            fullWidth
            value={endDate}
            label="end"
            variant="standard"
            onChange={({ target }) => setEndDate(target.value)}
            disabled={!sickLeave}
          />
        </Box>
        <div>
          <TextField
            fullWidth
            value={diagnosisCodes}
            label="Diagnosis codes"
            variant="standard"
            onChange={({ target }) => setDiagnosisCodes(target.value)}
          />
        </div>
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