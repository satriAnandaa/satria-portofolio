import type { Project } from '@/lib/content'
import { Arrow } from '../ui/Design'

/** Original illustrations for existing concepts, never presented as shipped-product screenshots. */
export function ProjectVisual({ project }: { project: Project }) {
  const dashboard =
    project.slug?.includes('analytics') ||
    project.category?.toLowerCase().includes('dashboard')
  const brand = project.slug?.includes('brand')
  return (
    <div
      className={
        'project-illustration ' +
        (dashboard ? 'visual-data' : brand ? 'visual-brand' : 'visual-personal')
      }
      aria-hidden="true"
    >
      <div className="mock-window">
        <div className="mock-chrome">
          <i />
          <i />
          <i />
          <span>
            {dashboard
              ? 'analytics / workspace'
              : brand
                ? 'brand / launch'
                : 'creative / portfolio'}
          </span>
        </div>
        {dashboard ? (
          <div className="mock-analytics">
            <aside>
              <span className="mock-logo">a.</span>
              <b>▦</b>
              <b>≋</b>
              <b>◷</b>
            </aside>
            <div className="mock-dash-main">
              <div className="mock-dash-title">
                Data overview <span>WORKSPACE ↗</span>
              </div>
              <div className="mock-data-grid">
                <div>
                  <span>01 / SOURCE</span>
                  <strong>
                    Explore
                    <br />
                    the structure.
                  </strong>
                </div>
                <div className="mock-chart">
                  <svg viewBox="0 0 300 120">
                    <path
                      d="M0 100 40 75 75 90 120 45 160 60 220 18 260 38 300 5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      d="M0 40H300M0 80H300M50 0V120M150 0V120M250 0V120"
                      stroke="currentColor"
                      strokeOpacity=".12"
                    />
                  </svg>
                </div>
              </div>
              <div className="mock-query">
                <span>QUERY / MYSQL</span>
                <code>
                  SELECT table_name, column_name
                  <br />
                  FROM information_schema.columns;
                </code>
              </div>
              <div className="mock-table">
                {Array.from({ length: 12 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
            </div>
          </div>
        ) : brand ? (
          <div className="mock-brand">
            <span className="mock-logo">brand / concept</span>
            <div className="mock-brand-title">
              Ideas take
              <br />
              <em>shape.</em>
            </div>
            <span className="mock-pill">
              A new perspective <Arrow />
            </span>
            <div className="mock-brand-object">
              <i />
              <i />
              <i />
            </div>
            <div className="mock-brand-bottom">
              DESIGN WITH PURPOSE <span>EST. / CONCEPT</span>
            </div>
          </div>
        ) : (
          <div className="mock-personal">
            <span className="mock-logo">creative.</span>
            <span className="mock-index">SELECTED WORK / CONCEPT</span>
            <div className="mock-personal-title">
              Make it
              <br />
              <em>meaningful.</em>
            </div>
            <div className="mock-personal-bottom">
              <span>
                Digital experiences
                <br />
                with a point of view.
              </span>
              <Arrow />
            </div>
          </div>
        )}
      </div>
      <span className="illustration-label">
        ILUSTRASI KONSEP / BUKAN TANGKAPAN LAYAR PRODUK
      </span>
    </div>
  )
}
