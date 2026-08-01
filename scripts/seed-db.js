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
    console.log('Seeding Neon database with initial store data across all relational tables...');
    
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

    // 2. Insert into employees table
    await sql`DELETE FROM employees`;
    for (let emp of INITIAL_EMPLOYEES) {
      await sql`
        INSERT INTO employees (id, name, phone, designation, monthly_salary, status, join_date)
        VALUES (
          ${emp.id},
          ${emp.name || ''},
          ${emp.phone || null},
          ${emp.designation || null},
          ${Number(emp.salary || emp.monthlySalary || 0)},
          ${emp.status || 'Active'},
          ${emp.joinDate || null}
        )
      `;
    }

    // 3. Insert into suppliers table
    await sql`DELETE FROM suppliers`;
    for (let sup of INITIAL_SUPPLIERS) {
      await sql`
        INSERT INTO suppliers (id, name, phone, address, balance_due)
        VALUES (
          ${sup.id},
          ${sup.name || ''},
          ${sup.phone || null},
          ${sup.address || null},
          ${Number(sup.balanceDue || 0)}
        )
      `;
    }

    // 4. Insert into products table
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
          ${sql.json(firstVariant.batches || [])}
        )
      `;
    }

    console.log('Successfully seeded Neon database tables (employees, suppliers, products, store_state)!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await sql.end();
  }
}

seed();
