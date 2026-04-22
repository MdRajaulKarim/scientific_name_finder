// --- ADMIN AUTHENTICATION ---
function requireAdminLogin() {
    const adminPass = prompt("Enter admin password:");
    if (adminPass !== "admin123") {
        alert("❌ Unauthorized Access");
        window.location.href = "index.html";
    }
}

// --- LOCATION RESTRICTION LOGIC ---
const restrictedZipCodes = ["110001", "110002"];

function checkDeliveryEligibility(userZip) {
    if (restrictedZipCodes.includes(userZip)) {
        alert("❌ Sorry! We are currently not delivering to this location.");
        return false;
    }
    return true;
}

function updateRestrictions(newZips) {
    restrictedZipCodes.length = 0;
    newZips.split(',').forEach(zip => {
        restrictedZipCodes.push(zip.trim());
    });
    alert("✓ Restrictions updated successfully!");
}

// --- MENU MANAGEMENT ---
let menuItems = [
    { id: 101, name: "Paneer Pizza", price: 249, type: "veg" },
    { id: 102, name: "Chicken Burger", price: 189, type: "nonveg" }
];

function addNewItem(id, name, price, type) {
    if (!id || !name || !price || !type) {
        alert("❌ All fields are required");
        return;
    }

    const newItem = { id, name, price: parseInt(price), type };
    menuItems.push(newItem);
    console.log("✓ Item Added:", newItem);
    alert(`✓ ${name} added to menu!`);
}

function removeMenuItem(itemId) {
    const index = menuItems.findIndex(item => item.id === itemId);
    if (index > -1) {
        const removed = menuItems.splice(index, 1);
        console.log("✓ Item Removed:", removed[0]);
        alert(`✓ ${removed[0].name} removed from menu!`);
    }
}

// --- OFFER MANAGEMENT ---
let activeOffers = [
    "FLAT 20% OFF - Use: ZESTYFIRST",
    "WEEKEND SPECIAL - Free Garlic Bread on orders above ₹499"
];

function pushNewOffer(title, subtitle) {
    if (!title || !subtitle) {
        alert("❌ Please provide both title and description");
        return;
    }

    const offer = `${title} - ${subtitle}`;
    activeOffers.push(offer);
    console.log("✓ New Offer Pushed:", offer);
    alert("✓ Offer is now live on the homepage slider!");
}

// --- ORDER TRACKING ---
function trackOrder(orderId) {
    // This would connect to backend
    console.log(`🔍 Tracking order: ${orderId}`);
    window.location.href = `tracking.html?orderId=${orderId}`;
}