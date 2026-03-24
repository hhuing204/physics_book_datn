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