'use client'

import { parseDateTime } from '@zolplay/utils'
import Image from 'next/image'
import React from 'react'

import { BlogPostStateLoader } from '~/app/(main)/blog/BlogPostStateLoader'
import { BlogReactions } from '~/app/(main)/blog/BlogReactions'
import {
  CalendarIcon,
  CursorClickIcon,
  HourglassIcon,
  PencilSwooshIcon,
  ScriptIcon,
  UTurnLeftIcon,
} from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { PostMarkdown } from '~/components/PostMarkdown'
import { PostPortableText } from '~/components/PostPortableText'
import { Prose } from '~/components/Prose'
import { Button } from '~/components/ui/Button'
import { Container } from '~/components/ui/Container'
import { prettifyNumber } from '~/lib/math'
import { type PostDetail } from '~/sanity/schemas/post'
import GithubSlugger from 'github-slugger'

import { BlogPostCard } from './BlogPostCard'
import { BlogPostTableOfContents } from './BlogPostTableOfContents'

const parseMarkdownHeadings = (markdown: string) => {
  const slugger = new GithubSlugger()
  const headingRegex = /^(#{2,4})\s+(.+)$/gm
  const headings: any[] = []
  let match

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2]
    const id = slugger.slug(text)
    headings.push({
      _type: 'block',
      style: `h${level}`,
      _key: id,
      children: [{ _type: 'span', text }],
    })
  }

  return headings
}

export function BlogPostPage({
  post,
  views,
  reactions,
  relatedViews,
}: {
  post: PostDetail
  views?: number
  reactions?: number[]
  relatedViews: number[]
}) {
  const isMarkdown = Boolean(post.markdown)
  const headings = isMarkdown
    ? parseMarkdownHeadings(post.markdown!)
    : post.headings

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="w-full md:flex md:justify-between xl:relative">
        <aside className="hidden w-[160px] shrink-0 lg:block">
          <div className="sticky top-2 pt-20">
            <BlogPostTableOfContents headings={headings} />
          </div>
        </aside>
        <div className="max-w-2xl md:flex-1 md:shrink-0">
          <Button
            href="/blog"
            variant="secondary"
            aria-label="返回博客页面"
            className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
          >
            <UTurnLeftIcon className="h-8 w-8 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
          </Button>
          <article data-postid={post._id}>
            <header className="relative flex flex-col items-center pb-5 after:absolute after:-bottom-1 after:block after:h-px after:w-full after:rounded after:bg-gradient-to-r after:from-zinc-400/20 after:via-zinc-200/10 after:to-transparent dark:after:from-zinc-600/20 dark:after:via-zinc-700/10">
              <div
                className="relative mb-7 aspect-[240/135] w-full md:mb-12 md:w-[110%]"
              >
                <div className="absolute z-0 hidden aspect-[240/135] w-full blur-xl saturate-150 after:absolute after:inset-0 after:hidden after:bg-white/50 dark:after:bg-black/50 md:block md:after:block">
                  <Image
                    src={post.mainImage.asset.url}
                    alt=""
                    className="select-none"
                    unoptimized
                    fill
                    aria-hidden={true}
                  />
                </div>
                <Image
                  src={post.mainImage.asset.url}
                  alt={post.title}
                  className="select-none rounded-2xl ring-1 ring-zinc-900/5 transition dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 md:rounded-3xl"
                  placeholder="blur"
                  blurDataURL={post.mainImage.asset.lqip}
                  unoptimized
                  fill
                />
              </div>
              <div
                className="flex w-full items-center space-x-4 text-sm font-medium text-[var(--text-secondary)]"
              >
                <time
                  dateTime={post.publishedAt}
                  className="flex items-center space-x-1.5"
                >
                  <CalendarIcon />
                  <span>
                    {parseDateTime({
                      date: new Date(post.publishedAt),
                    })?.format('YYYY/MM/DD')}
                  </span>
                </time>
                <span className="inline-flex items-center space-x-1.5">
                  <ScriptIcon />
                  <span>{post.categories?.join(', ')}</span>
                </span>
              </div>
              <h1
                className="mt-6 w-full text-4xl font-bold tracking-tight text-[var(--text-primary)] sm:text-5xl"
              >
                {post.title}
              </h1>
              <p
                className="my-5 w-full text-sm font-medium text-[var(--text-tertiary)]"
              >
                {post.description}
              </p>
              <div
                className="flex w-full items-center space-x-4 text-sm font-medium text-[var(--text-muted)]"
              >
                <span
                  className="inline-flex items-center space-x-1.5"
                  title={views?.toString()}
                >
                  <CursorClickIcon />
                  <span>{prettifyNumber(views ?? 0, true)}次点击</span>
                </span>

                <span className="inline-flex items-center space-x-1.5">
                  <HourglassIcon />
                  <span>{post.readingTime.toFixed(0)}分钟阅读</span>
                </span>
              </div>
            </header>
            <Prose className="mt-8">
              {isMarkdown ? (
                <PostMarkdown content={post.markdown!} />
              ) : (
                <PostPortableText value={post.body} />
              )}
            </Prose>
          </article>
        </div>
        <aside className="hidden w-[90px] shrink-0 lg:block">
          <div className="sticky top-2 flex justify-end pt-20">
            <BlogReactions
              _id={post._id}
              mood={post.mood}
              reactions={reactions}
            />
          </div>
        </aside>
      </div>

      {post.related && post.related.length > 0 ? (
        <section className="mb-12 mt-32">
          <h2 className="mb-6 flex items-center justify-center text-lg font-bold text-[var(--text-primary)]">
            <PencilSwooshIcon className="h-5 w-5 flex-none" />
            <span className="ml-2">相关文章</span>
          </h2>

          <div className="mt-6 grid grid-cols-1 justify-center gap-6 md:grid-cols-[repeat(auto-fit,75%)] lg:grid-cols-[repeat(auto-fit,45%)] lg:gap-8">
            {post.related.map((post, idx) => (
              <BlogPostCard
                post={post}
                views={relatedViews[idx] ?? 0}
                key={post._id}
              />
            ))}
          </div>
        </section>
      ) : null}

      <ClientOnly>
        <BlogPostStateLoader post={post} />
      </ClientOnly>
    </Container>
  )
}
