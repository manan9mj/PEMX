import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';

export function Header() {
  return (
    <AppBar
      position="fixed"
      style={{ backgroundColor: '#FFD500', height: '80px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          sx={{
            fontWeight: 900,
            letterSpacing: '.1rem',
            color: "#0051BA"
          }}
        >
          Product Events Message Exchange
        </Typography>
      </div>
    </AppBar>
  );
}
