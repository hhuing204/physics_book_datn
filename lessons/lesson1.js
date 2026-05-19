const lesson1 = {
  id: 1,
  title: 'Mô tả dao động',
  slides: [
    {
      id: 1,
      title: "Mô tả dao động",
      type: "intro",
      content: `

            <div class="summary-box">
              <p>
                - Thí nghiệm đơn giản về dao động, một số ví dụ đơn giản về dao động tự do.<br/>
                - Định nghĩa biên độ, chu kì, tần số, tần số góc, độ lệch pha.<br/>
                - Mô tả dao động điều hoà.
              </p>
            </div>

            <div class="intro-box">
              <p class="intro-text">
              Sự dao động của các vật diễn ra phổ biến trong cuộc sống hàng ngày như:
                dao động của quả lắc đồng hồ <strong>(Hình 1.1a)</strong>, dao động của cánh chim ruồi để giữ
                cho cơ thể bay tại chỗ trong không trung khi hút mật <strong>(Hình 1.1b)</strong>.
                Vậy dao động có đặc điểm gì và được mô tả như thế nào?
                </p>
            </div>

            <div class="double-image-box">
                <div class="image-box">
                  <div class="image-box-img-wrapper">
                      <img src="/images/chapter1_lesson1/1.1a.png" class="max-h-full object-contain rounded"/>
                  </div>
                <p class="image-box-caption">a) Đồng hồ quả lắc</p>
                </div>

                <div class="image-box">
                  <div class="image-box-img-wrapper">
                    <img src="/images/chapter1_lesson1/1.1b.png" class="max-h-full object-contain rounded"/>
                  </div>
                  <p class="image-box-caption">b) Chim ruồi đang hút mật</p>
                </div>
            </div>

            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400">
                ▲ Hình 1.1.
            </p>
            `
    },
    {
      id: 2,
      title: 'Khái niệm dao động tự do',
      type: 'foundation',
      subId: 1,
      content: `
            <p class="section-title">
              <strong>▶ Khái niệm dao động</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Chuyển động của những vật trong <strong>Hình 1.1</strong> (quả lắc, cánh chim) có điểm chung là sự chuyển động có tính lặp lại và có giới hạn trong không gian.
                Những chuyển động như vậy được gọi là <strong>dao động cơ học</strong>. Một số vật thực hiện dao động cơ học quanh một vị trí đặc biệt được gọi là <strong>vị trí cân bằng</strong>.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Dao động cơ học là sự chuyển động có giới hạn trong không gian của một vật quanh một vị trí đặc biệt được gọi là vị trí cân bằng.
                  </p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-3 rounded-lg mb-4 shadow-sm">
              <p class="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
                Dao động rất phổ biến trong tự nhiên và khoa học kỹ thuật. Trong điện và từ học cũng có hiện tượng dao động. Dòng điện được sử dụng trong sinh hoạt hàng ngày là dao động điện từ.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Dao động mà trạng thái chuyển động của vật (vị trí và vận tốc) được lặp lại như cũ sau những khoảng thời gian bằng nhau được gọi là <strong>dao động tuần hoàn</strong>, ví dụ: dao động của quả lắc đồng hồ <strong>(Hình 1.1a)</strong>.
              </p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>1.</strong> Từ một số dụng cụ đơn giản như: lò xo nhẹ, dây nhẹ không dãn, vật nặng và giá đỡ.
                  </p>

                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) Em hãy thực hiện hai thí nghiệm sau:</span> <br/>
                    - Cố định một đầu của lò xo, gắn vật nặng vào đầu còn lại của lò xo như <strong>Hình 1.2a</strong>. Kéo vật nặng xuống một đoạn theo phương thẳng đứng và buông nhẹ.<br/>
                    - Cố định một đầu của dây nhẹ không dãn, gắn vật nặng vào đầu còn lại của dây. Kéo vật nặng để dây treo lệch một góc xác định và buông nhẹ.<br/>
                    <span class="font-semibold">b) Quan sát và mô tả chuyển động của các vật, nêu điểm giống nhau về chuyển động của chúng.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="discussion-box-summary">
                      <span>Gợi ý</span>
                    </summary>

                    <div class="discussion-box-answer">
                      <div class="text-sm text-justify">
                        <p class="font-bold mb-1">
                          Mô tả chuyển động:
                        </p>
                        <ul>
                          <li><strong>Thí nghiệm 1:</strong> Sau tác động, vật nặng chuyển động lên xuống theo phương thẳng đứng trên một quỹ đạo thẳng.</li>
                          <li><strong>Thí nghiệm 2:</strong> Sau tác động, vật nặng chuyển động qua lại trên quỹ đạo là một cung tròn.</li>
                        </ul>
                      </div>

                      <div class="text-sm text-justify">
                        <p class="mb-1">
                          <span class="font-semibold">
                            Điểm giống nhau về chuyển động trong cả 2 thí nghiệm:
                          </span>
                          <span class="font-normal">
                          Chuyển động của vật nặng bị giới hạn trong không gian và trạng thái chuyển động của vật có sự lặp lại theo thời gian.
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
                    <strong>2.</strong> Nêu một số ví dụ về dao động tuần hoàn.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li><strong>Dao động của con lắc đồng hồ quả lắc:</strong> Lặp lại trạng thái sau những khoảng thời gian bằng nhau.</li>
                        <li><strong>Dao động của con lắc lò xo (trong điều kiện lý tưởng):</strong> Vật dao động qua lại quanh vị trí cân bằng với chu kỳ không đổi.</li>
                        <li><strong>Chuyển động của pittông trong động cơ:</strong> Chuyển động tịnh tiến qua lại tuần hoàn.</li>
                        <li><strong>Dao động của bánh xe Ferris:</strong> Mỗi cabin lặp lại vị trí sau mỗi vòng quay.</li>
                      </ul>
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
                    <strong>3.</strong> Hãy nêu một ứng dụng của dao động tuần hoàn trong cuộc sống.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li><strong>Đồng hồ quả lắc:</strong> Sử dụng dao động tuần hoàn của con lắc để đo thời gian chính xác.</li>
                        <li><strong>Nhạc cụ:</strong> Dao động của dây đàn, màng trống tạo ra âm thanh với tần số xác định.</li>
                        <li><strong>Hệ thống giảm xóc xe:</strong> Lò xo và giảm chấn giúp xe dao động ổn định khi qua địa hình gập ghềnh.</li>
                        <li><strong>Máy massage rung:</strong> Dao động tuần hoàn giúp thư giãn cơ bắp.</li>
                        <li><strong>Máy phát điện:</strong> Sử dụng dao động điện từ tuần hoàn để tạo ra dòng điện xoay chiều.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <p class="section-title">
              <strong>▶ Dao động tự do</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Xét các hệ thực hiện dao động: con lắc lò xo gồm vật nặng được gắn vào đầu một lò xo <strong>(Hình 1.2a)</strong>, con lắc đơn gồm một vật nặng được gắn vào đầu một dây nhỏ không dãn <strong>(Hình 1.2b)</strong>. Lực đàn hồi tác dụng lên vật trong con lắc lò xo và lực tác dụng lên vật trong con lắc đơn gọi là nội lực của hệ.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                  Dao động của hệ xảy ra dưới tác dụng chỉ của nội lực được gọi là dao động tự do (dao động riêng).
                  </p>
                </div>
              </div>
            </div>    

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Nêu một số ví dụ về các vật dao động tự do trong thực tế.
                  </p>

                  <details>
                    <summary class="practice-box-summary">
                      <span>Gợi ý</span>
                    </summary>
                    <div class="practice-box-answer">
                      <ul>
                        <li><strong>Con lắc lò xo:</strong> Sau khi kéo ra khỏi vị trí cân bằng và thả nhẹ, vật dao động tự do nhờ lực đàn hồi của lò xo.</li>
                        <li><strong>Con lắc đơn:</strong> Kéo lệch khỏi vị trí cân bằng rồi thả nhẹ, vật dao động tự do dưới tác dụng của trọng lực.</li>
                        <li><strong>Dây đàn guitar sau khi gảy:</strong> Dao động tự do tạo ra âm thanh.</li>
                        <li><strong>Cánh cửa lò xo sau khi đóng:</strong> Dao động tự do quanh vị trí đóng.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="double-image-box">
              <div class="image-box">
                <div class="image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.2a.png" alt="Con lắc lò xo">
                </div>
                <p class="image-box-caption">a) Con lắc lò xo</p>
              </div>
              <div class="image-box">
                <div class="image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.2b.png" alt="Con lắc đơn">
                </div>
                <p class="image-box-caption">b) Con lắc đơn</p>
              </div>
            </div>
            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.2.</p>

          `
    },
    {
      id: 3,
      title: 'Dao động điều hòa',
      type: 'foundation',
      subId: 2,
      content: `
            <p class="section-title">
              <strong>▶ Thí nghiệm khảo sát sự phụ thuộc tọa độ của vật dao động theo thời gian</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
              • <strong>Mục đích:</strong><br/> Khảo sát sự phụ thuộc tọa độ của vật dao động theo thời gian.<br/>
              • <strong>Dụng cụ:</strong><br/>
              - Hệ thống giá đỡ (1) và con lắc lò xo (2).<br/>
              - Cảm biến khoảng cách (3).<br/>
              - Dây cáp nối cảm biến với bộ ghi số liệu (4).<br/>
              - Bộ ghi số liệu (5).<br/>
              - Dây cáp nối bộ ghi số liệu và máy tính (6), máy tính (7).
              </p>
            </div>

            <div class="image-box">
                <div class="image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.3.png" alt="Thí nghiệm khảo sát">
                </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.3. Thí nghiệm khảo sát sự phụ thuộc tọa độ của vật dao động theo thời gian</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                <strong>• Tiến hành thí nghiệm:</strong><br/>
                Tiến hành bố trí thí nghiệm như <strong>Hình 1.3</strong>. 
                Khởi động các thiết bị để sẵn sàng ghi nhận tin liệu, sau đó kéo vật ra khỏi vị trí cân bằng một đoạn nhỏ theo phương thẳng đứng và buông cho vật bắt đầu dao động không vận tốc ban đầu. 
                Tọa độ của vật được ghi nhận tại từng thời điểm khác nhau được hiển thị trên máy tính như trong Bảng 1.1 và đồ thị tọa độ - thời gian của vật dao động như trong <strong>Hình 1.4</strong>.
              </p>
            </div>

            <div class="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-xl mb-6">
              <h3 class="text-lg font-bold text-center text-pink-800 dark:text-pink-200 mb-4">▼ Bảng 1.1. Tọa độ của vật nặng tại những thời điểm khác nhau</h3>
              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-pink-200 dark:bg-pink-800">
                      <th class="border border-pink-300 dark:border-pink-600 p-2">t (s)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">x (m)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">t (s)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">x (m)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">t (s)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">x (m)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">t (s)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">x (m)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">t (s)</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">x (m)</th>
                    </tr>
                  </thead>
                  <tbody class="text-center">
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,00</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,044</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,28</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,041</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,56</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,027</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,84</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,009</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,12</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,012</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,02</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,30</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,044</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,58</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,033</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,86</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,017</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,14</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,003</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,04</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,041</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,32</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,045</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,60</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,038</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,88</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,025</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,16</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,005</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,06</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,037</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,34</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,045</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,62</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,042</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,90</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,031</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,18</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,013</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,08</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,032</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,36</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,64</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,92</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,036</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,20</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,021</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,10</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,026</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,38</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,040</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,66</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,94</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,041</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,22</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,028</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,12</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,018</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,40</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,035</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,68</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,96</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,043</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,24</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,035</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,14</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,010</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,42</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,029</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,70</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,040</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,98</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,044</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,26</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,040</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,16</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,002</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,44</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,022</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,72</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,036</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,00</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,044</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,28</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,042</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,18</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,006</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,46</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,014</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,74</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,031</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,02</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,042</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,30</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,20</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,016</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,48</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,005</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,76</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,025</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,04</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,039</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,32</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,043</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,22</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,024</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,50</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,004</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,78</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,004</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,06</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,034</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,24</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,031</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,52</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,012</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,80</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,009</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,08</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,028</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,26</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,036</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,54</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,020</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,82</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">-0,001</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">1,10</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2">0,021</td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                      <td class="border border-pink-300 dark:border-pink-600 p-2"></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="image-box">
              <div class="large-image-box-img-wrapper">
                <img src="/images/chapter1_lesson1/1.4.png" alt="Đồ thị tọa độ - thời gian của vật dao động trong thí nghiệm">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.4. Đồ thị tọa độ - thời gian của vật dao động trong thí nghiệm</p>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>4.</strong> Nhận xét về hình dạng đồ thị tọa độ - thời gian của vật dao động trong <span class="font-bold">Hình 1.4</span>.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li>Hình dạng tọa độ - thời gian của vật là một đường cong biến đổi theo thời gian có tính chu kỳ, nghĩa là có sự lặp lại sau những khoảng thời gian bằng nhau.</li>
                        <li>Tọa độ của vật có thể nhận các giá trị dương, âm hoặc bằng 0.</li>
                        <li>Khoảng cách từ gốc tọa độ đến các vị trí mà tọa độ có độ lớn cực đại là không đổi.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>  
          `
    },
    {
      id: 4,
      title: 'Dao động điều hoà',
      type: 'foundation',
      subId: 2,
      content: `
            <p class="section-title">
              <strong>▶ Li độ, biên độ, chu kì dao động, tần số dao động</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>5.</strong> Quan sát <strong>Hình 1.5</strong> và chỉ ra những điểm:
                  </p>

                  <p class="inner-text-box-text">
                    <span class="font-semibold">a) Có tọa độ dương, âm hoặc bằng không.</span> <br/>
                    <span class="font-semibold">b) Có khoảng cách đến vị trí cân bằng cực đại.</span> <br/>
                    <span class="font-semibold">c) Gần nhau nhất ở cùng trạng thái chuyển động.</span> <br/>
                  </p>

                  <details class="mt-3">
                    <summary class="discussion-box-summary">
                        <span>Gợi ý</span>
                    </summary>

                    <div class="discussion-box-answer">
                      <div class="text-sm text-justify">
                        <p class="font-semibold mb-1">
                            a)
                        </p>
                        <ul>
                          <li><span class="font-semibold">Những điểm có tọa độ dương:</span> G, P.
                          <li><span class="font-semibold">Những điểm có tọa độ âm:</span> E, M, R.
                          <li><span class="font-semibold">Những điểm có tọa độ bằng 0:</span> F, H, N, Q.
                        </ul>
                      </div>

                      <div class="text-sm text-justify">
                        <p class="mb-1">
                            <span class="font-semibold">
                            b) Những điểm có khoảng cách đến vị trí cân bằng cực đại:
                            </span>
                            <span class="font-normal">
                            E, G, M, P, R.
                            </span>
                        </p>
                      </div>

                      <div class="text-sm text-justify">
                        <p class="mb-1">
                            <span class="font-semibold">
                            c) Những điểm gần nhau nhất có cùng trạng thái dao động:
                            </span>
                            <span class="font-normal">
                             (E, M, R), (F, N), (G, P), (H, Q).
                            </span>
                        </p>
                      </div>

                    </div>
                </details>

                </div>
              </div>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson1/1.5.png" alt="Vị trí của vật nặng trong hệ con lắc lò xo tại các thời điểm khác nhau">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.5. Vị trí của vật nặng trong hệ con lắc lò xo tại các thời điểm khác nhau</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                <strong>Hình 1.5</strong> cho biết vị trí của vật nặng tại những thời điểm khác nhau trên đường đồ thị toạ độ -
                thời gian khi tiến hành thí nghiệm như bố trí trong <strong>Hình 1.3</strong>. <br/>
                Chọn hệ trục toạ độ Oxt như <strong>Hình 1.5</strong>, gốc thời gian được chọn vào lúc vật bắt đầu dao động,
                gốc toạ độ được chọn tại vị trí cân bằng của vật, chiều dương của trục toạ độ được chọn theo
                một chiều xác định, ví dụ thẳng đứng hướng lên. <br/>
                Toạ độ của vật tính từ vị trí cân bằng tại mỗi thời điểm được gọi là <strong>li độ</strong> x của vật dao động.
                Như vậy, li độ có thể có giá trị dương, âm hoặc bằng không. <br/>
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Trong quá trình dao động, vật nặng sẽ đến hai biên,
                dừng lại và đổi chiều chuyển động. Biên ứng với toạ độ
                dương được gọi là biên dương, biên còn lại là biên âm.
                Khi ở hai biên, li độ của vật dao động có độ lớn cực đại.
                Độ lớn cực đại của li độ được gọi là <strong>biên độ</strong> A của vật
                dao động. Biên độ dao động luôn có giá trị dương. <br/>
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Li độ của vật dao động là tọa độ của vật mà gốc tọa độ được chọn trùng với vị trí cân bằng.
                    Biên độ là độ lớn cực đại của li độ.
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Trong <strong>Hình 1.5</strong>, ta thấy tại các thời điểm $t_0$, $t_1$, và $t_2$, vật nặng
                có cùng trạng thái chuyền động: đến biên âm và bắt đầu
                chuyền động đi lên. Khoảng thời gian ngắn nhất giữa hai
                lần vật có cùng trạng thái chuyển động được gọi là <strong>chu kì
                dao động </strong> T. Trong một chu kì dao động, vật hoàn thành
                được một dao động hay một chu trình dao động.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Trên thực tế, người ta thường sử dụng thuật ngữ
                <strong>tần số dao động</strong> như là một đặc trưng của dao động để cho biết
                số dao động mà vật thực hiện trong một giây.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Chu kì dao động là khoảng thời gian để vật thực hiện được một dao động.
                    Tần số dao động được xác định bởi số dao động mà vật thực hiện được trong một giây.<br>
                    <strong>$f = \\frac{1}{T}$</strong> <strong>(1.1)</strong> <br>
                    Trong hệ SI, chu kì có đơn vị là giây (s) và tần số có đơn vị là héc (Hz)
                  </p>
                </div>
              </div>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>6.</strong> Một con ong mật đang bay tại chỗ trong không trung <span class="font-bold">(Hình 1.6)</span>, đập cánh với tần số khoảng 300 Hz.
                    Xác định số dao động mà cánh ong mật thực hiện trong 1 s và chu kì dao động của cánh ong.
                  </p>

                  <div class="green-image-box">
                    <div class="image-box-img-wrapper">
                      <img src="/images/chapter1_lesson1/1.6.png" alt="Ong mật bay tại chỗ trong không trung"/>
                    </div>
                    <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.6. Ong mật bay tại chỗ trong không trung</p>
                  </div>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li>Ong đập cánh với tần số 300 Hz nên số dao động mà ong thực hiện trong 1 s là 300 dao động.</li>
                        <li>Chu kỳ dao động của cánh ong: T = $\\frac{1}{f}$ = $\\frac{1}{300}$ s</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

          `,
    },
    {
      id: 5,
      title: 'Dao động điều hoà',
      type: 'foundation',
      subId: 2,
      content: `

            <p class="section-title">
              <strong>▶ Khái niệm dao động điều hoà</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Khi lực cản trong quá trình dao động là không đáng kể, đồ
                thị toạ độ – thời gian, cũng chính là đồ thị li độ – thời gian,
                có dạng hình sin. Dao động có tính chất này được gọi là
                <strong>dao động điều hoà</strong>.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div> 
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Dao động điều hoà là dao động tuần hoàn mà li độ
                    của vật dao động là một hàm cosin (hoặc sin) theo
                    thời gian.
                  </p>
                </div>
              </div>
            </div>

            <p class="section-title">
              <strong>▶ Pha dao động, độ lệch pha, tần số góc</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>7.</strong> Quan sát <span class="font-bold">Hình 1.7</span>, so sánh biên độ và li độ của hai dao động 1 và 2 tại mỗi thời điểm.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>
                    <div class="discussion-box-answer">
                      <ul>
                        <li>Hai dao động 1 và 2 luôn có cùng biên độ.</li>
                        <li>Tại mỗi thời điểm, li độ của hai dao động này khác nhau trừ một số trường hợp đặc biệt khi li độ của chúng bằng nhau ở những thời điểm hai đường đồ thị cắt nhau. Sau một khoảng thời gian ngắn nhất Δt, dao động 2 có cùng trạng thái với dao động 1.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="image-box">
              <div class="small-image-box-img-wrapper">
                <img src="/images/chapter1_lesson1/1.7.png" alt="Đồ thị li độ - thời gian của hai vật dao động điều hòa trong các trường hợp khác nhau">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.7. Đồ thị li độ – thời gian của hai vật dao động điều hoà</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Tại mỗi thời điểm, trạng thái dao động (li độ và vận tốc) của
                vật được đặc trưng bởi một đại lượng, gọi là <strong>pha dao động</strong> $\\phi$.
                Pha dao động được đo bằng đơn vị của góc, là độ hoặc rad.
                Vật thực hiện một dao động tương ứng với pha dao động
                thay đổi một lượng 2$\\pi$ rad.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Khi xét hai dao động cùng chu kì (cùng tần số), ta thường
                quan tâm đến đại lượng <strong>độ lệch pha</strong> giữa chúng.<br/>
                Ví dụ: Hai vật đang dao động có đồ thị li độ – thời gian được
                biểu diễn như <strong>Hình 1.7</strong>. Tại thời điểm t = 0, vật 1 đi qua
                vị trí cân bằng theo chiểu dương của trục toạ độ. Sau một
                khoảng thời gian ngắn nhất $\\Delta t$, vật 2 mới đạt được trạng
                thái tương tự. Ta nói hai dao động này lệch pha nhau một
                lượng $\\Delta \\varphi$.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Pha dao động là một đại lượng đặc trung cho trạng thái của vật trong quá trình dao động.
                    Độ lệch pha giữa hai dao động điều hòa cùng chu kì (cùng tần số) được xác định theo công thức:<br/>
                    <strong>$\\Delta \\varphi = 2\\pi \\frac{\\Delta t}{T}$</strong> <strong>(1.2)</strong> <br/>
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Vật thực hiện một dao động tương ứng với pha dao động thay đổi một lượng 2$\\pi$ rad.
                Đại lượng đặc trưng cho tốc độ biến thiên của pha dao động là được gọi là <strong>tần số góc</strong> $\\omega$ của dao động.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Tần số góc của dao động là đại lượng đặc trưng cho tốc độ biến thiên của pha dao động.
                    Đối với dao động điều hòa, tần số góc có giá trị không đổi và được xác định theo công thức:<br/>
                    <strong>$\\omega = \\frac{2\\pi}{T} = 2\\pi f$</strong> <strong>(1.3)</strong> <br/>
                    Trong hệ SI, tần số góc có đơn vị là radian trên giây (rad/s).
                  </p>
                </div>
              </div>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>8.</strong> Dựa vào dữ kiện trong câu Thảo luận 6, xác định tần số góc khi ong đập cánh.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Tần số góc khi ong đập cánh là $\\omega = 2\\pi f$ = $2\\pi \\times 300$ = 600$\\pi$ rad/s.
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
                    Quan sát đồ thị li độ - thời gian của hai vật dao động điều hòa được thể hiện trong <span class="font-bold">Hình 1.8</span>.
                    Hãy xác định biên độ, chu kì, tần số và độ lệch pha của hai dao động.
                  </p>
                  
                  <div class="orange-image-box">
                    <div class="image-box-img-wrapper">
                      <img src="/images/chapter1_lesson1/1.8.png" alt="Đồ thị li độ - thời gian của hai vật dao động điều hòa" />
                    </div>
                    <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.8. Đồ thị li độ - thời gian của hai vật dao động điều hoà</p>
                  </div>

                  <details>
                    <summary class="practice-box-summary">
                      <span>Gợi ý</span>
                    </summary>
                    <div class="practice-box-answer">
                      <div class="text-sm text-justify">
                        <p class="font-bold mb-1">
                          Dao động 1 (đường màu xanh):
                        </p>
                        <ul>
                          <li>Biên độ: $A_1 =$ 10 cm</li>
                          <li>Chu kì: $T_1 =$ 1 s (thời gian thực hiện 1 dao động toàn phần)</li>
                          <li>Tần số: $f_1 = \\frac{1}{T_1} = \\frac{1}{1} =$ 1 Hz</li>
                        </ul>
                      </div>
                      
                      <div class="text-sm text-justify">
                        <p class="font-bold mb-1">
                          Dao động 2 (đường màu đỏ):
                        </p>
                        <ul>
                          <li>Biên độ: $A_2 =$ 10 cm</li>
                          <li>Chu kì: $T_2 =$ 1 s</li>
                          <li>Tần số: $f_2 = \\frac{1}{T_2} = \\frac{1}{1} =$ 1 Hz</li>
                        </ul>
                      </div>
                      
                      <div class="text-sm text-justify">
                        <p class="font-bold mb-1">
                          Độ lệch pha:
                        </p>
                        <ul>
                          <li>Dao động 2 đạt cực đại sau dao động 1 một khoảng thời gian $\\Delta t =$ 0.5 s</li>
                          <li>Độ lệch pha: $\\Delta\\varphi = \\frac{2\\pi \\Delta t}{T} = \\frac{2\\pi \\times 0.5}{1} = \\pi$ rad (hay 180°)</li>
                          <li>Dao động 2 lệch pha $\\pi$ rad so với dao động 1</li>
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
      id: 6,
      title: 'Dao động điều hoà',
      type: 'example',
      subId: 2,
      content: `

            <p class="section-title">
              <strong>▶ Vận dụng các đại lượng vật lý đặc trưng để mô tả dao động điều hoà</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                <strong>Ví dụ 1:</strong> <strong>Hình 1.9</strong> thể hiện đô thị li độ - thời gian của một vật dao động điều hoà được kích thích theo hai cách khác nhau.
                Hãy xác định các đại lượng biên độ, chu kì, tần số và tần số góc trong từng trường hợp.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              <strong>Bài giải:</strong> <br/>
              </p>
              
              <p class="text-box-text mt-3">
              * Trong trường hợp a), vật bắt đầu dao động từ vị trí cân bằng theo chiều dương quy ước.<br/>
                Trong trường hợp b), vật bắt đầu dao động từ vị trí biên dương, ngược chiều dương quy ước.
              </p>

              <p class="text-box-text mt-3">
              * Trong hai trường hợp a) và b): <br/>
                - Vật dao động cùng biên độ $A$ = 20 cm<br/>
                - Vật dao động cùng chu kì $T$ = 2 s<br/>
                - Tần số dao động của vật trong cả 2 trường hợp: $f$ = $\\frac{1}{T}$ = $\\frac{1}{2}$ = 0,5 Hz<br/>
                - Tần số góc của vật trong cả 2 trường hợp: $\\omega$ = $\\frac{2\\pi}{T}$ = $\\frac{2\\pi}{2}$ = $\\pi$ rad/s<br/>
              </p>
            </div>

            <div class="double-image-box">
              <div class="image-box">
                <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.9a.png">
                </div>
                <p class="image-box-caption">a)</p>
              </div>
              <div class="image-box">
                <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.9b.png">
                </div>
                <p class="image-box-caption">b)</p>
              </div>
            </div>
            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.9. Đồ thị li độ - thời gian của một vật được kích thích dao động theo hai cách khác nhau</p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>9.</strong> Xác định độ lệch pha giữa hai dao động trong <span class="font-bold">Hình 1.9</span>.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>
                    <div class="discussion-box-answer">
                      <ul>
                        <li>Trong trường hợp a): Vật dao động đang đi qua vị trí cân bằng ở gốc toạ độ O.<br/></li>
                        <li>Trong trường hợp b): Cũng ở gốc toạ độ O, vật dao động đang đi qua vị trí biên.<br/></li>
                        <li>Điều này có nghĩa là khoảng thời gian ngắn nhất để hai dao động có cùng trạng thái là: $\\Delta t$ = $T$/4.<br/></li>
                        <li>Theo công thức [[formula:1.2]], ta suy ra độ lệch pha giữa hai dao động $\\Delta \\varphi$ = $2\\pi \\frac{\\Delta t}{T}$ = $2\\pi \\frac{T/4}{T}$ = $\\frac{\\pi}{2}$ rad.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>
      `
    }
    ,
    {
      id: 7,
      title: 'Dao động điều hoà',
      type: 'example',
      subId: 2,
      content: `

            <p class="section-title">
              <strong>▶ Vận dụng các đại lượng vật lý đặc trưng để mô tả dao động điều hoà (tiếp tục)</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
              <strong>Ví dụ 2:</strong> So sánh biên độ, chu kì, tần số, tần số góc và xác định độ lệch pha của hai dao động điều hoà trong ba trường hợp được thể hiện ở <strong>Hình 1.10</strong>.
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
              <strong>Bài giải:</strong>
              </p>

              <p class="text-box-text mt-3">
              * Trường hợp a): <br/>
                - Biên độ dao động của vật 1 lớn hơn biên độ dao động của vật 2: $A_1 > A_2$. <br/>
                - Chu kì dao động của hai vật bằng nhau: $T_1 = T_2$. <br/>
                - Tần số và tần số góc của hai dao động này cũng bằng nhau: $f_1 = f_2$ và $\\omega_1 = \\omega_2$. <br/>
                - Trong quá trình dao động, hai vật luôn đến vị trí cân bằng và hai biên cùng thời điểm. Do đó, đại lượng $\\Delta t$ trong công thức [[formula:1.2]] bằng 0, dẫn đến $\\Delta \\varphi$ = 0 rad. Ta nói hai vật dao động cùng pha với nhau.
                Trong trường hợp b), vật bắt đầu dao động từ vị trí biên dương, ngược chiều dương quy ước.<br/>
              </p>

              <p class="text-box-text mt-3">
              * Trường hợp b): <br/>
                - Biên độ dao động của hai vật bằng nhau: $A_1$ = $A_2$ = $A$.<br/>
                - Chu kì dao động của vật 1 bằng một nửa chu kì dao động của vật 2: $T_1$ = $\\frac{T_2}{2}$.<br/>
                - Tần số và tần số góc dao động của vật 1 gấp hai lần tần số và tần số góc dao động của vật 2: $f_1$ = 2$f_2$ và $\\omega_1$ = 2$\\omega_2$.<br/>
                - Do hai vật dao động khác chu kì nên ta không thể xác định được độ lệch pha của hai dao động này.<br/>
              </p>

              <p class="text-box-text mt-3">
              * Trường hợp c): <br/>
                - Biên độ dao động của hai vật bằng nhau: $A_1$ = $A_2$ = $A$.<br/>
                - Chu kì dao động của hai vật bằng nhau: $T_1$ = $T_2$ = $T$.<br/>
                - Tần số và tần số góc của hai dao động này cũng bằng nhau: $f_1$ = $f_2$và $\\omega_1$ = $\\omega_2$.<br/>
                - Trong quá trình dao động, vật thứ nhất đi qua vị trí cân bằng thì vật thứ hai đi qua vị trí biên.
                Nghĩa là khoảng thời gian ngắn nhất để hai vật có cùng trạng thái dao động là $\\Delta t$ = $T$/4. 
                Theo công thức [[formula:1.2]], ta suy ra độ lệch pha giữa hai dao động $\\Delta \\varphi$ = $\\frac{\\pi}{2}$ rad. Ta nói hai dao động vuông pha với nhau.
              </p>
            </div>

            <div class="double-image-box">
              <div class="image-box">
                <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.10a.png">
                </div>
                <p class="image-box-caption">a)</p>
              </div>
              <div class="image-box">
                <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.10b.png">
                </div>
                <p class="image-box-caption">b)</p>
              </div>
            </div>
            <div class="image-box">
                <div class="small-image-box-img-wrapper">
                  <img src="/images/chapter1_lesson1/1.10c.png">
                </div>
                <p class="image-box-caption">c)</p>
              </div>
            </div>
            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 1.10. Đồ thị li độ - thời gian của hai vật dao động trong các trường hợp khác nhau</p>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Xét vật thứ nhất bắt đầu dao động điều hoà từ vị trí cân bằng, vật thứ hai dao động điều hoà với biên độ lớn gấp hai lần, cùng chu kì và lệch pha
                    $\\Delta \\varphi$ = $\\frac{\\pi}{4}$ rad so với vật thứ nhất.
                    Vẽ phác đồ thị li độ - thời gian của hai vật trong hai chu kì dao động đầu tiên.
                  </p>

                  <details>
                    <summary class="practice-box-summary">
                      <span>Gợi ý</span>
                    </summary>
                    <div class="practice-box-answer">
                      <div class="image-box">
                        <div class="small-image-box-img-wrapper">
                          <img src="/images/chapter1_lesson1/1.S.png" alt="Bài giải" />
                        </div>
                        <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình bài giải</p>
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
                    Tìm hiểu và trình bày một số ứng dụng thực tiễn của dao động.
                  </p>
                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>
                    <div class="discussion-box-answer">
                      <ul>
                        <li><strong>Đồng hồ cơ:</strong> Sử dụng dao động của con lắc hoặc lò xo để đo thời gian chính xác.</li>
                        <li><strong>Điều hòa không khí:</strong> Sử dụng dao động của máy nén để làm mát không khí.</li>
                        <li><strong>Âm nhạc:</strong> Sử dụng dao động của dây đàn hoặc màng loa để tạo ra âm thanh.</li>
                        <li><strong>Y học:</strong> Sử dụng dao động trong các thiết bị siêu âm để chẩn đoán hình ảnh và điều trị.</li>
                        <li><strong>Giao thông:</strong> Sử dụng dao động trong hệ thống treo của xe để cải thiện sự thoải mái khi lái xe.</li>
                        <li><strong>Kỹ thuật xây dựng:</strong> Sử dụng dao động để kiểm tra độ bền của các công trình và phát hiện các vấn đề cấu trúc.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>
      `
    }
    ,
    {
      id: 8,
      title: 'Dao động điều hoà',
      type: 'exploratory',
      subId: 2,
      content: `

            <p class="section-title">
              <strong>▶ Mối liên hệ giữa dao động điều hoà và chuyển động tròn đều</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Xét một quả cầu được gắn cố định vào một vành mảnh có thể chuyển động tròn đều trong mặt phẳng thẳng đứng.
                Khi chiếu ánh sáng từ trên xuống, ta thấy bóng của quả cầu dao động trên một đoạn thẳng có phương song song với đường thẳng đi qua tâm của chuyển động tròn.
                Quả cầu xoay được một vòng tương ứng với bóng của nó thực hiện được một dao động.<br/>
                Bằng một số tính toán, ta rút ra được dao động điều hoà được xem như là <strong>hình chiếu</strong> của một chuyển động tròn đều lên một đường thẳng đi qua tâm và nằm trong mặt phẳng quỹ đạo,
                biên độ của dao động bằng bán kính quỹ đạo của chuyển động tròn đều.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson1/1.11.png" alt="Hình chiếu của một quả cầu chuyển động tròn đều lên mặt phẳng nằm ngang" />
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-1">▲ Hình 1.11. Hình chiếu của một quả cầu chuyển động tròn đều lên mặt phẳng nằm ngang</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Khi quả cầu trong <strong>Hình 1.11</strong> quay được một vòng, vectơ bán kính nối tâm của quỹ đạo và vật quét được một góc 2$\\pi$ rad, tương ứng với bóng của vật thực hiện được một dao động.
                Bảng 1.2 thể hiện sự tương tự trong dao động điều hoà và chuyển động tròn đều.
              </p>
            </div>
            
            <div class="bg-pink-50 dark:bg-pink-900/20 p-5 rounded-xl mb-6">
              <h3 class="text-lg font-bold text-center text-pink-800 dark:text-pink-200 mb-4">
                ▼ Bảng 1.2. Sự tương tự trong dao động điều hòa và chuyển động tròn đều
              </h3>

              <div class="overflow-x-auto">
                <table class="w-full border-collapse text-sm">
                  <thead>
                    <tr class="bg-pink-200 dark:bg-pink-800">
                      <th class="border border-pink-300 dark:border-pink-600 p-2">Ký hiệu</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">Dao động điều hoà</th>
                      <th class="border border-pink-300 dark:border-pink-600 p-2">Chuyển động tròn đều</th>
                    </tr>
                  </thead>

                  <tbody class="text-center">
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border p-2">$x$</td>
                      <td class="border p-2">Li độ</td>
                      <td class="border p-2">Toạ độ trên màn của hình chiếu</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border p-2">$A$</td>
                      <td class="border p-2">Biên độ</td>
                      <td class="border p-2">Bán kính quỹ đạo</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border p-2">$T$</td>
                      <td class="border p-2">Chu kỳ dao động</td>
                      <td class="border p-2">Chu kỳ quay</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border p-2">$f$</td>
                      <td class="border p-2">Tần số dao động</td>
                      <td class="border p-2">Tần số quay</td>
                    </tr>
                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border p-2">$\\omega$</td>
                      <td class="border p-2">Tần số góc</td>
                      <td class="border p-2">Tần số góc</td>
                    </tr>
                    <tr class="bg-pink-50 dark:bg-pink-900/10">
                      <td class="border p-2">$\\omega t + \\varphi$</td>
                      <td class="border p-2">Pha dao động</td>
                      <td class="border p-2">Toạ độ góc</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          `
    },
    {
      id: 9,
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
                    <col style="width: 6rem">
                    <col style="width: 12rem">
                    <col style="width: 6rem">
                  </colgroup>

                  <thead>
                    <tr class="bg-emerald-500 text-white dark:bg-emerald-700">
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Khái niệm
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Định nghĩa
                      </th>
                      <th class="border border-emerald-400 dark:border-emerald-600 p-2">
                        Công thức liên quan
                      </th>
                    </tr>
                  </thead>

                  <tbody class="text-center break-words">

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động cơ học
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Sự chuyển động có giới hạn trong không gian của một vật quanh một vị trí xác định (<strong>Vị trí cân bằng</strong>)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động tự do <br>(dao động riêng)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động của hệ xảy ra dưới tác dụng chỉ của nội lực
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Li độ của vật dao động <br>(Ký hiệu: $x$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Toạ độ của vật mà gốc toạ độ được chọn trùng với vị trí cân bằng
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Biên độ dao động <br>(Ký hiệu: $A$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Độ lớn cực đại của li độ
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Chu kì dao động <br>(Ký hiệu: $T$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Khoảng thời gian để vật thực hiện được một dao động
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2" rowspan="2">
                        $f = \\frac{1}{T}$
                      </td>
                    </tr>

                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Tần số dao động <br>(Ký hiệu: $f$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Số dao động vật thực hiện được trong một giây
                      </td>
                    </tr>

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động tuần hoàn
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động có trạng thái chuyển động của vật (vị trí và vận tốc) lặp lại sau những khoảng thời gian bằng nhau
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động điều hoà
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Dao động tuần hoàn mà li độ của vật dao động là một hàm cosin (hoặc sin) theo thời gian.
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Pha dao động <br>tại thời điểm $t$ <br>(Ký hiệu: $\\varphi_t$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Đại lượng đặc trưng cho trạng thái dao động của vật trong quá trình dao động
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2"></td>
                    </tr>

                    <tr class="bg-white dark:bg-gray-800">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Độ lệch pha <br>(Ký hiệu: $\\Delta\\varphi$)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Đại lượng đặc trưng cho sự chênh lệch về trạng thái dao động giữa hai dao động.<br/>
                        Độ lệch pha giữa hai dao động điều hoà cùng chu kì (cùng tần số) <strong>không thay đổi</strong>.<br/>
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        $\\Delta\\varphi = 2\\pi \\frac{\\Delta t}{T}$
                      </td>
                    </tr>

                    <tr class="bg-green-50 dark:bg-green-900/10">
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Tần số góc <br>(Ký hiệu: $\\omega$, <br/>Đơn vị: rad/s, hệ SI)
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        Đại lượng đặc trưng cho tốc độ biến thiên của pha dao động.<br/>
                        Tần số góc của dao động điều hoà có giá trị không đổi.<br/>
                      </td>
                      <td class="border border-green-300 dark:border-green-600 p-2">
                        $\\omega = \\frac{\\varphi_2 - \\varphi_1}{t_2 - t_1} = \\frac{2\\pi}{T}$
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
          `
    }
  ],
}

export default lesson1;