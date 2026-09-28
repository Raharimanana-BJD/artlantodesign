export interface CatalogueProduct {
  name: string;
  description: string;
  price: string;
  image: string;
  credit: string;
  creditHref: string;
}

export const TOLIARA_PRODUCTS: CatalogueProduct[] = [
  {
    name: "Grand panier de récolte",
    description: "Panier tressé à anse renforcée, plusieurs finitions.",
    price: "À partir de 48 000 Ar",
    image: "https://images.unsplash.com/photo-1570980441308-74f1b846c32b?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Misky on Unsplash",
    creditHref: "https://unsplash.com/@misky",
  },
  {
    name: "Plateau tressé cadeaux",
    description: "Plateau carré, idéal coffret cadeau ou rangement.",
    price: "32 000 Ar",
    image: "https://images.unsplash.com/photo-1769286145156-70a40fff80ec?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by dhiraj kumar on Unsplash",
    creditHref: "https://unsplash.com/@dhirajjj23",
  },
  {
    name: "Corbeille à pain",
    description: "Corbeille doublée tissu, pour le pain ou les fruits secs.",
    price: "26 000 Ar",
    image: "https://images.unsplash.com/photo-1588453251771-cd919b362ed4?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Debby Hudson on Unsplash",
    creditHref: "https://unsplash.com/@hudsoncrafted",
  },
  {
    name: "Pots & panier tressés",
    description: "Cache-pots en jute et panier assortis, plusieurs tailles.",
    price: "À partir de 18 000 Ar",
    image: "https://images.unsplash.com/photo-1654372066395-5a07f1e28afc?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Annie Spratt on Unsplash",
    creditHref: "https://unsplash.com/@anniespratt",
  },
  {
    name: "Plateau tressé rond",
    description: "Plateau tressé rond, finition naturelle, service ou décoration.",
    price: "22 000 Ar",
    image: "https://images.unsplash.com/photo-1641573260130-74d81b179809?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Ray Shrewsberry on Unsplash",
    creditHref: "https://unsplash.com/@ray12119",
  },
  {
    name: "Corbeille murale",
    description: "Grand panier de rangement, fibre naturelle, deux tailles.",
    price: "À partir de 35 000 Ar",
    image: "https://images.unsplash.com/photo-1540551079-b1236c0cd8ef?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Annie Spratt on Unsplash",
    creditHref: "https://unsplash.com/@anniespratt",
  },
];

export const UNIVERS_PLANTE_PRODUCTS: CatalogueProduct[] = [
  {
    name: "Monstera deliciosa",
    description: "Grande plante d'intérieur, pot en terre cuite inclus.",
    price: "45 000 Ar",
    image: "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Severin Candrian on Unsplash",
    creditHref: "https://unsplash.com/@sevi_media",
  },
  {
    name: "Palmier areca",
    description: "Idéal pour halls et espaces lumineux.",
    price: "À partir de 52 000 Ar",
    image: "https://images.unsplash.com/photo-1598531403144-43fdb36c9ae8?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by feey on Unsplash",
    creditHref: "https://unsplash.com/@feeypflanzen",
  },
  {
    name: "Collection aromatiques",
    description: "Basilic, menthe, thym — pots assortis pour la cuisine.",
    price: "18 000 Ar le lot de 3",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Markus Spiske on Unsplash",
    creditHref: "https://unsplash.com/@markusspiske",
  },
  {
    name: "Citronnier en pot",
    description: "Jeune arbre fruitier, déjà fructifère, prêt à planter.",
    price: "À partir de 38 000 Ar",
    image: "https://images.unsplash.com/photo-1575574202227-6b68bd6e3f29?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Artur Aldyrkhanov on Unsplash",
    creditHref: "https://unsplash.com/@aldyrkhanov",
  },
  {
    name: "Pot en terre cuite émaillée",
    description: "Trois tailles, avec ou sans soucoupe.",
    price: "À partir de 12 000 Ar",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Kara Eads on Unsplash",
    creditHref: "https://unsplash.com/@karaeads",
  },
  {
    name: "Kit d'entretien",
    description: "Sécateur, pulvérisateur et engrais naturel.",
    price: "22 000 Ar",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=900&q=75",
    credit: "Photo by Filip Urban on Unsplash",
    creditHref: "https://unsplash.com/@filiph",
  },
];

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const ORAURA_MENU: MenuCategory[] = [
  {
    name: "Entrées",
    items: [
      { name: "Salade de crevettes de Tuléar", description: "Avocat, mangue verte, vinaigrette au citron vert", price: "18 000 Ar" },
      { name: "Samoussas maison", description: "Bœuf épicé ou légumes, sauce pimentée", price: "12 000 Ar" },
      { name: "Carpaccio de zébu", description: "Copeaux de parmesan, huile de baobab", price: "20 000 Ar" },
    ],
  },
  {
    name: "Grillades",
    items: [
      { name: "Zébu grillé, sauce voatsiperifery", description: "Riz local, légumes de saison", price: "35 000 Ar" },
      { name: "Poisson du jour au feu de bois", description: "Selon arrivage, riz coco", price: "38 000 Ar" },
      { name: "Brochettes mixtes", description: "Zébu, poulet, poivrons grillés", price: "30 000 Ar" },
    ],
  },
  {
    name: "Cocktails & boissons",
    items: [
      { name: "Ti' Punch Or'Aura", description: "Rhum arrangé maison, citron vert", price: "15 000 Ar" },
      { name: "Jus frais du jour", description: "Fruits de saison, sans sucre ajouté", price: "8 000 Ar" },
      { name: "THB pression", description: "Bière malgache, 33 cl", price: "6 000 Ar" },
    ],
  },
  {
    name: "Desserts",
    items: [
      { name: "Fondant au chocolat et vanille de Madagascar", description: "Cœur coulant, glace maison", price: "14 000 Ar" },
      { name: "Salade de fruits exotiques", description: "Ananas, litchi, fruit de la passion", price: "10 000 Ar" },
    ],
  },
];
