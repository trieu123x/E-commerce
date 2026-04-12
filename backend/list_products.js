import db from './models/index.js';
async function listProducts() {
  const products = await db.Product.findAll({ limit: 10 });
  console.log('Product Names:');
  products.forEach(p => console.log(`- ${p.name}`));
  process.exit(0);
}
listProducts();
