import db from './models/index.js';

async function checkData() {
  try {
    const p = await db.Product.findOne();
    const a = await db.Address.findOne();
    console.log('Product ID:', p?.id);
    console.log('Address ID:', a?.id);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkData();
