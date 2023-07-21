import { useState } from "react";
import { Box, Button, InputLabel, TextField } from "@mui/material";

import { EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  toggleVisibility: () => void;
}

const HospitalForm = ({ onSubmit, toggleVisibility }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');
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
      discharge: {
        date: dischargeDate,
        criteria
      },
      diagnosisCodes: diagnosisCodes === '' ? [] : diagnosisCodes.split(', '),
      type: 'Hospital'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setDischargeDate('');
    setCriteria('');
    setDiagnosisCodes('');
  };

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
        <InputLabel sx={{ mt: 2 }}>Discharge</InputLabel>
        <Box sx={{ ml: '10px' }}>
          <TextField
            fullWidth
            value={dischargeDate}
            label="date"
            variant="standard"
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

export default HospitalForm;