const lesson3 = {
  id: 3,
  title: 'Năng lượng trong dao động điều hoà',
  slides: [
    {
      id: 1,
      title: 'Năng lượng trong dao động điều hoà',
      type: 'intro',
      content: `
            <div class="summary-box">
              <p>
                Sự chuyển hoá động năng và thế năng trong dao động điều hoà.
              </p>
            </div>

            <div class="intro-box">
              <p class="intro-text">
              Tiến hành thí nghiệm như mô tả trong Hình 3.1.
              Đặt một tấm gỗ cố định lên tường, đưa vật nặng của con lắc đơn đến vị trí tiếp xúc
              với tấm gỗ và thả nhẹ để vật nặng bắt đầu chuyển động không vận tốc ban đầu.
              Khi dao động, vật nặng có và chạm vào tấm gỗ hay không? Vì sao?
              Trong quá trình dao động, vật nặng có những dạng năng lượng gì và sự chuyển hoá giữa chúng như thế nào?
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson3/3.1.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.1. Thí nghiệm với con lắc đơn</p>
            </div>
          `
    },
    {
      id: 2,
      title: 'Thế năng trong dao động điều hòa',
      type: 'foundation',
      subId: 1,
      content: `
            <p class="section-title">
              <strong>▶ Biểu thức của thế năng trong dao động đièu hoà</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Xét hệ con lắc lò xo dao động điều hoà.
                Thế năng của hệ được tích luỹ trong lò xo và phụ thuộc vào mức độ lò xo bị kéo dãn hay nén lại.
                Khi chọn gốc thế năng tại vị trí cân bằng, từ một số tính toán, ta rút ra được thế năng trong dao động điều hoà:<br/>
                $W_t = \\frac{1}{2}Kx^2$ <strong>(3.1)</strong> <br/>
                Kết hợp với công thức (2.1) ta có:
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Thế năng trong dao động điều hoà được tính theo công thức:<br/>
                    <strong>$W_t = \\frac{1}{2}Kx^2 = \\frac{1}{2}m\\omega^2 A^2 \\cos^2(\\omega t + \\varphi_0)$</strong> <strong>(3.2)</strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Do hàm cosin (hoặc sin) bình phương có giá trị thay đổi
                từ 0 đến 1 nên thế năng trong dao động điều hoà có giá trị
                thay đổi từ 0 đến $W_{tmax}$ với $W_{tmax} = \\frac{1}{2}m \\omega^2 A^2$
                là giá trị cực đại của thế năng.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson3/3.2.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.2. Đồ thị thế năng - thời gian trong dao động điều hoà</p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>1.</strong> Dựa vào công thức (3.2) và Hình 3.2, mô tả sự thay đổi của thế năng trong một chu kì dao động của vật.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Khi vật thực hiện một dao động toàn phần (tức là sau một chu kì dao động),
                        thế năng biến thiên tuần hoàn theo thời gian với giá trị thay đổi từ 0 đến
                        $\\frac{1}{2}m \\omega^2 A^2$, có hai lần đạt giá trị cực tiểu và hai lần
                        đạt giá trị cực đại. Tức là thế năng của vật đã biến thiên tuần hoàn được <strong>hai chu kì</strong>.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 3,
      title: 'Thế năng trong dao động điều hòa',
      type: 'foundation',
      subId: 1,
      content: `
            <p class="section-title">
              <strong>▶ Sự biến đổi của thế năng theo thời gian</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Kết hợp công thức (3.2) và phép biến đổi lượng giác
                $\\cos^2 a = \\frac{1 + \\cos2a}{2}$, ta có: <br>
                $W_t = \\frac{1}{4}m\\omega^2 A^2 + \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0)$ <strong>(3.3)</strong>
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Như vậy, thế năng trong dao động điều hoà biến đổi tuần hoàn theo thời gian với tần số góc bằng hai lần tần số góc của li độ:
                $\\omega$’ $= 2\\omega$ <strong>(3.4)</strong>
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>2.</strong> So sánh chu kì, tần số biến thiên của thế năng với chu kì, tần số dao động của vật.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Thế năng trong dao động điều hoà biến thiên theo thời gian
                        với tần số gấp hai lần tần số dao động của vật
                        và với chu kì bằng một nửa chu kì dao động của vật.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
            
            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Một số toà nhà cao tầng sử dụng các con lắc nặng trong bộ giảm chấn khối lượng (mass damper) để giảm thiểu sự rung động gây ra bởi gió hay những cơn địa chấn nhỏ.
                    Giả sử vật nặng của con lắc có khối lượng 3,0.10$^5$ kg, thực hiện dao động điều hoà với với tần số 15 Hz với biên độ dao động là 15 cm. Hãy xác định thế năng cực đại của hệ con lắc trong bộ giảm chấn khối lượng.
                  </p>

                  <details>
                    <summary class="practice-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="practice-box-answer">
                      <p class="text-box-text">
                        Thế năng cực đại của hệ con lắc trong bộ giảm chấn khối lượng là: <br/>
                        $W_{tmax} = \\frac{1}{2}m \\omega^2 A^2 = \\frac{1}{2}m ($2$\\pi f)^2 A^2 = \\frac{1}{2}$.3.10$^5$.$($2$\\pi$.15$)$.0,15$^{15} \\approx$ 29,98.10$^6$ J. 
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `,
    },
    {
      id: 4,
      title: 'Động năng trong dao động điều hòa',
      type: 'foundation',
      subId: 2,
      content: `
            <p class="section-title">
              <strong>▶ Biểu thức của động năng trong dao động đièu hoà</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Động năng của một vật được xác định bởi công thức: <br/>
                $W_đ = \\frac{1}{2}mv^2$ <br/>
                Kết hợp với công thức (2.4) ta có:
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Động năng của vật dao động điều hoà được tính theo công thức:<br/>
                    <strong>$W_đ = \\frac{1}{2}mv^2 = \\frac{1}{2}m\\omega^2 A^2 \\sin^2(\\omega t + \\varphi_0)$</strong> <strong>(3.5)</strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Tương tự như thế năng, động năng của vật dao động điều hoà có giá trị
                thay đổi từ 0 đến $W_{đmax}$ với $W_{đmax} = \\frac{1}{2}m \\omega^2 A^2$
                là giá trị cực đại của động năng.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson3/3.3.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.3. Đồ thị động năng - thời gian trong dao động điều hoà</p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>3.</strong> Dựa vào công thức (3.5) và Hình 3.3, mô tả sự thay đổi của động năng trong một chu kì dao động của vật.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Khi vật thực hiện một dao động toàn phần (tức là sau một chu kì dao động),
                        động năng biến thiên tuần hoàn theo thời gian với giá trị thay đổi từ 0 đến
                        $\\frac{1}{2}m \\omega^2 A^2$, có hai lần đạt giá trị cực tiểu và hai lần
                        đạt giá trị cực đại. Tức là động năng của vật đã biến thiên tuần hoàn được <strong>hai chu kì</strong>.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 5,
      title: 'Động năng trong dao động điều hòa',
      type: 'foundation',
      subId: 2,
      content: `
            <p class="section-title">
              <strong>▶ Sự biến đổi của động năng theo thời gian</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Kết hợp công thức (3.5) và phép biến đổi lượng giác
                $\\sin^2 a = \\frac{1 - \\cos2a}{2}$, ta có: <br>
                $W_đ = \\frac{1}{4}m\\omega^2 A^2 - \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0)$ <strong>(3.6)</strong>
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Như vậy, động năng trong dao động điều hoà biến đổi tuần hoàn theo thời gian với tần số góc bằng hai lần tần số góc của li độ
                theo công thức (3.4).
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>4.</strong> So sánh pha dao động của thế năng và động năng khi vật dao động điều hoà.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Thế năng và động năng khi vật dao động điều hoà ngược pha nhau.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
            
            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Một vật có khối lượng 2 kg dao động điều hoà có đồ thị vận tốc - thời gian như Hình 3.4. Xác định tốc độ cực đại và động năng cực đại của vật trong quá trình dao động.
                  </p>

                  <div class="orange-image-box">
                    <div class="large-image-box-img-wrapper">
                      <img src="/images/chapter1_lesson3/3.4.png"/>
                    </div>
                    <p class="mt-0 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.4. Đồ thị vận tốc - thời gian của vật dao động</p>
                  </div>

                  <details>
                    <summary class="practice-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="practice-box-answer">
                      <ul>
                        <li><strong>Tốc độ cực đại của vật:</strong> $v_{max} =$ 0,4 m/s.</li>
                        <li><strong>Động năng cực đại của vật:</strong> $W_{đmax} = \\frac{1}{2}m v_{max} = \\frac{1}{2}$.2.0,4$^2 =$ 0,16 J.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `,
    },
    {
      id: 6,
      title: 'Sự chuyển hoá năng lượng và bảo toàn cơ năng trong dao động điều hoà',
      type: 'foundation',
      subId: 3,
      content: `
            <p class="section-title">
              <strong>▶ Sự chuyển hoá năng lượng trong dao động điều hoà</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>5.</strong> Quan sát Hình 3.5 và mô tả sự thay đổi của động năng và thế năng khi vật dao động di chuyển từ biên âm đến biên dương.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li>Khi vật ở biển âm, thế năng cực đại còn động năng bằng 0.</li>
                        <li>Khi vật di chuyển từ biên âm về vị trí cân bằng, thế năng giảm trong khi động năng tăng.</li>
                        <li>Khi vật đi qua vị trí cân bằng, thể năng bằng 0 và động năng cực đại.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Từ các công thức (3.2) và (3.5), ta có thể vẽ được các đường đồ thị mô tả 
                sự phụ thuộc của thế năng và động năng vào li độ của hệ dao động điều hoà như trong Hình 3.5.
              </p>
              <p class="text-box-text mt-3">
                Hình 3.5 thể hiện: <br/>
                - Khi vật ở biên, thế năng có giá trị cực đại còn động năng bằng 0. <br/>
                - Khi vật di chuyển từ biên về vị trí cân bằng, thế năng giảm trong khi động năng tăng. <br/>
                - Khi vật ở vị trí cân bằng, thế năng bằng 0 và động năng có giá trị cực đại. <br/>
                - Khi vật di chuyển từ vị trí cân bằng ra biên, thế năng tăng trong khi động năng giảm. <br/>
                Như vậy, trong quá trình vật dao động, động năng và thế năng luôn thay đổi và chuyển hoá qua lại với nhau.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson3/3.5.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.5. Sự phụ thuộc của thế năng, động năng, cơ năng vào li độ của vật dao động</p>
            </div>
          `
    },
    {
      id: 7,
      title: 'Sự chuyển hoá năng lượng và bảo toàn cơ năng trong dao động điều hoà',
      type: 'foundation',
      subId: 3,
      content: `
            <p class="section-title">
              <strong>▶ Sự bảo toàn cơ năng trong dao động điều hoà</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>6.</strong>Quan sát Hình 3.5 và 3.6, nhận xét về độ lớn của động năng, thế năng và cơ năng trong quá trình dao động điều hoà của vật.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Trong quá trình vật dao động điều hoà, động năng và thế năng thay đổi tuần hoàn theo thời gian,
                        nhưng giá trị của cơ năng không thay đổi theo thời gian.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Ta đã biết, cơ năng của một hệ bằng tổng động năng và thế năng.
                Kết hợp với các công thức (3.2) và (3.5), ta rút ra được công thức xác định cơ năng trong dao động điều hoà: <br/>
                $W = W_t + W_đ = \\frac{1}{2}m \\omega^2 A^2$ <strong>(3.7)</strong>
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Từ biểu thức (3.7), ta thấy rằng, xét với một dao động điều hoà, cơ năng tỉ lệ thuận với bình phương biên độ dao động A của vật và không thay đổi theo thời gian.
                Như vậy, trong quá trình vật dao động điều hoà, thế năng W và động năng W, biến đổi liên tục theo thời gian nhưng cơ năng luôn bảo toàn.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson3/3.6.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 3.6. Đồ thị biểu diễn sự phụ thuộc của thế năng, động năng, cơ năng trong dao động theo thời gian</p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>7.</strong> Dựa vào biểu thức (3.2) và (3.5), hãy thiết lập biểu thức (3.7).
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Từ công thức (3.2) và (3.5), ta có: <br/>
                        $$
                          \\begin{aligned}
                          W &= W_t + W_đ \\\\
                            &= \\frac{1}{4}m\\omega^2 A^2 + \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0) + \\frac{1}{4}m\\omega^2 A^2 - \\frac{1}{4}m\\omega^2 A^2 \\cos2(\\omega t + \\varphi_0) \\\\
                            &= \\frac{1}{2}m \\omega^2 A^2
                          \\end{aligned}
                        $$
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Xét một vật bắt đầu dao động điều hoà từ vị trí cân bằng, hãy chỉ ra những khoảng thời gian trong một chu kì dao động mà:
                  </p>
                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) thế năng tăng dần trong khi động năng giảm dần.</span> <br/>
                    <span class="font-semibold">b) thế năng giảm dần trong khi động năng tăng dần.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="practice-box-summary">
                      <span>Gợi ý</span>
                    </summary>

                    <div class="practice-box-answer">
                      <div class="text-sm text-justify">
                        <p class="mb-1">
                          <span class="font-semibold">
                            a)
                          </span>
                          <span class="font-normal">
                            Trong khoảng thời gian từ 0 -> $\\frac{T}{4}$ và $\\frac{T}{2}$ -> $\\frac{3T}{4}$
                            thế năng của vật tăng dần trong khi động năng của vật giảm dần.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                            b)
                          </span>
                          <span class="font-normal">
                            Trong khoảng thời gian từ $\\frac{T}{4}$ -> $\\frac{T}{2}$ và $\\frac{3T}{4}$ -> T
                            thế năng của vật giảm dần trong khi động năng của vật tăng dần.
                          </span>
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    Biết phương trình li độ của một vật có khối lượng 0,2 kg dao động điều hoà là $x =$ 5$\\cos($20$t)$ cm.
                  </p>
                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) Tính cơ năng trong quá trình dao động.</span> <br/>
                    <span class="font-semibold">b) Viết biểu thức thế năng và động năng.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="discussion-box-summary">
                      <span>Gợi ý</span>
                    </summary>

                    <div class="discussion-box-answer">
                      <div class="text-sm text-justify">
                        <p class="mb-1">
                          <span class="font-semibold">
                            a) <br/> Cơ năng trong quá trình dao động:
                          </span>
                          <span class="font-normal">
                            $W = \\frac{1}{2}m \\omega^2 A^2 = \\frac{1}{2}$.0,2.20$^2$.0,05$^2 =$ 0,1 J.
                          </span>
                        </p>

                        <p class="font-semibold mb-1">
                            b)
                        </p>
                        <ul>
                            <li><span class="font-semibold">Biểu thức của thế năng:</span> $W_t =$ 0,1 $\\cos^2$(20$t$) (J).</li>
                            <li><span class="font-semibold">Biểu thức của động năng:</span> $W_đ =$ 0,1 $\\sin^2$(20$t$) (J).</li>
                        </ul>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 8,
      title: 'Bảng tóm tắt và tổng kết bài học',
      type: 'summary',
      content: `
            <div class="bg-green-50 dark:bg-green-900/20 p-5 rounded-xl mb-6">
              <h3 class="text-lg font-bold text-center text-green-800 dark:text-green-200 mb-4">
                ▼ Bảng tóm tắt kiến thức
              </h3>

              <div class="overflow-x-auto">
                <table class="w-full table-fixed" style="table-layout: fixed;">

                  <colgroup>
                    <col style="width: 4rem">
                    <col style="width: 10rem">
                    <col style="width: 10rem">
                  </colgroup>

                  <thead>
                    <tr class="bg-emerald-500 text-white dark:bg-emerald-700">
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Khái niệm
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Công thức tính trong dao động điều hoà
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Chú thích ký hiệu
                      </th>
                    </tr>
                  </thead>

            <tbody class="text-center break-words">

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Thế năng
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $W_t = \\frac{1}{2}m\\omega^2 A^2 \\cos^2(\\omega t + \\varphi_0)$
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10 text-left" rowspan="3">
                  <ul class="list-disc list-inside pl-2">
                    <li>$A$ là biên độ dao động của vật <br/> (đơn vị: m, hệ SI).</li>
                    <li>$\\omega$ là tần số góc của dao động <br/> (đơn vị: rad/s, hệ SI).</li>
                    <li>$m$ là khối lượng của vật dao động (đơn vị: kg, hệ SI).</li>
                    <li>$\\varphi_0$ là pha ban đầu của dao động (đơn vị: rad, hệ SI).</li>
                    <li>$W_t$, $W_đ$, $W$ lần lượt là thế năng, động năng, cơ năng của vật khi dao động (đơn vị: J, hệ SI).</li>
                  </ul>
                </td>
              </tr>

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Động năng
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $W_đ = \\frac{1}{2}m\\omega^2 A^2 \\sin^2(\\omega t + \\varphi_0)$
                </td>
              </tr>

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Cơ năng
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $$
                    \\begin{aligned}
                    W &= W_t + W_đ \\\\
                      &= \\frac{1}{2}m \\omega^2 A^2 \\\\
                    \\end{aligned}
                  $$
                </td>
              </tr>

            </tbody>
                </table>
              </div>
            </div>

            <div class="flex justify-center my-8">
              <img src="/images/congrats.jpg" alt="Chúc mừng hoàn thành bài học!" class="w-40 h-40 object-contain" />
            </div>

            <div class="text-center mt-6">
              <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200">🎉 Chúc mừng bạn đã hoàn thành bài học!</h3>
              <p class="text-lg text-gray-600 dark:text-gray-400 mt-2">Hãy luyện tập các bài tập để củng cố kiến thức.</p>
            </div>
          `,
    }
  ]
}

export default lesson3;