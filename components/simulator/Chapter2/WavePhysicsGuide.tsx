'use client'

import { useState } from 'react'
import {
    Waves,
    GitCompare,
    Target,
    Radio,
    Volume2,
    Eye,
    Brain,
    BookOpen,
    Calculator,
    TrendingUp,
    AlertTriangle,
    Lightbulb
} from 'lucide-react'

interface Topic {
    id: string
    title: string
    icon: React.ReactNode
    content: string
    formulas: { name: string; formula: string }[]
    examples: { title: string; solution: string }[]
    tips: string[]
}

const topics: Topic[] = [
    {
        id: 'basic',
        title: 'Sóng cơ và sự truyền sóng',
        icon: <Waves className="w-5 h-5" />,
        content: `Sóng cơ là dao động lan truyền trong môi trường vật chất. Khi sóng truyền đi, các phần tử môi trường chỉ dao động tại chỗ, không truyền đi theo sóng. Sóng được phân thành hai loại: sóng ngang (phương dao động vuông góc phương truyền) và sóng dọc (phương dao động trùng phương truyền).`,
        formulas: [
            { name: 'Phương trình sóng', formula: 'u = A cos(ωt - kx)' },
            { name: 'Vận tốc sóng', formula: 'v = λf = λ/T' },
            { name: 'Số sóng', formula: 'k = 2π/λ' },
            { name: 'Tần số góc', formula: 'ω = 2πf = 2π/T' }
        ],
        examples: [
            {
                title: 'Một sóng có phương trình u = 5cos(4πt - 0.5πx) cm. Tính bước sóng và vận tốc.',
                solution: 'Từ phương trình: ω = 4π rad/s, k = 0.5π rad/m → λ = 2π/k = 4 m, f = ω/2π = 2 Hz, v = λf = 8 m/s'
            }
        ],
        tips: [
            'Phân biệt sóng dọc và sóng ngang dựa vào phương dao động',
            'Sóng âm là sóng dọc, sóng trên dây là sóng ngang',
            'Khoảng cách 2 đỉnh sóng liên tiếp bằng bước sóng λ'
        ]
    },
    {
        id: 'interference',
        title: 'Giao thoa sóng',
        icon: <GitCompare className="w-5 h-5" />,
        content: `Giao thoa sóng là hiện tượng hai sóng kết hợp gặp nhau, tăng cường hoặc triệt tiêu lẫn nhau tại một số vị trí trong môi trường. Điều kiện để có giao thoa: hai nguồn sóng cùng phương, cùng tần số, độ lệch pha không đổi.`,
        formulas: [
            { name: 'Cực đại giao thoa', formula: 'd₂ - d₁ = kλ' },
            { name: 'Cực tiểu giao thoa', formula: 'd₂ - d₁ = (k + 1/2)λ' },
            { name: 'Biên độ tổng hợp', formula: 'A = 2A₀|cos(πΔd/λ)|' },
            { name: 'Độ lệch pha', formula: 'Δφ = 2πΔd/λ' }
        ],
        examples: [
            {
                title: 'Hai nguồn kết hợp cùng pha cách nhau 12 cm, bước sóng 4 cm. Tìm số điểm cực đại trên đoạn nối hai nguồn.',
                solution: 'Điều kiện cực đại: -S₁S₂ ≤ kλ ≤ S₁S₂ → -12 ≤ 4k ≤ 12 → -3 ≤ k ≤ 3 → có 7 điểm (k = -3,...,3)'
            }
        ],
        tips: [
            'Nguồn cùng pha: trung trực là cực đại',
            'Nguồn ngược pha: trung trực là cực tiểu',
            'Số cực đại trên đoạn nối hai nguồn: n = 2⌊S₁S₂/λ⌋ + 1'
        ]
    },
    {
        id: 'standing',
        title: 'Sóng dừng',
        icon: <Target className="w-5 h-5" />,
        content: `Sóng dừng là sóng có các nút và bụng cố định trong không gian, được tạo thành do sự giao thoa của sóng tới và sóng phản xạ. Bụng sóng là điểm dao động với biên độ cực đại, nút sóng là điểm đứng yên.`,
        formulas: [
            { name: 'Điều kiện 2 đầu cố định', formula: 'L = n·λ/2 (n = 1,2,3...)' },
            { name: 'Điều kiện 1 đầu cố định, 1 tự do', formula: 'L = (2n-1)λ/4' },
            { name: 'Khoảng cách 2 nút', formula: 'λ/2' },
            { name: 'Khoảng cách nút - bụng', formula: 'λ/4' }
        ],
        examples: [
            {
                title: 'Sợi dây dài 1,2 m có sóng dừng với 3 bụng sóng. Tìm bước sóng.',
                solution: 'Với 2 đầu cố định, số bụng = n → n = 3. L = n·λ/2 → 1,2 = 3·λ/2 → λ = 0,8 m'
            }
        ],
        tips: [
            'Hai đầu cố định: nút ở hai đầu',
            'Một đầu tự do: bụng ở đầu tự do',
            'Số bụng = số bó sóng = n'
        ]
    },
    {
        id: 'em',
        title: 'Sóng điện từ',
        icon: <Radio className="w-5 h-5" />,
        content: `Sóng điện từ là sự lan truyền của điện trường và từ trường biến thiên trong không gian. Sóng điện từ là sóng ngang, truyền được trong chân không với tốc độ c = 3×10⁸ m/s. Ánh sáng là một dạng sóng điện từ.`,
        formulas: [
            { name: 'Vận tốc trong chân không', formula: 'c = 3×10⁸ m/s' },
            { name: 'Chiết suất', formula: 'n = c/v' },
            { name: 'Bước sóng trong môi trường', formula: 'λ = λ₀/n' }
        ],
        examples: [
            {
                title: 'Ánh sáng đỏ có bước sóng 700 nm trong chân không. Tính tần số.',
                solution: 'f = c/λ = 3×10⁸ / (700×10⁻⁹) = 4,29×10¹⁴ Hz'
            }
        ],
        tips: [
            'Sóng điện từ không cần môi trường truyền',
            'E và B vuông góc nhau và vuông góc phương truyền',
            'Các loại sóng điện từ: radio, vi sóng, hồng ngoại, ánh sáng, UV, X, gamma'
        ]
    },
    {
        id: 'sound',
        title: 'Sóng âm',
        icon: <Volume2 className="w-5 h-5" />,
        content: `Sóng âm là sóng cơ dọc truyền trong các môi trường rắn, lỏng, khí. Tai người nghe được âm có tần số 16 Hz - 20.000 Hz. Sóng hạ âm (f < 16 Hz) và siêu âm (f > 20.000 Hz) không nghe được.`,
        formulas: [
            { name: 'Cường độ âm', formula: 'I = P/S' },
            { name: 'Mức cường độ âm', formula: 'L = 10lg(I/I₀) (dB)' },
            { name: 'Vận tốc âm trong không khí', formula: 'v = 331,3 + 0,606t (m/s)' }
        ],
        examples: [
            {
                title: 'Cường độ âm tại điểm là 10⁻⁶ W/m². Tính mức cường độ âm biết I₀ = 10⁻¹² W/m².',
                solution: 'L = 10lg(10⁻⁶/10⁻¹²) = 10lg(10⁶) = 60 dB'
            }
        ],
        tips: [
            'Vận tốc âm lớn nhất trong chất rắn, nhỏ nhất trong chất khí',
            'Mức cường độ âm tăng 10 dB thì cường độ âm tăng 10 lần',
            'Ngưỡng đau: 130 dB, ngưỡng nghe: 0 dB'
        ]
    }
]

