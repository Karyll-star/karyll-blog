'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\blog\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {codeInput} from '@sanity/code-input'
import {markdownSchema} from 'sanity-plugin-markdown'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './sanity/env'
import {schema} from './sanity/schema'


export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    // Sanity 内容管理主工具（Desk）
    deskTool({
      // 可选：如果需要自定义结构，取消下一行注释
      // structure,
    }),
    codeInput(),
    markdownSchema(),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
