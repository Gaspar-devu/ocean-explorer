const { CosmosClient } = require("@azure/cosmos");
const { oceans: localOceans, species: localSpecies } = require("../data/seed");

const isLocal = process.env.NODE_ENV === "development" || !process.env.COSMOS_ENDPOINT;

let client, database, oceansContainer, speciesContainer;

async function getContainers() {
  if (isLocal) return null;

  if (!client) {
    client = new CosmosClient({
      endpoint: process.env.COSMOS_ENDPOINT,
      key: process.env.COSMOS_KEY
    });
    database = client.database(process.env.COSMOS_DATABASE);
    oceansContainer = database.container(process.env.COSMOS_CONTAINER_OCEANS);
    speciesContainer = database.container(process.env.COSMOS_CONTAINER_SPECIES);
  }

  return { oceansContainer, speciesContainer };
}


async function getAllOceans() {
  if (isLocal) return localOceans;

  const { oceansContainer } = await getContainers();
  const { resources } = await oceansContainer.items
    .query("SELECT * FROM c ORDER BY c.area_km2 DESC")
    .fetchAll();
  return resources;
}

async function getOceanById(id) {
  if (isLocal) return localOceans.find((o) => o.id === id) || null;

  const { oceansContainer } = await getContainers();
  const { resource } = await oceansContainer.item(id, id).read();
  return resource || null;
}

async function createOcean(ocean) {
  const newOcean = {
    ...ocean,
    id: Date.now().toString(),
    species_ids: ocean.species_ids || []
  };

  if (isLocal) {
    localOceans.push(newOcean);
    return newOcean;
  }

  const { oceansContainer } = await getContainers();
  const { resource } = await oceansContainer.items.create(newOcean);
  return resource;
}


async function getAllSpecies() {
  if (isLocal) return localSpecies;

  const { speciesContainer } = await getContainers();
  const { resources } = await speciesContainer.items
    .query("SELECT * FROM c ORDER BY c.name")
    .fetchAll();
  return resources;
}

async function getSpeciesById(id) {
  if (isLocal) return localSpecies.find((s) => s.id === id) || null;

  const { speciesContainer } = await getContainers();
  const { resource } = await speciesContainer.item(id, id).read();
  return resource || null;
}

async function createSpecies(species) {
  const newSpecies = {
    ...species,
    id: Date.now().toString(),
    ocean_ids: species.ocean_ids || []
  };

  if (isLocal) {
    localSpecies.push(newSpecies);
    return newSpecies;
  }

  const { speciesContainer } = await getContainers();
  const { resource } = await speciesContainer.items.create(newSpecies);
  return resource;
}

module.exports = {
  getAllOceans,
  getOceanById,
  createOcean,
  deleteOcean,
  getAllSpecies,
  getSpeciesById,
  createSpecies,
  deleteSpecies
};

async function deleteOcean(id) {
  if (isLocal) {
    const idx = localOceans.findIndex((o) => o.id === id);
    if (idx !== -1) localOceans.splice(idx, 1);
    return;
  }
  const { oceansContainer } = await getContainers();
  await oceansContainer.item(id, id).delete();
}

async function deleteSpecies(id) {
  if (isLocal) {
    const idx = localSpecies.findIndex((s) => s.id === id);
    if (idx !== -1) localSpecies.splice(idx, 1);
    return;
  }
  const { speciesContainer } = await getContainers();
  await speciesContainer.item(id, id).delete();
}
