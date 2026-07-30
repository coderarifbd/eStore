import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require' });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not set in environment variables.' });
  }

  const { products, sales, expenses, suppliers, salaryTx, employees, purchases } = req.body;

  try {
    // 1. Sync products
    if (products !== undefined) {
      if (products.length > 0) {
        const ids = products.map(p => p.id);
        await sql`DELETE FROM products WHERE id != ALL(${ids})`;
        for (let p of products) {
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
              batches = EXCLUDED.batches
          `;
        }
      } else {
        await sql`DELETE FROM products`;
      }
    }

    // 2. Sync sales
    if (sales !== undefined) {
      if (sales.length > 0) {
        const ids = sales.map(s => s.id);
        await sql`DELETE FROM sales WHERE id != ALL(${ids})`;
        for (let s of sales) {
          await sql`
            INSERT INTO sales (id, date, customer_name, customer_phone, customer_address, items, sub_total, discount, grand_total, paid_amount, due_amount, total_cost_price)
            VALUES (${s.id}, ${new Date(s.date)}, ${s.customerName || null}, ${s.customerPhone || null}, ${s.customerAddress || null}, ${JSON.stringify(s.items || [])}, ${s.subTotal || 0}, ${s.discount || 0}, ${s.grandTotal || 0}, ${s.paidAmount || 0}, ${s.dueAmount || 0}, ${s.totalCostPrice || 0})
            ON CONFLICT (id) DO UPDATE SET
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

    // 3. Sync expenses
    if (expenses !== undefined) {
      if (expenses.length > 0) {
        const ids = expenses.map(e => e.id);
        await sql`DELETE FROM expenses WHERE id != ALL(${ids})`;
        for (let e of expenses) {
          await sql`
            INSERT INTO expenses (id, category, amount, date, notes, paid_by)
            VALUES (${e.id}, ${e.category}, ${e.amount}, ${e.date}, ${e.notes || null}, ${e.paidBy || 'ক্যাশ'})
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

    // 4. Sync suppliers
    if (suppliers !== undefined) {
      if (suppliers.length > 0) {
        const ids = suppliers.map(s => s.id);
        await sql`DELETE FROM suppliers WHERE id != ALL(${ids})`;
        for (let sup of suppliers) {
          await sql`
            INSERT INTO suppliers (id, name, phone, address, balance_due)
            VALUES (${sup.id}, ${sup.name}, ${sup.phone || null}, ${sup.address || null}, ${sup.balanceDue || 0})
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

    // 5. Sync salary transactions
    if (salaryTx !== undefined) {
      if (salaryTx.length > 0) {
        const ids = salaryTx.map(s => s.id);
        await sql`DELETE FROM salary_tx WHERE id != ALL(${ids})`;
        for (let st of salaryTx) {
          await sql`
            INSERT INTO salary_tx (id, employee_id, employee_name, month_year, type, amount, date, notes)
            VALUES (${st.id}, ${st.employeeId}, ${st.employeeName}, ${st.monthYear}, ${st.type}, ${st.amount}, ${st.date}, ${st.notes || null})
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

    // 6. Sync employees
    if (employees !== undefined) {
      if (employees.length > 0) {
        const ids = employees.map(e => e.id);
        await sql`DELETE FROM employees WHERE id != ALL(${ids})`;
        for (let emp of employees) {
          await sql`
            INSERT INTO employees (id, name, phone, designation, monthly_salary, status, join_date)
            VALUES (${emp.id}, ${emp.name}, ${emp.phone || null}, ${emp.designation || null}, ${emp.monthlySalary || 0}, ${emp.status || 'Active'}, ${emp.joinDate || null})
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

    // 7. Sync purchases
    if (purchases !== undefined) {
      if (purchases.length > 0) {
        const ids = purchases.map(p => p.id);
        await sql`DELETE FROM purchases WHERE id != ALL(${ids})`;
        for (let pur of purchases) {
          await sql`
            INSERT INTO purchases (id, date, supplier_id, supplier_name, items, grand_total, paid_amount, due_amount)
            VALUES (${pur.id}, ${pur.date}, ${pur.supplierId || null}, ${pur.supplierName || null}, ${JSON.stringify(pur.items || [])}, ${pur.grandTotal || 0}, ${pur.paidAmount || 0}, ${pur.dueAmount || 0})
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Sync error:', error);
    return res.status(500).json({ error: error.message });
  }
}