export default function WavePhysicsGuide() {
    const [activeTopic, setActiveTopic] = useState<string>('basic')

    const currentTopic = topics.find(t => t.id === activeTopic) || topics[0]

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Hướng dẫn học sóng cơ
                </h2>
                <p className="text-blue-100 mt-1">
                    Tổng hợp lý thuyết, công thức và bài tập về sóng
                </p>
            </div>

            <div className="flex flex-col lg:flex-row">
                {/* Sidebar */}
                <div className="lg:w-64 bg-gray-50 dark:bg-gray-800/50 p-4 border-r border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        {topics.map(topic => (
                            <button
                                key={topic.id}
                                onClick={() => setActiveTopic(topic.id)}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all ${activeTopic === topic.id
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                    }`}
                            >
                                {topic.icon}
                                <span className="font-medium">{topic.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                        {currentTopic.icon}
                        {currentTopic.title}
                    </h3>

                    <div className="prose dark:prose-invert max-w-none">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {currentTopic.content}
                        </p>
                    </div>

                    {/* Công thức */}
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Công thức quan trọng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {currentTopic.formulas.map((formula, idx) => (
                                <div key={idx} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                                    <div className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                                        {formula.formula}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                        {formula.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ví dụ */}
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4" />
                            Ví dụ minh họa
                        </h4>
                        {currentTopic.examples.map((example, idx) => (
                            <div key={idx} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 mb-3">
                                <div className="font-medium text-amber-800 dark:text-amber-300">
                                    {example.title}
                                </div>
                                <div className="text-sm text-amber-700 dark:text-amber-400 mt-2">
                                    <span className="font-bold">Giải:</span> {example.solution}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Mẹo học */}
                    <div className="mt-6">
                        <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                            <Brain className="w-4 h-4" />
                            Mẹo học tập
                        </h4>
                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <ul className="space-y-2">
                                {currentTopic.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-green-700 dark:text-green-300">
                                        <span className="text-green-500">✓</span>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Lưu ý */}
                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border-l-4 border-yellow-500">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h5 className="font-bold text-yellow-800 dark:text-yellow-300">Lưu ý</h5>
                                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                    Khi làm bài tập sóng, cần chú ý đến đơn vị của các đại lượng (m, cm, mm, ...)
                                    và điều kiện biên (đầu cố định, đầu tự do) để áp dụng đúng công thức.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}