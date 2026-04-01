"use client";

import { useEffect, useState, useTransition } from "react";
import styles from "@/app/page.module.css";

const INITIAL_FORM = {
  name: "",
  email: "",
  company: "",
};

function formatDate(value) {
  return new Date(value).toLocaleString("pt-BR");
}

async function readJsonSafely(response) {
  const raw = await response.text();

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`Resposta inválida do servidor (${response.status}).`);
  }
}

export default function HomePage() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function loadEntries() {
    const response = await fetch("/api/waitlist", { cache: "no-store" });
    const data = await readJsonSafely(response);

    if (!response.ok) {
      throw new Error(data.error || "Erro ao carregar registros.");
    }

    setEntries(data.entries || []);
  }

  useEffect(() => {
    startTransition(() => {
      loadEntries().catch((loadError) => setError(loadError.message));
    });
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    setFeedback("");
    setError("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await readJsonSafely(response);

      if (!response.ok) {
        throw new Error(data.error || "Erro ao salvar registro.");
      }

      setForm(INITIAL_FORM);
      setFeedback("Registro salvo com sucesso no RDS.");
      await loadEntries();
    } catch (saveError) {
      setError(saveError.message);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Smoke Test Fullstack</p>
        <h1>AWS App Runner + RDS + Prisma</h1>
        <p>
          Este SaaS mínimo existe para provar uma coisa só: a aplicação sobe, conecta no banco AWS, grava registros e lê de volta.
        </p>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>Novo lead</h2>
          <form className={styles.form} onSubmit={onSubmit}>
            <label>
              Nome
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
              />
            </label>

            <label>
              E-mail
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
              />
            </label>

            <label>
              Empresa
              <input
                value={form.company}
                onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
              />
            </label>

            <button className={styles.button} type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar no banco"}
            </button>
          </form>

          <p className={styles.hint}>Se esse cadastro funcionar localmente e no App Runner, a infraestrutura básica está validada.</p>
          {feedback ? <p className={styles.success}>{feedback}</p> : null}
          {error ? <p className={styles.error}>{error}</p> : null}
        </div>

        <div className={styles.card}>
          <h2>Registros no banco</h2>
          {entries.length === 0 ? <p className={styles.empty}>Nenhum lead salvo ainda.</p> : null}

          <div className={styles.list}>
            {entries.map((entry) => (
              <article key={entry.id} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <strong>{entry.name}</strong>
                  <span>{formatDate(entry.createdAt)}</span>
                </div>
                <div className={styles.entryMeta}>{entry.email}</div>
                <div className={styles.entryMeta}>{entry.company || "Sem empresa informada"}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
