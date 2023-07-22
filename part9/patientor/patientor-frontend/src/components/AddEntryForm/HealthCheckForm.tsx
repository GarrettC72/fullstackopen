import { useState } from "react";
import { Box, Button, Input, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

import { Diagnosis, EntryFormValues } from "../../types";

interface Props {
  onSubmit: (values: EntryFormValues) => void;
  toggleVisibility: () => void;
  diagnosisCodeList: Array<Diagnosis['code']>;
}

const HealthCheckForm = ({ onSubmit, toggleVisibility, diagnosisCodeList }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [healthCheckRating, setHealthCheckRating] = useState(0);
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);

  const buttonStyle = {
    display: 'flex',
    marginTop: 20
  };

  const diagnosisCodeOptions = diagnosisCodeList.map(code => ({
    value: code,
    label: code
  }));

  const healthCheckRatingOptions = [
    { label: "Healthy", value: 0 },
    { label: "Low Risk", value: 1 },
    { label: "High Risk", value: 2 },
    { label: "Critical Risk", value: 3 }
  ];

  const addEntry = (event: React.SyntheticEvent) => {
    event.preventDefault();
    onSubmit({
      description,
      date,
      specialist,
      healthCheckRating,
      diagnosisCodes,
      type: 'HealthCheck'
    });

    setDescription('');
    setDate('');
    setSpecialist('');
    setHealthCheckRating(0);
    setDiagnosisCodes([]);
  };

  const onDiagnosisCodesChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    event.preventDefault();
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value
    );
  }

  const onHealthCheckRatingChange = (event: SelectChangeEvent<typeof healthCheckRating>) => {
    event.preventDefault();
    if (typeof event.target.value === 'number') {
      setHealthCheckRating(event.target.value);
    }
  }

  return (
    <div>
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
            fullWidth
            value={diagnosisCodes}
            onChange={onDiagnosisCodesChange}
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
        <div style={{ marginTop: 10 }}>
          <InputLabel>HealthCheckRating</InputLabel>
          <Select
            fullWidth
            value={healthCheckRating}
            onChange={onHealthCheckRatingChange}
            variant="standard"
          >
            {healthCheckRatingOptions.map(option => 
            <MenuItem
              key={option.label}
              value={option.value}
            >
              {option.label}
            </MenuItem>
          )}
          </Select>
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

export default HealthCheckForm;