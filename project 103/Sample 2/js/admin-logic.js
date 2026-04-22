// --- LOCATION RESTRICTION LOGIC ---
const restrictedZipCodes = ["110001", "110002"]; // Example Blacklist

function checkDeliveryEligibility(userZip) {
    if (restrictedZipCodes.includes(userZip)) {
        alert("Sorry! We are currently not delivering to this location.");
        return false;
    }
    return true;
}

// --- MENU MANAGEMENT (Admin Side) ---
let menuItems = [];

function addNewItem(id, name, price, type) {
    const newItem = { id, name, price, type };
    menuItems.push(newItem);
    console.log("Item Added to Menu:", newItem);
    // In a real app, this would send a POST request to your database
}

// --- OFFER UPDATE LOGIC ---
function pushNewOffer(title, subtitle) {
    // Logic to update the 'offers' array in main.js
    console.log(`New Offer Pushed: ${title} - ${subtitle}`);
    alert("Offer is now live on the homepage slider!");
}

// --- THERMAL PRINTER TRIGGER ---
function autoPrintOnOrder(orderId) {
    console.log(`Checking for Order ${orderId}...`);
    // Connect to printing.js logic
    const dummyOrder = { id: orderId, item: "Paneer Pizza", price: "249" };
    printReceipt(dummyOrder); 
}