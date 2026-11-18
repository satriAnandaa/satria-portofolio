import type { Profile, Section } from '@/lib/content'
import { ContactForm } from '../ui/ContactForm'
import { Arrow } from '../ui/Design'
import { Heading } from './SectionHeading'

export function ContactSection({
  profile,
  data,
}: {
  profile: Profile
  data: Section
}) {
  const mapQuery = encodeURIComponent(profile.location)
  return (
    <section
      className="section contact-section"
      id="contact"
      aria-label="Kontak"
    >
      <div className="container">
        <div className="contact-grid">
          <div>
            <Heading data={data} />
            <div className="contact-detail">
              <span className="contact-icon">@</span>
              <div>
                <span>Email</span>
                <a href={'mailto:' + profile.email}>{profile.email}</a>
              </div>
            </div>
            {profile.phone && (
              <div className="contact-detail">
                <span className="contact-icon">↗</span>
                <div>
                  <span>Telepon / WhatsApp</span>
                  <a href={'tel:' + profile.phone}>{profile.phone}</a>
                </div>
              </div>
            )}
            <div className="contact-detail">
              <span className="contact-icon">⌖</span>
              <div>
                <span>Berbasis di</span>
                <strong>{profile.location}</strong>
              </div>
            </div>
            <div className="contact-socials">
              {profile.socialLinks?.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <Arrow />
                </a>
              ))}
            </div>
          </div>
          <figure className="contact-map">
            <iframe
              src={
                'https://www.google.com/maps?q=' +
                mapQuery +
                '&z=9&output=embed'
              }
              title={'Peta lokasi umum — ' + profile.location}
              loading="lazy"
              width="640"
              height="500"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
            <figcaption>
              <span>
                Peta wilayah {profile.location}. Lokasi ditampilkan secara umum.
              </span>
              <a
                href={
                  'https://www.google.com/maps/search/?api=1&query=' + mapQuery
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka Google Maps <Arrow />
              </a>
            </figcaption>
          </figure>
        </div>
        <div className="contact-form-panel">
          <h3>Mari mulai percakapan.</h3>
          <ContactForm email={profile.email} />
        </div>
      </div>
    </section>
  )
}
