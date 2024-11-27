import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../context/AuthProvider';

interface FileRecord {
  file_id: string;
  file_name: string;
  prediction_label: string;
  prediction_confidence: number;
  family: string;
  created_at: string;
}

const HistoryPage: React.FC = () => {
  const { userID } = useAuth();
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/user/${userID}/files?search=${searchQuery}&page=${paginationModel.page}&pageSize=${paginationModel.pageSize}`
      );

      const data = await response.json();

      if (response.ok) {
        setFiles(data);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch files');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [searchQuery, paginationModel]);

  const handleViewFile = (fileId: string) => {
    // navigate(`/file/${fileId}`);
  };

  const columns: GridColDef[] = [
    {
      field: 'created_at',
      headerName: 'Date',
      flex: 1,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleTimeString([], {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        });
      },
    },
    { field: 'file_name', headerName: 'File Name', flex: 1 },
    { field: 'prediction_label', headerName: 'Scan Result', flex: 1 },
    {
      field: 'family',
      headerName: 'Family',
      flex: 1,
      renderCell: (params) => (
        <span style={{ textTransform: 'uppercase' }}>{params.value}</span>
      ),
    },
    {
      field: 'prediction_confidence',
      headerName: 'Confidence',
      flex: 1,
      renderCell: (params) => `${(params.value * 100).toFixed(2)}%`,
    },
    {
      field: 'view',
      headerName: '',
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          <IconButton onClick={() => handleViewFile(params.row.file_id)}>
            <VisibilityIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Scan History
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search by file name..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => fetchFiles()}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
        </Box>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Box
          sx={{
            height: 500,
            width: '100%',
          }}
        >
          <DataGrid
            rows={files.map((file) => ({ ...file, id: file.file_id }))}
            columns={columns}
            paginationModel={paginationModel}
            onPaginationModelChange={(newModel) => setPaginationModel(newModel)}
            disableRowSelectionOnClick
            autoHeight
            sx={{
              fontSize: '1.25rem',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default HistoryPage;
