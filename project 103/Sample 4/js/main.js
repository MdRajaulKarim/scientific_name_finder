/**
 * ZestyBite — main.js
 * Responsibilities:
 *  - Menu data store (item catalogue)
 *  - Hero Slider auto-play
 *  - Cart (add / remove / update qty) with sidebar
 *  - Search & filter logic
 *  - Scroll-triggered animations
 *  - Navbar scroll effect
 *  - Toast notification system
 *  - Smooth navigation helpers
 */

/* ============================================================
   1. MENU DATA STORE
   Add / edit items here. Images can be URLs or local paths.
   ============================================================ */
const MENU_DATA = [
  // ── STARTERS ──────────────────────────────────────────────
  {
    id: "ZB001",
    name: "Chicken 65",
    category: "Starters",
    type: "non-veg",
    price: 242,
    originalPrice: 279,
    description: "Crispy deep-fried chicken tossed with curry leaves, green chillies and a spiced tempering.",
    rating: 4.7,
    ratingCount: 487,
    badge: "Spicy 🌶️",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB002",
    name: "Chicken Dry Fry",
    category: "Starters",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Tender chicken pieces stir-fried with spices and peppers.",
    rating: 4.6,
    ratingCount: 342,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB003",
    name: "Chicken Finger",
    category: "Starters",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Crispy battered chicken strips, perfect as a snack or appetizer.",
    rating: 4.5,
    ratingCount: 210,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB004",
    name: "Chicken Manchurian",
    category: "Starters",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Indo-Chinese style chicken with tangy soy-based sauce.",
    rating: 4.6,
    ratingCount: 298,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB005",
    name: "Chicken Pakoda (H)",
    category: "Starters",
    type: "non-veg",
    price: 85,
    originalPrice: 98,
    description: "Half plate of spiced chicken fritters.",
    rating: 4.4,
    ratingCount: 165,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB006",
    name: "Chicken Pakoda (F)",
    category: "Starters",
    type: "non-veg",
    price: 163,
    originalPrice: 187,
    description: "Full plate of crispy chicken fritters.",
    rating: 4.5,
    ratingCount: 278,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB007",
    name: "Chicken Momo",
    category: "Starters",
    type: "non-veg",
    price: 110,
    originalPrice: 127,
    description: "Steamed dumplings filled with spiced chicken.",
    rating: 4.6,
    ratingCount: 312,
    badge: "",
    emoji: "🥟",
    img: ""
  },
  {
    id: "ZB008",
    name: "Chicken Spring Roll",
    category: "Starters",
    type: "non-veg",
    price: 145,
    originalPrice: 167,
    description: "Crispy rolls stuffed with seasoned chicken.",
    rating: 4.5,
    ratingCount: 224,
    badge: "",
    emoji: "🌮",
    img: ""
  },
  {
    id: "ZB009",
    name: "Paneer Spring Roll",
    category: "Starters",
    type: "veg",
    price: 157,
    originalPrice: 180,
    description: "Golden rolls stuffed with cottage cheese and vegetables.",
    rating: 4.4,
    ratingCount: 198,
    badge: "",
    emoji: "🌮",
    img: ""
  },
  {
    id: "ZB010",
    name: "Paneer Schezwan",
    category: "Starters",
    type: "veg",
    price: 145,
    originalPrice: 167,
    description: "Paneer tossed with Schezwan sauce and vegetables.",
    rating: 4.5,
    ratingCount: 211,
    badge: "",
    emoji: "🧀",
    img: ""
  },
  {
    id: "ZB011",
    name: "Fish Finger",
    category: "Starters",
    type: "non-veg",
    price: 194,
    originalPrice: 222,
    description: "Crispy battered fish strips.",
    rating: 4.6,
    ratingCount: 189,
    badge: "",
    emoji: "🐟",
    img: ""
  },
  {
    id: "ZB012",
    name: "Onion Pakoda",
    category: "Starters",
    type: "veg",
    price: 109,
    originalPrice: 125,
    description: "Crispy battered onion fritters.",
    rating: 4.3,
    ratingCount: 156,
    badge: "",
    emoji: "🧅",
    img: ""
  },
  {
    id: "ZB013",
    name: "Honey Potato",
    category: "Starters",
    type: "veg",
    price: 169,
    originalPrice: 195,
    description: "Crispy potato wedges drizzled with honey.",
    rating: 4.5,
    ratingCount: 267,
    badge: "",
    emoji: "🥔",
    img: ""
  },
  {
    id: "ZB014",
    name: "Mushroom Chilli Fry",
    category: "Starters",
    type: "veg",
    price: 182,
    originalPrice: 209,
    description: "Spiced mushrooms with green chillies.",
    rating: 4.6,
    ratingCount: 234,
    badge: "",
    emoji: "🍄",
    img: ""
  },
  {
    id: "ZB015",
    name: "Chilli Paneer Dry Fry",
    category: "Starters",
    type: "veg",
    price: 187,
    originalPrice: 216,
    description: "Paneer cubes tossed with chillies and soy sauce.",
    rating: 4.7,
    ratingCount: 302,
    badge: "Bestseller",
    emoji: "🧀",
    img: ""
  },
  {
    id: "ZB016",
    name: "Veg Manchurian",
    category: "Starters",
    type: "veg",
    price: 145,
    originalPrice: 167,
    description: "Indo-Chinese style vegetable balls.",
    rating: 4.5,
    ratingCount: 278,
    badge: "",
    emoji: "🥘",
    img: ""
  },
  {
    id: "ZB017",
    name: "Veg Pakoda",
    category: "Starters",
    type: "veg",
    price: 121,
    originalPrice: 139,
    description: "Mixed vegetable fritters.",
    rating: 4.4,
    ratingCount: 212,
    badge: "",
    emoji: "🥒",
    img: ""
  },

  // ── MAIN COURSE ────────────────────────────────────────────
  {
    id: "ZB018",
    name: "Chicken Masala",
    category: "Main Course",
    type: "non-veg",
    price: 230,
    originalPrice: 264,
    description: "Chicken in a rich spiced masala gravy.",
    rating: 4.8,
    ratingCount: 542,
    badge: "Most Loved",
    emoji: "🍛",
    img: ""
  },
  {
    id: "ZB019",
    name: "Chicken Tadka",
    category: "Main Course",
    type: "non-veg",
    price: 182,
    originalPrice: 209,
    description: "Chicken with aromatic tadka of cumin and curry leaves.",
    rating: 4.6,
    ratingCount: 287,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB020",
    name: "Butter Tadka",
    category: "Main Course",
    type: "veg",
    price: 109,
    originalPrice: 125,
    description: "Paneer in buttery tadka sauce.",
    rating: 4.5,
    ratingCount: 198,
    badge: "",
    emoji: "🧀",
    img: ""
  },
  {
    id: "ZB021",
    name: "Mix Tadka",
    category: "Main Course",
    type: "non-veg",
    price: 242,
    originalPrice: 278,
    description: "Mixed vegetables and paneer in tadka sauce.",
    rating: 4.6,
    ratingCount: 256,
    badge: "",
    emoji: "🥘",
    img: ""
  },
  {
    id: "ZB022",
    name: "Plain Tadka",
    category: "Main Course",
    type: "veg",
    price: 97,
    originalPrice: 111,
    description: "Simple tadka with just spices and onions.",
    rating: 4.3,
    ratingCount: 124,
    badge: "",
    emoji: "🥘",
    img: ""
  },
  {
    id: "ZB023",
    name: "Egg Tadka",
    category: "Main Course",
    type: "non-veg",
    price: 121,
    originalPrice: 139,
    description: "Boiled eggs in flavored tadka sauce.",
    rating: 4.4,
    ratingCount: 167,
    badge: "",
    emoji: "🥚",
    img: ""
  },
  {
    id: "ZB024",
    name: "Garlic Chicken Dry Fry",
    category: "Main Course",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Chicken stir-fried with garlic and peppers.",
    rating: 4.7,
    ratingCount: 298,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB025",
    name: "Honey Chicken",
    category: "Main Course",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Tender chicken glazed with honey.",
    rating: 4.6,
    ratingCount: 234,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB026",
    name: "Pepper Chicken",
    category: "Main Course",
    type: "non-veg",
    price: 266,
    originalPrice: 306,
    description: "Chicken cooked with black pepper and spices.",
    rating: 4.7,
    ratingCount: 312,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB027",
    name: "Crispy Chicken",
    category: "Main Course",
    type: "non-veg",
    price: 182,
    originalPrice: 209,
    description: "Golden fried chicken pieces.",
    rating: 4.6,
    ratingCount: 276,
    badge: "",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB028",
    name: "Crispy Chicken Baby",
    category: "Main Course",
    type: "non-veg",
    price: 242,
    originalPrice: 278,
    description: "Baby chicken pieces, crispy and tender.",
    rating: 4.7,
    ratingCount: 289,
    badge: "Bestseller",
    emoji: "🍗",
    img: ""
  },
  {
    id: "ZB029",
    name: "Soleted Chicken",
    category: "Main Course",
    type: "non-veg",
    price: 218,
    originalPrice: 251,
    description: "Chicken in a special sol-based sauce.",
    rating: 4.5,
    ratingCount: 201,
    badge: "",
    emoji: "🍗",
    img: ""
  },

  // ── RICE & BREADS ──────────────────────────────────────────
  {
    id: "ZB030",
    name: "Chicken Biryani (F)",
    category: "Rice & Breads",
    type: "non-veg",
    price: 330,
    originalPrice: 380,
    description: "Full portion of fragrant biryani with tender chicken.",
    rating: 4.9,
    ratingCount: 1245,
    badge: "Fan Favourite",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB031",
    name: "Chicken Biryani (H)",
    category: "Rice & Breads",
    type: "non-veg",
    price: 204,
    originalPrice: 234,
    description: "Half portion of chicken biryani.",
    rating: 4.8,
    ratingCount: 892,
    badge: "",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB032",
    name: "Chicken Dum Biryani",
    category: "Rice & Breads",
    type: "non-veg",
    price: 330,
    originalPrice: 380,
    description: "Traditional dum-cooked biryani with layered rice.",
    rating: 4.9,
    ratingCount: 1156,
    badge: "Best Seller",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB033",
    name: "Chicken Dum Biryani (Alt)",
    category: "Rice & Breads",
    type: "non-veg",
    price: 165,
    originalPrice: 189,
    description: "Alternative smaller portion of dum biryani.",
    rating: 4.7,
    ratingCount: 567,
    badge: "",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB034",
    name: "Paneer Biryani",
    category: "Rice & Breads",
    type: "veg",
    price: 209,
    originalPrice: 240,
    description: "Fragrant biryani with cottage cheese cubes.",
    rating: 4.6,
    ratingCount: 534,
    badge: "",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB035",
    name: "Veg Sizzler",
    category: "Rice & Breads",
    type: "veg",
    price: 266,
    originalPrice: 306,
    description: "Vegetables served sizzling on a hot plate.",
    rating: 4.5,
    ratingCount: 278,
    badge: "",
    emoji: "🍚",
    img: ""
  },
  {
    id: "ZB036",
    name: "Chicken Sizzler",
    category: "Rice & Breads",
    type: "non-veg",
    price: 327,
    originalPrice: 376,
    description: "Tender chicken served on a sizzling hot plate.",
    rating: 4.7,
    ratingCount: 456,
    badge: "",
    emoji: "🍚",
    img: ""
  },

  // ── NOODLES / CHOPSUEY ─────────────────────────────────────
  {
    id: "ZB037",
    name: "American Chopsuey",
    category: "Noodles",
    type: "non-veg",
    price: 194,
    originalPrice: 222,
    description: "Indo-Chinese noodle dish with chicken and vegetables.",
    rating: 4.5,
    ratingCount: 234,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB038",
    name: "American Corn",
    category: "Noodles",
    type: "veg",
    price: 182,
    originalPrice: 209,
    description: "Noodles with sweet corn kernels.",
    rating: 4.4,
    ratingCount: 189,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB039",
    name: "Italian Chopsuey",
    category: "Noodles",
    type: "veg",
    price: 194,
    originalPrice: 222,
    description: "Noodles with Italian herbs and vegetables.",
    rating: 4.5,
    ratingCount: 212,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB040",
    name: "Chicken Chowmein",
    category: "Noodles",
    type: "non-veg",
    price: 121,
    originalPrice: 139,
    description: "Stir-fried noodles with chicken.",
    rating: 4.6,
    ratingCount: 412,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB041",
    name: "Egg Chowmein",
    category: "Noodles",
    type: "non-veg",
    price: 97,
    originalPrice: 111,
    description: "Noodles with scrambled eggs.",
    rating: 4.4,
    ratingCount: 267,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB042",
    name: "Veg Chowmein",
    category: "Noodles",
    type: "veg",
    price: 85,
    originalPrice: 98,
    description: "Simple vegetable noodles.",
    rating: 4.3,
    ratingCount: 198,
    badge: "",
    emoji: "🍜",
    img: ""
  },
  {
    id: "ZB043",
    name: "Mix Chowmein",
    category: "Noodles",
    type: "non-veg",
    price: 182,
    originalPrice: 209,
    description: "Noodles with mixed vegetables and chicken.",
    rating: 4.6,
    ratingCount: 334,
    badge: "",
    emoji: "🍜",
    img: ""
  },

  // ── SNACKS / ROLLS ────────────────────────────────────────
  {
    id: "ZB044",
    name: "Chicken Burger",
    category: "Snacks",
    type: "non-veg",
    price: 165,
    originalPrice: 189,
    description: "Crispy chicken patty in soft burger buns.",
    rating: 4.5,
    ratingCount: 287,
    badge: "",
    emoji: "🍔",
    img: ""
  },
  {
    id: "ZB045",
    name: "Egg Burger",
    category: "Snacks",
    type: "non-veg",
    price: 109,
    originalPrice: 125,
    description: "Omelette and vegetables in burger buns.",
    rating: 4.3,
    ratingCount: 156,
    badge: "",
    emoji: "🍔",
    img: ""
  },
  {
    id: "ZB046",
    name: "Chicken Roll",
    category: "Snacks",
    type: "non-veg",
    price: 97,
    originalPrice: 111,
    description: "Chicken wrapped in paratha.",
    rating: 4.4,
    ratingCount: 234,
    badge: "",
    emoji: "🌯",
    img: ""
  },
  {
    id: "ZB047",
    name: "Egg Roll",
    category: "Snacks",
    type: "non-veg",
    price: 73,
    originalPrice: 84,
    description: "Scrambled eggs wrapped in paratha.",
    rating: 4.2,
    ratingCount: 145,
    badge: "",
    emoji: "🌯",
    img: ""
  },
  {
    id: "ZB048",
    name: "Chicken With Egg Roll",
    category: "Snacks",
    type: "non-veg",
    price: 109,
    originalPrice: 125,
    description: "Chicken and egg combined in paratha roll.",
    rating: 4.5,
    ratingCount: 201,
    badge: "",
    emoji: "🌯",
    img: ""
  },

  // ── PIZZA ──────────────────────────────────────────────────
  {
    id: "ZB049",
    name: "Blockbuster Pizza",
    category: "Pizza",
    type: "non-veg",
    price: 385,
    originalPrice: 442,
    description: "Pizza loaded with multiple toppings.",
    rating: 4.7,
    ratingCount: 567,
    badge: "Best Seller",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB050",
    name: "Chicken Pizza",
    category: "Pizza",
    type: "non-veg",
    price: 335,
    originalPrice: 442,
    description: "Pizza with grilled chicken and cheese.",
    rating: 4.6,
    ratingCount: 412,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB051",
    name: "Chicken Pizza (Alt)",
    category: "Pizza",
    type: "non-veg",
    price: 418,
    originalPrice: 481,
    description: "Premium chicken pizza with special sauce.",
    rating: 4.7,
    ratingCount: 289,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB052",
    name: "Corn Paneer Pizza (8\")",
    category: "Pizza",
    type: "veg",
    price: 347,
    originalPrice: 398,
    description: "8-inch pizza with corn and paneer.",
    rating: 4.5,
    ratingCount: 234,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB053",
    name: "Corn Veggies Pizza (8\")",
    category: "Pizza",
    type: "veg",
    price: 275,
    originalPrice: 317,
    description: "8-inch vegetable pizza with corn.",
    rating: 4.4,
    ratingCount: 198,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB054",
    name: "Onion Pizza (6\")",
    category: "Pizza",
    type: "veg",
    price: 132,
    originalPrice: 152,
    description: "6-inch pizza with caramelized onions.",
    rating: 4.3,
    ratingCount: 145,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB055",
    name: "Margherita Pizza (8\")",
    category: "Pizza",
    type: "veg",
    price: 248,
    originalPrice: 285,
    description: "Classic 8-inch pizza with tomato and cheese.",
    rating: 4.6,
    ratingCount: 567,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB056",
    name: "Paneer Veggies Pizza",
    category: "Pizza",
    type: "veg",
    price: 317,
    originalPrice: 364,
    description: "Pizza with paneer and assorted vegetables.",
    rating: 4.5,
    ratingCount: 289,
    badge: "",
    emoji: "🍕",
    img: ""
  },
  {
    id: "ZB057",
    name: "Loaded All In One Pizza",
    category: "Pizza",
    type: "non-veg",
    price: 440,
    originalPrice: 506,
    description: "Pizza loaded with everything you can think of.",
    rating: 4.8,
    ratingCount: 612,
    badge: "Must Try",
    emoji: "🍕",
    img: ""
  },

  // ── SEAFOOD ────────────────────────────────────────────────
  {
    id: "ZB058",
    name: "Prawns Golden Fry",
    category: "Seafood",
    type: "non-veg",
    price: 278,
    originalPrice: 320,
    description: "Golden fried prawns, crispy and tender.",
    rating: 4.8,
    ratingCount: 456,
    badge: "Chef's Pick",
    emoji: "🍤",
    img: ""
  },
  {
    id: "ZB059",
    name: "Fish Curry",
    category: "Seafood",
    type: "non-veg",
    price: 320,
    originalPrice: 380,
    description: "Fresh river fish simmered in tangy coconut curry.",
    rating: 4.7,
    ratingCount: 312,
    badge: "",
    emoji: "🐟",
    img: ""
  },
  {
    id: "ZB060",
    name: "Tandoori Fish",
    category: "Seafood",
    type: "non-veg",
    price: 340,
    originalPrice: 400,
    description: "Fish marinated in yogurt and spices, grilled in tandoor.",
    rating: 4.8,
    ratingCount: 289,
    badge: "Bestseller",
    emoji: "🐟",
    img: ""
  },
  {
    id: "ZB061",
    name: "Butter Garlic Prawns",
    category: "Seafood",
    type: "non-veg",
    price: 295,
    originalPrice: 350,
    description: "Juicy prawns in buttery garlic sauce.",
    rating: 4.7,
    ratingCount: 234,
    badge: "",
    emoji: "🍤",
    img: ""
  },

  // ── DESSERTS ───────────────────────────────────────────────
  {
    id: "ZB062",
    name: "Gulab Jamun",
    category: "Desserts",
    type: "veg",
    price: 80,
    originalPrice: 95,
    description: "Soft milk-solid dumplings soaked in rose-cardamom syrup.",
    rating: 4.8,
    ratingCount: 743,
    badge: "",
    emoji: "🍯",
    img: ""
  },
  {
    id: "ZB063",
    name: "Kulfi Falooda",
    category: "Desserts",
    type: "veg",
    price: 120,
    originalPrice: 140,
    description: "Saffron kulfi on rose falooda with basil seeds.",
    rating: 4.9,
    ratingCount: 412,
    badge: "Must Try",
    emoji: "🍦",
    img: ""
  },
  {
    id: "ZB064",
    name: "Rasgulla",
    category: "Desserts",
    type: "veg",
    price: 90,
    originalPrice: 110,
    description: "Soft cheese balls in light sugar syrup.",
    rating: 4.7,
    ratingCount: 298,
    badge: "",
    emoji: "🍡",
    img: ""
  },
  {
    id: "ZB065",
    name: "Kheer",
    category: "Desserts",
    type: "veg",
    price: 70,
    originalPrice: 85,
    description: "Creamy rice pudding with nuts and cardamom.",
    rating: 4.6,
    ratingCount: 267,
    badge: "",
    emoji: "🥣",
    img: ""
  },
  {
    id: "ZB066",
    name: "Jalebi",
    category: "Desserts",
    type: "veg",
    price: 60,
    originalPrice: 75,
    description: "Spiral-shaped crispy sweet soaked in sugar syrup.",
    rating: 4.5,
    ratingCount: 189,
    badge: "",
    emoji: "🍯",
    img: ""
  },

  // ── BEVERAGES ──────────────────────────────────────────────
  {
    id: "ZB067",
    name: "Mango Lassi",
    category: "Beverages",
    type: "veg",
    price: 90,
    originalPrice: 110,
    description: "Chilled yogurt with ripe Alphonso mango pulp.",
    rating: 4.7,
    ratingCount: 598,
    badge: "",
    emoji: "🥭",
    img: ""
  },
  {
    id: "ZB068",
    name: "Masala Chai",
    category: "Beverages",
    type: "veg",
    price: 60,
    originalPrice: 75,
    description: "Freshly brewed spiced tea with ginger and cardamom.",
    rating: 4.6,
    ratingCount: 1034,
    badge: "",
    emoji: "🍵",
    img: ""
  },
  {
    id: "ZB069",
    name: "Sweet Lassi",
    category: "Beverages",
    type: "veg",
    price: 70,
    originalPrice: 85,
    description: "Chilled sweet yogurt drink with cardamom.",
    rating: 4.5,
    ratingCount: 412,
    badge: "",
    emoji: "🥛",
    img: ""
  },
  {
    id: "ZB070",
    name: "Iced Coffee",
    category: "Beverages",
    type: "veg",
    price: 80,
    originalPrice: 95,
    description: "Chilled coffee with cream and ice.",
    rating: 4.6,
    ratingCount: 289,
    badge: "",
    emoji: "☕",
    img: ""
  },
  {
    id: "ZB071",
    name: "Fresh Lemonade",
    category: "Beverages",
    type: "veg",
    price: 50,
    originalPrice: 65,
    description: "Freshly squeezed lemon juice with mint.",
    rating: 4.4,
    ratingCount: 156,
    badge: "",
    emoji: "🍋",
    img: ""
  }
];

