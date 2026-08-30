/*
  The Copper Pot Eatery, demo seed data.
  This is a fictional demo restaurant. Every photo is AI generated and is
  flagged with photoAi: true so it can be swapped for a real photo later.
*/

const RESTAURANT = {
  name: "The Copper Pot Eatery",
  shortName: "The Copper Pot",
  town: "Stellenbosch",
  tagline: {
    en: "Honest food, warm company.",
    af: "Eerlike kos, warm geselskap."
  },
  address: "12 Kerk Street, Stellenbosch, 7600",
  phone: "021 555 0134",
  whatsapp: "27658793566", // demo practice number, wa.me without the +
  email: "hello@copperpot.co.za",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=12+Kerk+Street+Stellenbosch+7600",
  established: 2021,
  staffPin: "2021",
  // hours per weekday, 0 = Sunday. Times in minutes from midnight.
  hours: [
    { open: 8 * 60, close: 15 * 60, kitchenClose: 14 * 60 + 30 }, // Sun
    { open: 8 * 60, close: 21 * 60, kitchenClose: 20 * 60 + 30 }, // Mon
    { open: 8 * 60, close: 21 * 60, kitchenClose: 20 * 60 + 30 }, // Tue
    { open: 8 * 60, close: 21 * 60, kitchenClose: 20 * 60 + 30 }, // Wed
    { open: 8 * 60, close: 21 * 60, kitchenClose: 20 * 60 + 30 }, // Thu
    { open: 8 * 60, close: 22 * 60, kitchenClose: 21 * 60 + 30 }, // Fri
    { open: 8 * 60, close: 22 * 60, kitchenClose: 21 * 60 + 30 }  // Sat
  ],
  hoursLabel: {
    en: [
      ["Mon to Thu", "08:00 to 21:00, kitchen closes 20:30"],
      ["Fri and Sat", "08:00 to 22:00, kitchen closes 21:30"],
      ["Sunday", "08:00 to 15:00, kitchen closes 14:30"]
    ],
    af: [
      ["Ma tot Do", "08:00 tot 21:00, kombuis sluit 20:30"],
      ["Vr en Sa", "08:00 tot 22:00, kombuis sluit 21:30"],
      ["Sondag", "08:00 tot 15:00, kombuis sluit 14:30"]
    ]
  }
};

// Public Firebase web config (same key already on the AI Optimization site).
// Used so guest orders land on every staff phone, not only the phone that sent them.
const KITCHEN_LIVE = {
  apiKey: "AIzaSyBM6PfzVRQcLu31TJl43KswQIp9Um-sNhE",
  authDomain: "ai-visibility-reports.firebaseapp.com",
  projectId: "ai-visibility-reports",
  storageBucket: "ai-visibility-reports.firebasestorage.app",
  messagingSenderId: "973327362646",
  appId: "1:973327362646:web:e3c5fe2b4fa9c1aa5e29f7"
};

const LOYALTY = {
  name: "Copper Club",
  pointsPerRand: 0.1, // 1 point per R10
  stampsForReward: 10,
  tiers: [
    { id: "ember", min: 0, name: { en: "Ember", af: "Kool" } },
    { id: "flame", min: 500, name: { en: "Flame", af: "Vlam" } },
    { id: "forge", min: 1500, name: { en: "Forge", af: "Smidse" } }
  ],
  rewards: [
    { points: 100, name: { en: "Free cappuccino", af: "Gratis cappuccino" } },
    { points: 250, name: { en: "R50 off your bill", af: "R50 af van jou rekening" } }
  ]
};

const CATEGORIES = [
  { id: "breakfast", name: { en: "Breakfast", af: "Ontbyt" }, note: { en: "Served until 11:30", af: "Bedien tot 11:30" } },
  { id: "light", name: { en: "Sandwiches and Light Meals", af: "Toebroodjies en Ligte Etes" }, note: { en: "", af: "" } },
  { id: "mains", name: { en: "Mains", af: "Hoofgeregte" }, note: { en: "From 11:30", af: "Vanaf 11:30" } },
  { id: "desserts", name: { en: "Desserts", af: "Nageregte" }, note: { en: "", af: "" } },
  { id: "drinks", name: { en: "Drinks", af: "Drankies" }, note: { en: "", af: "" } }
];

