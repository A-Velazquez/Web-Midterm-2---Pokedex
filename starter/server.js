import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;
const api = 'https://pokeapi.co/api/v2/pokemon';

// Serve the static frontend from ./public
app.use(express.static('public'));

// The Api endpoint is https://pokeapi.co/api/v2/pokemon

// GET /api endpoint to fetch the catalog list
app.get('/api', async (req, res) => {
  try {
    const response = await fetch(`${api}?limit=100`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch data from PokeAPI: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  // search for characters by name
  const { search } = req.query;
  if (!search) {
    return res.status(400).json({ error: 'Search query parameter is required' });
  }

  try {
    const response = await fetch(`${api}/${encodeURIComponent(search.toLowerCase())}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch data from PokeAPI: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// GET /api/:id endpoint to fetch a specific character by ID
app.get('/api/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch data from PokeAPI: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  // id endpoint to get a specific character

  try {
    const response = await fetch(`${api}/${id}`);
    if (!response.ok) {
      return res.status(response.status).json({ error: `Failed to fetch data from PokeAPI: ${response.statusText}` });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching data from PokeAPI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});








app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);
});