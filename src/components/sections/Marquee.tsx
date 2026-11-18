import { Spark } from '../ui/Design'

export function Marquee({
  items,
  footer = false,
}: {
  items: string[]
  footer?: boolean
}) {
  return (
    <div
      className={footer ? 'footer-callout' : 'identity-ticker'}
      aria-hidden="true"
    >
      <div className="marquee-track">
        {[0, 1].map((copy) => (
          <div className="marquee-group" key={copy}>
            {items.map((item, index) => (
              <span key={index}>
                {item}
                <Spark />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
