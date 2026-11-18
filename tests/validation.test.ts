import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateSlug, validateURL, recognizedFile } from '../src/lib/validation'
test('URLs reject executable and malformed protocols', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,<script>', '//example.com', 'not a url']) assert.notEqual(validateURL(url), true)
  for (const url of ['https://github.com/satriAnandaa', 'http://localhost:3000', '']) assert.equal(validateURL(url), true)
})
test('project slugs cannot escape the project route', () => {
  for (const slug of ['../admin', 'Project X', '/test', 'x?draft=true', '']) assert.notEqual(validateSlug(slug), true)
  assert.equal(validateSlug('analytics-ui-2026'), true)
})
test('file signatures reject placeholder content and disguised SVG/HTML', () => {
  for (const text of ['placeholder', 'placeholder pdf', '<svg onload="alert(1)">', '<html>test</html>']) assert.equal(recognizedFile(Buffer.from(text)), null)
  assert.equal(recognizedFile(Buffer.from('%PDF-1.7')), 'application/pdf')
  assert.equal(recognizedFile(Buffer.from([137,80,78,71,13,10,26,10])), 'image/png')
})
