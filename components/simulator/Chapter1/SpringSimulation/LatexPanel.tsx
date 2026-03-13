'use client'

import { BlockMath } from 'react-katex'
import 'katex/dist/katex.min.css'

export default function LatexPanel({
    x,
    v,
    k,
    m
}: {
    x: number
    v: number
    k: number
    m: number
}) {
    return (
        <>
            <BlockMath math={`x(t) = ${x.toFixed(2)}\\,m`} />
            <BlockMath math={`v(t) = ${v.toFixed(2)}\\,m/s`} />
            <BlockMath math={`\\omega = \\sqrt{\\frac{${k}}{${m}}}`} />
        </>
    )
}
