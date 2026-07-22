import Image from "next/image";
import Link from "next/link";
import { prospect } from "@/config/prospect";
import { TierGate } from "@/components/tier/TierGate";

export function SiteFooter() {
  const { social } = prospect.contact;

  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Image
            src={prospect.branding.crestOnDark ?? prospect.branding.crest}
            alt={`${prospect.club.name} crest`}
            width={80}
            height={79}
          />
          {prospect.club.tagline && <p>{prospect.club.tagline}</p>}
        </div>

        <div className="footer-links">
          <span className="footer-label">Explore</span>
          <Link href="/roster">Roster</Link>
          <Link href="/schedule">Schedule</Link>
        </div>

        <div className="footer-matchday">
          <span className="footer-label">Matchday</span>
          <p>{prospect.club.venue}</p>
          <p>{prospect.contact.address}</p>
          <a href={`mailto:${prospect.contact.email}`}>{prospect.contact.email}</a>
        </div>

        {(social?.instagram || social?.youtube) && (
          <div className="footer-social">
            <span className="footer-label">Follow</span>
            <div className="footer-social-links">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${prospect.club.name} on Instagram`}
                  title="Instagram"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4.25" />
                    <circle className="social-icon-fill" cx="17.4" cy="6.7" r="1.15" />
                  </svg>
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${prospect.club.name} on YouTube`}
                  title="YouTube"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24">
                    <rect x="2.5" y="5.25" width="19" height="13.5" rx="4" />
                    <path className="social-icon-fill" d="m10 9 5 3-5 3Z" />
                  </svg>
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      <TierGate feature="sponsors">
        <div className="footer-partners">
          <span>Club partners</span>
          {prospect.sponsors.map((sponsor) => (
            <span className="footer-partner-logo" key={sponsor.id}>
              <Image src={sponsor.logo} alt={sponsor.name} width={140} height={44}/>
            </span>
          ))}
        </div>
      </TierGate>

      <div className="footer-bottom">
        <span>© 2026 {prospect.club.name}</span>
        <span>Interactive concept preview — sample content only.</span>
      </div>
    </footer>
  );
}
