async function testEndpoints() {
  try {
    console.log("Fetching /api/data from local server...");
    const res = await fetch("http://localhost:3001/api/data");
    const data = await res.json();
    console.log("Success! Status:", res.status);
    console.log("Products loaded from DB:", data.products?.length || 0);
  } catch (err) {
    console.error("API call failed:", err);
  }
}
testEndpoints();
