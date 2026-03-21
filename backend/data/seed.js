
const oceans = [
  {
    id: "1",
    name: "Océan Pacifique",
    type: "ocean",
    area_km2: 165250000,
    max_depth_m: 11034,
    avg_temp_celsius: 13.5,
    location: "Entre l'Asie, l'Australie, l'Amérique",
    description:
      "Le plus grand et le plus profond des océans, couvrant plus d'un tiers de la surface terrestre.",
    fun_fact:
      "La fosse des Mariannes, point le plus profond de la Terre, s'y trouve à 11 034 m.",
    image_url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",
    species_ids: ["1", "2", "5"]
  },
  {
    id: "2",
    name: "Océan Atlantique",
    type: "ocean",
    area_km2: 106460000,
    max_depth_m: 8376,
    avg_temp_celsius: 13.0,
    location: "Entre l'Europe, l'Afrique et les Amériques",
    description:
      "Deuxième plus grand océan, séparant l'Ancien et le Nouveau Monde.",
    fun_fact:
      "Le Titanic repose au fond de l'Atlantique Nord, à environ 3 800 m de profondeur.",
    image_url: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80",
    species_ids: ["3", "4"]
  },
  {
    id: "3",
    name: "Océan Indien",
    type: "ocean",
    area_km2: 70560000,
    max_depth_m: 7258,
    avg_temp_celsius: 22.0,
    location: "Entre l'Afrique, l'Asie et l'Australie",
    description: "Le plus chaud des océans, traversé par les routes maritimes reliant l'Europe à l'Asie.",
    fun_fact: "C'est le seul océan dont les courants changent de direction selon les saisons (mousson).",
    image_url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    species_ids: ["5", "6"]
  },
  {
    id: "4",
    name: "Mer Méditerranée",
    type: "mer",
    area_km2: 2500000,
    max_depth_m: 5267,
    avg_temp_celsius: 18.5,
    location: "Entre l'Europe, l'Afrique et l'Asie",
    description:
      "Mer semi-fermée berceau de nombreuses civilisations antiques.",
    fun_fact: "La Méditerranée a été entièrement asséchée il y a 5,6 millions d'années lors de la crise messinienne.",
    image_url: "https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80",
    species_ids: ["4", "6"]
  },
  {
    id: "5",
    name: "Mer des Caraïbes",
    type: "mer",
    area_km2: 2754000,
    max_depth_m: 7686,
    avg_temp_celsius: 27.0,
    location: "Amérique centrale et du Sud",
    description: "Mer tropicale aux eaux chaudes et transparentes, abritant de nombreux récifs coralliens.",
    fun_fact: "La mer des Caraïbes abrite le second plus grand récif corallien du monde, le récif mésoaméricain.",
    image_url: "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80",
    species_ids: ["1", "2", "6"]
  }
];

const species = [
  {
    id: "1",
    name: "Baleine bleue",
    scientific_name: "Balaenoptera musculus",
    category: "mammifère",
    conservation_status: "En danger",
    max_length_m: 33,
    max_weight_kg: 200000,
    description: "Le plus grand animal ayant jamais existé sur Terre.",
    image_url: "https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=800&q=80",
    ocean_ids: ["1", "3"]
  },
  {
    id: "2",
    name: "Grand requin blanc",
    scientific_name: "Carcharodon carcharias",
    category: "poisson",
    conservation_status: "Vulnérable",
    max_length_m: 6,
    max_weight_kg: 2250,
    description: "Prédateur apex des océans, souvent mal compris par l'homme.",
    image_url: "https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=800&q=80",
    ocean_ids: ["1", "5"]
  },
  {
    id: "3",
    name: "Dauphin commun",
    scientific_name: "Delphinus delphis",
    category: "mammifère",
    conservation_status: "Préoccupation mineure",
    max_length_m: 2.5,
    max_weight_kg: 135,
    description: "Mammifère marin très sociable, connu pour ses acrobaties.",
    image_url: "https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=800&q=80",
    ocean_ids: ["2"]
  },
  {
    id: "4",
    name: "Poulpe commun",
    scientific_name: "Octopus vulgaris",
    category: "céphalopode",
    conservation_status: "Non évalué",
    max_length_m: 1.3,
    max_weight_kg: 10,
    description: "Invertébré marin doté d'une intelligence remarquable et de capacités de camouflage.",
    image_url: "https://images.unsplash.com/photo-1585755612763-8f5040a88de2?w=800&q=80",
    ocean_ids: ["2", "4"]
  },
  {
    id: "5",
    name: "Tortue imbriquée",
    scientific_name: "Eretmochelys imbricata",
    category: "reptile",
    conservation_status: "En danger critique",
    max_length_m: 1,
    max_weight_kg: 80,
    description: "Tortue marine en danger critique, essentielle à l'écosystème des récifs coralliens.",
    image_url: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&q=80",
    ocean_ids: ["1", "3"]
  },
  {
    id: "6",
    name: "Mérou géant",
    scientific_name: "Epinephelus lanceolatus",
    category: "poisson",
    conservation_status: "Vulnérable",
    max_length_m: 2.7,
    max_weight_kg: 400,
    description: "L'un des plus grands poissons osseux des récifs coralliens tropicaux.",
    image_url: "https://images.unsplash.com/photo-1552408617-1f7d21a159fa?w=800&q=80",
    ocean_ids: ["3", "4", "5"]
  }
];

module.exports = { oceans, species };