// Common extras, referenced by menu items.
const EXTRAS = {
  egg: { name: { en: "Extra egg", af: "Ekstra eier" }, price: 12 },
  avo: { name: { en: "Avocado, seasonal", af: "Avokado, seisoenaal" }, price: 18 },
  halloumi: { name: { en: "Halloumi", af: "Halloumi" }, price: 22 },
  chips: { name: { en: "Side of chips", af: "Porsie skyfies" }, price: 25 },
  cheese: { name: { en: "Extra cheese", af: "Ekstra kaas" }, price: 15 },
  bacon: { name: { en: "Add bacon", af: "Voeg spek by" }, price: 20 },
  patty: { name: { en: "Extra patty", af: "Ekstra frikkadel" }, price: 45 },
  pepperSauce: { name: { en: "Pepper sauce", af: "Pepersous" }, price: 25 },
  mushroomSauce: { name: { en: "Mushroom sauce", af: "Sampioensous" }, price: 25 },
  roti: { name: { en: "Extra roti", af: "Ekstra roti" }, price: 15 },
  iceCream: { name: { en: "Scoop of ice cream", af: "Skeppie roomys" }, price: 18 },
  cream: { name: { en: "Pouring cream", af: "Gietroom" }, price: 10 },
  oatMilk: { name: { en: "Oat milk", af: "Hawermelk" }, price: 8 },
  doubleShot: { name: { en: "Double shot", af: "Dubbelskoot" }, price: 10 }
};

