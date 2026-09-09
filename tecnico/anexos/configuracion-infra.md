# Anexo — Configuración e infraestructura (locale)

Complementa el [informe técnico](../INFORME-tecnico.md).

## 1. Modelo

**Un deploy por cultura.** Variables y pipelines para ES (ya en matriz) y patrón a replicar en otros idiomas.

## 2. Variables de entorno / build

| Variable | Rol | ES (referencia) |
|----------|-----|-----------------|
| `NEXT_PUBLIC_LOCALE` | Cultura del build (`es`) | Obligatorio |
| `NEXT_PUBLIC_SITE_URL` | Canonical / OG | `https://www.fxstreet.es` / QA `https://qa.fxstreet.es` |
| `NEXT_PUBLIC_CDN_URL` | Assets | `https://staticcontent.fxsstatic.com/site/es` (+ `-qa`) |
| `NEXT_PUBLIC_SITE_GATEWAY_URL_TEMPLATE` | Gateway | `https://site-gateway-{locale}{site_env}.fxstreet.com` |
| `NEXT_PUBLIC_USER_AUTH_*` | Auth | Plantillas compartidas |
| `NEXT_PUBLIC_SITE_ENV` | `qa` / vacío pro | Language switcher |
| `AUTHORIZATION_APITOKEN` | Token gateway | Por entorno |

## 3. Deploy / CI / CDN / K8s

Fuente: `Site/Build/site-deploy.yaml`.

| culture | env | siteUrl | gateway | CDN | image |
|---------|-----|---------|---------|-----|-------|
| es | qa | qa.fxstreet.es | site-gateway-es-qa | site/es-qa | site-es-qa |
| es | pro | www.fxstreet.es | site-gateway-es | site/es | site-es |
| en | qa/pro | fxstreet.com | site-gateway-en* | site/en* | site-en* |

**Validar antes de go-live:** DNS/ingress, gateway `Languages.es`, CDN, smoke QA/PRO.

## 4. Tipado / helpers

| Pieza | Path | ES |
|-------|------|-----|
| `SiteLocale` | `locale-keyed.ts` | Incluye `es` |
| `CALENDAR_BASE_PATH` | `calendar-base-path.ts` | `/calendario-economico` |
| Language switcher | `languages.ts` | Entrada Español → fxstreet.es |
| next-intl loader | `i18n/request.ts` | Base modular + componentes + RSS |

## 5. Formatos

| Área | Nota |
|------|------|
| Fechas UI | `Intl` + locale |
| Premium | `Intl.NumberFormat` — QA en ES |
| Rates charts | Propuesta informe D9: mantener `en-US` |

## 6. Redirects

`Site/redirects.ts` es locale-aware (`NEXT_PUBLIC_LOCALE`). Detalle en [routing-seo-producto.md](./routing-seo-producto.md) (mismo directorio).

## 7. Terceros

Validar por locale: emails soporte, OneSignal, Turnstile/aria, banner cookies.
