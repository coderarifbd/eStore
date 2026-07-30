import dotenv from 'dotenv';
import postgres from 'postgres';
dotenv.config();

const DEFAULT_DB_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const sql = postgres(process.env.DATABASE_URL || DEFAULT_DB_URL, { ssl: 'require' });

async function migrateProducts() {
  console.log('Migrating products from relational table to store_state...');
  try {
    const productsRaw = await sql`SELECT * FROM products`;
    console.log(`Found ${productsRaw.length} products in relational table.`);

    const formattedProducts = productsRaw.map(p => {
      let batches = [];
      try {
        batches = typeof p.batches === 'string' ? JSON.parse(p.batches) : (p.batches || []);
        while (typeof batches === 'string') batches = JSON.parse(batches);
      } catch (e) { batches = []; }

      return {
        id: p.id,
        nameBn: p.name_bn || "ক্যাবল ও ওয়ার (Retail Wire by Yard)",
        nameEn: p.name_en || "Retail Wire by Yard",
        categoryId: p.category || "cat_cables",
        brand: p.brand || "BRB Cables",
        unit: "Yard",
        variationTypeName: "টাইপ",
        variants: [
          {
            id: `v_${p.id}_1`,
            spec: p.spec || "Standard",
            sku: p.id,
            purchasePrice: 0,
            sellingPrice: 0,
            stock: Number(p.stock || 0),
            reorderLevel: 5,
            batches: Array.isArray(batches) ? batches : []
          }
        ]
      };
    });

    const stateRow = await sql`SELECT data FROM store_state WHERE id = 1`;
    let currentState = (stateRow.length > 0 && stateRow[0].data) ? stateRow[0].data : {};

    // Combine or set products
    currentState.products = formattedProducts;

    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${sql.json(currentState)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
    `;

    console.log('SUCCESS: Migration completed!');
    console.log('store_state products count:', currentState.products.length);
    console.log('Migrated product:', JSON.stringify(currentState.products[0], null, 2));

  } catch (err) {
    console.error('Migration error:', err);
  } finally {
    await sql.end();
  }
}

migrateProducts();
