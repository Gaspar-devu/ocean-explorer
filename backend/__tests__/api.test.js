const request = require("supertest");
const app = require("../server");


describe("GET /api/health", () => {
  it("doit retourner status ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/oceans", () => {
  it("doit retourner la liste des océans", async () => {
    const res = await request(app).get("/api/oceans");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe("GET /api/oceans/:id", () => {
  it("doit retourner un océan par id", async () => {
    const res = await request(app).get("/api/oceans/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.id).toBe("1");
    expect(res.body.data.name).toBe("Océan Pacifique");
  });

  it("doit retourner 404 si l'id n'existe pas", async () => {
    const res = await request(app).get("/api/oceans/9999");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("POST /api/oceans", () => {
  it("doit créer un nouvel océan", async () => {
    const res = await request(app)
      .post("/api/oceans")
      .send({
        name: "Mer de Test",
        type: "mer",
        area_km2: 500000,
        max_depth_m: 3000,
        avg_temp_celsius: 15,
        location: "Test",
        description: "Une mer de test"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.name).toBe("Mer de Test");
  });

  it("doit refuser un type invalide", async () => {
    const res = await request(app)
      .post("/api/oceans")
      .send({ name: "Test", type: "lac", area_km2: 1000 });
    expect(res.statusCode).toBe(400);
  });

  it("doit refuser si champs obligatoires manquants", async () => {
    const res = await request(app).post("/api/oceans").send({ name: "Test" });
    expect(res.statusCode).toBe(400);
  });
});

describe("GET /api/species", () => {
  it("doit retourner la liste des espèces", async () => {
    const res = await request(app).get("/api/species");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("doit filtrer par catégorie", async () => {
    const res = await request(app).get("/api/species?category=mammifère");
    expect(res.statusCode).toBe(200);
    res.body.data.forEach((s) => {
      expect(s.category).toBe("mammifère");
    });
  });
});

describe("POST /api/species", () => {
  it("doit créer une nouvelle espèce", async () => {
    const res = await request(app)
      .post("/api/species")
      .send({
        name: "Espèce Test",
        scientific_name: "Testus testus",
        category: "poisson",
        conservation_status: "Non évalué",
        description: "Espèce de test"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("doit refuser si champs obligatoires manquants", async () => {
    const res = await request(app).post("/api/species").send({ name: "Test" });
    expect(res.statusCode).toBe(400);
  });
});

describe("DELETE /api/oceans/:id", () => {
  it("doit supprimer un océan existant", async () => {
    const res = await request(app).delete("/api/oceans/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("doit retourner 404 si l'id n'existe pas", async () => {
    const res = await request(app).delete("/api/oceans/9999");
    expect(res.statusCode).toBe(404);
  });
});

describe("DELETE /api/species/:id", () => {
  it("doit supprimer une espèce existante", async () => {
    const res = await request(app).delete("/api/species/1");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("doit retourner 404 si l'id n'existe pas", async () => {
    const res = await request(app).delete("/api/species/9999");
    expect(res.statusCode).toBe(404);
  });
});
