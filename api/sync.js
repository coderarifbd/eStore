import postgres from 'postgres';
import { verifyToken, getTokenFromRequest, getDbUrl } from './auth-utils.js';

const sql = postgres(getDbUrl(), { ssl: 'require', max: 1 });

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // Verify authentication
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const stateData = req.body || {};

    // 1. Save to store_state (Full JSON backup)
    await sql`
      INSERT INTO store_state (id, data, updated_at)
      VALUES (1, ${sql.json(stateData)}, CURRENT_TIMESTAMP)
      ON CONFLICT (id) DO UPDATE SET
        data = EXCLUDED.data,
        updated_at = CURRENT_TIMESTAMP
    `;

    // 2. Sync employees table
    if (Array.isArray(stateData.employees)) {
      if (stateData.employees.length > 0) {
        const ids = stateData.employees.map(e => e.id);
        await sql`DELETE FROM employees WHERE NOT (id = ANY(${ids}))`;
        for (let emp of stateData.employees) {
          await sql`
            INSERT INTO employees (id, name, phone, designation, monthly_salary, status, join_date)
            VALUES (
              ${emp.id},
              ${emp.name || ''},
              ${emp.phone || null},
              ${emp.designation || null},
              ${Number(emp.salary || emp.monthlySalary || emp.monthly_salary || 0)},
              ${emp.status || 'Active'},
              ${emp.joinDate || emp.join_date || null}
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              phone = EXCLUDED.phone,
              designation = EXCLUDED.designation,
              monthly_salary = EXCLUDED.monthly_salary,
              status = EXCLUDED.status,
              join_date = EXCLUDED.join_date
          `;
        }
      } else {
        await sql`DELETE FROM employees`;
      }
    }

    // 3. Sync suppliers table
    if (Array.isArray(stateData.suppliers)) {
      if (stateData.suppliers.length > 0) {
        const ids = stateData.suppliers.map(s => s.id);
        await sql`DELETE FROM suppliers WHERE NOT (id = ANY(${ids}))`;
        for (let sup of stateData.suppliers) {
          await sql`
            INSERT INTO suppliers (id, name, phone, address, balance_due)
            VALUES (
              ${sup.id},
              ${sup.name || ''},
              ${sup.phone || null},
              ${sup.address || null},
              ${Number(sup.balanceDue || sup.balance_due || 0)}
            )
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              phone = EXCLUDED.phone,
              address = EXCLUDED.address,
              balance_due = EXCLUDED.balance_due
          `;
        }
      } else {
        await sql`DELETE FROM suppliers`;
      }
    }

    // 4. Sync sales table
    if (Array.isArray(stateData.sales)) {
      if (stateData.sales.length > 0) {
        const ids = stateData.sales.map(s => s.id);
        await sql`DELETE FROM sales WHERE NOT (id = ANY(${ids}))`;
        for (let s of stateData.sales) {
          await sql`
            INSERT INTO sales (id, date, customer_name, customer_phone, customer_address, items, sub_total, discount, grand_total, paid_amount, due_amount, total_cost_price)
            VALUES (
              ${s.id},
              ${s.date ? new Date(s.date) : new Date()},
              ${s.customerName || null},
              ${s.customerPhone || null},
              ${s.customerAddress || null},
              ${sql.json(s.items || [])},
              ${Number(s.subtotal || 0)},
              ${Number(s.discountValue || s.discount || 0)},
              ${Number(s.grandTotal || 0)},
              ${Number(s.paidAmount || 0)},
              ${Number(s.dueAmount || 0)},
              ${Number(s.costOfGoodsSold || 0)}
            )
            ON CONFLICT (id) DO UPDATE SET
              date = EXCLUDED.date,
              customer_name = EXCLUDED.customer_name,
              customer_phone = EXCLUDED.customer_phone,
              customer_address = EXCLUDED.customer_address,
              items = EXCLUDED.items,
              sub_total = EXCLUDED.sub_total,
              discount = EXCLUDED.discount,
              grand_total = EXCLUDED.grand_total,
              paid_amount = EXCLUDED.paid_amount,
              due_amount = EXCLUDED.due_amount,
              total_cost_price = EXCLUDED.total_cost_price
          `;
        }
      } else {
        await sql`DELETE FROM sales`;
      }
    }

    // 5. Sync purchases table
    if (Array.isArray(stateData.purchases)) {
      if (stateData.purchases.length > 0) {
        const ids = stateData.purchases.map(p => p.id);
        await sql`DELETE FROM purchases WHERE NOT (id = ANY(${ids}))`;
        for (let p of stateData.purchases) {
          await sql`
            INSERT INTO purchases (id, date, supplier_id, supplier_name, items, grand_total, paid_amount, due_amount)
            VALUES (
              ${p.id},
              ${p.date ? new Date(p.date) : new Date()},
              ${p.supplierId || null},
              ${p.supplierName || null},
              ${sql.json(p.items || [])},
              ${Number(p.grandTotal || 0)},
              ${Number(p.paidAmount || 0)},
              ${Number(p.dueAmount || 0)}
            )
            ON CONFLICT (id) DO UPDATE SET
              date = EXCLUDED.date,
              supplier_id = EXCLUDED.supplier_id,
              supplier_name = EXCLUDED.supplier_name,
              items = EXCLUDED.items,
              grand_total = EXCLUDED.grand_total,
              paid_amount = EXCLUDED.paid_amount,
              due_amount = EXCLUDED.due_amount
          `;
        }
      } else {
        await sql`DELETE FROM purchases`;
      }
    }

    // 6. Sync expenses table
    if (Array.isArray(stateData.expenses)) {
      if (stateData.expenses.length > 0) {
        const ids = stateData.expenses.map(e => e.id);
        await sql`DELETE FROM expenses WHERE NOT (id = ANY(${ids}))`;
        for (let e of stateData.expenses) {
          await sql`
            INSERT INTO expenses (id, category, amount, date, notes, paid_by)
            VALUES (
              ${e.id},
              ${e.category || null},
              ${Number(e.amount || 0)},
              ${e.date ? new Date(e.date) : new Date()},
              ${e.notes || null},
              ${e.paidBy || null}
            )
            ON CONFLICT (id) DO UPDATE SET
              category = EXCLUDED.category,
              amount = EXCLUDED.amount,
              date = EXCLUDED.date,
              notes = EXCLUDED.notes,
              paid_by = EXCLUDED.paid_by
          `;
        }
      } else {
        await sql`DELETE FROM expenses`;
      }
    }

    // 7. Sync salary_tx table
    if (Array.isArray(stateData.salaryTx)) {
      if (stateData.salaryTx.length > 0) {
        const ids = stateData.salaryTx.map(st => st.id);
        await sql`DELETE FROM salary_tx WHERE NOT (id = ANY(${ids}))`;
        for (let st of stateData.salaryTx) {
          await sql`
            INSERT INTO salary_tx (id, employee_id, employee_name, month_year, type, amount, date, notes)
            VALUES (
              ${st.id},
              ${st.employeeId || null},
              ${st.employeeName || null},
              ${st.monthYear || st.month || null},
              ${st.type || null},
              ${Number(st.amount || 0)},
              ${st.date ? new Date(st.date) : new Date()},
              ${st.notes || null}
            )
            ON CONFLICT (id) DO UPDATE SET
              employee_id = EXCLUDED.employee_id,
              employee_name = EXCLUDED.employee_name,
              month_year = EXCLUDED.month_year,
              type = EXCLUDED.type,
              amount = EXCLUDED.amount,
              date = EXCLUDED.date,
              notes = EXCLUDED.notes
          `;
        }
      } else {
        await sql`DELETE FROM salary_tx`;
      }
    }

    // 8. Sync products table
    if (Array.isArray(stateData.products)) {
      if (stateData.products.length > 0) {
        const ids = stateData.products.map(p => p.id);
        await sql`DELETE FROM products WHERE NOT (id = ANY(${ids}))`;
        for (let p of stateData.products) {
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
            ON CONFLICT (id) DO UPDATE SET
              name_bn = EXCLUDED.name_bn,
              name_en = EXCLUDED.name_en,
              category = EXCLUDED.category,
              brand = EXCLUDED.brand,
              spec = EXCLUDED.spec,
              stock = EXCLUDED.stock,
              batches = EXCLUDED.batches
          `;
        }
      } else {
        await sql`DELETE FROM products`;
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('POST /api/sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
