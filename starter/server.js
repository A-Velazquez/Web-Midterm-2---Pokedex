import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

const BASE = 'https://pokeapi.co/api/v2';
const SPRITE = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const TOTAL = 1025; // National Dex
const cache = new Map(); // avoid re-fetching the same Pokémon

// Serve the static frontend from ./public
app.use(express.static('public'));

// Fetch one Pokémon from PokeAPI by id or name, reusing the cache when possible
async function getPokemon(idOrName) {
  const key = String(idOrName).toLowerCase().trim();
  if (cache.has(key)) return cache.get(key);

  const response = await fetch(`${BASE}/pokemon/${encodeURIComponent(key)}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`PokeAPI responded with ${response.status}`);

  const pokemon = await response.json();
  cache.set(key, pokemon);
  cache.set(String(pokemon.id), pokemon);
  return pokemon;
}

// Shape used by the catalog cards: only id, name and sprite are needed
function toSummary(pokemon) {
  return {
    id: pokemon.id,
    name: pokemon.name,
    image:
      pokemon.sprites?.other?.['official-artwork']?.front_default ||
      pokemon.sprites?.front_default,
  };
}

// Shape used by the detail modal
function toDetail(pokemon) {
  return {
    ...toSummary(pokemon),
    experience: pokemon.base_experience ?? '-',
    height: pokemon.height ?? '-',
    weight: pokemon.weight ?? '-',
    types: (pokemon.types || [])
      .sort((a, b) => a.slot - b.slot)
      .map((entry) => entry.type.name),
    abilities: (pokemon.abilities || []).map((entry) => entry.ability.name),
    moves: (pokemon.moves || []).map((entry) => entry.move.name),
    prevId: pokemon.id === 1 ? TOTAL : pokemon.id - 1,
    nextId: pokemon.id === TOTAL ? 1 : pokemon.id + 1,
  };
}

// GET /api            -> full catalog
// GET /api?search=... -> one Pokémon, as an array
app.get('/api', async (req, res) => {
  const search = String(req.query.search || '')
    .trim()
    .toLowerCase();

  try {
    if (search) {
      const pokemon = await getPokemon(search);
      if (!pokemon) return res.status(404).json({ error: 'Not found' });
      return res.json([toDetail(pokemon)]);
    }

    const response = await fetch(`${BASE}/pokemon?limit=${TOTAL}`);
    if (!response.ok) throw new Error(`PokeAPI responded with ${response.status}`);

    const { results } = await response.json();

    res.json(
      results.map(({ name, url }) => {
        const id = Number(url.split('/').filter(Boolean).pop());
        return { id, name, image: `${SPRITE}/${id}.png` };
      })
    );
  } catch (error) {
    console.error('Error fetching the catalog:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET /api/:id -> one Pokémon's details (id or name)
app.get('/api/:id', async (req, res) => {
  try {
    const pokemon = await getPokemon(req.params.id);
    if (!pokemon) return res.status(404).json({ error: 'Not found' });
    res.json(toDetail(pokemon));
  } catch (error) {
    console.error('Error fetching a Pokémon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
