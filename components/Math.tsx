'use client'

import { MathJax, MathJaxContext } from 'better-react-mathjax'

interface MathFormulaProps {
  formula: string
  inline?: boolean
  className?: string
}

export function MathFormula({ formula, inline = false, className = '' }: MathFormulaProps) {
  // Đảm bảo formula không bị undefined
  const cleanFormula = formula?.trim() || ''

  return (
    <MathJax inline={inline} dynamic>
      {`${inline ? '\\(' : '\\['} ${cleanFormula} ${inline ? '\\)' : '\\]'}`}
    </MathJax>
  )
}

export function RenderWithMath({ content }: { content: string }) {
  if (!content) return null

  const parseContent = (text: string) => {
    const parts: Array<{ type: 'text' | 'math'; content: string; inline?: boolean }> = []
    const blockMathRegex = /\$\$([^$]+?)\$\$/g
    const inlineMathRegex = /\$([^$]+?)\$/g

    let lastIndex = 0
    let match

    const blockMatches: Array<{ index: number; content: string; length: number }> = []
    while ((match = blockMathRegex.exec(text)) !== null) {
      blockMatches.push({ index: match.index, content: match[1], length: match[0].length })
    }

    const inlineMatches: Array<{ index: number; content: string; length: number }> = []
    while ((match = inlineMathRegex.exec(text)) !== null) {
      const isBlock = blockMatches.some(b => match!.index >= b.index && match!.index < b.index + b.length)
      if (!isBlock) {
        inlineMatches.push({ index: match.index, content: match[1], length: match[0].length })
      }
    }

    const allMatches = [
      ...blockMatches.map(m => ({ ...m, type: 'block' as const })),
      ...inlineMatches.map(m => ({ ...m, type: 'inline' as const }))
    ].sort((a, b) => a.index - b.index)

    for (const match of allMatches) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        })
      }
      parts.push({
        type: 'math',
        content: match.content,
        inline: match.type === 'inline'
      })
      lastIndex = match.index + match.length
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      })
    }

    return parts
  }

  const parts = parseContent(content)

  return (
    <div className="math-content">
      {parts.map((part, idx) => {
        if (part.type === 'math') {
          return (
            <MathFormula
              key={idx}
              formula={part.content}
              inline={part.inline}
            />
          )
        }
        let text = part.content
        const greekMap: Record<string, string> = {
          'α': '\\alpha', 'β': 'beta', 'γ': 'gamma', 'δ': 'delta',
          'ε': 'epsilon', 'ζ': 'zeta', 'η': 'eta', 'θ': 'theta',
          'ι': 'iota', 'κ': 'kappa', 'λ': 'lambda', 'μ': 'mu',
          'ν': 'nu', 'ξ': 'xi', 'π': 'pi', 'ρ': 'rho',
          'σ': 'sigma', 'τ': 'tau', 'υ': 'upsilon', 'φ': 'varphi',
          'χ': 'chi', 'ψ': 'psi', 'ω': 'omega',
          'Δ': 'Delta', 'Σ': 'Sigma', 'Φ': 'Phi', 'Ψ': 'Psi', 'Ω': 'Omega'
        }

        Object.entries(greekMap).forEach(([char, latex]) => {
          text = text.replace(new RegExp(char, 'g'), `$${latex}$`)
        })

        return <span key={idx} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
      })}
    </div>
  )
}

interface MathProviderProps {
  children: React.ReactNode
}

export function MathProvider({ children }: MathProviderProps) {
  const config = {
    loader: { load: ["[tex]/html", "input/tex", "output/chtml"] },
    tex: {
      packages: { "[+]": ["html", "ams", "newcommand"] },
      inlineMath: [["$", "$"], ["\\(", "\\)"]],
      displayMath: [["$$", "$$"], ["\\[", "\\]"]],
      processEscapes: true,
      processEnvironments: true,
    },
    options: {
      ignoreHtmlClass: 'no-mathjax',
      processHtmlClass: 'mathjax',
    },
    startup: {
      typeset: false, // Để dynamic rendering
    }
  }

  return (
    <MathJaxContext config={config}>
      {children}
    </MathJaxContext>
  )
}