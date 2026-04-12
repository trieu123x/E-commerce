import axios from 'axios';

async function verifySearch() {
  try {
    const res = await axios.get('http://localhost:5000/api/products?search=ao');
    console.log('Search Results for "ao":');
    res.data.data.forEach(p => console.log(`- ${p.name}`));
    
    if (res.data.data.some(p => p.name.toLowerCase().includes('áo'))) {
      console.log('SUCCESS: Found accented products with unaccented search term.');
    } else {
      console.log('FAILURE: Accented products not found.');
    }
  } catch (error) {
    console.error('Error verifying search:', error.message);
  }
}

verifySearch();