const MENU = [
  // Breakfast
  {
    id: "b1", cat: "breakfast", price: 95, img: "images/dish-farmhouse-breakfast.png", photoAi: true,
    name: { en: "Farmhouse Breakfast", af: "Plaasontbyt" },
    desc: {
      en: "Two free range eggs, crispy bacon, pork sausage, grilled tomato and buttered sourdough toast.",
      af: "Twee plaaseiers, knapperige spek, varkwors, gebraaide tamatie en suurdeegroosterbrood met botter."
    },
    extras: ["egg", "avo", "halloumi"]
  },
  {
    id: "b2", cat: "breakfast", price: 85, img: "images/dish-shakshuka.png", photoAi: true,
    name: { en: "Shakshuka Pan", af: "Sjakshuka Pan" },
    desc: {
      en: "Two eggs baked in a spiced tomato sauce with feta and coriander, served with sourdough.",
      af: "Twee eiers gebak in 'n gekruide tamatiesous met feta en koljander, bedien met suurdeegbrood."
    },
    extras: ["egg", "halloumi"]
  },
  {
    id: "b3", cat: "breakfast", price: 70, img: "images/dish-flapjacks.png", photoAi: true,
    name: { en: "Buttermilk Flapjacks", af: "Karringmelk Plaatkoekies" },
    desc: {
      en: "A stack of fluffy flapjacks with golden syrup, butter and fresh berries.",
      af: "'n Stapel donsige plaatkoekies met goue stroop, botter en vars bessies."
    },
    extras: ["bacon", "iceCream"]
  },
  {
    id: "b4", cat: "breakfast", price: 65, img: "images/dish-granola-bowl.png", photoAi: true,
    name: { en: "Granola and Yoghurt Bowl", af: "Granola en Jogurtbak" },
    desc: {
      en: "Thick plain yoghurt, toasted honey granola, banana, berries and a drizzle of honey.",
      af: "Dik gewone jogurt, geroosterde heuninggranola, piesang, bessies en 'n straaltjie heuning."
    },
    extras: []
  },

  // Sandwiches and light meals
  {
    id: "s1", cat: "light", price: 78, img: "images/dish-chicken-mayo-ciabatta.png", photoAi: true,
    name: { en: "Chicken Mayo Ciabatta", af: "Hoender-mayonnaise Ciabatta" },
    desc: {
      en: "Roast chicken mayo on toasted ciabatta with butter lettuce and tomato, served with crisps.",
      af: "Gebraaide hoender-mayonnaise op geroosterde ciabatta met botterslaai en tamatie, bedien met aartappelskyfies."
    },
    extras: ["chips", "cheese", "avo"]
  },
  {
    id: "s2", cat: "light", price: 88, img: "images/dish-biltong-brie-toastie.png", photoAi: true,
    name: { en: "Biltong and Brie Toastie", af: "Biltong en Brie Roosterbrood" },
    desc: {
      en: "Sliced biltong and melted brie on golden sourdough, a local favourite.",
      af: "Gesnyde biltong en gesmelte brie op goue suurdeegbrood, 'n plaaslike gunsteling."
    },
    extras: ["chips", "cheese"]
  },
  {
    id: "s3", cat: "light", price: 82, img: "images/dish-halloumi-wrap.png", photoAi: true,
    name: { en: "Grilled Halloumi Wrap", af: "Geroosterde Halloumi Wrap" },
    desc: {
      en: "Grilled halloumi, roasted red pepper, cucumber, hummus and greens in a soft wrap.",
      af: "Geroosterde halloumi, geroosterde rooi soetrissie, komkommer, hummus en groenigheid in 'n sagte wrap."
    },
    extras: ["chips", "avo"]
  },
  {
    id: "s4", cat: "light", price: 65, img: "images/dish-soup-of-the-day.png", photoAi: true,
    name: { en: "Soup of the Day", af: "Sop van die Dag" },
    desc: {
      en: "Ask us what the pot is holding today, served with toasted sourdough and butter.",
      af: "Vra ons wat vandag in die pot is, bedien met geroosterde suurdeegbrood en botter."
    },
    extras: []
  },

  // Mains
  {
    id: "m1", cat: "mains", price: 185, img: "images/dish-sirloin.png", photoAi: true,
    name: { en: "Flame Grilled Sirloin 300g", af: "Vlamgebraaide Kruisskyf 300g" },
    desc: {
      en: "300g sirloin off the flame with herb butter, hand cut chips and a side salad.",
      af: "300g kruisskyf van die vlam met kruiebotter, handgesnyde skyfies en 'n syslaai."
    },
    extras: ["pepperSauce", "mushroomSauce", "chips"]
  },
  {
    id: "m2", cat: "mains", price: 145, img: "images/dish-lamb-curry.png", photoAi: true,
    name: { en: "Karoo Lamb Curry", af: "Karoo Lamskerrie" },
    desc: {
      en: "Slow cooked lamb in a rich curry with basmati rice, sambals and a roti.",
      af: "Stadig gaargemaakte lamsvleis in 'n ryk kerrie met basmatirys, sambals en 'n roti."
    },
    extras: ["roti"]
  },
  {
    id: "m3", cat: "mains", price: 160, img: "images/dish-line-fish.png", photoAi: true,
    name: { en: "Line Fish of the Day", af: "Lynvis van die Dag" },
    desc: {
      en: "Pan seared line fish on creamy mash with lemon butter sauce and seasonal greens.",
      af: "Pangebraaide lynvis op romerige kapokaartappels met suurlemoenbottersous en seisoenale groente."
    },
    extras: ["chips"]
  },
  {
    id: "m4", cat: "mains", price: 120, img: "images/dish-butternut-gnocchi.png", photoAi: true,
    name: { en: "Butternut Gnocchi", af: "Botterskorsie Gnocchi" },
    desc: {
      en: "Pan fried gnocchi with roasted butternut, sage butter, pumpkin seeds and parmesan. Vegetarian.",
      af: "Pangebraaide gnocchi met geroosterde botterskorsie, salieboter, pampoenpitte en parmesaan. Vegetaries."
    },
    extras: ["halloumi"]
  },
  {
    id: "m5", cat: "mains", price: 110, img: "images/dish-beef-burger.png", photoAi: true,
    name: { en: "Copper Pot Beef Burger", af: "Copper Pot Beesburger" },
    desc: {
      en: "Flame grilled beef patty, cheddar, caramelised onion, lettuce and tomato on a brioche bun, with hand cut chips.",
      af: "Vlamgebraaide beesfrikkadel, cheddar, gekarameliseerde ui, blaarslaai en tamatie op 'n briochebroodjie, met handgesnyde skyfies."
    },
    extras: ["bacon", "patty", "cheese"]
  },

  // Desserts
  {
    id: "d1", cat: "desserts", price: 60, img: "images/dish-malva-pudding.png", photoAi: true,
    name: { en: "Malva Pudding", af: "Malvapoeding" },
    desc: {
      en: "Warm and sticky with caramel sauce and a scoop of vanilla ice cream.",
      af: "Warm en taai met karamelsous en 'n skeppie vanieljeroomys."
    },
    extras: ["iceCream", "cream"]
  },
  {
    id: "d2", cat: "desserts", price: 55, img: "images/dish-milk-tart.png", photoAi: true,
    name: { en: "Ouma's Milk Tart", af: "Ouma se Melktert" },
    desc: {
      en: "A generous slice with cinnamon on top, just like it should be.",
      af: "'n Ruim sny met kaneel bo-op, nes dit hoort."
    },
    extras: ["cream"]
  },
  {
    id: "d3", cat: "desserts", price: 58, img: "images/dish-chocolate-brownie.png", photoAi: true,
    name: { en: "Dark Chocolate Brownie", af: "Donkersjokolade Brownie" },
    desc: {
      en: "Warm fudgy brownie with icing sugar and pouring cream.",
      af: "Warm klewerige brownie met versiersuiker en gietroom."
    },
    extras: ["iceCream", "cream"]
  },

  // Drinks
  {
    id: "dr1", cat: "drinks", price: 38, img: "images/drink-cappuccino.png", photoAi: true,
    name: { en: "Cappuccino", af: "Cappuccino" },
    desc: {
      en: "Double shot with silky milk and a biscuit on the side.",
      af: "Dubbelskoot met syerige melk en 'n koekie langsaan."
    },
    extras: ["oatMilk", "doubleShot"]
  },
  {
    id: "dr2", cat: "drinks", price: 45, img: "images/drink-orange-juice.png", photoAi: true,
    name: { en: "Fresh Orange Juice", af: "Vars Lemoensap" },
    desc: {
      en: "Squeezed to order, nothing added.",
      af: "Op bestelling gedruk, niks bygevoeg nie."
    },
    extras: []
  },
  {
    id: "dr3", cat: "drinks", price: 42, img: "images/drink-lemonade.png", photoAi: true,
    name: { en: "Homemade Lemonade", af: "Tuisgemaakte Limonade" },
    desc: {
      en: "Cloudy lemonade with fresh mint and plenty of ice.",
      af: "Wolkerige limonade met vars kruisement en baie ys."
    },
    extras: []
  },
  {
    id: "dr4", cat: "drinks", price: 55, img: "images/drink-house-red.png", photoAi: true,
    name: { en: "Glass of House Red", af: "Glas Huisrooiwyn" },
    desc: {
      en: "A local Stellenbosch blend, ask us what is open today. 18 plus only.",
      af: "'n Plaaslike Stellenbosch versnit, vra ons wat vandag oop is. Slegs 18 plus."
    },
    extras: []
  }
];

