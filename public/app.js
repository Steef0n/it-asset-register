const form = document.getElementById("assetForm");
const tableBody = document.getElementById("assetTableBody");
const searchInput = document.getElementById("searchInput");

let assets = [];

async function loadAssets() {
    try {
        const response = await fetch("/api/assets");

        if (!response.ok) {
            throw new Error(`Failed to load assets: ${response.status}`);
        }

        assets = await response.json();
        renderAssets(assets);
    } catch (error) {
        console.error(error);
    }
}

function renderAssets(items) {
    tableBody.innerHTML = "";

    items.forEach((asset) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${asset.assetNumber}</td>
            <td>${asset.user}</td>
            <td>${asset.department}</td>
            <td>${asset.deviceType}</td>
            <td>${asset.serialNumber}</td>
            <td>${asset.warrantyExpiry}</td>
            <td>${asset.location}</td>
            <td>
                <button type="button" onclick="editAsset(${asset.id})">
                    Edit
                </button>
                <button type="button" onclick="deleteAsset(${asset.id})">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const asset = {
        assetNumber: document.getElementById("assetNumber").value,
        user: document.getElementById("user").value,
        department: document.getElementById("department").value,
        deviceType: document.getElementById("deviceType").value,
        serialNumber: document.getElementById("serialNumber").value,
        warrantyExpiry: document.getElementById("warrantyExpiry").value,
        location: document.getElementById("location").value
    };

    try {
        const response = await fetch("/api/assets", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(asset)
        });

        if (!response.ok) {
            throw new Error(`Failed to add asset: ${response.status}`);
        }

        form.reset();
        await loadAssets();
    } catch (error) {
        console.error(error);
    }
});

async function editAsset(id) {
    const asset = assets.find((item) => item.id === id);

    if (!asset) {
        return;
    }

    const updatedAsset = {
        assetNumber: prompt("Asset number:", asset.assetNumber),
        user: prompt("Assigned user:", asset.user),
        department: prompt("Department:", asset.department),
        deviceType: prompt("Device type:", asset.deviceType),
        serialNumber: prompt("Serial number:", asset.serialNumber),
        warrantyExpiry: prompt("Warranty expiry:", asset.warrantyExpiry),
        location: prompt("Location:", asset.location)
    };

    const response = await fetch(`/api/assets/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedAsset)
    });

    if (!response.ok) {
        console.error("Failed to update asset");
        return;
    }

    await loadAssets();
}

async function deleteAsset(id) {
    try {
        const response = await fetch(`/api/assets/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Failed to delete asset: ${response.status}`);
        }

        await loadAssets();
    } catch (error) {
        console.error(error);
    }
}

searchInput.addEventListener("input", () => {
    const term = searchInput.value.toLowerCase();

    const filtered = assets.filter((asset) =>
        Object.values(asset).some((value) =>
            String(value).toLowerCase().includes(term)
        )
    );

    renderAssets(filtered);
});

loadAssets();