/* ============================================================
   2. HERO SLIDER DATA
   Managed by admin — stored in localStorage under 'zb_slides'
   ============================================================ */
const DEFAULT_SLIDES = [
  {
    id: "slide1",
    badge: "Limited Time Offer",
    title: "Taste the <em>Art</em> of Indian Cuisine",
    desc: "From smoky tandoor classics to slow-simmered curries, every dish tells a story crafted for your table.",
    cta1: { text: "Explore Menu", href: "menu.html" },
    cta2: { text: "Book a Table", href: "booking.html" },
    bgColor: "linear-gradient(135deg, #1a0a00 0%, #3d1500 40%, #8B3A00 100%)",
    emoji: "🍛"
  },
  {
    id: "slide2",
    badge: "Weekend Special — 20% OFF",
    title: "Exclusive <em>Weekend Feast</em>",
    desc: "Get 20% off on all main course orders every Saturday & Sunday. Use code WEEKEND20 at checkout.",
    cta1: { text: "Order Now", href: "menu.html" },
    cta2: { text: "View Offers", href: "menu.html#offers" },
    bgColor: "linear-gradient(135deg, #0a1500 0%, #1a2d0a 40%, #2d5a1a 100%)",
    emoji: "🎉"
  },
  {
    id: "slide3",
    badge: "New on Menu",
    title: "Introducing <em>Coastal Specials</em>",
    desc: "Fresh seafood delicacies straight from the Malabar coast — Prawn Koliwada, Fish Curry & more.",
    cta1: { text: "See New Items", href: "menu.html?filter=New" },
    cta2: { text: "Reserve Table", href: "booking.html" },
    bgColor: "linear-gradient(135deg, #00101a 0%, #001f3f 40%, #0a3060 100%)",
    emoji: "🦐"
  }
];

