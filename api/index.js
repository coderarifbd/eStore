import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import postgres from 'postgres';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL environment variable is missing!");
  process.exit(1);
}

const sql = postgres(DATABASE_URL, { ssl: 'require' });

// GET /api/data: Load all initial data from Postgres database
app.get('/api/data', async (req, res) => {
  try {
    const productsRaw = await sql`SELECT * FROM products`;
    const salesRaw = await sql`SELECT * FROM sales ORDER BY date DESC`;
    const expensesRaw = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    const suppliersRaw = await sql`SELECT * FROM suppliers`;
    const salaryTxRaw = await sql`SELECT * FROM salary_tx ORDER BY date DESC`;
    const employeesRaw = await sql`SELECT * FROM employees`;
    const purchasesRaw = await sql`SELECT * FROM purchases ORDER BY date DESC`;

    // Map database naming (snake_case) to client-side naming (camelCase)
    const products = productsRaw.map(p => ({
      id: p.id,
      nameBn: p.name_bn,
      nameEn: p.name_en,
      category: p.category,
      brand: p.brand,
      spec: p.spec,
      stock: p.stock,
      batches: p.batches || []
    }));

    const sales = salesRaw.map(s => ({
      id: s.id,
      date: s.date.toISOString(),
      customerName: s.customer_name,
      customerPhone: s.customer_phone,
      customerAddress: s.customer_address,
      items: s.items || [],
      subTotal: Number(s.sub_total),
      discount: Number(s.discount),
      grandTotal: Number(s.grand_total),
      paidAmount: Number(s.paid_amount),
      dueAmount: Number(s.due_amount),
      totalCostPrice: Number(s.total_cost_price)
    }));

    const expenses = expensesRaw.map(e => ({
      id: e.id,
      category: e.category,
      amount: Number(e.amount),
      date: e.date instanceof Date ? e.date.toISOString().split('T')[0] : e.date,
      notes: e.notes,
      paidBy: e.paid_by
    }));

    const suppliers = suppliersRaw.map(sup => ({
      id: sup.id,
      name: sup.name,
      phone: sup.phone,
      address: sup.address,
      balanceDue: Number(sup.balance_due)
    }));

    const salaryTx = salaryTxRaw.map(st => ({
      id: st.id,
      employeeId: st.employee_id,
      employeeName: st.employee_name,
      monthYear: st.month_year,
      type: st.type,
      amount: Number(st.amount),
      date: st.date instanceof Date ? st.date.toISOString().split('T')[0] : st.date,
      notes: st.notes
    }));

    const employees = employeesRaw.map(emp => ({
      id: emp.id,
      name: emp.name,
      phone: emp.phone,
      designation: emp.designation,
      monthlySalary: Number(emp.monthly_salary),
      status: emp.status,
      joinDate: emp.join_date instanceof Date ? emp.join_date.toISOString().split('T')[0] : emp.join_date
    }));

    const purchases = purchasesRaw.map(pur => ({
      id: pur.id,
      date: pur.date instanceof Date ? pur.date.toISOString().split('T')[0] : pur.date,
      supplierId: pur.supplier_id,
      supplierName: pur.supplier_name,
      items: pur.items || [],
      grandTotal: Number(pur.grand_total),
      paidAmount: Number(pur.paid_amount),
      dueAmount: Number(pur.due_amount)
    }));

    res.json({
      products,
      sales,
      expenses,
      suppliers,
      salaryTx,
      employees,
      purchases
    });
  } catch (error) {
    console.error("Error loading database records:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/sync: Universal sync endpoint to save updated state and delete removed records
app.post('/api/sync', async (req, res) => {
  const { products, sales, expenses, suppliers, salaryTx, employees, purchases } = req.body;

  try {
    // 1. Sync products
    if (products) {
      if (products.length > 0) {
        const ids = products.map(p => p.id);
        await sql`DELETE FROM products WHERE id NOT IN (${ids})`;
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
              batches = EXCLUDED.batches;
          `;
        }
      } else {
        await sql`DELETE FROM products`;
      }
    }

    // 2. Sync sales
    if (sales) {
      if (sales.length > 0) {
        const ids = sales.map(s => s.id);
        await sql`DELETE FROM sales WHERE id NOT IN (${ids})`;
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
              total_cost_price = EXCLUDED.total_cost_price;
          `;
        }
      } else {
        await sql`DELETE FROM sales`;
      }
    }

    // 3. Sync expenses
    if (expenses) {
      if (expenses.length > 0) {
        const ids = expenses.map(e => e.id);
        await sql`DELETE FROM expenses WHERE id NOT IN (${ids})`;
        for (let e of expenses) {
          await sql`
            INSERT INTO expenses (id, category, amount, date, notes, paid_by)
            VALUES (${e.id}, ${e.category}, ${e.amount}, ${e.date}, ${e.notes || null}, ${e.paidBy || 'ক্যাশ'})
            ON CONFLICT (id) DO UPDATE SET
              category = EXCLUDED.category,
              amount = EXCLUDED.amount,
              date = EXCLUDED.date,
              notes = EXCLUDED.notes,
              paid_by = EXCLUDED.paid_by;
          `;
        }
      } else {
        await sql`DELETE FROM expenses`;
      }
    }

    // 4. Sync suppliers
    if (suppliers) {
      if (suppliers.length > 0) {
        const ids = suppliers.map(sup => sup.id);
        await sql`DELETE FROM suppliers WHERE id NOT IN (${ids})`;
        for (let sup of suppliers) {
          await sql`
            INSERT INTO suppliers (id, name, phone, address, balance_due)
            VALUES (${sup.id}, ${sup.name}, ${sup.phone || null}, ${sup.address || null}, ${sup.balanceDue || 0})
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              phone = EXCLUDED.phone,
              address = EXCLUDED.address,
              balance_due = EXCLUDED.balance_due;
          `;
        }
      } else {
        await sql`DELETE FROM suppliers`;
      }
    }

    // 5. Sync salary transactions
    if (salaryTx) {
      if (salaryTx.length > 0) {
        const ids = salaryTx.map(st => st.id);
        await sql`DELETE FROM salary_tx WHERE id NOT IN (${ids})`;
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
              notes = EXCLUDED.notes;
          `;
        }
      } else {
        await sql`DELETE FROM salary_tx`;
      }
    }

    // 6. Sync employees
    if (employees) {
      if (employees.length > 0) {
        const ids = employees.map(emp => emp.id);
        await sql`DELETE FROM employees WHERE id NOT IN (${ids})`;
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
              join_date = EXCLUDED.join_date;
          `;
        }
      } else {
        await sql`DELETE FROM employees`;
      }
    }

    // 7. Sync purchases
    if (purchases) {
      if (purchases.length > 0) {
        const ids = purchases.map(pur => pur.id);
        await sql`DELETE FROM purchases WHERE id NOT IN (${ids})`;
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
              due_amount = EXCLUDED.due_amount;
          `;
        }
      } else {
        await sql`DELETE FROM purchases`;
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Sync database tables error:", error);
    res.status(500).json({ error: error.message });
  }
});

// For local running
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serverless API backend running on http://localhost:${PORT}`);
});

export default app;
