import postgres from 'postgres';
import { verifyToken, getTokenFromRequest, getDbUrl } from './auth-utils.js';

let sql;
function getSql() {
  if (!sql) {
    sql = postgres(getDbUrl(), { ssl: 'require', max: 1 });
  }
  return sql;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Verify authentication
  const token = getTokenFromRequest(req);
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const sqlClient = getSql();
    
    // 1. Fetch store_state JSON as baseline
    const stateResult = await sqlClient`SELECT data FROM store_state WHERE id = 1`;
    const stateData = (stateResult.length > 0 && stateResult[0].data) ? stateResult[0].data : {};

    // 2. Query suppliers relational table
    try {
      const dbSuppliers = await sqlClient`SELECT id, name, phone, address, balance_due AS "balanceDue" FROM suppliers`;
      if (Array.isArray(dbSuppliers)) {
        stateData.suppliers = dbSuppliers.map(s => ({
          id: s.id,
          name: s.name,
          phone: s.phone,
          address: s.address,
          balanceDue: Number(s.balanceDue || 0)
        }));
      }
    } catch (e) {
      console.warn("Could not query suppliers table directly, fallback to store_state", e);
    }

    // 3. Query employees relational table
    try {
      const dbEmployees = await sqlClient`SELECT id, name, phone, designation, monthly_salary AS "monthlySalary", status, join_date AS "joinDate" FROM employees`;
      if (Array.isArray(dbEmployees)) {
        stateData.employees = dbEmployees.map(emp => ({
          ...emp,
          monthlySalary: Number(emp.monthlySalary || 0)
        }));
      }
    } catch (e) {}

    // 4. Query expenses relational table
    try {
      const dbExpenses = await sqlClient`SELECT id, category, amount, date, notes, paid_by AS "paidBy" FROM expenses`;
      if (Array.isArray(dbExpenses)) {
        stateData.expenses = dbExpenses.map(exp => ({
          ...exp,
          amount: Number(exp.amount || 0)
        }));
      }
    } catch (e) {}

    return res.status(200).json(stateData);
  } catch (error) {
    console.error('GET /api/data error:', error);
    return res.status(500).json({ error: error.message });
  }
}
