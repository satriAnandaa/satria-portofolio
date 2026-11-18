import type { Section } from '@/lib/content'
import { Spark } from '../ui/Design'

export function Heading({
  data,
  centered = false,
}: {
  data: Section
  centered?: boolean
}) {
  return (
    <div
      className={
        'section-heading ' + (centered ? 'section-heading--center' : '')
      }
    >
      <div>
        <p className="eyebrow">
          <Spark />
          {data.eyebrow || 'Satria / Portfolio'}
        </p>
        <h2>
          {data.title} <em>{data.accent}</em>
        </h2>
      </div>
      {data.description && <p className="section-intro">{data.description}</p>}
    </div>
  )
}
