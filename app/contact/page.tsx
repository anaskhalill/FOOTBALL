"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

interface FormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", email: "", subject: "", message: "" };

export default function ContactPage() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [sent, setSent] = useState(false);

  const update = (key: keyof FormState) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    setForm(EMPTY_FORM);
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4">
      <div className="page-heading">
        <span className="eyebrow">✦ &nbsp; {t("nav.contact")}</span>
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.subtitle")}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <section className="card p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="field-label">
                <span>{t("contact.name")}</span>
                <input
                  className="input-field"
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Alex Morgan"
                />
              </label>
              <label className="field-label">
                <span>{t("contact.email")}</span>
                <input
                  className="input-field"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="alex@example.com"
                />
              </label>
            </div>

            <label className="field-label">
              <span>{t("contact.subject")}</span>
              <input
                className="input-field"
                type="text"
                required
                value={form.subject}
                onChange={update("subject")}
              />
            </label>

            <label className="field-label">
              <span>{t("contact.message")}</span>
              <textarea
                className="input-field min-h-[150px] resize-y"
                required
                value={form.message}
                onChange={update("message")}
              />
            </label>

            <div className="flex flex-wrap items-center gap-3">
              <button type="submit" className="btn-primary">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
                {t("contact.send")}
              </button>
              {sent && (
                <span className="text-xs font-semibold text-[var(--accent-emerald)] animate-fade-in">
                  ✓ {t("contact.sent")}
                </span>
              )}
            </div>
          </form>
        </section>

        <aside className="card card-accent p-5 sm:p-6 flex flex-col gap-4">
          <div className="w-11 h-11  border border-[var(--accent-gold)]/40 flex items-center justify-center text-[var(--accent-gold)] text-lg">
            ✦
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-2">
              {t("contact.infoTitle")}
            </h2>
            <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
              {t("contact.infoText")}
            </p>
          </div>
          <div className="pt-3 border-t border-[var(--border-color)]">
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--accent-gold)]">
              {t("contact.responseTitle")}
            </span>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t("contact.responseTime")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
