<template>
  <div>
    <h2 style="margin-bottom: 1.5rem">🐠 Espèces marines</h2>

    <div v-if="loading" class="loading">Chargement des espèces...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div v-if="deleteMsg" class="success-msg">✅ {{ deleteMsg }}</div>

      <div style="margin-bottom: 1.5rem; display: flex; gap: 0.8rem; flex-wrap: wrap">
        <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">Toutes</button>
        <button v-for="cat in categories" :key="cat" class="filter-btn" :class="{ active: filter === cat }" @click="filter = cat">{{ cat }}</button>
      </div>

      <div class="grid">
        <div v-for="s in filtered" :key="s.id" class="card species-card">
          <div class="card-img">
            <img v-if="s.image_url" :src="s.image_url" :alt="s.name" @error="e => e.target.style.display='none'" />
            <div v-else class="img-placeholder">🐟</div>
          </div>
          <div class="card-body">
            <span class="badge" :class="getBadge(s.category)">{{ s.category }}</span>
            <h3 style="margin-bottom: 0.3rem">{{ s.name }}</h3>
            <p style="font-style: italic; color: #6a9ad0; font-size: 0.85rem; margin-bottom: 0.8rem">{{ s.scientific_name }}</p>
            <p class="stat">Statut : <span :style="{ color: getStatusColor(s.conservation_status) }">{{ s.conservation_status }}</span></p>
            <p v-if="s.max_length_m" class="stat">Longueur max : <span>{{ s.max_length_m }} m</span></p>
            <p v-if="s.max_weight_kg" class="stat">Poids max : <span>{{ s.max_weight_kg.toLocaleString('fr-FR') }} kg</span></p>
            <p style="margin-top: 0.8rem; font-size: 0.85rem; color: #6a9ad0; line-height: 1.5">{{ s.description }}</p>
          </div>
          <div class="card-footer">
            <button class="delete-btn" @click="confirmDelete(s)">🗑️ Supprimer</button>
          </div>
        </div>
      </div>

      <p v-if="filtered.length === 0" style="text-align: center; color: #4a7ab5; padding: 2rem">Aucune espèce dans cette catégorie.</p>
    </div>

    <div v-if="toDelete" class="modal-overlay" @click.self="toDelete = null">
      <div class="modal">
        <h3>Confirmer la suppression</h3>
        <p>Voulez-vous vraiment supprimer <strong>{{ toDelete.name }}</strong> ?</p>
        <p style="font-size: 0.85rem; color: #ff8080; margin-top: 0.5rem">Cette action est irréversible.</p>
        <div class="modal-actions">
          <button class="cancel-btn" @click="toDelete = null">Annuler</button>
          <button class="confirm-delete-btn" :disabled="deleting" @click="doDelete">{{ deleting ? 'Suppression...' : 'Supprimer' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const API_BASE = import.meta.env.VITE_API_URL || "/api";
export default {
  data() {
    return { species: [], loading: true, error: null, filter: "all", toDelete: null, deleting: false, deleteMsg: null };
  },
  computed: {
    categories() { return [...new Set(this.species.map((s) => s.category))]; },
    filtered() {
      if (this.filter === "all") return this.species;
      return this.species.filter((s) => s.category === this.filter);
    }
  },
  methods: {
    getBadge(cat) {
      const map = { "mammifère": "badge-mammi", "poisson": "badge-poisson" };
      return map[cat] || "badge-other";
    },
    getStatusColor(status) {
      if (!status) return "#8ab8e8";
      if (status.includes("critique")) return "#ff6060";
      if (status.includes("danger")) return "#ffaa40";
      if (status.includes("Vulnérable")) return "#ffdd60";
      if (status.includes("mineure")) return "#60ff90";
      return "#8ab8e8";
    },
    confirmDelete(s) { this.toDelete = s; },
    async doDelete() {
      this.deleting = true;
      try {
        const res = await fetch(`${API_BASE}/species/${this.toDelete.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        this.species = this.species.filter((s) => s.id !== this.toDelete.id);
        this.deleteMsg = json.message;
        this.toDelete = null;
        setTimeout(() => (this.deleteMsg = null), 3000);
      } catch (e) { this.error = e.message; } finally { this.deleting = false; }
    }
  },
  async mounted() {
    try {
      const res = await fetch(`${API_BASE}/species`);
      const json = await res.json();
      this.species = json.data;
    } catch { this.error = "Impossible de contacter l'API."; } finally { this.loading = false; }
  }
};
</script>

<style scoped>
.filter-btn { background: transparent; border: 1px solid #2a6ab5; color: #8ab8e8; padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
.filter-btn:hover, .filter-btn.active { background: #2a6ab5; color: white; }
.species-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.card-img { height: 180px; overflow: hidden; background: #0a1828; display: flex; align-items: center; justify-content: center; }
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.card-img:hover img { transform: scale(1.05); }
.img-placeholder { font-size: 3rem; }
.card-body { padding: 1.2rem; flex: 1; }
.card-footer { padding: 0.8rem 1.2rem; border-top: 1px solid #1a3a6a; }
.delete-btn { background: transparent; border: 1px solid #8a2020; color: #ff8080; padding: 0.4rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
.delete-btn:hover { background: #3a0d0d; }
.success-msg { background: #0a3020; border: 1px solid #2a8050; border-radius: 8px; padding: 0.8rem 1rem; margin-bottom: 1.5rem; color: #60ffa0; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; }
.modal { background: #0d2040; border: 1px solid #2a6ab5; border-radius: 12px; padding: 2rem; max-width: 420px; width: 90%; }
.modal h3 { margin-bottom: 1rem; }
.modal-actions { display: flex; gap: 1rem; margin-top: 1.5rem; }
.cancel-btn { flex: 1; background: transparent; border: 1px solid #2a6ab5; color: #8ab8e8; padding: 0.6rem; border-radius: 8px; cursor: pointer; }
.cancel-btn:hover { background: #1a3a6a; }
.confirm-delete-btn { flex: 1; background: #8a2020; border: none; color: white; padding: 0.6rem; border-radius: 8px; cursor: pointer; }
.confirm-delete-btn:hover:not(:disabled) { background: #aa3030; }
.confirm-delete-btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>
