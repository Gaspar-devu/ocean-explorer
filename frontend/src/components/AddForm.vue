<template>
  <div style="max-width: 600px; margin: 0 auto">
    <h2 style="margin-bottom: 1.5rem">➕ Ajouter des données</h2>

    <div style="display: flex; gap: 1rem; margin-bottom: 2rem">
      <button class="tab-btn" :class="{ active: tab === 'ocean' }" @click="tab = 'ocean'">Océan / Mer</button>
      <button class="tab-btn" :class="{ active: tab === 'species' }" @click="tab = 'species'">Espèce marine</button>
    </div>

    <div v-if="success" class="success-msg">✅ {{ success }}</div>
    <div v-if="error" class="error" style="margin-bottom: 1.5rem">{{ error }}</div>

    
    <div v-if="tab === 'ocean'" class="card" style="cursor: default">
      <h3 style="margin-bottom: 1.2rem">Nouvel océan ou mer</h3>

      <div class="field">
        <label>Nom *</label>
        <input v-model="ocean.name" placeholder="Ex: Mer Noire" />
      </div>
      <div class="field">
        <label>Type *</label>
        <select v-model="ocean.type">
          <option value="ocean">Océan</option>
          <option value="mer">Mer</option>
        </select>
      </div>
      <div class="field">
        <label>Superficie (km²) *</label>
        <input v-model.number="ocean.area_km2" type="number" placeholder="Ex: 2500000" />
      </div>
      <div class="field">
        <label>Profondeur max (m)</label>
        <input v-model.number="ocean.max_depth_m" type="number" placeholder="Ex: 5000" />
      </div>
      <div class="field">
        <label>Température moyenne (°C)</label>
        <input v-model.number="ocean.avg_temp_celsius" type="number" placeholder="Ex: 15" />
      </div>
      <div class="field">
        <label>Localisation</label>
        <input v-model="ocean.location" placeholder="Ex: Europe du Nord" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea v-model="ocean.description" rows="3" placeholder="Description de l'étendue d'eau..."></textarea>
      </div>
      <div class="field">
        <label>Le saviez-vous ?</label>
        <input v-model="ocean.fun_fact" placeholder="Un fait surprenant..." />
      </div>

      
      <div class="field">
        <label>Image (URL)</label>
        <input v-model="ocean.image_url" placeholder="https://images.unsplash.com/..." @input="oceanPreview = ocean.image_url" />
        <p class="field-hint">Colle une URL d'image (Unsplash, Wikimedia…)</p>
      </div>
      <div v-if="oceanPreview" class="preview-box">
        <img :src="oceanPreview" alt="Aperçu" @error="oceanPreview = null" />
        <button class="remove-img" @click="ocean.image_url = ''; oceanPreview = null">✕ Retirer</button>
      </div>

      <button class="submit-btn" :disabled="loading" @click="submitOcean">
        {{ loading ? 'Envoi...' : 'Ajouter' }}
      </button>
    </div>

    
    <div v-if="tab === 'species'" class="card" style="cursor: default">
      <h3 style="margin-bottom: 1.2rem">Nouvelle espèce marine</h3>

      <div class="field">
        <label>Nom commun *</label>
        <input v-model="species.name" placeholder="Ex: Requin marteau" />
      </div>
      <div class="field">
        <label>Nom scientifique *</label>
        <input v-model="species.scientific_name" placeholder="Ex: Sphyrna mokarran" />
      </div>
      <div class="field">
        <label>Catégorie *</label>
        <select v-model="species.category">
          <option value="poisson">Poisson</option>
          <option value="mammifère">Mammifère</option>
          <option value="reptile">Reptile</option>
          <option value="céphalopode">Céphalopode</option>
          <option value="crustacé">Crustacé</option>
          <option value="autre">Autre</option>
        </select>
      </div>
      <div class="field">
        <label>Statut de conservation</label>
        <select v-model="species.conservation_status">
          <option>Non évalué</option>
          <option>Préoccupation mineure</option>
          <option>Quasi menacé</option>
          <option>Vulnérable</option>
          <option>En danger</option>
          <option>En danger critique</option>
          <option>Éteint à l'état sauvage</option>
        </select>
      </div>
      <div class="field">
        <label>Longueur max (m)</label>
        <input v-model.number="species.max_length_m" type="number" step="0.1" placeholder="Ex: 4.5" />
      </div>
      <div class="field">
        <label>Poids max (kg)</label>
        <input v-model.number="species.max_weight_kg" type="number" placeholder="Ex: 580" />
      </div>
      <div class="field">
        <label>Description</label>
        <textarea v-model="species.description" rows="3" placeholder="Description de l'espèce..."></textarea>
      </div>

      
      <div class="field">
        <label>Image (URL)</label>
        <input v-model="species.image_url" placeholder="https://images.unsplash.com/..." @input="speciesPreview = species.image_url" />
        <p class="field-hint">Colle une URL d'image (Unsplash, Wikimedia…)</p>
      </div>
      <div v-if="speciesPreview" class="preview-box">
        <img :src="speciesPreview" alt="Aperçu" @error="speciesPreview = null" />
        <button class="remove-img" @click="species.image_url = ''; speciesPreview = null">✕ Retirer</button>
      </div>

      <button class="submit-btn" :disabled="loading" @click="submitSpecies">
        {{ loading ? 'Envoi...' : 'Ajouter' }}
      </button>
    </div>
  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_URL || "/api";

