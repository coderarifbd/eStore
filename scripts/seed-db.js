import postgres from 'postgres';
import { getDbUrl } from '../api/auth-utils.js';
import {
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_PRODUCTS,
  INITIAL_SUPPLIERS,
  INITIAL_EMPLOYEES
} from '../src/data/demoData.js';

const dbUrl = getDbUrl();
const sql = postgres(dbUrl, { ssl: 'require', max: 1 });

async function seed() {
  try {
    console.log('Seeding Neon database with initial store data...');
    
    // Prepare products with initial batch structure
    const formattedProducts = INITIAL_PRODUCTS.map(p => ({
      ...p,
      variants: (p.variants || []).map(v => ({
        ...v,
        batches: v.batches || [{
          id: `b_init_${v.id}`,
          purchaseVoucherId: 'initial',
          quantity: v.stock || 0,
          remainingQuantity: v.stock || 0,
          purchasePrice: v.purchasePrice || 0,
          sellingPrice: v.sellingPrice || 0,
          date: '2026-07-30'
        }]
      }))
    }));

    const fullState = {
      categories: INITIAL_CATEGORIES,
      brands: INITIAL_BRANDS,
      products: formattedProducts,
      suppliers: INITIAL_SUPPLIERS,
      employees: INITIAL_EMPLOYEES,
      sales: [],
      purchases: [],
      expenses: [],
      salaryTx: []
    };

    // 1. Insert into store_state
    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${sql.json(fullState)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
    `;

    // 2. Insert into products table
    await sql`DELETE FROM products`;
    for (let p of formattedProducts) {
      const firstVariant = (p.variants && p.variants[0]) || {};
      await sql`
        INSERT INTO products (id, name_bn, name_en, category, brand, spec, stock, batches)
        VALUES (
          ${p.id}, 
          ${p.nameBn || null}, 
          ${p.nameEn || p.nameBn || null}, 
          ${p.categoryId || null}, 
          ${p.brand || null}, 
          ${firstVariant.spec || null}, 
          ${firstVariant.stock || 0}, 
          ${JSON.stringify(firstVariant.batches || [])}
        )
      `;
    }

    console.log('Successfully seeded Neon database!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await sql.end();
  }
}

seed();
