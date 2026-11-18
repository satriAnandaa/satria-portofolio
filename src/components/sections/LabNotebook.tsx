import type { Settings } from '@/lib/content'
import { Spark } from '../ui/Design'

export function LabNotebook({ settings }: { settings: Settings }) {
  return (
    <figure className="lab-sheet process-notebook">
      <div className="lab-topline">
        <span>DATA / CODE / CLARITY</span>
        <Spark />
      </div>
      <figcaption>{settings.notebookTitle}</figcaption>
      <div className="query-header">
        <span>schema_notes.sql</span>
        <span>MYSQL</span>
      </div>
      <pre
        className="query-code"
        tabIndex={0}
        aria-label="Query MySQL ilustratif"
      >
        <code>{settings.query}</code>
      </pre>
      <p className="lab-note">{settings.queryNote}</p>
    </figure>
  )
}
