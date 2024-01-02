import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}{new Date().getFullYear()}&nbsp;
        <Link color="inherit" href="https://citeducation.co.in/">
          Made By Husain
        </Link>{' '}
        {'.'}
      </Typography>
    );
  }
const defaultTheme = createTheme();

function CurrencyConverter() {
  const [currencies, setCurrencies] = useState([]);
  const [sourceCurrency, setSourceCurrency] = useState(null); 
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState('');
  const backendUrl = 'https://currencyconv-backhusain-6c1a24297384.herokuapp.com';
  useEffect(() => {
    async function fetchCurrencies() {
      try {
        const response = await fetch(backendUrl+'/api/currencies');
        const data = await response.json();
        setCurrencies(data);
      } catch (err) {
        if (err.response && err.response.statusCode === 429) {
          const retryAfter = parseInt(err.response.headers['retry-after'], 10) || 60;
          alert(`Rate limited. Retrying after ${retryAfter} seconds.`);
          setTimeout(fetchCurrencies, retryAfter * 60000);
        } else {
          console.error('Error Fetching Currencies:', err);
          alert('Error Fetching Currencies!');
        }
      }
    }
  
    fetchCurrencies();
  }, []);
  
  
  const currencyOptions = currencies.length > 0 ? currencies.map((currency) => ({
    value: currency.id,
    label: (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={currency.image}
          alt={`${currency.name} logo`}
          style={{ width: '20px', marginRight: '5px' }}
        />
        <span>{currency.name}</span>
      </div>
    ),
  })) : [];
  
  const targetOptions = [
    {
      value: 'usd',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>USD</span>
        </div>
      ),
    },
    {
      value: 'eur',
      label: (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>EUR</span>
        </div>
      ),
    },
    // Add more options as needed
  ];
  

  const convertCurrency=async (event)=> {
    event.preventDefault(); // Prevents the default form submission behavior
    
    const amt=amount;
    const source= sourceCurrency['value'];
    const target= targetCurrency['value']  || 'usd';
    try {
      const response = await fetch(backendUrl+'/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            source,
            target,
            amt,
          }),
      });
      const data = await response.json();
      setConvertedAmount(data.convertedAmount);
    } catch(err) {
      console.log(err);
    }
  }

  const resetHandler = async (event)=>{
    event.preventDefault();
    setSourceCurrency(null);
    setAmount('');
    setTargetCurrency('usd');
    setConvertedAmount('');
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          
          <Typography component="h1" variant="h5">
            Currency Converter
          </Typography>
          
          <Box sx={{ mt: 1}}>
          <form onSubmit={convertCurrency}>
        <CreatableSelect
        placeholder={'Source Currency'}
        isClearable={true}
        value={sourceCurrency}
        onChange={(selectedOption) => setSourceCurrency(selectedOption)}
        options={currencyOptions}
        isSearchable={true}
        fullWidth={true}
        styles={{
            control: (provided) => ({
              ...provided,
              textAlign: 'left', // Align the text inside the input to the left
            }),
          }}
          required={true}
      />

        <TextField
        sx={{ mt: 3,mb:3 }}
          id="amount"
          name="amount"
          placeholder={'Enter Amount'}
          type="number"
          fullWidth={true}
          autoFocus={true}
          value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required={true}
        />
            
        <Select
        placeholder={'Target Currency'}
        sx={{ mt: 2 }}
        value={targetOptions.find(option => option.value === targetCurrency)}
        onChange={(selectedOption) => setTargetCurrency(selectedOption)}
        options={targetOptions}> 
        </Select>
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Convert Currency
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
              onClick={resetHandler}
            >
              Reset
            </Button>
            </form>
            <Grid container>
              <Grid item xs>
              <div>Converted Amount: {convertedAmount}</div>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

export default CurrencyConverter;