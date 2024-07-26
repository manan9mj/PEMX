import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RefreshIcon from '@mui/icons-material/Refresh';
import Chip from '@mui/material/Chip';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import React, { useState } from 'react';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';

export const SearchComponent = () => {
  const [loading, setLoading] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [noResults, setNoResults] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (inputValue.trim()) productIds.push(inputValue.trim());
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await axios.get(
        `http://localhost:8080/event?productIds=${productIds.join(',')}`,
      );
      setResults(response.data);
      setLoading(false);
      if (!response.data.length) setNoResults(true);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setResults([]);
    }
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue.trim() !== '') {
      if (!productIds.includes(inputValue.trim()))
        setProductIds([...productIds, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDelete = (productIdToDelete) => {
    setProductIds(productIds.filter((id) => id !== productIdToDelete));
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ marginTop: '10rem' }}>
        <div className="search-component">
          <TextField
            fullWidth
            id="outlined-search"
            label="Product Id"
            type="search"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleInputKeyDown}
            sx={{ width: '70%' }}
            placeholder="Enter product ID and press Enter"
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            style={{
              backgroundColor: loading ? '#d3d3d3' : '#0051BA',
              color: '#ffffff',
            }}
            disabled={loading}
          >
            Search
          </Button>
        </div>
        <div>
          {productIds.map((productId) => (
            <Chip
              key={productId}
              label={productId}
              onDelete={() => handleDelete(productId)}
              color="primary"
              variant="outlined"
              sx={{ margin: '5px' }}
              deleteIcon={<CloseIcon />}
              style={{ backgroundColor: '#FFD500' }}
            />
          ))}
        </div>
        {loading ? (
          <CircularProgress sx={{ mt: '5rem' }} />
        ) : (
          <div>
            {results.length > 0 ? (
              results.map((result) => (
                <Card sx={{ m: 4 }} key={result.eventId}>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Tooltip title="Retry Event - Can add event retries from authorized users to retrigger an event.">
                      <IconButton aria-label="retry">
                        <RefreshIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                  <CardContent
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    <Typography
                      sx={{ fontSize: 14, textAlign: 'left' }}
                      color="text.secondary"
                      gutterBottom
                    >
                      <pre>{JSON.stringify(result, null, 5)}</pre>
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography sx={{ fontSize: 16, mt: '5rem' }}>
                {noResults && 'No results found.'}
              </Typography>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchComponent;