const emptyOcean = () => ({
  name: "", type: "ocean", area_km2: null, max_depth_m: null,
  avg_temp_celsius: null, location: "", description: "", fun_fact: "", image_url: ""
});
const emptySpecies = () => ({
  name: "", scientific_name: "", category: "poisson",
  conservation_status: "Non évalué", max_length_m: null,
  max_weight_kg: null, description: "", image_url: ""
});

export default {
  data() {
    return {
      tab: "ocean",
      loading: false,
      success: null,
      error: null,
      ocean: emptyOcean(),
      species: emptySpecies(),
      oceanPreview: null,
      speciesPreview: null
    };
  },
  methods: {
    async submitOcean() {
      this.success = null;
      this.error = null;
      if (!this.ocean.name || !this.ocean.area_km2) {
        this.error = "Le nom et la superficie sont obligatoires.";
        return;
      }
      this.loading = true;
      try {
        const res = await fetch(`${API_BASE}/oceans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.ocean)
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        this.success = `"${json.data.name}" ajouté avec succès !`;
        this.ocean = emptyOcean();
        this.oceanPreview = null;
      } catch (e) {
        this.error = e.message || "Erreur lors de l'ajout.";
      } finally {
        this.loading = false;
      }
    },
    async submitSpecies() {
      this.success = null;
      this.error = null;
      if (!this.species.name || !this.species.scientific_name) {
        this.error = "Le nom et le nom scientifique sont obligatoires.";
        return;
      }
      this.loading = true;
      try {
        const res = await fetch(`${API_BASE}/species`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.species)
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        this.success = `"${json.data.name}" ajouté avec succès !`;
        this.species = emptySpecies();
        this.speciesPreview = null;
      } catch (e) {
        this.error = e.message || "Erreur lors de l'ajout.";
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.tab-btn {
  background: transparent; border: 2px solid #2a6ab5; color: #8ab8e8;
  padding: 0.5rem 1.5rem; border-radius: 25px; cursor: pointer; transition: all 0.2s;
}
.tab-btn:hover, .tab-btn.active { background: #2a6ab5; color: white; }

.field { margin-bottom: 1rem; }
.field label { display: block; font-size: 0.85rem; color: #6a9ad0; margin-bottom: 0.4rem; }
.field input, .field select, .field textarea {
  width: 100%; background: #0a1828; border: 1px solid #1a3a6a;
  border-radius: 8px; padding: 0.6rem 0.8rem; color: #e0f0ff;
  font-size: 0.95rem; outline: none; transition: border-color 0.2s;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #2a6ab5; }
.field select option { background: #0a1828; }
.field-hint { font-size: 0.78rem; color: #4a7ab5; margin-top: 0.3rem; }

.preview-box {
  position: relative; margin-bottom: 1rem; border-radius: 8px;
  overflow: hidden; border: 1px solid #2a6ab5;
}
.preview-box img { width: 100%; height: 200px; object-fit: cover; display: block; }
.remove-img {
  position: absolute; top: 8px; right: 8px;
  background: rgba(0,0,0,0.7); border: 1px solid #ff8080;
  color: #ff8080; padding: 0.3rem 0.7rem; border-radius: 6px;
  cursor: pointer; font-size: 0.8rem;
}
.remove-img:hover { background: #3a0d0d; }

.submit-btn {
  width: 100%; background: #2a6ab5; border: none; color: white;
  padding: 0.8rem; border-radius: 8px; font-size: 1rem;
  cursor: pointer; margin-top: 0.5rem; transition: background 0.2s;
}
.submit-btn:hover:not(:disabled) { background: #1a5aa5; }
.submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.success-msg {
  background: #0a3020; border: 1px solid #2a8050; border-radius: 8px;
  padding: 0.8rem 1rem; margin-bottom: 1.5rem; color: #60ffa0;
}
</style>
