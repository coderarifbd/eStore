import postgres from 'postgres';
import { INITIAL_PRODUCTS } from '../src/data/demoData.js'; // Wait, let's just define a simple mock product or import it

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

async function testSync() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  // Simple mock product
  const mockProducts = [
    {
      id: "prod_test",
      nameBn: "টেস্ট প্রোডাক্ট",
      nameEn: "Test Product",
      category: "Test",
      brand: "Test",
      spec: "Test",
      stock: 10,
      batches: [{ id: "batch_1", purchaseVoucherId: "init", quantity: 10, remainingQuantity: 10, purchasePrice: 50, sellingPrice: 60, date: "2026-07-30" }]
    }
  ];

  try {
    console.log("Testing insert query for products...");
    for (let p of mockProducts) {
      await sql`
        INSERT INTO products (id, name_bn, name_en, category, brand, spec, stock, batches)
        VALUES (${p.id}, ${p.nameBn}, ${p.nameEn || null}, ${p.category || null}, ${p.brand || null}, ${p.spec || null}, ${p.stock || 0}, ${JSON.stringify(p.batches || [])})
        ON CONFLICT (id) DO UPDATE SET
          name_bn = EXCLUDED.name_bn,
          name_en = EXCLUDED.name_en,
          category = EXCLUDED.category,
          brand = EXCLUDED.brand,
          spec = EXCLUDED.spec,
          stock = EXCLUDED.stock,
          batches = EXCLUDED.batches;
      `;
    }
    console.log("Insert query succeeded!");

    // Verify
    const count = await sql`SELECT COUNT(*) FROM products`;
    console.log("Count in DB after insert:", count[0].count);

    // Clean up
    await sql`DELETE FROM products WHERE id = 'prod_test'`;
    console.log("Clean up succeeded.");
  } catch (error) {
    console.error("Query failed with error:", error);
  } finally {
    await sql.end();
  }
}

testSync();
