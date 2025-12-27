import { Box, Button, Flex } from '@sanity/ui'
import React from 'react'
import ReadingTime from 'reading-time'
import { type NumberInputProps, set, useFormValue } from 'sanity'

type SanityBlock = {
  _type: string
  children?: SanityBlock[]
  text?: string
}

function flattenBlocks(blocks: SanityBlock[]): string[] {
  return blocks.flatMap((block) => {
    if (block.text) {
      return [block.text]
    }

    if (block.children) {
      return flattenBlocks(block.children)
    }

    return []
  })
}

export default function ReadingTimeInput(props: NumberInputProps) {
  const body = useFormValue(['body'])
  const markdown = useFormValue(['markdown'])

  const generate = React.useCallback(() => {
    let content = ''
    if (typeof markdown === 'string' && markdown.length > 0) {
      content = markdown
    } else if (Array.isArray(body)) {
      content = flattenBlocks(body as SanityBlock[]).join('\n')
    }

    const rt = ReadingTime(content)
    props.onChange(set(rt.minutes))
  }, [body, markdown, props])

  return (
    <Flex gap={3} align="center">
      <Box flex={1}>{props.renderDefault(props)}</Box>
      <Button mode="ghost" onClick={generate}>
        Generate
      </Button>
    </Flex>
  )
}
