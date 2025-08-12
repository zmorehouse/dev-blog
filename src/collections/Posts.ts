import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: 'Post', plural: 'Posts' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  timestamps: true,
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      labels: { singular: 'Tag', plural: 'Tags' },
      admin: { description: 'Simple text tags for filtering' },
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar' },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.title && !data?.slug) {
          data.slug = slugify(data.title)
        }
        return data
      },
    ],
  },
}
