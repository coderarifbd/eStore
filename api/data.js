import postgres from 'postgres';

const DATABASE_URL = process.env.DATABASE_URL;

let sql = null;
if (DATABASE_URL) {
  sql = postgres(DATABASE_URL, { ssl: 'require' });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  if (!sql) {
    return res.status(500).json({ error: 'DATABASE_URL is not set in environment variables.' });
  }

  try {
    const productsRaw = await sql`SELECT * FROM products`;
    const salesRaw = await sql`SELECT * FROM sales ORDER BY date DESC`;
    const expensesRaw = await sql`SELECT * FROM expenses ORDER BY date DESC`;
    const suppliersRaw = await sql`SELECT * FROM suppliers`;
    const salaryTxRaw = await sql`SELECT * FROM salary_tx ORDER BY date DESC`;
    const employeesRaw = await sql`SELECT * FROM employees`;
    const purchasesRaw = await sql`SELECT * FROM purchases ORDER BY date DESC`;

    const products = productsRaw.map(p => ({
      id: p.id,
      nameBn: p.name_bn,
      nameEn: p.name_en,
      category: p.category,
      brand: p.brand,
      spec: p.spec,
      stock: Number(p.stock || 0),
      batches: typeof p.batches === 'string' ? JSON.parse(p.batches) : (p.batches || [])
    }));

    const sales = salesRaw.map(s => ({
      id: s.id,
      date: s.date instanceof Date ? s.date.toISOString() : s.date,
      customerName: s.customer_name,
      customerPhone: s.customer_phone,
      customerAddress: s.customer_address,
      items: typeof s.items === 'string' ? JSON.parse(s.items) : (s.items || []),
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
      items: typeof pur.items === 'string' ? JSON.parse(pur.items) : (pur.items || []),
      grandTotal: Number(pur.grand_total),
      paidAmount: Number(pur.paid_amount),
      dueAmount: Number(pur.due_amount)
    }));

    return res.status(200).json({ products, sales, expenses, suppliers, salaryTx, employees, purchases });
  } catch (error) {
    console.error('Error loading database records:', error);
    return res.status(500).json({ error: error.message });
  }
}
