import React from 'react'
import Link from 'next/link'

export interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: 'bullet' | 'number'
  url?: string
  fields?: {
    url?: string
    newTab?: boolean
    linkType?: 'custom' | 'internal'
  }
  checked?: boolean
  value?: string
  version?: number
}

export interface LexicalRoot {
  root: {
    type: string
    children: LexicalNode[]
    version: number
  }
}

interface RichTextProps {
  content: LexicalRoot | LexicalNode | null | undefined
  className?: string
}

// Bitwise formatting constants from Lexical
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6

const renderText = (node: LexicalNode, index: number) => {
  if (node.type === 'linebreak') {
    return <br key={index} />
  }

  if (node.type === 'text') {
    let textElement: React.ReactNode = node.text || ''
    const format = node.format || 0

    if (format & IS_BOLD) {
      textElement = <strong className="font-bold text-[#0b2540]">{textElement}</strong>
    }
    if (format & IS_ITALIC) {
      textElement = <em className="italic">{textElement}</em>
    }
    if (format & IS_STRIKETHROUGH) {
      textElement = <span className="line-through text-slate-400">{textElement}</span>
    }
    if (format & IS_UNDERLINE) {
      textElement = <span className="underline decoration-1 decoration-[#1d9e75]/50">{textElement}</span>
    }
    if (format & IS_CODE) {
      textElement = (
        <code className="px-1.5 py-0.5 rounded bg-slate-100 text-amber-700 text-xs font-mono font-medium border border-slate-200">
          {textElement}
        </code>
      )
    }
    if (format & IS_SUBSCRIPT) {
      textElement = <sub className="text-xs">{textElement}</sub>
    }
    if (format & IS_SUPERSCRIPT) {
      textElement = <sup className="text-xs">{textElement}</sup>
    }

    return <span key={index}>{textElement}</span>
  }

  return null
}

const renderNodes = (nodes: LexicalNode[] | undefined): React.ReactNode[] => {
  if (!nodes) return []

  return nodes.map((node, index) => {
    switch (node.type) {
      case 'text':
      case 'linebreak':
        return renderText(node, index)

      case 'paragraph':
        return (
          <p key={index} className="text-slate-600 text-base leading-relaxed mb-4">
            {renderNodes(node.children)}
          </p>
        )

      case 'heading': {
        const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
        const headingStyles = {
          h1: 'text-3xl md:text-4xl font-serif text-[#0b2540] font-semibold mt-8 mb-4 tracking-tight border-b border-slate-100 pb-2',
          h2: 'text-2xl md:text-3xl font-serif text-[#0b2540] font-medium mt-6 mb-3 tracking-tight',
          h3: 'text-xl md:text-2xl font-serif text-[#0b2540] font-medium mt-5 mb-2',
          h4: 'text-lg md:text-xl font-bold text-[#0b2540] mt-4 mb-2',
          h5: 'text-base font-bold text-[#0b2540] mt-3 mb-2',
          h6: 'text-sm font-bold text-[#0b2540] mt-3 mb-2 uppercase tracking-wider',
        }
        const classes = headingStyles[node.tag as keyof typeof headingStyles] || headingStyles.h2
        return (
          <Tag key={index} className={classes}>
            {renderNodes(node.children)}
          </Tag>
        )
      }

      case 'quote':
        return (
          <blockquote
            key={index}
            className="pl-5 border-l-4 border-[#1d9e75] text-slate-500 italic bg-slate-50/50 p-4 rounded-r-xl my-6"
          >
            {renderNodes(node.children)}
          </blockquote>
        )

      case 'list': {
        const isOrdered = node.listType === 'number'
        const ListTag = isOrdered ? 'ol' : 'ul'
        const listClasses = isOrdered
          ? 'list-decimal pl-6 my-4 space-y-2 text-slate-600'
          : 'list-disc pl-6 my-4 space-y-2 text-slate-600'
        return (
          <ListTag key={index} className={listClasses}>
            {renderNodes(node.children)}
          </ListTag>
        )
      }

      case 'listitem':
        return (
          <li key={index} className="text-base leading-relaxed">
            {renderNodes(node.children)}
          </li>
        )

      case 'link': {
        const url = node.fields?.url || node.url || ''
        const newTab = node.fields?.newTab || false
        return (
          <Link
            key={index}
            href={url}
            target={newTab ? '_blank' : undefined}
            rel={newTab ? 'noopener noreferrer' : undefined}
            className="text-[#1d9e75] hover:text-[#0b2540] font-bold underline decoration-dotted transition-colors"
          >
            {renderNodes(node.children)}
          </Link>
        )
      }

      default:
        // Render block fallback or recursion if children exist
        if (node.children) {
          return <React.Fragment key={index}>{renderNodes(node.children)}</React.Fragment>
        }
        return null
    }
  })
}

export const RichText = ({ content, className = '' }: RichTextProps) => {
  if (!content) return null

  // Safely extract root nodes if root structure exists
  let nodes: LexicalNode[] = []
  if ('root' in content && content.root?.children) {
    nodes = content.root.children
  } else if (Array.isArray(content)) {
    nodes = content
  } else if (typeof content === 'object') {
    nodes = [content as LexicalNode]
  }

  if (nodes.length === 0) return null

  return <div className={`lb-rich-text ${className}`}>{renderNodes(nodes)}</div>
}