/* ============================================================
   3. CART STATE
   ============================================================ */
let cart = JSON.parse(localStorage.getItem('zb_cart') || '[]');

function saveCart() {
  localStorage.setItem('zb_cart', JSON.stringify(cart));
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

/** Add item to cart or increase quantity */
function addToCart(itemId) {
  const item = MENU_DATA.find(m => m.id === itemId);
  if (!item) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, qty: 1, emoji: item.emoji, type: item.type });
  }
  saveCart();
  updateCartUI();
  showToast(`${item.emoji} ${item.name} added to cart!`, 'success');
}

/** Remove item completely from cart */
function removeFromCart(itemId) {
  cart = cart.filter(c => c.id !== itemId);
  saveCart();
  updateCartUI();
}

/** Update item quantity; remove if qty reaches 0 */
function updateCartQty(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(itemId);
  else { saveCart(); updateCartUI(); }
}

/** Re-render every cart-related UI element */
function updateCartUI() {
  const count = getCartCount();
  const total = getCartTotal();

  // Update all cart count badges in navbar
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count || '0';
  });

  // Render cart items list
  const listEl = document.getElementById('cartItemsList');
  const emptyEl = document.getElementById('cartEmpty');
  const footerEl = document.getElementById('cartFooter');

  if (!listEl) return;

  if (cart.length === 0) {
    listEl.innerHTML = '';
    if (emptyEl)  emptyEl.style.display = 'block';
    if (footerEl) footerEl.style.display = 'none';
    return;
  }

  if (emptyEl)  emptyEl.style.display  = 'none';
  if (footerEl) footerEl.style.display = 'block';

  listEl.innerHTML = cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}">
      <div class="cart-item-img" style="background:var(--color-base-dark);display:flex;align-items:center;justify-content:center;font-size:2rem;">
        ${item.emoji}
      </div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
      </div>
      <div class="qty-controls" style="margin-left:auto;">
        <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">−</button>
        <span class="qty-number">${item.qty}</span>
        <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
      </div>
    </div>
  `).join('');

  // Update totals
  const subtotal = total;
  const delivery = subtotal > 400 ? 0 : 40;
  const taxes    = Math.round(subtotal * 0.05);
  const grand    = subtotal + delivery + taxes;

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('cartSubtotal', `₹${subtotal}`);
  setEl('cartDelivery', delivery === 0 ? 'FREE' : `₹${delivery}`);
  setEl('cartTaxes',    `₹${taxes}`);
  setEl('cartGrand',    `₹${grand}`);
}

/* ============================================================
   4. CART SIDEBAR — open / close
   ============================================================ */
function openCart() {
  document.getElementById('cartSidebar')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   5. HERO SLIDER
   ============================================================ */
let sliderInterval = null;
let currentSlide = 0;

function initSlider() {
  const container = document.getElementById('heroSlider');
  if (!container) return;

  // Load slides from localStorage (admin-managed) or use defaults
  const saved = localStorage.getItem('zb_slides');
  const slides = saved ? JSON.parse(saved) : DEFAULT_SLIDES;

  // Render slides
  container.innerHTML = slides.map((s, i) => `
    <div class="slide${i === 0 ? ' active' : ''}" id="slide-${i}">
      <div class="slide-bg-fallback" style="background:${s.bgColor};position:absolute;inset:0;"></div>
      <div class="slide-overlay"></div>
      <div style="position:absolute;inset:0;display:flex;align-items:center;padding:0 max(24px, 5vw);max-width:1280px;margin:0 auto;left:50%;transform:translateX(-50%);">
        <div class="slide-text">
          <span class="slide-badge">${s.badge}</span>
          <h1 class="slide-title">${s.title}</h1>
          <p class="slide-desc">${s.desc}</p>
          <div class="slide-actions">
            <a href="${s.cta1.href}" class="btn btn-primary btn-lg">${s.cta1.text}</a>
            <a href="${s.cta2.href}" class="btn btn-white btn-lg">${s.cta2.text}</a>
          </div>
        </div>
        <div style="position:absolute;right:10%;font-size:8rem;opacity:0.15;pointer-events:none;user-select:none;">${s.emoji}</div>
      </div>
    </div>
  `).join('');

  // Render dots
  const dotsEl = document.getElementById('sliderDots');
  if (dotsEl) {
    dotsEl.innerHTML = slides.map((_, i) => `
      <span class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})"></span>
    `).join('');
  }

  // Start autoplay
  startSliderAuto(slides.length);
}

function startSliderAuto(total) {
  clearInterval(sliderInterval);
  sliderInterval = setInterval(() => nextSlide(total), 5000);
}

function goToSlide(index) {
  const slides = document.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.dot');
  if (!slides.length) return;

  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');

  // Restart autoplay timer
  startSliderAuto(slides.length);
}

function nextSlide(total) { goToSlide(currentSlide + 1); }
function prevSlide(total) {
  const slides = document.querySelectorAll('.slide');
  goToSlide(currentSlide - 1);
}

/* ============================================================
   6. MENU RENDERING
   ============================================================ */
function renderMenu(items, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:var(--space-3xl);color:var(--color-text-muted);">
        <div style="font-size:3rem;margin-bottom:var(--space-md);">🔍</div>
        <h3 style="font-size:1.2rem;margin-bottom:var(--space-sm);">No items found</h3>
        <p>Try a different search or filter</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => {
    const cartItem = cart.find(c => c.id === item.id);
    const inCart   = !!cartItem;
    const stars    = renderStars(item.rating);

    return `
      <div class="dish-card fade-up" data-id="${item.id}" data-type="${item.type}" data-category="${item.category}">
        <div class="dish-card-img">
          ${item.img
            ? `<img src="${item.img}" alt="${item.name}" loading="lazy">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:var(--color-base-dark);">${item.emoji}</div>`
          }
          ${item.badge ? `<span class="dish-badge">${item.badge}</span>` : ''}
          <span class="food-type-badge ${item.type === 'veg' ? 'veg' : 'non-veg'}"></span>
        </div>
        <div class="dish-card-body">
          <div class="dish-meta">
            <span class="dish-category">${item.category}</span>
            <div class="dish-rating">
              <span class="stars">${stars}</span>
              <span class="rating-count">(${item.ratingCount})</span>
            </div>
          </div>
          <h4 class="dish-name">${item.name}</h4>
          <p class="dish-desc">${item.description}</p>
          <div class="dish-id">ID: ${item.id}</div>
          <div class="dish-footer">
            <div>
              ${item.originalPrice ? `<span class="dish-price-original">₹${item.originalPrice}</span>` : ''}
              <span class="dish-price">₹${item.price}</span>
            </div>
            ${inCart
              ? `<div class="qty-controls">
                   <button class="qty-btn" onclick="updateCartQty('${item.id}',-1)">−</button>
                   <span class="qty-number" id="qty-${item.id}">${cartItem.qty}</span>
                   <button class="qty-btn" onclick="updateCartQty('${item.id}',1)">+</button>
                 </div>`
              : `<button class="btn-add" onclick="addToCartFromMenu('${item.id}', this)">ADD</button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Trigger scroll animations on newly rendered cards
  observeFadeUps();
}

/** Render ★ stars from numeric rating */
function renderStars(rating) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty);
}

/** Add to cart and swap ADD → qty controls in card */
function addToCartFromMenu(itemId, btn) {
  addToCart(itemId);
  // Replace ADD button with qty controls
  const footer = btn.parentElement;
  const item   = MENU_DATA.find(m => m.id === itemId);
  const cartItem = cart.find(c => c.id === itemId);
  if (!footer || !item || !cartItem) return;
  footer.innerHTML = footer.innerHTML.replace(
    btn.outerHTML,
    `<div class="qty-controls">
       <button class="qty-btn" onclick="updateCartQty('${itemId}',-1);rerenderQty('${itemId}')">−</button>
       <span class="qty-number" id="qty-${itemId}">${cartItem.qty}</span>
       <button class="qty-btn" onclick="updateCartQty('${itemId}',1);rerenderQty('${itemId}')">+</button>
     </div>`
  );
}

/** Sync qty display on menu card after update */
function rerenderQty(itemId) {
  const cartItem = cart.find(c => c.id === itemId);
  const el = document.getElementById(`qty-${itemId}`);
  if (el && cartItem) el.textContent = cartItem.qty;
  // If 0, re-render the whole card region
  if (!cartItem) {
    const card = document.querySelector(`.dish-card[data-id="${itemId}"] .dish-footer`);
    if (card) {
      const item = MENU_DATA.find(m => m.id === itemId);
      if (item) {
        card.innerHTML = `
          <div>
            ${item.originalPrice ? `<span class="dish-price-original">₹${item.originalPrice}</span>` : ''}
            <span class="dish-price">₹${item.price}</span>
          </div>
          <button class="btn-add" onclick="addToCartFromMenu('${item.id}', this)">ADD</button>
        `;
      }
    }
  }
}

/* ============================================================
   7. SEARCH & FILTER
   ============================================================ */
let activeFilters = { search: '', type: 'all', category: 'all' };

function initSearchFilter() {
  const searchInput = document.getElementById('menuSearch');
  const filterChips = document.querySelectorAll('.filter-chip');

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      activeFilters.search = e.target.value.toLowerCase().trim();
      applyFilters();
    });
  }

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const filterType = chip.dataset.filterType;  // 'type' or 'category'
      const filterVal  = chip.dataset.filterValue;

      if (filterType === 'type') {
        document.querySelectorAll('.filter-chip[data-filter-type="type"]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilters.type = filterVal;
      } else if (filterType === 'category') {
        document.querySelectorAll('.filter-chip[data-filter-type="category"]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilters.category = filterVal;
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = [...MENU_DATA];

  // Search by name or ID
  if (activeFilters.search) {
    filtered = filtered.filter(item =>
      item.name.toLowerCase().includes(activeFilters.search) ||
      item.id.toLowerCase().includes(activeFilters.search) ||
      item.category.toLowerCase().includes(activeFilters.search)
    );
  }

  // Type filter (veg / non-veg / all)
  if (activeFilters.type !== 'all') {
    filtered = filtered.filter(item => item.type === activeFilters.type);
  }

  // Category filter
  if (activeFilters.category !== 'all') {
    filtered = filtered.filter(item => item.category === activeFilters.category);
  }

  renderMenu(filtered, 'menuGrid');
}

/* ============================================================
   8. SCROLL ANIMATIONS (IntersectionObserver)
   ============================================================ */
function observeFadeUps() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   9. NAVBAR — scroll effect
   ============================================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Mark active link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll shadow
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  // Hamburger toggle
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    // Close on link click
    mobileNav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => mobileNav.classList.remove('open'))
    );
  }
}

/* ============================================================
   10. TOAST NOTIFICATION SYSTEM
   ============================================================ */
function showToast(message, type = 'success', duration = 3000) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-msg">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
}

/* ============================================================
   11. MODAL HELPERS
   ============================================================ */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/* ============================================================
   12. USER SESSION HELPERS
   ============================================================ */
function getCurrentUser() {
  const u = localStorage.getItem('zb_user');
  return u ? JSON.parse(u) : null;
}

function updateNavUserUI() {
  const user = getCurrentUser();
  const loginBtn = document.getElementById('navLoginBtn');
  const userBtn  = document.getElementById('navUserBtn');
  if (!loginBtn && !userBtn) return;

  if (user) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userBtn)  { userBtn.style.display = 'flex'; userBtn.innerHTML = `👤 ${user.name || user.phone}`; }
  } else {
    if (loginBtn) loginBtn.style.display = '';
    if (userBtn)  userBtn.style.display  = 'none';
  }
}

/* ============================================================
   13. CHECKOUT FLOW — delivery details modal
   ============================================================ */
function proceedToCheckout() {
  const user = getCurrentUser();
  if (!user) {
    showToast('Please log in to place an order', 'warning');
    setTimeout(() => { window.location.href = 'login.html'; }, 1200);
    return;
  }
  if (cart.length === 0) {
    showToast('Your cart is empty!', 'warning');
    return;
  }
  openModal('checkoutModal');
}

function placeOrder() {
  const phone    = document.getElementById('checkoutPhone')?.value.trim();
  const location = document.getElementById('checkoutLocation')?.value.trim();
  const address  = document.getElementById('checkoutAddress')?.value.trim();

  if (!phone || !location || !address) {
    showToast('Please fill all delivery details', 'error');
    return;
  }

  // Generate Order ID
  const orderId = 'ZB' + Date.now().toString().slice(-6);

  // Save order to localStorage
  const order = {
    id: orderId,
    items: [...cart],
    total: getCartTotal(),
    phone, location, address,
    status: 'confirmed',
    time: new Date().toISOString(),
    steps: [
      { label: 'Order Placed',      done: true,  time: new Date().toLocaleTimeString() },
      { label: 'Order Confirmed',   done: true,  time: new Date().toLocaleTimeString() },
      { label: 'Preparing Your Food', done: false, time: '' },
      { label: 'Out for Delivery',  done: false, time: '' },
      { label: 'Delivered',         done: false, time: '' }
    ]
  };

  const orders = JSON.parse(localStorage.getItem('zb_orders') || '[]');
  orders.push(order);
  localStorage.setItem('zb_orders', JSON.stringify(orders));

  // Clear cart
  cart = [];
  saveCart();
  updateCartUI();
  closeCart();
  closeModal('checkoutModal');

  showToast(`🎉 Order #${orderId} placed! Estimated delivery: 30-40 mins`, 'success', 5000);

  // Redirect to tracking after 2s
  setTimeout(() => {
    window.location.href = `tracking.html?order=${orderId}`;
  }, 2000);
}

