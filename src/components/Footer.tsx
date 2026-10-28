import Link from 'next/link'

import type { Dictionary } from '@/i18n/dictionaries'
import type { Locale } from '@/i18n/config'
import { FIRM_NAME, type Site } from '@/lib/site'

import { LanguageSwitcher } from './LanguageSwitcher'

export function Footer({ t, locale, site }: { t: Dictionary; locale: Locale; site: Site }) {
  return (
    <footer className="footer">
      <div className="page">
        <div className="footer__grid">
          <div>
            <p className="footer__name">{FIRM_NAME}</p>
            <address style={{ fontStyle: 'normal', marginTop: '0.6rem' }}>
              <p>{site.address}</p>
              <p>
                <a href={site.phoneHref}>{site.phone}</a>
              </p>
              <p>
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </p>
            </address>
          </div>

          <div>
            <p className="label footer__title">{t.footer.office}</p>
            <p>{t.footer.languagesLine}</p>
            <p style={{ marginTop: '0.6rem' }}>
              <Link href="/sell-with-us#valuation" className="textlink">
                {t.frontPage.requestValuation}
              </Link>
            </p>
          </div>

          <div>
            <p className="label footer__title">{t.footer.fairHousing}</p>
            <ul>
              <li>
                <a href={site.fairHousingUrl} target="_blank" rel="noopener noreferrer">
                  {t.footer.fairHousingNotice}
                </a>
              </li>
              <li>
                <a href={site.disclosureUrl} target="_blank" rel="noopener noreferrer">
                  {t.footer.disclosureForm}
                </a>
              </li>
            </ul>
            {site.licenseLine ? <p style={{ marginTop: '0.6rem' }}>{site.licenseLine}</p> : null}
          </div>
        </div>

        <div className="footer__fine">
          <span>
            © {new Date().getFullYear()} {FIRM_NAME}. {t.footer.rights}
          </span>
          <a href="/admin" className="footer__login" rel="nofollow">
            {t.footer.teamLogin}
          </a>
          <LanguageSwitcher locale={locale} />
        </div>
      </div>
    </footer>
  )
}
