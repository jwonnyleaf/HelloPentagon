import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

interface NavbarProps {
  onNavItemClick: (contentKey: string) => void;
}

const Overview: React.FC<NavbarProps> = ({ onNavItemClick }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">File Analysis</Typography>
              <Typography variant="body2" color="textSecondary">
                Scan any file for a malicious analysis.
              </Typography>
              <Typography
                variant="body2"
                onClick={() => onNavItemClick('File Upload')}
                sx={{ marginTop: '16px', cursor: 'pointer' }}
              >
                Scan Now →
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Protection Status</Typography>
              <Typography variant="body2" color="textSecondary">
                Average protection: 75%
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                }}
              >
                Circular Progress
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Threats</Typography>
              <Typography variant="body2" color="textSecondary">
                (+2) than last week
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100px',
                  backgroundColor: '#333',
                  borderRadius: '8px',
                }}
              >
                Bar Chart
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Add more cards as needed */}
      </Grid>
    </Box>
  );
};

export default Overview;
