import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, type Locale, messages } from "./messages";

/** Lee la cookie de idioma. Server components usan esto. Devuelve el default si no hay o es inválida. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE)?.value;
  return (LOCALES as readonly string[]).includes(raw ?? "") ? (raw as Locale) : DEFAULT_LOCALE;
}

/** Atajo — devuelve locale + messages en una llamada. */
export async function getT() {
  const locale = await getLocale();
  return { locale, t: messages[locale] };
}
