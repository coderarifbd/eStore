import postgres from 'postgres';

const DATABASE_URL = "postgresql://neondb_owner:npg_NcGoRyg6k9Jq@ep-raspy-recipe-ax20vp9q-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = postgres(DATABASE_URL, { ssl: 'require' });

async function main() {
  const suppliers = [
    { id: 'sup_1', name: 'মেসার্স বিআরবি ক্যাবলস এজেন্সি (M/S BRB Agency)', phone: '01711-000111', address: 'নবাবপুর, ঢাকা', balanceDue: 12500 },
    { id: 'sup_2', name: 'সুপার স্টার ইলেকট্রনিক্স লিমিটেড', phone: '01819-222333', address: 'স্টেডিয়াম মার্কেট, ঢাকা', balanceDue: 0 },
    { id: 'sup_3', name: 'ওয়ালটন ইলেকট্রিক্যাল ডিস্ট্রিবিউটর', phone: '01912-333444', address: 'মালিবাগ, ঢাকা', balanceDue: 4500 }
  ];

  console.log("Syncing suppliers into Neon DB...");
  for (let sup of suppliers) {
    await sql`
      INSERT INTO suppliers (id, name, phone, address, balance_due)
      VALUES (${sup.id}, ${sup.name}, ${sup.phone}, ${sup.address}, ${sup.balanceDue})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        address = EXCLUDED.address,
        balance_due = EXCLUDED.balance_due
    `;
  }

  const result = await sql`SELECT * FROM suppliers`;
  console.log("Neon DB Suppliers Table Row Count:", result.length);
  console.log(result);
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
