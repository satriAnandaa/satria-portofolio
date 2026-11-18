import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import initial from '../data/initial-content.json'

const payload = await getPayload({ config })
const context = { skipRevalidate: true }
for (const [key, documents] of Object.entries({
  projects: initial.projects, skills: initial.skills, 'process-steps': initial.processSteps,
  experiences: initial.experiences, education: initial.education,
})) {
  for (const document of documents) {
    const existing = await payload.find({ collection: key as 'projects', where: { legacyId: { equals: document.legacyId } }, limit: 1 })
    if (!existing.totalDocs) await payload.create({ collection: key as 'projects', data: document as never, context })
  }
}
for (const [slug, data] of [['profile', initial.profile], ['site-settings', initial.siteSettings]] as const) {
  const current = await payload.findGlobal({ slug })
  if (!current.imported) await payload.updateGlobal({ slug, data: data as never, context })
}
console.log('Seed selesai. Data yang sudah ada tidak ditimpa dan tidak digandakan.')
await payload.destroy()
process.exit(0)