// Home screen "On the pot today" rail. These must exist in MENU.
const FEATURED = ["b1", "s2", "m5", "m2", "d1"];

const EVENTS = [
  {
    id: "e1",
    title: { en: "Live acoustic evenings", af: "Akoestiese aande" },
    when: { en: "Every Friday from 18:30", af: "Elke Vrydag vanaf 18:30" },
    img: "images/hero-venue.png",
    desc: {
      en: "Local musicians on the terrace. No cover charge, just come early for a table.",
      af: "Plaaslike musikante op die terras. Geen toegangsfooi nie, kom net vroeg vir 'n tafel."
    }
  },
  {
    id: "e2",
    title: { en: "Burger Wednesdays", af: "Burger Woensdae" },
    when: { en: "Every Wednesday from 17:00", af: "Elke Woensdag vanaf 17:00" },
    img: "images/dish-beef-burger.png",
    desc: {
      en: "Any burger and a glass of house wine or lemonade for R135.",
      af: "Enige burger en 'n glas huiswyn of limonade vir R135."
    }
  },
  {
    id: "e3",
    title: { en: "Sunday slow roast", af: "Sondag stadige braai" },
    when: { en: "Sundays from 12:00 while it lasts", af: "Sondae vanaf 12:00 terwyl dit hou" },
    img: "images/dish-sirloin.png",
    desc: {
      en: "A proper Sunday roast out of the copper pot. Book a table, it goes fast.",
      af: "'n Regte Sondagbraai uit die koperpot. Bespreek 'n tafel, dit raak vinnig op."
    }
  }
];

const NOTICES = [
  {
    id: "n1",
    text: {
      en: "Allergens: our kitchen handles nuts, gluten, dairy and shellfish. Tell us about any allergy when you order.",
      af: "Allergene: ons kombuis werk met neute, gluten, suiwel en skulpvis. Se vir ons van enige allergie wanneer jy bestel."
    }
  },
  {
    id: "n2",
    text: {
      en: "Weekends get busy. Collection orders can take up to 30 minutes between 12:00 and 14:00.",
      af: "Naweke raak besig. Afhaalbestellings kan tot 30 minute neem tussen 12:00 en 14:00."
    }
  },
  {
    id: "n3",
    text: {
      en: "Load shedding: we cook on gas, so the kitchen stays open. Card machines may be slow, cash helps.",
      af: "Beurtkrag: ons kook op gas, so die kombuis bly oop. Kaartmasjiene kan stadig wees, kontant help."
    }
  },
  {
    id: "n4",
    text: {
      en: "Seasonal: our menu follows the seasons, so a dish may change slightly from the photo.",
      af: "Seisoenaal: ons spyskaart volg die seisoene, so 'n gereg kan effens van die foto verskil."
    }
  }
];

// Demo kitchen orders, seeded on first run so the kitchen board is alive.
const DEMO_ORDERS = [
  {
    id: "CP-1042",
    customer: "Anja M",
    phone: "0825550111",
    placedMinAgo: 6,
    status: "new",
    lines: [
      { itemId: "m5", qty: 2, extras: ["bacon"], notes: "One without onion please" },
      { itemId: "dr3", qty: 2, extras: [], notes: "" }
    ]
  },
  {
    id: "CP-1041",
    customer: "Sipho K",
    phone: "0825550122",
    placedMinAgo: 14,
    status: "preparing",
    lines: [
      { itemId: "m2", qty: 1, extras: ["roti"], notes: "" },
      { itemId: "b2", qty: 1, extras: [], notes: "Extra sourdough" }
    ]
  },
  {
    id: "CP-1040",
    customer: "Retha V",
    phone: "0825550133",
    placedMinAgo: 22,
    status: "ready",
    lines: [
      { itemId: "s2", qty: 1, extras: ["chips"], notes: "" },
      { itemId: "d2", qty: 2, extras: [], notes: "" },
      { itemId: "dr1", qty: 1, extras: ["oatMilk"], notes: "" }
    ]
  },
  {
    id: "CP-1039",
    customer: "John",
    phone: "",
    placedMinAgo: 8,
    status: "new",
    table: "10",
    split: true,
    kind: "table",
    lines: [
      { itemId: "m5", qty: 1, extras: [], notes: "" },
      { itemId: "dr3", qty: 1, extras: [], notes: "" }
    ]
  },
  {
    id: "CP-1038",
    customer: "Mary",
    phone: "",
    placedMinAgo: 9,
    status: "preparing",
    table: "10",
    split: true,
    kind: "table",
    lines: [
      { itemId: "s1", qty: 1, extras: ["avo"], notes: "" },
      { itemId: "dr1", qty: 1, extras: [], notes: "" }
    ]
  },
  {
    id: "CP-1037",
    customer: "Table 8",
    phone: "",
    placedMinAgo: 18,
    status: "ready",
    table: "8",
    split: false,
    kind: "table",
    lines: [
      { itemId: "m2", qty: 2, extras: ["roti"], notes: "" }
    ]
  }
];

