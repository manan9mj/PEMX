import Button from '@mui/material/Button';
import { SearchComponent } from './search-query';
import { Container, Stack, Typography } from '@mui/material';
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { styled } from '@mui/material/styles';
import { PushEventsComponent } from './push-events';

const DemoPaper = styled(Paper)(({ theme }) => ({
  width: 300,
  height: 300,
  padding: theme.spacing(2),
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'whitesmoke',
  color: '#0051BA',
  border: '3px solid #0051BA',
  cursor: 'pointer',
}));

export const Dashboard = () => {
  const [isDashboard, setIsDashboard] = useState(true);
  const [showSearchEvents, setShowSearchEvents] = useState(false);
  const [showPushEvents, setPushEvents] = useState(false);

  const handleSearchEvents = () => {
    setPushEvents(false);
    setIsDashboard(false);
    setShowSearchEvents(true);
  };

  const handlePushEvents = () => {
    setPushEvents(true);
    setIsDashboard(false);
    setShowSearchEvents(false);
  };

  const onBackClick = () => {
    setIsDashboard(true);
    setPushEvents(false);
    setShowSearchEvents(false);
  }

  return (
    <div>
      {!isDashboard && (<Button
        variant="contained"
        onClick={onBackClick}
        sx={{
          position: 'absolute',
          top: '12%',
          left: '13%',
          fontSize: '24px',
          cursor: 'pointer',
          backgroundColor: '#FFD500',
          color: '#0051BA',
          borderRadius: '10%',
          padding: '4px',
        }}
      >
        <ArrowBackIcon />
      </Button>)}

      {isDashboard && (
        <Container
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Stack direction="row" spacing={2}>
            <DemoPaper square={false} onClick={handleSearchEvents}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Search Events
              </Typography>
            </DemoPaper>
            <DemoPaper square={false} onClick={handlePushEvents}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Push Events
              </Typography>
            </DemoPaper>
          </Stack>
        </Container>
      )}
      {showSearchEvents && <SearchComponent />}
      {showPushEvents && <PushEventsComponent />}
    </div>
  );
};