/* ============================================================
   14. HOMEPAGE FEATURED ITEMS
   ============================================================ */
function renderFeaturedItems() {
  const container = document.getElementById('featuredGrid');
  if (!container) return;

  const featured = MENU_DATA.filter(item => item.badge).slice(0, 4);
  renderMenu(featured, 'featuredGrid');
}

/* ============================================================
   15. INIT — runs on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Core init
  initNavbar();
  updateCartUI();
  updateNavUserUI();
  observeFadeUps();

  // Cart sidebar events
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
  document.getElementById('cartCloseBtn')?.addEventListener('click', closeCart);
  document.getElementById('checkoutBtn')?.addEventListener('click', proceedToCheckout);

  // Checkout modal confirm
  document.getElementById('confirmOrderBtn')?.addEventListener('click', placeOrder);

  // Slider (homepage)
  initSlider();

  // Menu page
  if (document.getElementById('menuGrid')) {
    // Check for URL filter param
    const urlParams = new URLSearchParams(window.location.search);
    const filterParam = urlParams.get('filter');
    renderMenu(MENU_DATA, 'menuGrid');
    initSearchFilter();
    if (filterParam) {
      // auto-apply filter from URL
      const chip = document.querySelector(`.filter-chip[data-filter-value="${filterParam}"]`);
      if (chip) chip.click();
    }
  }

  // Featured items on homepage
  renderFeaturedItems();

  // Modal close on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
});

// Expose functions globally so inline HTML can call them
window.addToCart         = addToCart;
window.removeFromCart    = removeFromCart;
window.updateCartQty     = updateCartQty;
window.openCart          = openCart;
window.closeCart         = closeCart;
window.nextSlide         = nextSlide;
window.prevSlide         = prevSlide;
window.goToSlide         = goToSlide;
window.showToast         = showToast;
window.openModal         = openModal;
window.closeModal        = closeModal;
window.proceedToCheckout = proceedToCheckout;
window.placeOrder        = placeOrder;
window.addToCartFromMenu = addToCartFromMenu;
window.rerenderQty       = rerenderQty;
window.MENU_DATA         = MENU_DATA;