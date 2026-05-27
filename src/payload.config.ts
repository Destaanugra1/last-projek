import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { BlogPosts } from './collections/BlogPosts'
import { Partners } from './collections/Partners'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Reports } from './collections/Reports'
import { WasteCategories } from './collections/WasteCategories'
import { ReporterApplications } from './collections/ReporterApplications'
import { SiteSettings } from './globals/SiteSettings'
import { ReporterRegistration } from './globals/ReporterRegistration'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, WasteCategories, Reports, BlogPosts, Partners, ReporterApplications],
  editor: lexicalEditor(),
  globals: [SiteSettings, ReporterRegistration],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (process.env.DATABASE_URL || '').replace(
        /sslmode=(prefer|require|verify-ca)/,
        'sslmode=verify-full',
      ),
    },
  }),
  sharp,
  plugins: [],
})
