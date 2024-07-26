import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

export const PushEventsComponent = () => {
  const [success, setSuccess] = React.useState(false);
  const [jsonArray, setJsonArray] = useState('');
  const [errorList, setErrorList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleJsonArrayChange = (event) => {
    const value = event.target.value;
    setJsonArray(value);
  };

  const validateJson = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleJSONSubmission = async () => {
    if (!validateJson(jsonArray)) {
      setErrorList([
        'Invalid JSON format, events should be array of JSON objects',
      ]);
      return;
    }

    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await axios.post('http://localhost:8080/event', {events: JSON.parse(jsonArray)});
      setSuccess(true);
      setErrorList([]);
      setJsonArray('');
    } catch (error) {
      console.log(error, '$$$$$$$');
      const errorList = [];
      if (error.response.data.errors) {
        error.response.data.errors.forEach((e) => errorList.push(e.msg));
      } else if (error.response.data.error) {
        errorList.push(error.response.data.error);
      } else {
        errorList.push('Internal error occurred');
      }
      console.log(errorList);
      setErrorList(errorList);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSuccess(false);
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ marginTop: '10rem' }}>
        <Button
          variant="contained"
          onClick={handleJSONSubmission}
          style={{
            backgroundColor: loading ? '#d3d3d3' : '#0051BA',
            color: '#ffffff',
          }}
          disabled={loading}
        >
          <span style={{ marginRight: '8px' }}>Push Events</span>
          {loading && (
            <CircularProgress size={20} style={{ color: '#0051BA' }} />
          )}
        </Button>
        <Container style={{ marginTop: '2rem', paddingLeft: '0' }}>
          {Boolean(errorList.length) &&
            errorList.map((err, idx) => (
              <Typography
                variant="body2"
                key={idx}
                style={{
                  display: 'block',
                  color: 'red',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  marginTop: '0.5rem',
                  textAlign: 'left',
                }}
              >
                {err}
              </Typography>
            ))}
        </Container>
        <div style={{ position: 'relative' }}>
          <TextareaAutosize
            style={{ width: '100%', minHeight: '300px', marginTop: '1rem' }}
            aria-label="empty textarea"
            placeholder="Enter array of Product Events object"
            value={jsonArray}
            onChange={handleJsonArrayChange}
          />
        </div>
      </Container>
      <div>
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
        >
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            variant="filled"
            sx={{ width: '100%' }}
          >
            All the events has been pushed
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};
