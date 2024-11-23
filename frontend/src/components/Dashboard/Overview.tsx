import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';

import FileAnalysisCardIMG from '@assets/images/fileanalysisimage.png';

interface NavbarProps {
  onNavItemClick: (contentKey: string) => void;
}

const Overview: React.FC<NavbarProps> = ({ onNavItemClick }) => {
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12} lg={7}>
          <Card
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '20px',
              height: '350px',
            }}
          >
            <CardContent
              sx={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                alignSelf: 'flex-start',
                flexGrow: 1,
                justifyContent: 'space-between',
                height: '100%',
                gap: '1rem',
              }}
            >
              <Typography variant="h6">File Analysis</Typography>
              <Typography variant="body2" color="textSecondary">
                Scan any file for a malicious analysis.
              </Typography>
              <Typography
                variant="body2"
                onClick={() => onNavItemClick('File Upload')}
                sx={{
                  marginTop: 'auto',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Scan Now →
              </Typography>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 425, height: '100%', borderRadius: '8px' }}
              image={FileAnalysisCardIMG}
              alt="File Analysis Illustration"
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={5}>
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
