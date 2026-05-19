const { title } = require("node:process");

const lesson2 = {
  id: 2,
  title: 'Phương trình dao động điều hoà',
  slides: [
    {
      id: 1,
      title: "Phương trình dao động điều hoà",
      type: "intro",
      content: `

            <div class="summary-box">
              <p>
                - Độ dịch chuyển, vận tốc và gia tốc trong dao động điều hoà.<br/>
                - Các phương trình về li độ, vận tốc và gia tốc của dao động điều hoà.<br/>
                - Mối liên hệ giữa gia tốc và li độ trong dao động điều hoà.
              </p>
            </div>

            <div class="intro-box">
              <p class="intro-text">
              Việc nghiên cứu các quá trình dao động điều hoà để ứng dụng vào thực tiễn như xây dựng mô hình dự báo động đất yêu cầu ta phải mô tả chính xác trạng thái của vật dao động tại những thời điểm xác định. 
              Ngoài ra, dao động điều hoà có tính chất tuần hoàn theo thời gian và bị giới hạn trong không gian thì phương trình li độ, vận tốc và gia tốc của vật dao động điều hoà có những khác biệt gì so với chuyển động thẳng đều và biến đổi đều mà em đã học ở chương trình Vật lí 10?
              </p>
            </div>
      `
    },
    {
      id: 2,
      title: 'Li độ trong dao động điều hoà',
      subId: 1,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Phương trình li độ của vật dao động</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Trong Bài 1, ta đã biết một vật được xem là đang thực hiện dao động điều hoà khi đô thị li độ - thời gian của vật có dạng hình sin như <strong>Hình 1.4</strong>.
                Trong toán học, chỉ có hàm cosin (hoặc sin) mới có đồ thị dạng hình sin tương ứng.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Phương trình li độ của vật dao động điều hòa có dạng:<br>
                    <strong>$x = A \\cos(\\omega t + \\varphi_0)$</strong> <strong>(2.1)</strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Trong đó: <br>
                $x$, $A$ lần lượt là li độ và biên độ dao động của vật, trong hệ SI có đơn vị là m. <br>
                $\\omega$ là tần số góc của dao dộng, trong hệ SI có đơn vị là rad/s. <br>
                $\\varphi = \\omega t + \\varphi_0$ là pha của dao động, trong hệ SI có đơn vị là rad. <br>
                $\\varphi_0$ là pha ban đầu của dao động, trong hệ SI có đơn vị là rad.
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>1.</strong> Quan sát dao động của con lắc lò xo và kết hợp với <span class="font-bold">Hình 1.4</span>,
                    hãy chỉ rõ sự khác nhau giữa hình dạng quỹ đạo chuyển động và đồ thị li độ của vật
                    dao động theo thời gian.
                  </p>
                  
                  <details>
                    <summary class="discussion-box-summary">
                        <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                        <p class="text-box-text">
                        Quỹ đạo của vật nặng trong con lắc lò xo khi dao động là một đoạn thẳng, trong khi độ thị li độ của vật dao động theo thời gian có dạng hình sin.
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
      title: 'Li độ trong dao động điều hoà',
      subId: 1,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Độ dịch chuyển của vật dao động</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Trong chương trình Vật lí 10, các em đã biết độ dịch chuyển được xác định bằng độ biến thiên toạ độ của vật.
                Như vậy, tại một thời điểm bất kì, độ dịch chuyển của vật dao động so với vị trí ban đầu được xác định bằng công thức: <br>
                <strong>$d = \\Delta x = x - x_0 = A \\cos(\\omega t + \\varphi_0) - A \\cos(\\varphi_0)$</strong> <strong>(2.2)</strong>
              </p>
            </div>

            <div class ="text-box">
              <p class="text-box-text">
              <strong>Hình 2.1</strong> minh hoạ đồ thị li độ - thời gian (đường màu đỏ) và độ dịch chuyển - thời gian (đường màu xanh dương) đối với một vật dao động điều hoà có
              $A =$ 2 cm, $T =$ 1 s và $\\varphi_0 = \\frac{\\pi}{3}$.
              </p>
            </div>


            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson2/2.1.png" alt="Đồ thị li độ - thời gian">
              </div>
              <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.1. Đồ thị li độ - thời gian và độ dịch chuyển - thời gian của một vật dao động điều hoà</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Ta thấy độ dịch chuyển so với vị trí ban đầu của vật cũng biến thiên điều hoà theo thời gian cùng biên độ, chu kì và pha với li độ của vật dao động.
              Tại từng thời điểm, đồ thị độ dịch chuyển - thời gian dịch xuống một đoạn $A\\cos$($\\varphi_0$) trên trục tung so với đồ thị li độ - thời gian như <strong>Hình 2.1</strong>.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Từ công thức [[formula:2.1]], ta thấy $d$ trùng với $x$ khi gốc thời gian được chọn lúc vật đi qua vị trí cân bằng <br>
              ($\\cos$($\\varphi$) $=$ 0). Như vậy, li độ cũng chính là độ dịch chuyển từ vị trí cân bằng đến vị trí của vật tại thời điểm $t$.
              </p>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Một vật dao động có đồ thị li độ - thời gian được mô tả trong <span class="font-bold">Hình 2.2</span>. Hãy xác định:
                  </p>

                  <p class="inner-text-box-text">
                    <span class="font-semibold"> a) Biên độ dao động, chu kì, tần số, tần số góc của dao động.</span> <br/>
                    <span class="font-semibold"> b) Li độ của vật dao động tại các thời điểm $t_1$, $t_2$, $t_3$ ứng với các điểm A, B, C trên đường đồ thị li độ - thời gian.</span> <br/>
                    <span class="font-semibold"> c) Độ dịch chuyển so với vị trí ban đầu tại thời điểm $t_1$, $t_2$, $t_3$ trên đường đồ thị.</span> <br/>
                  </p>

                  <div class="orange-image-box">
                    <div class="image-box-img-wrapper">
                      <img src="/images/chapter1_lesson2/2.2.png"/>
                    </div>
                    <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.2. Đồ thị li độ - thời gian của một vật dao động</p>
                  </div>

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
                          Biên độ dao động A $=$ 0,2 cm, chu kì dao động T $=$ 0,4 s, tần số dao động f $=$ 2,5 Hz, tần số góc $\\omega =$ 5$\\pi$ rad/s.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          b)
                          </span>
                          <span class="font-normal">
                          Li độ của vật tại các thời điểm $t_1$, $t_2$, $t_3$ ứng với các điểm A, B, C trên đường đô thị lần lượt là: -0,1 cm, -0,2 cm, 0 cm.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          c)
                          </span>
                          <span class="font-normal">
                          Độ dịch chuyển so với vị trí ban đầu tại các thời điểm $t_1$, $t_2$, $t_3$ trên đường đô thị cũng chính bằng li độ của chúng vì gốc thời gian được chọn lúc vật đi qua vị trí cân bằng.
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 4,
      title: 'Vận tốc trong dao động điều hoà',
      subId: 2,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Phương trình vận tốc của vật dao động</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">

                  <p class="discussion-box-question">
                    <strong>2.</strong> Quan sát <strong>Hình 2.3a</strong> và <strong>Hình 2.3b</strong>, hãy xác định:
                    </p>

                    <p class="inner-text-box-text">
                    <span class="font-semibold">a) Hình dạng đồ thị vận tốc - thời gian của vật.</span> <br/>
                    <span class="font-semibold">b) Chu kì của vận tốc của vật.</span> <br/>
                    <span class="font-semibold">c) Mối liên hệ giữa tốc độ cực đại và biên độ của vật.</span> <br/>
                    <span class="font-semibold">d) Độ lệch pha của vận tốc so với li độ của vật.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="discussion-box-summary">
                      <span>Gợi ý</span>
                    </summary>

                    <div class="discussion-box-answer">
                      <div class="text-sm text-justify">
                        <p class="mb-1">
                          <span class="font-semibold">
                          a)
                          </span>
                          <span class="font-normal">
                          Đồ thị vận tốc - thời gian của vật dao động điều hoà cũng có dạng hình sin như đô thị li độ - thời gian.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          b)
                          </span>
                          <span class="font-normal">
                          Chu kì của vận tốc của vật cũng bằng chu kì của li độ, bằng 0,66 s.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          c)
                          </span>
                          <span class="font-normal">
                          Biên độ dao động là $A =$ 0,44 cm và tốc độ cực đại của vật là $v_{max} =$ 4,20 cm/s.<br/>
                          Ta thấy rằng $\\omega A =$ 2$\\pi$f$A =\\frac{2\\pi}{0,66} \\times$ 0,44 $=$ 4,19 cm/s, xấp xỉ giá trị của tốc độ cực đại $v_{max}$.
                          Do đó, ta có thể dự đoán mối liên hệ giữa tốc độ cực đại và biên độ dao động của vật là $v_{max} = \\omega A$.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          d)
                          </span>
                          <span class="font-normal">
                          Ta thấy rằng sau khoảng thời gian $\\Delta t$ = $\\frac{T}{4}$, li độ có cùng trạng thái dao động với vận tốc. Độ lệch pha của hai đại lượng này là $\\Delta \\varphi$ = 2$\\pi \\frac{\\Delta t}{T}$ = $\\frac{\\pi}{2}$.
                          </span>
                        </p>
                      </div>
                    </div>
                  </details>
    
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Trong chương trình Vật lí 10, các em đã biết vận tốc tức thời của vật được xác định bằng thương số giữa độ dịch chuyển
              $d = \\Delta x$ và thời gian $\\Delta t$ để vật thực hiện độ dịch chuyển đó:<br/>
              $v = \\frac{d}{\\Delta t}$ <strong>(2.3)</strong>, với điều kiện $\\Delta t$ rất nhỏ.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Đồ thị li độ - thời gian và vận tốc - thời gian của một vật dao động điều hoà được xác định từ thực nghiệm có dạng như <strong>Hình 2.3a</strong> và <strong>Hình 2.3b</strong>. Quan sát <strong>Hình 2.3</strong>, ta thấy:<br>
              - Đồ thị vận tốc - thời gian của vật dao động điều hoà cũng có dạng hình sin. Nghĩa là vận tốc của vật dao động điều hoà cũng biến đổi điều hoà theo thời gian. <br>
              - Vận tốc và li độ của vật dao động điều hoà có cùng chu kì $T$ (cùng tần số $f$). <br>
              - Tỉ số của tốc độ cực đại và biên độ dao động của vật bằng $\\omega$. Nghĩa là $v_{max}$ = $A\\omega$. <br>
              - Sau một khoảng thời gian $\\Delta t = \\frac{T}{4}$, li độ có cùng trạng thái dao động với vận tốc. Nghĩa là vận tốc
              biến đổi điều hoà theo thời gian lệch pha $\\frac{\\pi}{2}$ so với li độ. <br>
              Từ những nhận xét trên, kết hợp với việc sử dụng công cụ toán học phù hợp, ta rút ra được:
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Phương trình vận tốc của vật dao động điều hoà có dạng: <br>
                    $v = A \\omega \\cos(\\omega t + \\varphi_0 + \\frac{\\pi}{2}) = -A \\omega \\sin(\\omega t + \\varphi_0)$ <strong>(2.4)</strong>
                  </p>
                </div>
              </div>
            </div> 

            <div class="double-image-box">
              <div class="image-box">
              <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson2/2.3a.png">
              </div>
              <p class="image-box-caption">a) Đồ thị li độ - thời gian</p>
              </div>

              <div class="image-box">
              <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson2/2.3b.png">
              </div>
              <p class="image-box-caption">b) Đồ thị vận tốc - thời gian</p>
              </div>
            </div>

            <div class="image-box">
                <div class="small-image-box-img-wrapper">
                    <img src="/images/chapter1_lesson2/2.3c.png">
                </div>
                <p class="image-box-caption">c) Đồ thị gia tốc - thời gian</p>
                </div>
            </div>
            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.3.</p>
          
            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                  <div class="flex-1">
                    <p class="practice-box-question">
                      Một vật dao động điều hoà với biên độ 10 cm và chu kì 2 s.
                      Chọn gốc thời gian là khi vật qua vị trí cân bằng theo chiều dương.
                      Xác định vận tốc của vật vào thời điểm đó.
                    </p>

                    <details>
                      <summary class="practice-box-summary">
                        <span> Gợi ý </span>
                      </summary>

                      <div class="practice-box-answer">
                        <ul>
                          <li>Tần số góc của dao động là: $\\omega = \\frac{2\\pi}{T} = \\frac{2\\pi}{2} = \\pi$ rad/s</li>
                          <li>Gốc thời gian được chọn lúc vật qua vị trí cân bằng theo chiều dương nên ta có: $x$(0) $=$ 0, $v$(0) $>$ 0</li>
                          <li>Sử dụng các phương trình [[formula:2.1]] và [[formula:2.4]] với $t =$ 0, ta có: $\\cos \\varphi_0 =$ 0 và $\\sin \\varphi_0 =$ -1, suy ra pha ban đầu $\\varphi_0 = \\frac{\\pi}{2}$</li>
                          <li>Phương trình vận tốc của dao động điều hoà là:<br/>
                          $v = -\\omega A \\sin(\\omega t + \\varphi_0) = -$10$\\pi \\sin(\\pi t - \\frac{\\pi}{2})$.
                          Suy ra vận tốc của vật vào thời điểm ban đầu là $v$(0) $=$ 10$\\pi$ cm/s</li>
                        </ul>
                      </div>
                    </details>
                  </div>
              </div>
            </div>
      `
    },
    {
      id: 5,
      title: 'Vận tốc trong dao động điều hoà',
      subId: 2,
      type: 'exploratory',
      content: `
            <p class="section-title">
              <strong>▶ Công thức mô tả mối liên hệ giữa vận tốc và li độ trong dao động điều hoà</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
              Kết hợp các công thức [[formula:2.1]] và [[formula:2.4]], ta rút ra được công thức mô tả mối liên hệ giữa vận tốc và li độ của vật dao động tại mỗi thời điểm:
              $\\frac{v^2}{\\omega^2} + \\frac{x^2}{A^2} =$ 1 <strong>(2.5)</strong>
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                  <img src="/images/chapter1_lesson2/2.4.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.4. Đồ thị mô tả mối liên hệ giữa vận tốc và li độ của vật dao động</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Từ đồ thị trong <strong>Hình 2.3a</strong> và <strong>Hình 2.3b</strong>, kết hợp với phương trình [[formula:2.5]], ta thấy:<br/>
                - Khi vật đi qua vị trí cân bằng: $x =$ 0, $v = ±v_{max}$.<br/>
                - Khi vật ở hai biên: $x = ±A$, $v =$ 0.<br/>
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Đồ thị mô tả mối liên hệ giữa vận tốc và li độ của vật dao động được thể hiện trong <strong>Hình 2.4</strong> là một đường elip có độ dài hai trục lần lượt là 2$A$ và 2$v_{max}$.
              </p>
            </div>

      `
    },
    {
      id: 6,
      title: 'Gia tốc trong dao động điều hoà',
      subId: 3,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Phương trình gia tốc của vật dao động</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">

                  <p class="discussion-box-question">
                    <strong>3.</strong> Quan sát <strong>Hình 2.3a</strong> và <strong>Hình 2.3c</strong>, hãy xác định:
                    </p>

                    <p class="inner-text-box-text">
                    <span class="font-semibold">a) Hình dạng đồ thị gia tốc - thời gian của vật.</span> <br/>
                    <span class="font-semibold">b) Chu kì của gia tốc của vật.</span> <br/>
                    <span class="font-semibold">c) Mối liên hệ giữa gia tốc cực đại và biên độ của vật.</span> <br/>
                    <span class="font-semibold">d) Độ lệch pha của gia tốc so với li độ của vật.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="discussion-box-summary">
                      <span>Gợi ý</span>
                    </summary>

                    <div class="discussion-box-answer">
                      <div class="text-sm text-justify">
                        <p class="mb-1">
                          <span class="font-semibold">
                          a)
                          </span>
                          <span class="font-normal">
                          Đồ thị gia tốc - thời gian của vật dao động điều hoà cũng có dạng hình sin như đô thị li độ - thời gian.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          b)
                          </span>
                          <span class="font-normal">
                          Chu kì của gia tốc của vật cũng bằng chu kì của li độ, bằng 0,66 s.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          c)
                          </span>
                          <span class="font-normal">
                          Biên độ dao động là $A =$ 0,44 cm và gia tốc cực đại của vật là $a_{max} =$ 40 cm/s².<br/>
                          Ta thấy rằng $\\omega^2 A =$ (2$\\pi$f)²$A =$ ($\\frac{2\\pi}{0,66}$)² $\\times$ 0,44 $=$ 39.88 cm/s², xấp xỉ giá trị của gia tốc cực đại $a_{max}$.
                          Do đó, ta có thể dự đoán mối liên hệ giữa gia tốc cực đại và biên độ dao động của vật là $a_{max} = \\omega^2 A$.
                          </span>
                        </p>

                        <p class="mb-1">
                          <span class="font-semibold">
                          d)
                          </span>
                          <span class="font-normal">
                          Ta thấy rằng sau khoảng thời gian $\\Delta t$ = $\\frac{T}{2}$, li độ có cùng trạng thái dao động với gia tốc. Độ lệch pha của hai đại lượng này là $\\Delta \\varphi$ = 2$\\pi \\frac{\\Delta t}{T}$ = $\\pi$.
                          </span>
                        </p>
                      </div>
                    </div>
                  </details>
    
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Ta đã biết, gia tốc tức thời được xác định bằng thương số giữa biến thiên vận tốc $\\Delta v$ và thời gian $\\Delta t$ để vật thực hiện sự biến thiên vận tốc đó.<br/>
              $a = \\frac{\\Delta v}{\\Delta t}$ <strong>(2.6)</strong>, với điều kiện $\\Delta t$ rất nhỏ.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              Đồ thị gia tốc - thời gian của một dao động điều hoà được xác định từ thực nghiệm có dạng như <strong>Hình 2.3c</strong>. Quan sát <strong>Hình 2.3</strong>, ta thấy:<br/>
              - Đồ thị gia tốc - thời gian của vật dao động điều hoà cũng có dạng hình sin. Nghĩa là gia tốc của vật dao động điều hoà cũng biến đổi điều hoà theo thời gian.<br/>
              - Gia tốc và li độ của vật dao động điều hoà có chu kì T (cùng tần số f).<br/>
              - Tỉ số của độ lớn cực đại của gia tốc và biên độ dao động của vật bằng $\\omega^2$. Nghĩa là $a_{max} = A\\omega^2$.<br/>
              - Sau một khoảng thời gian $\\Delta t = \\frac{T}{2}$, li độ có cùng trạng thái dao động với gia tốc. Nghĩa là gia tốc và li độ luôn lệch pha $\\pi$ so với nhau (ngược pha nhau).<br/>
              Từ những nhận xét trên, kết hợp với việc sử dụng công cụ toán học phù hợp, ta rút ra được:
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Phương trình gia tốc của vật dao động điều hoà có dạng: <br>
                    $a = \\omega^2 A \\cos(\\omega t + \\varphi_0 + \\pi) = -\\omega^2 A \\cos(\\omega t + \\varphi_0) = -\\omega^2 x$ <strong>(2.7)</strong>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Do ta có $F = ma = -Kx$ (với $K = m\\omega^2$) nên lực tác dụng vào vật dao động điều hoà luôn hướng về vị trí cân bằng của vật.
                Từ đây, ta rút ra được những điều kiện để một vật thực hiện dao động điều hoà là:<br/>
                - Có một vật để thực hiện chuyển động.<br/>
                - Vật tồn tại một vị trí cân bằng.<br/>
                - Có lực tác dụng vào vật để luôn kéo vật về vị trí cân bằng.<br/>
                Lực này có độ lớn tỉ lệ thuận với độ lớn li độ của vật dao động.
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                  <div class="discussion-box-icon">👥</div>
                  <div class="flex-1">

                    <p class="discussion-box-question">
                      <strong>4.</strong> Hãy vẽ phác đồ thị lực tác dụng - thời gian của vật dao động điều hoà có đồ thị li độ - thời gian như <strong>Hình 2.2</strong>.
                    </p>

                    <details>
                      <summary class="discussion-box-summary">
                        <span>Gợi ý</span>
                      </summary>
                      <div class="discussion-box-answer">
                        <div class="image-box">
                          <div class="image-box-img-wrapper">
                            <img src="/images/chapter1_lesson2/2.4S.png" />
                          </div>
                          <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình bài giải</p>
                        </div>
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
                    Dựa vào các đồ thị trong <strong>Hình 2.3</strong>:
                  </p>
                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) Viết phương trình li độ, vận tốc và gia tốc của vật dao động điều hoà.</span> <br/>
                    <span class="font-semibold">b) Mô tả định tính tính chất của li độ, vận tốc và gia tốc của vật tại các thời điểm: 0,5 s; 0,75 s và 1 s.</span> <br/>
                    <span class="font-semibold">c) Dựa vào các phương trình được xây dựng ở câu a để kiểm chứng lại mô tả định tính ở câu b.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="practice-box-summary">
                        <span>Gợi ý</span>
                    </summary>

                    <div class="practice-box-answer">
                      <div class="text-sm text-justify">
                        <p class="font-bold mb-1">
                            a)
                        </p>
                        <ul>
                          <li>Dựa vào đồ thị trong <strong>Hình 2.3</strong>, ta thấy biên độ và chu kì của vật dao động lần lượt là $A =$ 0,44 cm và $T =$ 0,66 s.
                          Từ đó ta có tần số góc của vật dao động là:<br/> 
                          $\\omega = \\frac{2\\pi}{T} = \\frac{2\\pi}{0,66} =$ 9,52 rad/s.<br/></li>
                          <li>Tại thời điểm ban đầu, vật đang ở biển âm. Do đó ta có: $x$(0) = $A\\cos\\varphi = -A$ ⇒ $\\cos\\varphi =$ -1 ⇒ $\\varphi = \\pi$ rad.</li>
                          <li>Các phương trình dao động điều hoà của vật:<br/>
                          - <span class="font-semibold">Phương trình li độ:</span> $x =$ 0,44 $\\cos$(9,52$t + \\pi$) (cm).<br/>
                          - <span class="font-semibold">Phương trình vận tốc:</span> $v =$ -4,2$\\sin$(9,52$t + \\pi$) (cm/s).<br/>
                          - <span class="font-semibold">Phương trình gia tốc:</span> $a =$ -40$\\cos$(9,52$t + \\pi$) (cm/s²).<br/></li>
                        </ul>

                        <p class="mb-1">
                          <span class="font-bold">
                          b)
                          </span>
                          <span class="font-normal">
                          Việc mô tả định tính tính chất của li độ, vận tốc và gia tốc của vật dao động được dựa vào đồ thị. Cụ thể:<br/>
                          - <span class="font-semibold">Tại t = 0,33 s:</span> x = 0,44 cm; v = 0 cm/s; a=-40 cm/s².<br/>
                          - <span class="font-semibold">Tại t = 0,495 s:</span> x = 0 cm; v = -4,2 cm/s; a = 0 cm/s².<br/>
                          - <span class="font-semibold">Tại t = 0,66 s:</span> x = -0,44 cm; v = 0 cm/s; a = 40 cm/s².
                          </span>
                        </p>
                      </div>
                    </div>
                  </details>
                </div>
              </div>
            </div>
    `
    },
    {
      id: 7,
      title: 'Gia tốc trong dao động điều hoà',
      subId: 3,
      type: 'exploratory',
      content: `

          <div class="text-box">
            <p class="text-box-text">
              Đồ thị mô tả mối liên hệ giữa gia tốc và li độ được thể hiện trong <strong>Hình 2.5</strong> là một đoạn thẳng đi qua gốc toạ độ với hệ số góc có giá trị -0.
              Gia tốc luôn có chiều hướng về vị trí cân bằng của vật.
            </p>
          </div>

          <div class="image-box">
            <div class="image-box-img-wrapper">
              <img src="/images/chapter1_lesson2/2.5.png">
            </div>
            <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.5. Đồ thị mô tả mối liên hệ giữa gia tốc - li độ của vật dao động</p>
          </div>  

      `
    }
    ,
    {
      id: 8,
      title: 'Gia tốc trong dao động điều hoà',
      subId: 3,
      type: 'example',
      content: `

            <div class="section-title">
              <strong>▶ Vận dụng phương trình gia tốc, mối liên hệ giữa gia tốc và li độ của vật dao động</strong>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                <strong>Ví dụ:</strong> Một vật dao động điều hoà có phương trình gia tốc $a = 12π^2 \\cos(2πt + \\frac{π}{2})$ cm/s².<br/>
                a) Xác định biên độ, chu kì và tần số dao động của vật.<br/>
                b) Viết phương trình li độ và phương trình vận tốc của vật.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                <strong>Bài giải:</strong>
              </p>

              <p class="text-box-text mt-3">
                a) Từ công thức [[formula:2.7]] ta có: $a = \\omega^2 A \\cos(\\omega t + \\varphi_0 + \\pi) = -\\omega^2 A \\cos(\\omega t + \\varphi_0) = -\\omega^2 x$ <br/>
                So sánh với phương trình gia tốc của vật, suy ra:<br/>
                - Tần số góc: $\\omega =$ 2$\\pi$ rad/s.<br/>
                - Biên độ dao động: $A = \\frac{a_{max}}{\\omega^2} = \\frac{12\\pi^2}{(2\\pi)^2} =$ 3 cm.<br/>
                - Pha ban đầu của dao động: $\\varphi_0 = \\frac{pi}{2} - \\pi = -\\frac{pi}{2}$ rad.<br/>
                - Chu kì dao động: $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{2\\pi} =$ 1 s.<br/>
                - Tần số dao động: $f = \\frac{1}{T} = \\frac{1}{1} =$ 1 Hz. <br/>
              </p>

              <p class="text-box-text mt-3">
                b)<br/>
                - Phương trình li độ của vật theo công thức [[formula:2.1]]:<br/>
                $x = A\\cos(\\omega t + \\varphi_0) =$ 3$\\cos($2$\\pi t - \\frac{\\pi}{2})$ cm.<br/>
                - Phương trình vận tốc của vật theo công thức [[formula:2.4]]:<br/>
                $v = \\omega A\\cos(\\omega t + \\varphi_0 + \\frac{\\pi}{2}) =$ 6$\\pi\\cos($2$\\pi t)$ cm/s.
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>5.</strong> Nhận xét về độ lệch pha giữa vận tốc và gia tốc của vật dao động.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Dựa vào các công thức [[formula:2.4]] và [[formula:2.7]],
                        ta rút ra được độ lệch pha giữa gia tốc và vận tốc là $\\Delta \\varphi = \\frac{pi}{2}$ rad.
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
                    Một máy cơ khí khi hoạt động sẽ tạo ra những dao động được xem gần đúng là dao động điều hoà với phương trình li độ có dạng:<br/>
                    $x =$ 2$\\cos($180$\\pi t)$ mm
                  </p>
                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) Hãy xác định biên độ, chu kì, tần số và tần số góc của dao động.</span> <br/>
                    <span class="font-semibold">b) Viết phương trình vận tốc và gia tốc của vật dao động.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="practice-box-summary">
                        <span>Gợi ý</span>
                    </summary>

                    <div class="practice-box-answer">
                      <div class="text-sm text-justify">
                        <p class="font-semibold mb-1">
                          a)
                        </p>
                        <ul>
                          <li><strong>Biên độ dao động:</strong> $A = $ 2 mm.</li>
                          <li><strong>Tần số góc:</strong> $\\omega =$ 180$\\pi$ rad/s.</li>
                          <li><strong>Chu kỳ dao động:</strong> $T = \\frac{2\\pi}{\\omega} = \\frac{2\\pi}{180\\pi} = \\frac{1}{90} \\approx$ 0,011.</li>
                          <li><strong>Tần số dao động:</strong> $f = \\frac{\\omega}{2\\pi} = \\frac{180\\pi}{2\\pi} = $ 90 Hz.</li>
                        </ul>

                        <p class="font-semibold mb-1">
                          b)
                        </p>
                        <ul>
                          <li><strong>Phương trình vận tốc:</strong> $v = -$360$\\pi \\sin($180$\\pi t)$ (mm/s).</li>
                          <li><strong>Phương trình gia tốc:</strong> $a = -$64800$\\pi^2 \\cos($180$\\pi t)$ (mm/s²).</li>
                        </ul>
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
                    Tìm hiểu và trình bày ngắn gọn nguyên tắc hoạt động của thiết bị đo khối lượng của các phi hành gia trên tàu vũ trụ.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li>Dụng cụ đo khối lượng của các phi hành gia trên tàu vũ trụ trong điều kiện phi trọng lượng trên quỹ đạo quanh Trái Đất gồm một cái ghế lắp vào một đầu của lò xo, đầu còn lại của lò xo gắn vào một điểm cố định trên tàu) như hình dưới đây.</li>
                      </ul>

                      <div class="image-box">
                        <div class="small-image-box-img-wrapper">
                          <img src="/images/chapter1_lesson2/2.S.png" />
                        </div>
                      </div>

                      <ul>
                        <li>Khối lượng $M$ của ghế và độ cứng $k$ của lò xo là những tham số được cung cấp bởi nhà sản xuất.<br/></li>
                        <li>Khi sử dụng, phi hành gia ngồi vào ghế và thắt dây buộc chặt thân mình vào ghế. Sau đó, ghế được kích thích cho dao động. Chu kì dao động T của ghế được đo và có thể được thể hiện trên một đồng hồ hiện số được gắn trên ghế.
                        <li>Từ đó, phi hành gia có thể suy ra được khối lượng của mình từ công thức: <br/>
                        $m = \\frac{k}{4\\pi^2} T^2 - M$</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

          `
    },
    {
      id: 9,
      title: 'Gia tốc trong dao động điều hoà',
      type: 'exploratory',
      subId: 3,
      content: `

          <p class="section-title">
            <strong>▶ Con lắc đơn</strong>
          </p>

          <div class="text-box">
            <p class="text-box-text">
              Xét một con lắc lò xo gồm một vật nặng khối lượng m gắn vào đầu một lò xo nhẹ có độ cứng k, đầu còn lại của lò xo được giữ cố định.
              Vật có thể chuyển động trên mặt sàn nằm ngang như <strong>Hình 2.6</strong>, ma sát giữa mặt sàn và vật là không đáng kể. Kích thích cho vật dao động.
            </p>

            <p class="text-box-text mt-3">
              Các lực tác dụng vào vật nặng gồm:
              trọng lực $\\vec{P}$, phản lực $\\vec{N}$ và lực đàn hồi $\\vec{F}$.<br/>
              <br/>
              Theo định luật II Newton, ta có:
              $\\vec{P} + \\vec{N} + \\vec{F} = m\\vec{a}$ <strong>(2.8)</strong> <br/>
              Chiếu lên phương chuyển động, ta có:
              $F = ma$ <strong>(2.9)</strong> <br/>
              Lực đàn hồi có giá trị $F = -kx$ luôn ngược chiều với li độ của vật và hướng về vị trí cân bằng của vật. <br/>
              Ta có: $a = -\\frac{k}{m} x$ <strong>(2.10)</strong> <br/>
            </p>

            <p class="text-box-text mt-3">
              Kết hợp với phương trình [[formula:2.7]] ta suy ra:
              $\\omega^2 = \\frac{k}{m}$ <strong>(2.11)</strong> <br/>
              hay $\\omega = \\sqrt\\frac{k}{m}$ chính là tần số góc của con lắc lò xo dao động điều hoà.
            </p>

            <p class="text-box-text mt-3">
              <strong> Lưu ý: </strong> Đối với một hệ dao động tự do, tần số góc có một giá trị xác định, phụ thuộc vào các đặc tính của hệ.
            </p>
          </div>

          <div class="image-box">
            <div class="image-box-img-wrapper">
              <img src="/images/chapter1_lesson2/2.6.png" alt="Con lắc lò xo" />
            </div>
            <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.6. Con lắc lò xo</p>
          </div>
          `,
    },
    {
      id: 10,
      title: 'Gia tốc trong dao động điều hoà',
      type: 'exploratory',
      subId: 3,
      content: `

          <p class="section-title">
            <strong>▶ Con lắc đơn</strong>
          </p>

          <div class="text-box">
            <p class="text-box-text">
              Xét con lắc đơn gồm một vật nặng gắn vào đầu một sợi dây nhẹ, không dãn, đầu còn lại của sợi dây được giữ cố định như <strong>Hình 2.7</strong>.
              Xem lực cản của không khí là không đáng kể. Kích thích cho vật dao động.
            </p>

            <p class="text-box-text mt-3">
              Các lực tác dụng vào vật nặng gồm: trọng lực $\\vec{P}$ và lực căng dây $\\vec{T}$. <br/>
              Trọng lực $\\vec{P}$ được phân tích thành hai thành phần: thành phần pháp tuyến $\\vec{P_n}$  và tiếp tuyến $\\vec{P_t}$. <br/>
              Hợp lực của $\\vec{T}$ và $\\vec{P_n}$ hướng vào điểm cố định của dây treo, đóng vai trò là lực hướng tâm giúp vật chuyển động tròn. <br/>
              Lực $\\vec{P_t}$ luôn có tác dụng kéo vật về vị trí cân bằng O. <br/>
              <br/>
              Xét trên phương tiếp tuyến của quỹ đạo, ta có:
              $F = -mg \\sin \\theta = ma$ <strong>(2.12)</strong> <br/>
              Khi vật dao động góc nhỏ ($\\theta ≤ 10^\\circ$), ta có:
              $\\sin \\theta \\approx \\tan \\theta \\approx \\theta = \\frac{x}{l}$ <strong>(2.13)</strong> <br/>
              Do đó: $-\\frac{mg}{l} x = ma$ <=> $a = -\\frac{g}{l} x$ <strong>(2.14)</strong>. <br/>
              Với $x$ là độ dài cung $\\overparen{OM}$
            </p>

            <p class="text-box-text mt-3">
              Kết hợp với phương trình [[formula:2.7]] ta suy ra:
              $\\omega^2 = \\frac{g}{l}$ <strong>(2.15)</strong> <br/>
              hay $\\omega = \\sqrt\\frac{g}{l}$ chính là tần số góc của con lắc đơn dao động điều hoà với biên độ góc đủ nhỏ.
            </p>

            <p class="text-box-text mt-3">
              <strong> Lưu ý: </strong> Đối với một hệ dao động tự do, tần số góc có một giá trị xác định, phụ thuộc vào các đặc tính của hệ.
            </p>
          </div>

          <div class="image-box">
            <div class="image-box-img-wrapper">
              <img src="/images/chapter1_lesson2/2.7.png" alt="Con lắc đơn" />
            </div>
            <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 2.7. Con lắc đơn</p>
          </div>
          `,
    },
    {
      id: 11,
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
                    <col style="width: 9rem">
                    <col style="width: 11rem">
                  </colgroup>

                  <thead>
                    <tr class="bg-emerald-500 text-white dark:bg-emerald-700">
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Khái niệm
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Công thức
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Chú thích ký hiệu
                      </th>
                    </tr>
                  </thead>

            <tbody class="text-center break-words">

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Phương trình li độ
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $x = A\\cos(\\omega t + \\varphi_0)$
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10 text-left" rowspan="3">
                  <ul class="list-disc list-inside pl-2">
                    <li>$A$ là biên độ dao động của vật <br/> (đơn vị: m, hệ SI).</li>
                    <li>$\\omega$ là tần số góc của dao động <br/> (đơn vị: rad/s, hệ SI).</li>
                    <li>$\\varphi = \\omega t + \\varphi_0$ là pha của dao động tại thời điểm $t$ (đơn vị: rad, hệ SI).</li>
                    <li>$\\varphi_0$ là pha ban đầu của dao động (đơn vị: rad, hệ SI).</li>
                    <li>$x$ là li độ của vật dao động <br/> (đơn vị: m, hệ SI).</li>
                    <li>$v$ là vận tốc của vật dao động <br/> (đơn vị:m/s, hệ SI).</li>
                    <li>$a$ là gia tốc của vật dao động <br/> (đơn vị: m/s², hệ SI).</li>
                  </ul>
                </td>
              </tr>

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Phương trình vận tốc
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $$
                    \\begin{aligned}
                    v &= A \\omega \\cos(\\omega t + \\varphi_0 + \\frac{\\pi}{2}) \\\\
                      &= -A \\omega \\sin(\\omega t + \\varphi_0)
                    \\end{aligned}
                  $$
                </td>
              </tr>

              <tr>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-green-50 dark:bg-green-900/10">
                  Phương trình gia tốc
                </td>
                <td class="border border-green-300 dark:border-green-600 p-2 bg-white dark:bg-gray-800">
                  $$
                  \\begin{aligned}
                  a &= \\omega^2 A \\cos(\\omega t + \\varphi_0 + \\pi) \\\\
                    &= -\\omega^2 A \\cos(\\omega t + \\varphi_0) \\\\
                    &= -\\omega^2 x
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

export default lesson2;