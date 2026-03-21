<template>
  <div>
    <h2 style="margin-bottom: 1.5rem">🌍 Océans & Mers du monde</h2>

    <div v-if="loading" class="loading">Chargement des données...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <div v-else>
      <div v-if="deleteMsg" class="success-msg">✅ {{ deleteMsg }}</div>

      <div style="margin-bottom: 1.5rem; display: flex; gap: 0.8rem; flex-wrap: wrap">
        <button class="filter-btn" :class="{ active: filter === 'all' }" @click="filter = 'all'">Tous ({{ oceans.length }})</button>
        <button class="filter-btn" :class="{ active: filter === 'ocean' }" @click="filter = 'ocean'">Océans</button>
        <button class="filter-btn" :class="{ active: filter === 'mer' }" @click="filter = 'mer'">Mers</button>
      </div>

      <div v-if="!selected" class="grid">
        <div v-for="ocean in filtered" :key="ocean.id" class="card ocean-card">
          <div class="card-img" @click="selected = ocean">
            <img v-if="ocean.image_url" :src="ocean.image_url" :alt="ocean.name" @error="e => e.target.style.display='none'" />
            <div v-else class="img-placeholder">🌊</div>
          </div>
          <div class="card-body" @click="selected = ocean">
            <span class="badge" :class="ocean.type === 'ocean' ? 'badge-ocean' : 'badge-mer'">
              {{ ocean.type === 'ocean' ? '🌊 Océan' : '🏖️ Mer' }}
            </span>
            <h3 style="margin-bottom: 0.6rem">{{ ocean.name }}</h3>
            <p class="stat">Superficie : <span>{{ ocean.area_km2.toLocaleString('fr-FR') }} km²</span></p>
            <p class="stat">Profondeur max : <span>{{ ocean.max_depth_m ? ocean.max_depth_m.toLocaleString('fr-FR') + ' m' : 'N/A' }}</span></p>
            <p style="margin-top: 0.6rem; font-size: 0.85rem; color: #6a9ad0; line-height: 1.5">{{ ocean.description.slice(0, 90) }}…</p>
          </div>
          <div class="card-footer">
            <button class="delete-btn" @click.stop="confirmDelete(ocean)">🗑️ Supprimer</button>
          </div>
        </div>
      </div>

      <div v-else>
        <button class="back-btn" @click="selected = null">← Retour</button>
        <div class="card detail-card" style="cursor: default">
          <img v-if="selected.image_url" :src="selected.image_url" :alt="selected.name" class="detail-img" @error="e => e.target.style.display='none'" />
          <div style="padding: 1.5rem">
            <span class="badge" :class="selected.type === 'ocean' ? 'badge-ocean' : 'badge-mer'">
              {{ selected.type === 'ocean' ? '🌊 Océan' : '🏖️ Mer' }}
            </span>
            <h2 style="margin-bottom: 1rem">{{ selected.name }}</h2>
            <p style="color: #8ab8e8; margin-bottom: 1.5rem; line-height: 1.6">{{ selected.description }}</p>
            <div class="stats-grid">
              <div class="stat-box"><span>📐 Superficie</span><strong>{{ selected.area_km2.toLocaleString('fr-FR') }} km²</strong></div>
              <div class="stat-box"><span>⬇️ Profondeur max</span><strong>{{ selected.max_depth_m ? selected.max_depth_m.toLocaleString('fr-FR') + ' m' : 'N/A' }}</strong></div>
              <div class="stat-box"><span>🌡️ Température</span><strong>{{ selected.avg_temp_celsius ? selected.avg_temp_celsius + ' °C' : 'N/A' }}</strong></div>
              <div class="stat-box"><span>📍 Localisation</span><strong>{{ selected.location || 'N/A' }}</strong></div>
            </div>
            <div v-if="selected.fun_fact" class="fun-fact">💡 {{ selected.fun_fact }}</div>
            <button class="delete-btn" style="margin-top: 1.5rem" @click="confirmDelete(selected)">🗑️ Supprimer cet océan</button>
          </div>
        </div>
      </div>
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
    return { oceans: [], loading: true, error: null, selected: null, filter: "all", toDelete: null, deleting: false, deleteMsg: null };
  },
  computed: {
    filtered() {
      if (this.filter === "all") return this.oceans;
      return this.oceans.filter((o) => o.type === this.filter);
    }
  },
  methods: {
    confirmDelete(ocean) { this.toDelete = ocean; },
    async doDelete() {
      this.deleting = true;
      try {
        const res = await fetch(`${API_BASE}/oceans/${this.toDelete.id}`, { method: "DELETE" });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        this.oceans = this.oceans.filter((o) => o.id !== this.toDelete.id);
        this.deleteMsg = json.message;
        if (this.selected?.id === this.toDelete.id) this.selected = null;
        this.toDelete = null;
        setTimeout(() => (this.deleteMsg = null), 3000);
      } catch (e) { this.error = e.message; } finally { this.deleting = false; }
    }
  },
  async mounted() {
    try {
      const res = await fetch(`${API_BASE}/oceans`);
      const json = await res.json();
      this.oceans = json.data;
    } catch { this.error = "Impossible de contacter l'API."; } finally { this.loading = false; }
  }
};
</script>

<style scoped>
.filter-btn { background: transparent; border: 1px solid #2a6ab5; color: #8ab8e8; padding: 0.4rem 1rem; border-radius: 20px; cursor: pointer; transition: all 0.2s; }
.filter-btn:hover, .filter-btn.active { background: #2a6ab5; color: white; }
.ocean-card { padding: 0; overflow: hidden; display: flex; flex-direction: column; }
.card-img { height: 160px; overflow: hidden; cursor: pointer; background: #0a1828; display: flex; align-items: center; justify-content: center; }
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.card-img:hover img { transform: scale(1.05); }
.img-placeholder { font-size: 3rem; }
.card-body { padding: 1.2rem; flex: 1; cursor: pointer; }
.card-footer { padding: 0.8rem 1.2rem; border-top: 1px solid #1a3a6a; }
.detail-card { padding: 0; overflow: hidden; }
.detail-img { width: 100%; height: 280px; object-fit: cover; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
.stat-box { background: #0a1828; border-radius: 8px; padding: 0.8rem; display: flex; flex-direction: column; gap: 0.3rem; }
.stat-box span { font-size: 0.8rem; color: #6a9ad0; }
.stat-box strong { color: #e0f0ff; }
.fun-fact { background: #0a2040; border-left: 3px solid #2a6ab5; padding: 1rem; border-radius: 0 8px 8px 0; font-style: italic; color: #8ab8e8; }
.back-btn { margin-bottom: 1.5rem; background: transparent; border: 1px solid #2a6ab5; color: #6ab0ff; padding: 0.4rem 1rem; border-radius: 8px; cursor: pointer; }
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