// UI strings, English and Afrikaans.
const STRINGS = {
  navHome: { en: "Home", af: "Tuis" },
  navMenu: { en: "Menu", af: "Spyskaart" },
  navClub: { en: "Copper Club", af: "Copper Klub" },
  navBook: { en: "Book", af: "Bespreek" },
  navMore: { en: "More", af: "Meer" },

  open: { en: "Open now", af: "Nou oop" },
  closed: { en: "Closed", af: "Gesluit" },
  kitchenCloses: { en: "kitchen closes", af: "kombuis sluit" },
  kitchenClosed: { en: "kitchen is closed", af: "kombuis is gesluit" },
  opensAt: { en: "opens", af: "maak oop" },

  ctaOrder: { en: "Order for collection", af: "Bestel vir afhaal" },
  ctaMenu: { en: "Menu", af: "Spyskaart" },
  ctaTable: { en: "Order at your table", af: "Bestel by jou tafel" },
  ctaBook: { en: "Book a table", af: "Bespreek 'n tafel" },
  ctaDirections: { en: "Directions", af: "Aanwysings" },

  tableTitle: { en: "Order at your table", af: "Bestel by jou tafel" },
  tableIntro: {
    en: "Put in the table number the waitress gave you. WhatsApp send only opens after that.",
    af: "Sit die tafelnommer in wat die kelnerin vir jou gee. WhatsApp stuur maak eers daarna oop."
  },
  billOne: { en: "One bill for the table", af: "Een rekening vir die tafel" },
  billSplit: { en: "Split the bill, I pay my own", af: "Deel die rekening, ek betaal my eie" },
  oneBillHint: {
    en: "Everyone at this table is on one bill.",
    af: "Almal by hierdie tafel is op een rekening."
  },
  splitHint: {
    en: "Each person orders on their own phone. Use the same table number and your first name.",
    af: "Elke persoon bestel op hul eie foon. Gebruik dieselfde tafelnommer en jou voornaam."
  },
  tableNumber: { en: "Table number", af: "Tafelnommer" },
  firstName: { en: "Your first name", af: "Jou voornaam" },
  firstNamePh: { en: "e.g. John", af: "bv. John" },
  tableContinue: { en: "See the menu", af: "Sien die spyskaart" },
  tableNeedNumber: { en: "Put in the table number first", af: "Sit eers die tafelnommer in" },
  tableNeedName: { en: "Put in your name for the split bill", af: "Sit jou naam in vir die deelrekening" },
  tableBanner: { en: "Ordering for table {n}", af: "Bestel vir tafel {n}" },
  tableBannerSplit: { en: "Table {n}, split bill for {name}", af: "Tafel {n}, deelrekening vir {name}" },
  tablePayNote: {
    en: "You pay at the table. We will confirm your order on WhatsApp.",
    af: "Jy betaal by die tafel. Ons bevestig jou bestelling op WhatsApp."
  },
  openTables: { en: "Open tables", af: "Oop tafels" },
  cashUpTable: { en: "Cash up this table", af: "Maak hierdie tafel toe" },
  cashUpConfirm: {
    en: "Mark this table as paid and close these tickets?",
    af: "Merk hierdie tafel as betaal en maak die kaartjies toe?"
  },
  oneBillLabel: { en: "One bill", af: "Een rekening" },
  splitLabel: { en: "Split", af: "Deelrekening" },
  noOpenTables: {
    en: "No open table tabs right now.",
    af: "Geen oop tafelrekeninge op die oomblik nie."
  },
  tableTicket: { en: "Table {n}", af: "Tafel {n}" },

  todayAtCopperPot: { en: "On the pot today", af: "In die pot vandag" },
  goodToKnow: { en: "Good to know", af: "Goed om te weet" },
  seeAllEvents: { en: "See all specials", af: "Sien alle spesiale aanbiedinge" },

  whatsappCart: { en: "WhatsApp cart", af: "WhatsApp mandjie" },
  addToCart: { en: "Add to WhatsApp cart", af: "Voeg by WhatsApp mandjie" },
  cartEmptyTitle: { en: "Nothing in your basket yet", af: "Nog niks in jou mandjie nie" },
  cartEmptyBody: {
    en: "The kitchen is ready when you are. Have a look at the menu and pick something lekker.",
    af: "Die kombuis is reg wanneer jy is. Loer deur die spyskaart en kies iets lekker."
  },
  browseMenu: { en: "Browse the menu", af: "Blaai deur die spyskaart" },
  addMore: { en: "Add more", af: "Voeg nog by" },
  total: { en: "Total", af: "Totaal" },
  sendOrder: { en: "WhatsApp your order now", af: "WhatsApp jou bestelling nou" },
  collectionNote: {
    en: "You pay in store when you collect. We will confirm your order on WhatsApp.",
    af: "Jy betaal in die winkel wanneer jy afhaal. Ons bevestig jou bestelling op WhatsApp."
  },
  notes: { en: "Notes for the kitchen", af: "Notas vir die kombuis" },
  notesPlaceholder: { en: "No onion, sauce on the side, that kind of thing", af: "Geen ui, sous langsaan, daai soort ding" },
  quantity: { en: "Quantity", af: "Hoeveelheid" },
  extras: { en: "Extras", af: "Ekstras" },
  remove: { en: "Remove", af: "Verwyder" },
  edit: { en: "Edit", af: "Wysig" },
  soldOut: { en: "Sold out today", af: "Vandag uitverkoop" },
  aiPhotoTag: { en: "Photo for illustration", af: "Foto ter illustrasie" },

  clubTitle: { en: "Copper Club", af: "Copper Klub" },
  clubPitch: {
    en: "Earn 1 point for every R10 you spend, in store or on collection orders. Points become free food.",
    af: "Verdien 1 punt vir elke R10 wat jy bestee, in die winkel of op afhaalbestellings. Punte word gratis kos."
  },
  joinClub: { en: "Join the Copper Club", af: "Sluit aan by die Copper Klub" },
  yourName: { en: "Your name", af: "Jou naam" },
  yourPhone: { en: "Cell number", af: "Selnommer" },
  popiaConsent: {
    en: "I am happy for The Copper Pot to keep my name and number in this app for collection orders and Copper Club points. I can delete my details any time under More, Account.",
    af: "Ek is tevrede dat The Copper Pot my naam en nommer in hierdie app hou vir afhaalbestellings en Copper Klub punte. Ek kan my besonderhede enige tyd uitvee onder Meer, Rekening."
  },
  join: { en: "Join now", af: "Sluit nou aan" },
  points: { en: "points", af: "punte" },
  tier: { en: "Tier", af: "Vlak" },
  nextTier: { en: "to reach", af: "om te bereik" },
  stampCard: { en: "Stamp card", af: "Stempelkaart" },
  stampCardNote: {
    en: "One stamp per collection order. Fill 10 and your next cappuccino is on us.",
    af: "Een stempel per afhaalbestelling. Maak 10 vol en jou volgende cappuccino is op ons."
  },
  rewards: { en: "Rewards", af: "Belonings" },
  memberSince: { en: "Member since", af: "Lid sedert" },

  bookTitle: { en: "Book a table", af: "Bespreek 'n tafel" },
  bookIntro: {
    en: "Pick a date and time and we will confirm on WhatsApp. For groups of 8 or more, give us a ring.",
    af: "Kies 'n datum en tyd en ons bevestig op WhatsApp. Vir groepe van 8 of meer, bel ons gerus."
  },
  date: { en: "Date", af: "Datum" },
  time: { en: "Time", af: "Tyd" },
  covers: { en: "How many people", af: "Hoeveel mense" },
  dogs: { en: "Bringing a dog? The terrace is dog friendly.", af: "Bring jy 'n hond? Die terras is hondvriendelik." },
  bookNotes: { en: "Anything we should know", af: "Enigiets wat ons moet weet" },
  bookNotesPlaceholder: { en: "Birthday, pram, wheelchair, window table", af: "Verjaarsdag, stootwaentjie, rolstoel, venstertafel" },
  sendBooking: { en: "Send booking on WhatsApp", af: "Stuur bespreking op WhatsApp" },

  eventsTitle: { en: "Events and specials", af: "Geleenthede en spesiale aanbiedinge" },

  accountTitle: { en: "Account", af: "Rekening" },
  pastOrders: { en: "Past orders", af: "Vorige bestellings" },
  noOrders: {
    en: "No orders yet. Your collection orders will show up here.",
    af: "Nog geen bestellings nie. Jou afhaalbestellings sal hier verskyn."
  },
  language: { en: "Language", af: "Taal" },
  deleteData: { en: "Delete my data from this app", af: "Vee my data van hierdie app af" },
  deleteConfirm: {
    en: "This removes your Copper Club details, cart and order history from this phone. Sure?",
    af: "Dit verwyder jou Copper Klub besonderhede, mandjie en bestelgeskiedenis van hierdie foon. Seker?"
  },
  dataDeleted: { en: "All done. Your data is gone from this app.", af: "Klaar. Jou data is weg van hierdie app af." },

  contactTitle: { en: "Find us", af: "Kry ons" },
  hoursTitle: { en: "Hours", af: "Ure" },
  whatsappUs: { en: "WhatsApp us", af: "WhatsApp ons" },
  phoneUs: { en: "Call us", af: "Bel ons" },
  emailUs: { en: "Email us", af: "E-pos ons" },
  openInMaps: { en: "Open in Google Maps", af: "Maak oop in Google Maps" },

  moreTitle: { en: "More", af: "Meer" },
  staffMode: { en: "Staff and kitchen", af: "Personeel en kombuis" },
  privacy: { en: "Privacy in plain language", af: "Privaatheid in gewone taal" },
  privacyBody: {
    en: "This app keeps your name, number, cart, points and order history on your phone so collection and Copper Club work. We do not sell your details. You can delete everything under Account.",
    af: "Hierdie app hou jou naam, nommer, mandjie, punte en bestelgeskiedenis op jou foon sodat afhaal en die Copper Klub werk. Ons verkoop nie jou besonderhede nie. Jy kan alles uitvee onder Rekening."
  },
  demoBadge: { en: "Demo app with sample data", af: "Demo app met voorbeelddata" },

  staffTitle: { en: "Kitchen board", af: "Kombuisbord" },
  staffTabOrders: { en: "Orders", af: "Bestellings" },
  staffTabMenu: { en: "Edit menu", af: "Wysig spyskaart" },
  staffTabSpecials: { en: "Edit special", af: "Wysig spesiale" },
  staffTabDeck: { en: "On the pot", af: "In die pot" },
  kitchenEditorsNote: {
    en: "Three editors. Menu plates, today's special, and the plates on the pot.",
    af: "Drie redigeerders. Spyskaartborde, vandag se spesiale, en die borde in die pot."
  },
  liveNow: { en: "Live", af: "Live" },
  liveAcrossPhones: {
    en: "This board is live on every staff phone. When a guest sends an order, it appears here on its own, the same moment WhatsApp gets it.",
    af: "Hierdie bord is lewendig op elke personeel-foon. As 'n gas 'n bestelling stuur, kom dit vanself hier aan, dieselfde oomblik as WhatsApp."
  },
  kitchenSyncFail: {
    en: "WhatsApp is open. The kitchen board could not update. Check the wifi.",
    af: "WhatsApp is oop. Die kombuisbord kon nie opdateer nie. Check die wifi."
  },
  editMenuBtn: { en: "Edit menu", af: "Wysig spyskaart" },
  editSpecialBtn: { en: "Edit today's special", af: "Wysig vandag se spesiale" },
  editDeckBtn: { en: "Edit on the pot today", af: "Wysig in die pot vandag" },
  takePhoto: { en: "Take photo", af: "Neem foto" },
  fromGallery: { en: "From gallery", af: "Uit gallery" },
  deckEditorTitle: { en: "On the pot today", af: "In die pot vandag" },
  deckEditorNote: {
    en: "These five cards scroll on the home screen. Change the dish, take a photo with the camera, or pick one from the gallery.",
    af: "Hierdie vyf kaarte rol op die tuisskerm. Verander die gereg, neem 'n foto met die kamera, of kies een uit die gallery."
  },
  specialEditorFocus: {
    en: "This is the big photo card under On the pot today. Change the words and the photo and it updates the home screen.",
    af: "Dit is die groot fotokaart onder In die pot vandag. Verander die woorde en die foto en die tuisskerm dateer op."
  },
  pickDish: { en: "Dish on this card", af: "Gereg op hierdie kaart" },
  addDeckItem: { en: "+ Add a dish to the rail", af: "+ Voeg 'n gereg by die ry" },
  removeFromDeck: { en: "Remove from home", af: "Haal van tuisskerm af" },
  specialsEditorTitle: { en: "Events and specials", af: "Geleenthede en spesiale aanbiedinge" },
  specialsEditorNote: {
    en: "What you type here shows on the home screen and the events page right away. Fill in both languages, if you leave AFR empty we use the ENG text there too.",
    af: "Wat jy hier tik wys dadelik op die tuisskerm en die geleenthede-bladsy. Vul albei tale in, as jy ENG leeg los gebruik ons die AFR teks daar ook."
  },
  noticesEditorTitle: { en: "Good to know notices", af: "Goed om te weet kennisgewings" },
  noticesEditorNote: {
    en: "These are the small notices on the home screen, allergens, busy times, that kind of thing.",
    af: "Dit is die klein kennisgewings op die tuisskerm, allergene, besige tye, daai soort ding."
  },
  fieldTitle: { en: "Title", af: "Titel" },
  fieldWhen: { en: "When", af: "Wanneer" },
  fieldDesc: { en: "Details", af: "Besonderhede" },
  fieldNotice: { en: "Notice", af: "Kennisgewing" },
  save: { en: "Save", af: "Stoor" },
  deleteWord: { en: "Delete", af: "Vee uit" },
  addSpecial: { en: "+ Add a special", af: "+ Voeg 'n spesiale aanbieding by" },
  addNotice: { en: "+ Add a notice", af: "+ Voeg 'n kennisgewing by" },
  resetSection: { en: "Reset to original", af: "Herstel na oorspronklike" },
  savedToast: { en: "Saved, it is live in the app", af: "Gestoor, dit is nou in die app" },
  deletedToast: { en: "Deleted", af: "Uitgevee" },
  noEvents: {
    en: "Nothing on the board right now. Pop in anyway, the kettle is on.",
    af: "Niks op die bord op die oomblik nie. Kom kuier in elk geval, die ketel is aan."
  },
  noNotices: {
    en: "No notices on the home screen right now.",
    af: "Geen kennisgewings op die tuisskerm op die oomblik nie."
  },
  deleteConfirmItem: {
    en: "Delete this from the app?",
    af: "Vee dit van die app af?"
  },
  resetSectionConfirm: {
    en: "This puts the original demo specials and notices back. Sure?",
    af: "Dit sit die oorspronklike demo spesiale aanbiedinge en kennisgewings terug. Seker?"
  },
  enterPin: { en: "Staff PIN", af: "Personeel PIN" },
  demoPinHint: { en: "Demo PIN: 2021", af: "Demo PIN: 2021" },
  wrongPin: { en: "That PIN is not right. Try again.", af: "Daai PIN is nie reg nie. Probeer weer." },
  backToApp: { en: "Back to guest app", af: "Terug na gaste app" },
  backToKitchen: { en: "Back to kitchen board", af: "Terug na kombuisbord" },
  liveOrders: { en: "Live orders", af: "Lewendige bestellings" },
  eightySix: { en: "86 list, mark items sold out", af: "86 lys, merk items uitverkoop" },
  dineInSpend: { en: "Add dine in spend to Copper Club", af: "Voeg eetplek besteding by Copper Klub" },
  memberPhone: { en: "Member cell number", af: "Lid se selnommer" },
  amountSpent: { en: "Amount spent in Rand", af: "Bedrag bestee in Rand" },
  addPoints: { en: "Add points", af: "Voeg punte by" },
  statusNew: { en: "New", af: "Nuut" },
  statusPreparing: { en: "Preparing", af: "Berei voor" },
  statusReady: { en: "Ready", af: "Gereed" },
  statusCollected: { en: "Collected", af: "Afgehaal" },
  markPreparing: { en: "Start preparing", af: "Begin voorberei" },
  markReady: { en: "Mark ready", af: "Merk gereed" },
  markCollected: { en: "Collected", af: "Afgehaal" },
  deleteOrder: { en: "Delete order", af: "Vee bestelling uit" },
  deleteTheseOrders: { en: "Delete these orders", af: "Vee hierdie bestellings uit" },
  deleteThisTable: { en: "Delete this table", af: "Vee hierdie tafel uit" },
  deleteTableConfirm: {
    en: "Delete every order for this table from the kitchen board?",
    af: "Vee elke bestelling vir hierdie tafel van die kombuisbord af?"
  },
  deleteOrderConfirm: {
    en: "Delete this order from the kitchen board?",
    af: "Vee hierdie bestelling van die kombuisbord af?"
  },
  noLiveOrders: {
    en: "No live orders right now. The moment a guest sends one, it appears here on every staff phone.",
    af: "Geen lewendige bestellings op die oomblik nie. Die oomblik wat 'n gas een stuur, kom dit hier aan op elke personeel-foon."
  },
  available: { en: "Available", af: "Beskikbaar" },
  photoManager: { en: "Menu dishes", af: "Spyskaartgeregte" },
  photoManagerNote: {
    en: "Tap a dish name to open it. Then you can take a photo, pick one from the gallery, and change the name and the description. Save updates the guest menu on this phone.",
    af: "Tik op 'n geregnaam om dit oop te maak. Dan kan jy 'n foto neem, een uit die gallery kies, en die naam en die beskrywing verander. Stoor dateer die gaste-spyskaart op hierdie foon op."
  },
  backToDishes: { en: "Back to dishes", af: "Terug na geregte" },
  fieldName: { en: "Name", af: "Naam" },
  resetDishCopy: { en: "Reset name and description", af: "Herstel naam en beskrywing" },
  replacePhoto: { en: "Replace photo", af: "Vervang foto" },
  resetPhoto: { en: "Reset", af: "Herstel" },
  photoUpdated: { en: "Photo updated, check the menu", af: "Foto opgedateer, kyk na die spyskaart" },
  photoReset: { en: "Back to the original photo", af: "Terug na die oorspronklike foto" },
  aiLabel: { en: "AI photo", af: "KI-foto" },
  yourPhotoLabel: { en: "Your photo", af: "Jou foto" },

  installHint: {
    en: "Tip: add this app to your home screen for one tap ordering.",
    af: "Wenk: voeg hierdie app by jou tuisskerm vir bestelling met een tik."
  },
  orderSent: {
    en: "Your order is on its way to WhatsApp. Send the message there to finish.",
    af: "Jou bestelling is op pad na WhatsApp. Stuur die boodskap daar om klaar te maak."
  },
  welcomeBack: { en: "Welcome back", af: "Welkom terug" },
  eventNote: { en: "From our events board", af: "Van ons geleenthedebord" }
};
