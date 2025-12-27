'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import { ClipboardCheckIcon, ClipboardDataIcon } from '~/assets'
import { PeekabooLink } from '~/components/links/PeekabooLink'
import { ElegantTooltip } from '~/components/ui/Tooltip'

export function PostMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSlug]}
      components={{
        pre: ({ children }) => <>{children}</>,
        a: ({ children, href }) => {
          const rel = !href?.startsWith('/') ? 'noreferrer noopener' : undefined
          return (
            <PeekabooLink href={href ?? ''} rel={rel}>
              {children}
            </PeekabooLink>
          )
        },
        h2: ({ children, id }) => (
          <h2 id={id} className="group relative pr-3 after:pointer-events-none after:inline after:select-none after:opacity-0 after:transition-opacity after:will-change-[opacity] after:content-['_#'] hover:after:opacity-100 md:pr-0">
            <a href={`#${id}`} className="absolute inset-0" />
            {children}
          </h2>
        ),
        h3: ({ children, id }) => (
          <h3 id={id} className="group relative pr-3 after:pointer-events-none after:inline after:select-none after:opacity-0 after:transition-opacity after:will-change-[opacity] after:content-['_#'] hover:after:opacity-10 md:pr-0">
            <a href={`#${id}`} className="absolute inset-0" />
            {children}
          </h3>
        ),
        h4: ({ children, id }) => (
          <h4 id={id} className="group relative pr-3 after:pointer-events-none after:inline after:select-none after:opacity-0 after:transition-opacity after:will-change-[opacity] after:content-['_#'] hover:after:opacity-10 md:pr-0">
            <a href={`#${id}`} className="absolute inset-0" />
            {children}
          </h4>
        ),
        code({ node: _node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const code = String(children).replace(/\n$/, '')

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          }

          return <MarkdownCodeBlock code={code} language={language} />
        },
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

function MarkdownCodeBlock({
  code,
  language,
}: { 
  code: string
  language: string
}) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const onClickCopy = React.useCallback(() => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setHasCopied(true)
        setTimeout(() => {
          setHasCopied(false)
        }, 3000)
      })
      .catch(() => {
        console.error('Failed to copy code block')
      })
  }, [code])

  return (
    <div className="group relative mr-3 rounded-3xl border border-[--tw-prose-pre-border] dark:bg-zinc-800/80 md:mr-0">
      <div className="relative flex text-xs leading-6 text-slate-400">
        <div className="absolute right-0 top-2 flex h-8 items-center pr-4">
          <div className="relative -mr-0.5 flex">
            <ElegantTooltip content="复制">
              <button
                type="button"
                className="text-zinc-400 hover:text-zinc-500 dark:text-zinc-500 dark:hover:text-zinc-400"
                onClick={onClickCopy}
              >
                {hasCopied ? (
                  <ClipboardCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDataIcon className="h-5 w-5" />
                )}
              </button>
            </ElegantTooltip>
          </div>
        </div>
      </div>

      <SyntaxHighlighter
        language={language}
        showLineNumbers
        useInlineStyles={false}
        codeTagProps={{
          style: {},
          className: `language-${language}`,
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
