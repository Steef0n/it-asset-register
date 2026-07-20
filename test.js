const assert = require("assert");

async function runTests() {
    const response = await fetch("http://localhost:3000/api/assets");

    assert.strictEqual(
        response.status,
        200,
        "GET /api/assets should return HTTP 200"
    );

    const assets = await response.json();

    assert.ok(
        Array.isArray(assets),
        "GET /api/assets should return an array"
    );

    console.log("API test passed.");
}

runTests().catch((error) => {
    console.error("API test failed:", error.message);
    process.exit(1);
});