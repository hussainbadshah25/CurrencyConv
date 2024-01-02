const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(cors());
app.use(express.json());

const API_URL = 'https://api.coingecko.com/api/v3';

app.get('/api/currencies', async (req, res) => {

    try {
  
      const response = await axios.get(`${API_URL}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          per_page: 100
        }
      });
  
      const currencies = response.data.map(coin => ({
        id: coin.id,
        symbol: coin.symbol, 
        name: coin.name,
        image: coin.image
      }));
  
      res.json(currencies);
  
    } catch (error) {
  
      console.error(error);
      res.status(500).json({ message: 'Error fetching currencies' });
    
    }
  
  });

app.post('/api/convert', async (req, res) => {
  try {
    const { source, target, amt } = req.body;
    
    const quoteResponse = await axios.get(`${API_URL}/simple/price`, {
      params: {
        ids: source,
        vs_currencies: target  
      }
    });
    
    const rate = quoteResponse.data[source][target];
    const convertedAmount = amt * rate;
    
    res.json({ convertedAmount });
    
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error converting currencies' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });