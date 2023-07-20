import { Box, Button, TextField } from "@mui/material";
import { forwardRef, useImperativeHandle, useState } from "react";

import { EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
}

export type EntryFormHandle = {
  toggleVisibility: () => void;
}

const AddEntryForm = forwardRef<EntryFormHandle, Props>(({ onSubmit }, refs) => {
  const [visible, setVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

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

  const buttonStyle = {
    display: 'flex',
    marginTop: 20
  };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  });

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      healthCheckRating: Number(healthCheckRating),
      diagnosisCodes: diagnosisCodes === '' ? [] : diagnosisCodes.split(', '),
      type: 'HealthCheck'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating('');
    setDiagnosisCodes('');
  };

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
        <h4>New HealthCheck entry</h4>
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
              value={healthCheckRating}
              label="Healthcheck rating"
              variant="standard"
              onChange={({ target }) => setHealthCheckRating(target.value)}
            />
          </div>
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
    </div>
  )
});

export default AddEntryForm;