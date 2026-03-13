'use client'

import { LineChart, Line, XAxis, YAxis } from 'recharts'

export default function SpringChart({
    xData,
    vData
}: {
    xData: number[]
    vData: number[]
}) {
    const data = xData.map((x, i) => ({
        t: i,
        x,
        v: vData[i] ?? 0
    }))

    return (
        <>
            <h3>x(t)</h3>
            <LineChart width={300} height={150} data={data}>
                <Line dataKey="x" dot={false} />
                <XAxis dataKey="t" />
                <YAxis />
            </LineChart>

            <h3>v(t)</h3>
            <LineChart width={300} height={150} data={data}>
                <Line dataKey="v" dot={false} />
                <XAxis dataKey="t" />
                <YAxis />
            </LineChart>
        </>
    )
}
