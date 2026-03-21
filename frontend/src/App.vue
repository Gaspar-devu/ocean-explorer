<template>
  <div class="app">
    <header>
      <h1>🌊 Ocean Explorer</h1>
      <p>Explorez les mers et océans du monde</p>
      <nav>
        <button :class="{ active: view === 'oceans' }" @click="view = 'oceans'">Océans & Mers</button>
        <button :class="{ active: view === 'species' }" @click="view = 'species'">Espèces marines</button>
        <button :class="{ active: view === 'add' }" @click="view = 'add'">Ajouter</button>
      </nav>
    </header>

    <main>
      <OceanList v-if="view === 'oceans'" />
      <SpeciesList v-if="view === 'species'" />
      <AddForm v-if="view === 'add'" />
    </main>

    <footer>
      <p>Projet Azure ESGI — Gaspar Le Forestier, Marwane Chafi, Stanislas Prigent</p>
    </footer>
  </div>
</template>

<script>
import OceanList from "./components/OceanList.vue";
import SpeciesList from "./components/SpeciesList.vue";
import AddForm from "./components/AddForm.vue";

export default {
  components: { OceanList, SpeciesList, AddForm },
  data() {
    return { view: "oceans" };
  }
};
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', sans-serif;
  background: #0a1628;
  color: #e0f0ff;
  min-height: 100vh;
}

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

header {
  background: linear-gradient(135deg, #0d2b5e, #1a4a8a);
  padding: 2rem;
  text-align: center;
  border-bottom: 2px solid #2a6ab5;
}

header h1 { font-size: 2.2rem; margin-bottom: 0.5rem; }
header p { color: #8ab8e8; margin-bottom: 1.5rem; }

nav { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

nav button {
  background: transparent;
  border: 2px solid #2a6ab5;
  color: #8ab8e8;
  padding: 0.5rem 1.5rem;
  border-radius: 25px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

nav button:hover, nav button.active {
  background: #2a6ab5;
  color: white;
}

main { flex: 1; padding: 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }

footer {
  text-align: center;
  padding: 1rem;
  color: #4a7ab5;
  font-size: 0.85rem;
  border-top: 1px solid #1a3a6a;
}


.card {
  background: #0d2040;
  border: 1px solid #1a3a6a;
  border-radius: 12px;
  padding: 1.5rem;
  transition: transform 0.2s, border-color 0.2s;
  cursor: pointer;
}
.card:hover { transform: translateY(-3px); border-color: #2a6ab5; }

.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }

.badge {
  display: inline-block;
  padding: 0.2rem 0.7rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
}
.badge-ocean { background: #1a3a8a; color: #6ab0ff; }
.badge-mer { background: #1a5a3a; color: #6affa0; }
.badge-mammi { background: #3a1a5a; color: #d090ff; }
.badge-poisson { background: #1a4a5a; color: #60d0ff; }
.badge-other { background: #3a2a1a; color: #ffb060; }

.loading { text-align: center; color: #4a7ab5; padding: 3rem; font-size: 1.2rem; }
.error { background: #3a0d0d; border: 1px solid #8a2020; border-radius: 8px; padding: 1rem; color: #ff8080; }

.stat { margin: 0.4rem 0; font-size: 0.9rem; color: #8ab8e8; }
.stat span { color: #e0f0ff; font-weight: 500; }
</style>
