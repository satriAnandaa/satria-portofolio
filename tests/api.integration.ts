import 'dotenv/config'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { getPayload } from 'payload'
import config from '../src/payload.config'

test(
  'production HTTP: content lifecycle, protected preview, accounts and media',
  { timeout: 180000 },
  async (t) => {
    const base = process.env.TEST_SERVER_URL || 'http://localhost:3000'
    if (
      !['localhost', '127.0.0.1'].includes(new URL(base).hostname) ||
      !['localhost', '127.0.0.1'].includes(
        new URL(process.env.DATABASE_URL!).hostname,
      )
    )
      throw new Error(
        'Integration tests only run against local development data.',
      )
    const payload = await getPayload({ config })
    const suffix = randomBytes(6).toString('hex')
    const email = 'qa-' + suffix + '@example.test'
    const password = randomBytes(24).toString('base64url')
    const context = { skipRevalidate: true }
    const user = await payload.create({
      collection: 'users',
      data: { email, password },
      context: { ...context, bootstrapAdmin: true },
    })
    let projectID: number | undefined
    let mediaID: number | undefined
    let jwt = ''
    let keepSession = false
    const request = (route: string, options: RequestInit = {}, auth = false) =>
      fetch(base + route, {
        ...options,
        headers: {
          ...(auth ? { Authorization: 'JWT ' + jwt } : {}),
          ...options.headers,
        },
      })
    const json = (method: string, data: unknown): RequestInit => ({
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    try {
      const login = await request(
        '/api/users/login',
        json('POST', { email, password }),
      )
      assert.equal(login.status, 200)
      jwt = (await login.json()).token
      assert.ok(jwt)
      await t.test(
        'anonymous writes, users, preview, and first-user registration denied',
        async () => {
          assert.ok(
            (
              await request(
                '/api/projects',
                json('POST', { title: 'Unauthorized' }),
              )
            ).status >= 400,
          )
          assert.ok((await request('/api/users')).status >= 400)
          assert.equal(
            (await request('/preview?path=/', { redirect: 'manual' })).status,
            401,
          )
          assert.ok(
            (
              await request(
                '/api/users/first-register',
                json('POST', { email: 'intruder@example.test', password }),
              )
            ).status >= 400,
          )
        },
      )
      const slug = 'qa-project-' + suffix
      await t.test(
        'draft remains private in list, direct lookup, HTML, and draft query',
        async () => {
          const response = await request(
            '/api/projects',
            json('POST', {
              title: 'Private QA ' + suffix,
              slug,
              stage: 'concept',
              category: 'Test',
              summary:
                'Temporary integration content, removed after verification.',
              _status: 'draft',
              order: 9999,
            }),
            true,
          )
          assert.equal(response.status, 201)
          projectID = (await response.json()).doc.id
          assert.ok((await request('/api/projects/' + projectID)).status >= 400)
          assert.ok(
            !(
              await (await request('/api/projects?draft=true')).text()
            ).includes('Private QA ' + suffix),
          )
          assert.equal((await request('/projects/' + slug)).status, 404)
          const preview = await request(
            '/preview?path=' + encodeURIComponent('/projects/' + slug),
            { redirect: 'manual' },
            true,
          )
          assert.ok([302, 303, 307].includes(preview.status))
          assert.ok(
            preview.headers.get('set-cookie')?.includes('__prerender_bypass'),
          )
        },
      )
      await t.test(
        'publish and edit appear without rebuilding; draft edits stay private',
        async () => {
          assert.equal(
            (
              await request(
                '/api/projects/' + projectID,
                json('PATCH', {
                  _status: 'published',
                  title: 'Published QA ' + suffix,
                }),
                true,
              )
            ).status,
            200,
          )
          assert.equal((await request('/projects/' + slug)).status, 200)
          assert.ok(
            (await (await request('/projects/' + slug)).text()).includes(
              'Published QA ' + suffix,
            ),
          )
          assert.equal(
            (
              await request(
                '/api/projects/' + projectID + '?draft=true',
                json('PATCH', {
                  title: 'Secret revision ' + suffix,
                  _status: 'draft',
                }),
                true,
              )
            ).status,
            200,
          )
          assert.ok(
            !(await (await request('/projects/' + slug)).text()).includes(
              'Secret revision ' + suffix,
            ),
          )
          assert.ok(
            !(
              await (await request('/api/projects?draft=true')).text()
            ).includes('Secret revision ' + suffix),
          )
          const versions = await request(
            '/api/projects/versions?limit=20',
            {},
            true,
          )
          assert.equal(versions.status, 200)
          const previous = (await versions.json()).docs.find(
            (item: { id: number; version: { title?: string } }) =>
              item.version.title === 'Published QA ' + suffix,
          )
          assert.ok(previous)
          assert.equal(
            (
              await request(
                '/api/projects/versions/' + previous.id,
                json('POST', {}),
                true,
              )
            ).status,
            200,
          )
          assert.equal(
            (
              await (
                await request('/api/projects/' + projectID, {}, true)
              ).json()
            ).title,
            'Published QA ' + suffix,
          )
        },
      )
      await t.test(
        'archive removes published content; unpublish returns 404',
        async () => {
          await request(
            '/api/projects/' + projectID,
            json('PATCH', { _status: 'published', archived: true }),
            true,
          )
          assert.equal((await request('/projects/' + slug)).status, 404)
          await request(
            '/api/projects/' + projectID,
            json('PATCH', { _status: 'published', archived: false }),
            true,
          )
          assert.equal((await request('/projects/' + slug)).status, 200)
          await request(
            '/api/projects/' + projectID,
            json('PATCH', { _status: 'draft' }),
            true,
          )
          assert.equal((await request('/projects/' + slug)).status, 404)
        },
      )
      await t.test(
        'global draft endpoint is denied to anonymous callers',
        async () => {
          assert.ok(
            (await request('/api/globals/profile?draft=true')).status >= 400,
          )
          assert.equal((await request('/api/globals/profile')).status, 200)
          const before = await payload.findGlobal({ slug: 'site-settings' })
          try {
            await payload.updateGlobal({
              slug: 'site-settings',
              draft: true,
              data: { heroGreeting: 'Confidential draft ' + suffix },
              context,
            })
            assert.ok(
              !(await (await request('/')).text()).includes(
                'Confidential draft ' + suffix,
              ),
            )
            assert.ok(
              !(
                await (await request('/api/globals/site-settings')).text()
              ).includes('Confidential draft ' + suffix),
            )
          } finally {
            await payload.updateGlobal({
              slug: 'site-settings',
              data: { heroGreeting: before.heroGreeting, _status: 'published' },
              context,
            })
          }
        },
      )
      await t.test(
        'spoofed uploads rejected; private bytes protected, public bytes readable',
        async () => {
          const bad = new FormData()
          bad.set(
            '_payload',
            JSON.stringify({
              title: 'Invalid',
              alt: 'Invalid',
              visibility: 'private',
            }),
          )
          bad.set(
            'file',
            new Blob(['placeholder'], { type: 'image/png' }),
            'invalid.png',
          )
          assert.ok(
            (await request('/api/media', { method: 'POST', body: bad }, true))
              .status >= 400,
          )
          const data = new FormData()
          data.set(
            '_payload',
            JSON.stringify({
              title: 'QA upload ' + suffix,
              alt: 'Temporary test portrait',
              visibility: 'private',
            }),
          )
          data.set(
            'file',
            new Blob([await readFile('assets/images/about.png')], {
              type: 'image/png',
            }),
            'qa-' + suffix + '.png',
          )
          const upload = await request(
            '/api/media',
            { method: 'POST', body: data },
            true,
          )
          assert.equal(upload.status, 201)
          const media = (await upload.json()).doc
          mediaID = media.id
          const file = new URL(media.url, base).pathname
          assert.ok((await request(file)).status >= 400)
          assert.ok((await request('/api/media/' + mediaID)).status >= 400)
          assert.equal(
            (
              await request(
                '/api/media/' + mediaID,
                json('PATCH', { visibility: 'public' }),
                true,
              )
            ).status,
            200,
          )
          assert.equal((await request(file)).status, 200)
          assert.equal((await request('/api/media/' + mediaID)).status, 200)
        },
      )
      await t.test('legacy redirects, CV and content persistence', async () => {
        const legacy = await request('/resume.html', { redirect: 'manual' })
        assert.equal(legacy.status, 308)
        assert.ok(legacy.headers.get('location')?.endsWith('/cv'))
        const cv = await request('/cv')
        assert.equal(cv.status, 200)
        assert.ok((await cv.text()).includes('Satria Ananda'))
        const contact = await request('/contact')
        assert.equal(contact.status, 200)
        const contactHTML = await contact.text()
        assert.ok(contactHTML.includes('www.google.com/maps?q='))
        assert.ok(contactHTML.includes('Hire Me'))
        assert.ok(contactHTML.includes('Peta lokasi umum'))
        assert.equal(
          (await request('/index.html', { redirect: 'manual' })).status,
          308,
        )
      })
      await t.test(
        'optional content stays private until published and enabled; blog routes resolve',
        async () => {
          const before = await payload.findGlobal({ slug: 'site-settings' })
          const created: {
            collection:
              'services' | 'awards' | 'testimonials' | 'pricing-plans' | 'posts'
            id: number
          }[] = []
          const fixtures = [
            {
              collection: 'services',
              key: 'services',
              data: { summary: 'Temporary QA service' },
            },
            {
              collection: 'awards',
              key: 'awards',
              data: { issuer: 'QA fixture issuer' },
            },
            {
              collection: 'testimonials',
              key: 'testimonials',
              data: {
                author: 'QA fixture author',
                quote: 'Temporary test quotation.',
              },
            },
            {
              collection: 'pricing-plans',
              key: 'pricing',
              data: { priceLabel: 'QA fixture price' },
            },
            {
              collection: 'posts',
              key: 'blog',
              data: {
                slug: 'qa-post-' + suffix,
                excerpt: 'Temporary QA excerpt',
                body: 'Paragraph one.\n\nParagraph two.',
                publishedDate: new Date().toISOString(),
              },
            },
          ] as const
          try {
            await payload.updateGlobal({
              slug: 'site-settings',
              context,
              data: {
                optionalSections: {
                  services: false,
                  awards: false,
                  testimonials: false,
                  pricing: false,
                  blog: false,
                },
                _status: 'published',
              },
            })
            for (const fixture of fixtures) {
              const title = 'Optional QA ' + fixture.key + ' ' + suffix
              const create = await request(
                '/api/' + fixture.collection,
                json('POST', { title, ...fixture.data, _status: 'draft' }),
                true,
              )
              assert.equal(create.status, 201)
              const id = (await create.json()).doc.id
              created.push({ collection: fixture.collection, id })
              assert.ok(
                !(
                  await (
                    await request('/api/' + fixture.collection + '?draft=true')
                  ).text()
                ).includes(title),
              )
              assert.ok(
                !(await (await request('/')).text()).includes(
                  'id="' + fixture.key + '"',
                ),
              )
              assert.equal(
                (
                  await request(
                    '/api/' + fixture.collection + '/' + id,
                    json('PATCH', { _status: 'published' }),
                    true,
                  )
                ).status,
                200,
              )
              assert.ok(
                !(await (await request('/')).text()).includes(
                  'id="' + fixture.key + '"',
                ),
              )
            }
            assert.equal((await request('/blog/qa-post-' + suffix)).status, 404)
            await payload.updateGlobal({
              slug: 'site-settings',
              context,
              data: {
                optionalSections: {
                  services: true,
                  awards: true,
                  testimonials: true,
                  pricing: true,
                  blog: true,
                },
                _status: 'published',
              },
            })
            const html = await (await request('/')).text()
            for (const fixture of fixtures) {
              assert.ok(html.includes('id="' + fixture.key + '"'))
              assert.ok(
                html.includes(
                  fixture.key === 'testimonials'
                    ? 'QA fixture author'
                    : 'Optional QA ' + fixture.key + ' ' + suffix,
                ),
              )
            }
            assert.equal((await request('/blog')).status, 200)
            const article = await request('/blog/qa-post-' + suffix)
            assert.equal(article.status, 200)
            assert.ok((await article.text()).includes('Paragraph two.'))
            const post = created.find((item) => item.collection === 'posts')!
            await request(
              '/api/posts/' + post.id,
              json('PATCH', { _status: 'draft' }),
              true,
            )
            assert.equal((await request('/blog/qa-post-' + suffix)).status, 404)
            assert.ok(
              !(await (await request('/')).text()).includes('id="blog"'),
            )
          } finally {
            await payload.updateGlobal({
              slug: 'site-settings',
              context,
              data: {
                optionalSections: before.optionalSections,
                _status: 'published',
              },
            })
            for (const item of created)
              await payload.delete({ ...item, context })
          }
        },
      )
      if (process.env.QA_KEEP_SESSION === 'true') {
        await mkdir('.data', { recursive: true })
        await writeFile(
          '.data/browser-session.json',
          JSON.stringify({ email, password, id: user.id }),
          { mode: 0o600 },
        )
        keepSession = true
        console.log(
          'Temporary browser QA account retained in ignored .data; remove with the documented cleanup after browser QA.',
        )
      }
    } finally {
      if (mediaID)
        await payload.delete({ collection: 'media', id: mediaID, context })
      if (projectID)
        await payload.delete({ collection: 'projects', id: projectID, context })
      if (!keepSession)
        await payload.delete({ collection: 'users', id: user.id, context })
      await payload.destroy()
      // Payload/Next may retain CLI handles; test-force-exit runs only after these awaited cleanups.
      void payload.db.pool.end()
    }
  },
)
