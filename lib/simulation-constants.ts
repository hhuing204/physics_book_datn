// lib/simulation-constants.ts

export const SIMULATION_QUESTIONS: Record<string, Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    hint?: string;
    requiredAction?: string;
}>> = {
    'con-lac-don': [
        {
            id: 'p1',
            text: 'Kéo thả quả nặng con lắc lệch góc 30°, thả tay. Sau đó, kéo thanh trượt "Chiều dài dây" từ 1m lên 4m. Em thấy chu kỳ dao động thay đổi thế nào?',
            options: ['Không đổi', 'Tăng lên', 'Giảm xuống', 'Lúc tăng lúc giảm'],
            correctAnswer: 1,
            explanation: 'Chu kỳ T = 2π√(l/g) tỉ lệ với căn bậc hai của chiều dài. Khi l tăng từ 1m lên 4m, T tăng gấp đôi.',
            hint: 'Hãy kéo thanh trượt chiều dài và quan sát đồng hồ bấm giây hiển thị chu kỳ.',
            requiredAction: 'Kéo thanh trượt chiều dài dây, xem chu kỳ thay đổi'
        },
        {
            id: 'p2',
            text: 'Trong tab "Đồ thị phân tích", em hãy chọn đồ thị năng lượng. Khi con lắc ở vị trí thấp nhất (VTCB), đường màu nào thể hiện động năng?',
            options: ['Đường màu đỏ (thế năng)', 'Đường màu vàng (động năng)', 'Đường màu xanh (cơ năng)', 'Cả ba đường bằng nhau'],
            correctAnswer: 1,
            explanation: 'Tại VTCB, thế năng = 0, động năng cực đại và bằng cơ năng.',
            hint: 'Bật tab "Đồ thị", chọn "Năng lượng", quan sát khi quả nặng qua điểm thấp nhất.',
            requiredAction: 'Xem đồ thị năng lượng khi con lắc dao động'
        },
        {
            id: 'p3',
            text: 'Bật chế độ "Hiển thị vòng tròn lượng giác". Góc lệch của con lắc đang là 30°. Hình chiếu của điểm M trên vòng tròn lên trục Ox tương ứng với li độ góc là bao nhiêu?',
            options: ['30°', '0°', '60°', '-30°'],
            correctAnswer: 0,
            explanation: 'Hình chiếu của điểm M (góc 30°) lên trục Ox cho li độ góc 30°.',
            hint: 'Xem mô phỏng vòng tròn lượng giác và hình chiếu của nó.',
            requiredAction: 'Bật vòng tròn lượng giác, kéo con lắc đến góc 30°'
        }
    ],
    'con-lac-lo-xo': [
        {
            id: 's1',
            text: 'Kéo thả vật nặng con lắc lò xo xuống dưới VTCB 5 cm rồi thả. Sau đó, tăng độ cứng lò xo từ 10 N/m lên 40 N/m. Tần số dao động thay đổi thế nào?',
            options: ['Tăng gấp đôi', 'Giảm một nửa', 'Không đổi', 'Tăng gấp 4'],
            correctAnswer: 0,
            explanation: 'f = (1/2π)√(k/m). k tăng 4 lần → f tăng 2 lần.',
            hint: 'Kéo thanh trượt độ cứng, xem đồ thị dao động.',
            requiredAction: 'Điều chỉnh độ cứng lò xo, quan sát số dao động trong 1 giây'
        },
        {
            id: 's2',
            text: 'Bật tab "Thông tin Vật lý" và xem công thức cơ năng. Nếu kéo vật nặng xuống thấp hơn (tăng biên độ), đại lượng nào sau đây thay đổi?',
            options: ['Chu kỳ', 'Tần số', 'Cơ năng', 'Độ cứng lò xo'],
            correctAnswer: 2,
            explanation: 'Cơ năng E = (1/2)kA², tăng khi biên độ A tăng.',
            hint: 'Kéo thanh trượt biên độ, xem giá trị cơ năng hiển thị.',
            requiredAction: 'Thay đổi biên độ, xem số chỉ cơ năng'
        }
    ],
    'song-dien-tu': [
        {
            id: 'em1',
            text: 'Xoay camera (giữ chuột trái và kéo) để nhìn rõ. Vectơ điện trường E (màu đỏ) và vectơ từ trường B (màu xanh) có hướng thế nào với nhau?',
            options: ['Cùng hướng', 'Vuông góc', 'Ngược hướng', 'Tạo góc 45°'],
            correctAnswer: 1,
            explanation: 'E dao động theo trục Y, B dao động theo trục Z, luôn vuông góc với nhau.',
            hint: 'Xoay camera để quan sát trục Y (đỏ) và trục Z (xanh).',
            requiredAction: 'Xoay camera 360°, bật/tắt từng vectơ để so sánh'
        },
        {
            id: 'em2',
            text: 'Giảm tần số sóng điện từ từ 1 Hz xuống 0.2 Hz. Bước sóng λ (hiển thị ở bảng thông số) thay đổi thế nào? (λ = c/f)',
            options: ['Giảm 5 lần', 'Tăng 5 lần', 'Không đổi', 'Giảm 2 lần'],
            correctAnswer: 1,
            explanation: 'λ = c/f, f giảm 5 lần thì λ tăng 5 lần.',
            hint: 'Xem bảng thông số "Bước sóng" thay đổi khi kéo thanh trượt tần số.',
            requiredAction: 'Kéo thanh trượt tần số, quan sát bước sóng'
        },
        {
            id: 'em3',
            text: 'Bật tab "Đồ thị phân tích", chọn biểu đồ "E(t) và B(t)". Hai đường đồ thị có pha như thế nào?',
            options: ['Cùng pha', 'Ngược pha', 'Vuông pha', 'Lệch pha 45°'],
            correctAnswer: 0,
            explanation: 'E và B trong sóng điện từ dao động cùng pha.',
            hint: 'Xem đồ thị, so sánh đỉnh của đường đỏ (E) và xanh (B).',
            requiredAction: 'Mở tab đồ thị, quan sát E(t) và B(t)'
        }
    ],
    'song-doc-va-song-ngang': [
        {
            id: 'w1',
            text: 'Bật chế độ "Hiển thị phương dao động". Hướng dao động của các phần tử ở sóng dọc như thế nào so với mũi tên phương truyền?',
            options: ['Song song', 'Vuông góc', 'Chếch 45°', 'Ngược chiều'],
            correctAnswer: 0,
            explanation: 'Sóng dọc: các phần tử dao động dọc theo phương truyền sóng.',
            hint: 'Bật "Hiển thị phương dao động", xem các mũi tên ngang.',
            requiredAction: 'Bật checkbox "Phương dao động", quan sát hướng mũi tên'
        },
        {
            id: 'w2',
            text: 'Giảm tần số sóng từ 0.8 Hz xuống 0.4 Hz. Em thấy hiện tượng gì ở cả hai loại sóng?',
            options: ['Sóng truyền nhanh hơn', 'Bước sóng tăng lên', 'Biên độ giảm', 'Sóng dừng lại'],
            correctAnswer: 1,
            explanation: 'λ = v/f, f giảm thì λ tăng.',
            hint: 'Quan sát khoảng cách giữa các vòng tròn sóng ngang.',
            requiredAction: 'Kéo thanh trượt tần số, xem bước sóng thay đổi'
        }
    ],
    'giao-thoa-song': [
        {
            id: 'i1',
            text: 'Tăng bước sóng λ lên 2 lần (ví dụ 1m → 2m). Số lượng vân cực đại (đường màu đỏ) thay đổi thế nào?',
            options: ['Tăng lên', 'Giảm xuống', 'Không đổi', 'Biến mất hoàn toàn'],
            correctAnswer: 1,
            explanation: 'd2 - d1 = kλ. λ tăng → khoảng cách vân lớn hơn → số vân giảm.',
            hint: 'Xem số đường đỏ giữa hai nguồn.',
            requiredAction: 'Điều chỉnh bước sóng, đếm số vân đỏ'
        },
        {
            id: 'i2',
            text: 'Bật chế độ "Hiển thị sóng tròn". Khi hai sóng tròn gặp nhau tại vân sáng (đỏ), hai sóng thành phần có pha thế nào?',
            options: ['Cùng pha', 'Ngược pha', 'Vuông pha', 'Lệch bất kỳ'],
            correctAnswer: 0,
            explanation: 'Cực đại giao thoa xảy ra khi hai sóng cùng pha.',
            hint: 'Quan sát màu sắc: điểm đỏ/vàng là cùng pha.',
            requiredAction: 'Bật sóng tròn, xem tại vân đỏ hai vòng tròn gặp nhau'
        },
        {
            id: 'i3',
            text: 'Kéo thanh trượt "Độ lệch pha" từ 0 đến π (180°). Hệ vân giao thoa thay đổi thế nào?',
            options: ['Vân trung tâm dịch sang một bên', 'Vân trung tâm biến mất', 'Các vân xoay tròn', 'Không thay đổi'],
            correctAnswer: 0,
            explanation: 'Độ lệch pha làm dịch chuyển hệ vân.',
            hint: 'Xem vạch đỏ chính giữa dịch chuyển sang trái/phải.',
            requiredAction: 'Điều chỉnh độ lệch pha, quan sát vân trung tâm'
        }
    ],
    'song-tren-day': [
        {
            id: 'st1',
            text: 'Chọn chế độ "Xung đơn", điều kiện biên "Cố định". Nhấn "Gửi xung sóng". Khi xung chạm đầu dây cố định, xung phản xạ có đặc điểm gì?',
            options: ['Cùng chiều', 'Ngược chiều (lộn ngược)', 'Mất hẳn', 'Tăng biên độ'],
            correctAnswer: 1,
            explanation: 'Đầu cố định, sóng phản xạ ngược pha → xung bị lộn ngược.',
            hint: 'Xem xung màu đỏ khi đến cuối dây.',
            requiredAction: 'Gửi xung, quan sát phản xạ ở đầu cố định'
        },
        {
            id: 'st2',
            text: 'Chuyển sang "Tự do", lại gửi xung. Xung phản xạ có khác gì so với đầu cố định?',
            options: ['Giữ nguyên chiều', 'Lộn ngược', 'Không phản xạ', 'Đổi màu'],
            correctAnswer: 0,
            explanation: 'Đầu tự do, sóng phản xạ cùng pha, xung giữ nguyên chiều.',
            hint: 'So sánh với trường hợp cố định.',
            requiredAction: 'Đổi sang tự do, gửi xung và so sánh'
        },
        {
            id: 'st3',
            text: 'Ở chế độ "Liên tục", tăng lực căng dây T lên gấp 4 lần. Vận tốc truyền sóng v thay đổi thế nào? (v = √(T/μ))',
            options: ['Tăng 2 lần', 'Tăng 4 lần', 'Giảm 2 lần', 'Không đổi'],
            correctAnswer: 0,
            explanation: 'v ∝ √T, T tăng 4 lần → v tăng 2 lần.',
            hint: 'Xem giá trị vận tốc thay đổi khi kéo thanh trượt.',
            requiredAction: 'Kéo thanh trượt lực căng, quan sát vận tốc'
        }
    ],
    'sonar': [
        {
            id: 'sn1',
            text: 'Giảm khoảng cách đến đáy biển (thanh trượt "Khoảng cách"). Thời gian để sóng echo quay về thay đổi thế nào?',
            options: ['Tăng lên', 'Giảm xuống', 'Không đổi', 'Dao động'],
            correctAnswer: 1,
            explanation: 't = 2d/v, d giảm thì t giảm.',
            hint: 'Xem chỉ số "Thời gian phản hồi (ms)".',
            requiredAction: 'Điều chỉnh khoảng cách, xem thời gian echo'
        },
        {
            id: 'sn2',
            text: 'Tại sao tàu không thể phát hiện vật thể nằm ngay phía sau một tảng đá lớn dưới đáy biển?',
            options: ['Sóng bị hấp thụ', 'Sóng truyền thẳng, bị vật cản che', 'Sóng đổi tần số', 'Nước không truyền sóng'],
            correctAnswer: 1,
            explanation: 'Sóng âm truyền thẳng, không có khả năng nhiễu xạ mạnh.',
            hint: 'Quan sát tia sonar bị chặn bởi núi ngầm.',
            requiredAction: 'Xoay camera xem vùng bị che khuất sau núi'
        },
        {
            id: 'sn3',
            text: 'Tăng cường độ tín hiệu lên 100%. Sóng phát và sóng echo có gì khác?',
            options: ['Sóng echo mờ hơn', 'Sóng echo mạnh hơn', 'Cả hai bằng nhau', 'Không thấy echo'],
            correctAnswer: 0,
            explanation: 'Sóng echo bị suy hao năng lượng sau phản xạ và truyền ngược.',
            hint: 'So sánh độ sáng của vòng tròn xanh (phát) và đỏ (echo).',
            requiredAction: 'Bật sóng phát và echo, quan sát sự khác biệt'
        }
    ]
};

export const SIMULATION_TITLES: Record<string, string> = {
    'con-lac-don': 'Con lắc đơn',
    'con-lac-lo-xo': 'Con lắc lò xo',
    'song-dien-tu': 'Sóng điện từ',
    'song-doc-va-song-ngang': 'Sóng dọc và sóng ngang',
    'giao-thoa-song': 'Giao thoa sóng',
    'song-tren-day': 'Sóng trên dây',
    'sonar': 'Mô phỏng Sonar',
    'song-co-3d': 'Sóng cơ 3D',
};

export const getTestCompletedKey = (simulationId: string) => `simulation_test_completed_${simulationId}`;
export const getTestScoreKey = (simulationId: string) => `simulation_test_score_${simulationId}`;

export const PASS_THRESHOLD = 70; // 70% để qua bài