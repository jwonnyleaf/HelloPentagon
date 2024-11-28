import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import FileAnalysisCardIMG from '@assets/images/fileanalysisimage.png';

interface NavbarProps {
  onNavItemClick: (contentKey: string) => void;
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

const Overview: React.FC<NavbarProps> = ({ onNavItemClick }) => {
  const [chartData, setChartData] = useState<any>(null);
  const [threats, setThreats] = useState<number>(0);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/user/1/files?last_week=true');
        const data = await response.json();

        if (response.ok) {
          setThreats(data.length);
          const daysOfWeek = [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ];
          const threatCounts = Array(7).fill(0);
          data.forEach((item: any) => {
            const date = new Date(item.created_at);
            const dayIndex = date.getDay();
            threatCounts[dayIndex] += 1;
          });

          setChartData({
            labels: daysOfWeek,
            datasets: [
              {
                label: 'Threats Detected',
                data: threatCounts,
                backgroundColor: '#FFFFFF',
                borderRadius: 4,
              },
            ],
          });
        } else {
          console.error('Error fetching data:', data.error);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
    barThickness: 10,
    layout: {
      padding: 20,
    },
    elements: {
      bar: {
        borderWidth: 0,
      },
    },
  };
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
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
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
          <Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '16px',
              borderRadius: '20px',
              height: '350px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <h3 style={{ marginBottom: '16px', color: '#555' }}>
                Protection Status
              </h3>
              <div style={{ width: '150px', marginBottom: '16px' }}>
                <CircularProgressbar
                  value={75}
                  text={`${75}%`}
                  counterClockwise={true}
                  styles={buildStyles({
                    textColor: '#333',
                    pathColor: '#FFA726',
                    trailColor: '#ddd',
                  })}
                />
              </div>
              <h4 style={{ margin: '8px 0', color: '#000' }}>
                Average protection
              </h4>
              <p style={{ fontSize: '14px', color: '#888' }}>
                Check what you can do to be fully protected
              </p>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={6}>
          <Card
            sx={{
              padding: '16px',
              borderRadius: '20px',
              height: '500px',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '250px',
                  backgroundColor: '#0A1128',
                  borderRadius: '16px',
                  padding: '16px',
                  marginBottom: '16px',
                }}
              >
                {chartData ? (
                  <Bar data={chartData} options={options} />
                ) : (
                  <p>Loading...</p>
                )}
              </Box>
              <Typography variant="h6">Threats</Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 'auto',
                }}
                color="textSecondary"
              >
                <span className="font-bold text-green-500">(+{threats})</span>{' '}
                than last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Overview;
