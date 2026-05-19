const lesson4 = {
  id: 4,
  title: 'Dao động tắt dần và hiện tượng cộng hưởng',
  slides: [
    {
      id: 1,
      title: 'Dao động tắt dần và hiện tượng cộng hưởng',
      type: 'intro',
      content: `

        <div class="summary-box">
          <p>
          - Dao động tắt dần, dao động cưỡng bức và hiện tượng cộng hưởng.<br/>
          - Lợi ích và tác hại của hiện tượng cộng hưởng trong một số trường hợp cụ thể.
          </p>
        </div>

        <div class="intro-box">
          <p class="intro-text">
            Bộ giảm chấn khối lượng (mass damper) (Hình 4.1) được sử dụng để giảm thiểu sự rung lắc của các toà nhà cao tầng khi có gió mạnh hay địa chấn.
            Toà nhà Taipei 101 tầng (cao 508 m) tại thành phố Đài Bắc, Đài Loan cũng được trang bị bộ giảm chấn khối lượng, là một con lắc với vật nặng
            khoảng 728 tấn được treo tại trung tâm toà nhà từ tầng 92 xuống đến tầng 87. Nhờ vậy, toà nhà có thể chịu được những cơn bão có sức gió
            lên tới 216 km/h hay những cơn địa chấn lên đến 7 độ richter. Các kĩ sư xây dựng đã dựa trên những hiện tượng vật lí nào?
          </p>
        </div>

        <div class="image-box">
          <div class="image-box-img-wrapper">
            <img src="/images/chapter1_lesson4/4.1.png">
          </div>
          <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 4.1. Bộ giảm chấn khối lượng</p>
        </div>

          `
    },
    {
      id: 2,
      title: 'Dao động tắt dần',
      type: 'foundation',
      subId: 1,
      content: `
            <p class="section-title">
              <strong>▶ Quan sát hiện tượng dao động tắt dần</strong>
            </p>

            <div class="double-image-box">
              <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.2a.png" alt="Xích đu">
              </div>
              <p class="image-box-caption">a) Xích đu</p>
              </div>
              <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.2b.png" alt="Ván nhảy cầu">
              </div>
              <p class="image-box-caption">b) Ván nhảy cầu</p>
              </div>
            </div>
            <p class="text-xs italic text-center text-gray-600 dark:text-gray-400 mb-4">▲ Hình 4.2.</p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>1.</strong> Quan sát Hình 4.2 và mô tả chuyển động của xích đu, ván nhảy cầu sau khi ngừng tác dụng lực.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Ngay sau khi ngừng tác dụng lực, xích du và ván nhảy cầu tiếp tục thực hiện dao động,
                        tuy nhiên biên độ dao động của chúng giảm dần theo thời gian và chúng sẽ dừng chuyển động sau một khoảng thời gian.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Khi khảo sát hiện tượng dao động trong các bài trước,
                ta đã lí tưởng hoá bài toán khi xem lực cản của môi trường là không đáng kể,
                có thể bỏ qua. Tuy nhiên, trên thực tế,sau khi ngừng tác dụng lực để kích thích cho vật dao động,
                biên độ dao động của vật giảm dần và vật sẽ dừng lại sau một khoảng thời gian nhất định.
              </p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Dao động tắt dần là dao động có biên độ giảm dần theo thời gian.
                  </p>
                </div>
              </div>
            </div>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>2.</strong> Nêu một số ví dụ thực tế khác về hiện tượng dao động tắt dần.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li>Dao động của người chơi sau khi nhảy bungee.</li>
                        <li>Dao động của dây đàn guitar, vĩ cầm sau khi nhạc công ngừng gẩy đàn.</li>
                        <li>Dao động của cái võng hay nôi sau khi ngừng tác dụng lực.</li>
                        <li>Dao động của màng nhĩ sau khi sóng âm ngừng truyền đến tai.</li>
                        <li>Dao động của lò xo trong bộ phận giảm xóc của xe máy, ô tô.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 3,
      title: 'Dao động tắt dần',
      type: 'exploratory',
      subId: 1,
      content: `
            
            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.3.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.3. Đồ thị li độ - thời gian của các loại dao động tắt dần</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Tuỳ theo lực cản tác dụng lên vật mà dao động tắt dần có thể chia thành các loại sau:
              </p>
              <ul class="list-disc list-inside space-y-4 mt-2">
                <li class="text-box-text">
                  <span class="font-semibold">Dao động tắt dần dưới hạn:</span> Khi lực cản tác dụng lên vật có độ lớn nhỏ, vật thực hiện dao động với biên độ giảm dần theo thời gian và dừng lại sau một số chu kì dao động. Đồ thị li độ - thời gian của dao động tắt dần dưới hạn được thể hiện ở đường màu đỏ trong Hình 4.3.
                  <div class="text-box-text mt-3">
                    <span class="font-semibold">Ví dụ:</span> Con lắc lò xo dao động trên mặt phẳng ngang có ma sát hoặc một số loại cửa có thể dao động khi được đẩy ra hoặc kéo vào.
                  </div>
                </li>

                <li class="text-box-text">
                  <span class="font-semibold">Dao động tắt dần tới hạn:</span> Khi lực cản tác dụng lên vật có độ lớn vừa đủ, vật không thể thực hiện đủ một chu kì dao động mà trở về vị trí cân bằng sau một thời gian ngắn. Đồ thị li độ - thời gian của dao động tắt dần tới hạn được thể hiện ở đường màu vàng trong Hình 4.3.
                  <div class="text-box-text mt-3">
                    <span class="font-semibold">Ví dụ:</span> Một số loại cửa được lắp đặt hệ thống bản lề đặc biệt, để cửa không còn thực hiện được dao động mà tự đóng lại sau một khoảng thời gian ngắn.
                  </div>
                </li>

                <li class="text-box-text">
                  <span class="font-semibold">Dao động tắt dần vượt hạn:</span> Khi lực cản tác dụng lên vật có độ lớn tăng lên, vật không thể thực hiện đủ một chu kì dao động mà trở về vị trí cân bằng sau một thời gian tương đối dài. Đồ thị li độ - thời gian của dao động tắt dần vượt hạn được thể hiện ở đường màu xanh trong Hình 4.3.
                  <div class="text-box-text mt-3">
                    <span class="font-semibold">Ví dụ:</span> Nếu lực cản trong hệ thống bản lề đóng cửa tự động tăng lên đáng kể, cửa vẫn không thể thực hiện được dao động nhưng mất nhiều thời gian để tự đóng lại.
                  </div>
                </li>
              </ul>
            </div>
          `
    },
    {
      id: 4,
      title: 'Dao động tắt dần',
      type: 'foundation',
      subId: 1,
      content: `
            <p class="section-title">
              <strong>▶ Giải thích hiện tượng dao động tắt dần</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Ta đã biết, lực cản của môi trường tác dụng lên vật luôn ngược chiều chuyển động của vật.
                Do đó, công của lực cản tác dụng lên vật luôn âm làm cho cơ năng giảm.
                Từ đó biên độ dao động của vật giảm dần theo thời gian.
              </p>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Bố trí sơ đồ thí nghiệm như Hình 4.4.
                    Kéo vật nặng của con lắc lò xo khỏi vị trí cân bằng theo phương thẳng đứng một đoạn xác định và thả nhẹ để vật dao động không vận tốc ban đầu.
                    Dự đoán và thực hiện thí nghiệm kiểm chứng (nếu có điều kiện) về dao động của con lắc trong các trường hợp vật nặng thực hiện dao động trong:
                  </p>

                  <p class="inner-text-box-text">
                    <span class="font-semibold"> a) không khí;</span> <br/>
                    <span class="font-semibold"> b) chất lỏng (nước/dầu);</span> <br/>
                    <span class="font-semibold"> c) chất lỏng (nước/dầu) khi có gắn thêm vật cản;</span> <br/>
                  </p>

                  <div class="orange-image-box">
                    <div class="image-box-img-wrapper">
                      <img src="/images/chapter1_lesson4/4.4.png"/>
                    </div>
                    <p class="mt-0 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.4. Vật nặng của con lắc lò xo dao động:</p>
                    <p class="space-image-box-caption">
                      <span>a) Trong không khí</span>
                      <span>b) Trong chất lỏng</span>
                      <span>c) Trong chất lỏng có gắn thêm vật cản</span>
                    </p>
                    </div>

                  <details class="mt-3">
                    <summary class="practice-box-summary">
                        <span>Gợi ý</span>
                    </summary>

                    <div class="practice-box-answer">
                      <ul>
                        <li><span class="font-semibold">a) Trong không khí:</span> lực cản của không khí rất nhỏ nên dao động kéo dài lâu nhất.</li>
                        <li><span class="font-semibold">b) Trong chất lỏng:</span> lực cản của chất lỏng lớn hơn nên dao động tắt nhanh hơn a).</li>
                        <li><span class="font-semibold">c) Trong chất lỏng có gắn thêm vật cản:</span> lực cản tăng lên khi gắn thêm vật cản nên dao động tắt nhanh hơn b).</li>
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
                    Đưa ra một số ví dụ về tác hại và lợi ích của dao động tắt dần.
                    Từ đó tìm hiểu và sưu tầm hình ảnh về một số ứng dụng của dao động tắt dần trong cuộc sống.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <ul>
                        <li><span class="font-semibold">Một số lợi ích của dao động tắt dần:</span> Hệ thống đóng/mở cửa tự động; Bộ phận giảm xóc của ô tô/xe máy; Ứng dụng trong thiết kế nền móng nhà ở Nhật Bản, giảm thiểu sự dao động của các toà nhà trong các trận động đất,...</li>
                        <li><span class="font-semibold">Một số tác hại của dao động tắt dần:</span> Gây hao phí năng lượng, giảm hiệu suất, giảm độ chính xác trong các hệ cần duy trì dao động như con lắc đồng hồ; Gây mài mòn và sinh nhiệt khi thiết bị cơ khí hoạt động; Làm suy giảm tín hiệu, gây sai lệch thông tin trong kỹ thuật điện tử,...</li>
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
      title: 'Dao động cưỡng bức và hiện tượng cộng hưởng',
      subId: 2,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Dao động cưỡng bức</strong>
            </p>

            <div class="discussion-box">
              <div class="discussion-box-content">
                <div class="discussion-box-icon">👥</div>
                <div class="flex-1">
                  <p class="discussion-box-question">
                    <strong>3.</strong> Trên thực tế, sau khi được kích thích để dao động, xích đu <strong>(Hình 4.2a)</strong> hoặc võng sẽ dao động tắt dần.
                    Làm cách nào để chúng có thể dao động với biên độ không đổi?
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        - Tác dụng lực vào mỗi nửa chu kì dao động của vật.<br/>
                        - Tác dụng lực tuần hoàn vào vật như cơ chế của các xích đu hoặc võng máy tự động sử dụng điện.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Trên thực tế, để một vật dao động không bị tắt, ta cần bổ sung năng lượng để bù lại sự tiêu hao năng lượng do lực cản môi trường.
              </p>
              <p class="text-box-text mt-3">
                Thông thường, ta có hai cách bổ sung năng lượng cho vật dao động:<br/>
                - Truyền năng lượng bổ sung đúng bằng phần năng lượng tiêu hao ở cuối mỗi chu kì dao động của hệ bằng một lực cùng chiều với chuyển động.
                Lực này không làm thay đổi chu kì dao động riêng của vật. Cơ chế này được gọi là dao động duy trì.<br/>
                Ví dụ: hệ bù năng lượng cho con lắc trong đồng hồ quả lắc <strong>(Hình 4.5)</strong>.<br/>
                - Sử dụng một ngoại lực biến thiên điều hoà (ngoại lực điều hoà) theo thời gian:<br/>
                $ F = F_0 \\cos(\\Omega t + \\varphi_0) $ <strong>(4.1)</strong> <br/>
                trong đó $F_0$ và $\\Omega$ lần lượt là biên độ và tần số góc của ngoại lực.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.5.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.5. Cơ chế bổ sung năng lượng cho đồng hồ quả lắc</p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    Dao động của vật dưới tác dụng của ngoại lực điều hoà trong giai đoạn ổn định được gọi là <strong>dao động cưỡng bức</strong>.
                    Ngoại lực điều hoà tác dụng vào vật khi này được gọi là <strong>lực cưỡng bức</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Đồ thị li độ - thời gian của vật được thể hiện trong <strong>Hình 4.6</strong>
                (trong trường hợp ngoại lực điều hoà cùng pha với dao động cưỡng bức ở giai đoạn ổn định) gồm hai giai đoạn:<br/>
                + Giai đoạn chuyển tiếp, trong đó dao động của hệ chưa ổn định, biên độ và chu kì dao động biến thiên phức tạp theo thời gian.<br/>
                + Giai đoạn ổn định, trong đó biên độ và chu kì dao động của vật không thay đổi. Giai đoạn ổn định kéo dài cho đến khi ngoại lực không còn tác dụng.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.6.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.6. Đồ thị:</p>
              <p class="image-box-caption">
                a) ngoại lực điều hoà - thời gian (đường màu đỏ) <br/>
                b) li độ - thời gian của vật (đường màu xanh)
              </p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Một trong những ví dụ của dao động cưỡng bức là hệ thống võng máy tự động sử dụng điện như trong <strong>Hình 4.7</strong>.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.7.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.7. Võng máy tự động sử dụng điện</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Tính chất của dao động cưỡng bức:<br/>
                - Dao động cưỡng bức là dao động điều hoà.<br/>
                - Tần số góc của dao động cưỡng bức bằng tần số góc 2 của lực cưỡng bức.<br/>
                - Biên độ của dao động cưỡng bức phụ thuộc vào biên độ $F_0$, độ chênh lệch giữa tần số góc của lực cưỡng bức và tần số góc riêng của hệ, lực cản của môi trường xung quanh.
              </p>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Nêu một số ví dụ về dao động cưỡng bức trong thực tế.
                  </p>

                  <details>
                    <summary class="practice-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="practice-box-answer">
                      <ul>
                        <li>Dao động của võng máy sử dụng điện.</li>
                        <li>Dao động của mặt cầu khi có các phương tiện giao thông hoặc người đi bộ đang đi qua.</li>
                        <li>Dao động của các công trình xây dựng khi có động đất xảy ra.</li>
                        <li>Dao động điện từ trong mạch điện xoay chiều.</li>
                      </ul>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 6,
      title: 'Dao động cưỡng bức và hiện tượng cộng hưởng',
      subId: 2,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Hiện tượng cộng hưởng</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Khi giữ biên độ $F_0$ không đổi và thay đổi tần số góc $\\Omega$ của lực cưỡng bức, ta thấy biên độ dao động cưỡng bức $A$ của hệ thay đổi.
                Biên độ dao động cưỡng bức đạt giá trị cực đại $A_{max}$ khi tần số góc của lực cưỡng bức bằng tần số góc riêng của hệ dao động ($\\Omega = \\omega$) như đồ thị trong <strong>Hình 4.8</strong>.
              </p>
              <p class="text-box-text mt-3">
                Khi tác dụng vào vật, lực cưỡng bức đã thực hiện công và bổ sung năng lượng cho vật, giúp vật duy trì dao động với biên độ không đổi.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.8.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.8. Sự phụ thuộc của biên độ dao động cưỡng bức vào tần số góc của lực cưỡng bức</p>
            </div>

            <div class="memorise-box">
              <div class="memorise-box-content">
                <div class="memorise-box-icon">✍️</div>
                <div class="flex-1">
                  <p class="inner-text-box-text">
                    <strong>Hiện tượng cộng hưởng</strong> xảy ra khi tần số góc của lực cưỡng bức bằng tần số góc riêng của hệ dao động.
                    Khi này, biên độ dao động cưỡng bức của hệ đạt giá trị cực đại $A_{max}$.
                  </p>
                </div>
              </div>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Khi lực cản của môi trường thay đổi, độ lớn cực đại của biên độ dao động cưỡng bức cũng thay đổi.
                Hình 4.9 minh hoạ sự phụ thuộc của biên độ dao động cưỡng bức vào tần số góc của lực cưỡng bức ứng với các giá trị khác nhau của lực cản môi trường. Kết quả cho thấy khi độ lớn của lực cản mỗi trường tăng lên thì đỉnh của đường đồ thị loe ra và biên độ dao động cưỡng bức cực đại $A_{max}$ giảm xuống.
              </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.9.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.9. Sự phụ thuộc của biên độ dao động điều hoà vào tần số góc của ngoại lực điều hoà khi lực cản tác dụng vào vật dao động thay đổi</p>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Bố trí thí nghiệm hệ con lắc Barton như Hình 4.10. Mô hình gồm nhiều con lắc đơn có chiều dài dây treo khác nhau được gắn trên cùng một dây treo đàn hồi.
                    Khi con lắc số 1 được kích thích để dao động, những con lắc còn lại (từ số 2 đến 7) sẽ bắt đầu dao động.
                    Giải thích vì sao chúng dao động và dự đoán về biên độ dao động của chúng.<br/>
                    Thực hiện thí nghiệm kiểm chứng.
                  </p>


                  <div class="orange-image-box">
                    <div class="large-image-box-img-wrapper">
                      <img src="/images/chapter1_lesson4/4.10.png">
                    </div>
                    <p class="mt-0 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.10. Con lắc Barton</p>
                  </div>

                  <details>
                    <summary class="practice-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="practice-box-answer">
                      <p class="text-box-text">
                        Khi con lắc 1 dao động, các con lắc còn lại (2 đến 7) bắt đầu dao động vì chúng chịu tác dụng của lực cưỡng bức do dao động của con lắc 1 gây ra.
                        Với bố trí thí nghiệm như <strong>Hình 4.10</strong>, con lắc 4 sẽ dao động với biên độ lớn nhất.
                        Vì chiều dài dày của con lắc 4 xấp xỉ bằng chiều dài dây của con lắc 1, do đó tần số dao động riêng của con lắc 4 xấp xỉ bằng tần số dao động của con lắc 1 (đóng vai trò là tần số của lực cưỡng bức tuần hoàn).
                        Từ đó, hiện tượng cộng hưởng xảy ra đối với con lắc 4 và làm cho biên độ dao động của nó lớn nhất so với các con lắc còn lại.
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 7,
      title: 'Dao động cưỡng bức và hiện tượng cộng hưởng',
      subId: 2,
      type: 'foundation',
      content: `
            <p class="section-title">
              <strong>▶ Lợi ích và tác hại của hiện tượng cộng hưởng</strong>
            </p>

            <div class="text-box">
              <p class="text-box-text">
                Trong cuộc sống, những hiểu biết về hiện tượng cộng hưởng được ứng dụng trong lĩnh vực xây dựng, âm nhạc, y học, thông tin liên lạc,...<br/>
                - Khi thiết kế các công trình lớn như nhà cao tầng hoặc cầu đường, các kĩ sư cần có những phương án xử lí kĩ thuật nhằm tránh xảy ra cộng hưởng trên hệ thống.
                Ví dụ: Cầu Thiên niên kỉ tại London (Hình 4.11) đã phải tạm đóng sau ba ngày đón khách du lịch vào năm 2000 vì hiện tượng cộng hưởng đã xảy ra khi khách tham quan cùng đi trên cầu, 
                vô tình tạo ra một ngoại lực cưỡng bức có tần số dao động xấp xỉ tần số dao động riêng của cầu, làm cho cầu rung lắc rất mạnh (Nguồn: www.theguardian.com).
                Các kĩ sư đã mất khoảng hai năm để bổ sung bộ giảm chấn khối lượng nhằm tạo ra dao động tắt dần tới hạn trên cầu.<br/>
                - Vào tháng 9/1985, một trận động đất lớn (8,1 độ richter), có tâm chấn tại bờ biển phía tây của nước Mexico. Tại thủ đô Mexico, cách tâm chấn đến 400 km,
                sóng địa chấn đã tạo ra lực cưỡng bức lên các toà nhà, gây hiện tượng cộng hưởng, làm cho nhiều toà nhà có độ cao trung bình rung lắc dữ dội và sụp đổ hoàn toàn, trong khi những toà nhà cao hơn hoặc thấp hơn hẳn lại đứng vững. (Nguồn: www.britannica.com)<br/>
                - Trong lĩnh vực âm nhạc: Mỗi nhạc cụ phát ra những giai điệu âm thanh mang nét đặc trưng riêng của nhạc cụ đó. Để khuếch đại độ to của âm thanh mà không làm mất đi nét đặc trưng riêng đó, người ta sử dụng một buồng đặc biệt là buồng cộng hưởng như hộp đàn guitar, hộp vĩ cầm.
                </p>
            </div>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4.11.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4.11. Cầu đi bộ Thiên niên kỉ tại London, Vương Quốc Anh</p>
            </div>

            <div class="practice-box">
              <div class="practice-box-content">
                <div class="practice-box-icon">🎯</div>
                <div class="flex-1">
                  <p class="practice-box-question">
                    Tìm hiểu và trình bày hoạt động của bộ giảm chấn khối lượng, là một con lắc được treo trên toà nhà Taipei 101 tại thành phố Đài Bắc, Đài Loan (Hình 4.1).
                  </p>

                  <details>
                    <summary class="practice-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="practice-box-answer">
                      <p class="text-box-text">
                        Bộ giảm chấn khối lượng bao gồm một con lắc với khối lượng rất lớn, có thể lên tới vài trăm tấn được treo lơ lửng trong tòa nhà
                        và có thể di chuyển một cách hạn chế theo các chiều hướng nhất định (thường là theo chiều ngang). Bộ giảm chấn khối lượng hoạt động
                        dựa trên nguyên lý của sự cộng hưởng, trong đó con lắc được điều chỉnh sao cho tần số dao động của nó khớp với tần số dao động của tòa nhà
                        khi chịu ảnh hưởng bởi gió mạnh, động đất hoặc các yếu tố bên ngoài. Sự dao động của tòa nhà sẽ được khắc phục bằng các lực cưỡng chế tạo ra từ con lắc, từ đó giảm thiểu sự ảnh hưởng của rung chấn.
                      </p>
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
                    Tìm hiểu và trình bày ngắn gọn phương án kĩ thuật để hạn chế thiệt hại cho các toà nhà,
                    đặc biệt là các toà nhà cao tầng, tại những nơi thường xảy ra động đất như Nhật Bản.
                  </p>

                  <details>
                    <summary class="discussion-box-summary">
                      <span> Gợi ý </span>
                    </summary>

                    <div class="discussion-box-answer">
                      <p class="text-box-text">
                        Nhiều toà nhà cao tầng tại Nhật Bản được xây dựng với các lò xo dưới móng cọc.
                        Khi có động đất, mặt đất rung lắc, chuyển dịch có thể làm các toà nhà cao tầng sụp đổ. 
                        Khi toà nhà được gắn với móng nền bởi một hệ thống lò xo, toà nhà sẽ “trôi nổi” nhẹ nhàng trên móng nền
                        không bị đổ sụp khi có động đất (tương tự hệ thống giảm xóc được sử dụng trong xe máy hoặc ô tô).
                      </p>
                    </div>
                  </details>
                </div>
              </div>
            </div>
          `
    },
    {
      id: 8,
      title: 'Dao động cưỡng bức và hiện tượng cộng hưởng',
      subId: 2,
      type: 'exploratory',
      content: `
            <p class="section-title">
              <strong>▶ Máy đo địa chấn</strong>
            </p>

            <div class="image-box">
              <div class="image-box-img-wrapper">
                <img src="/images/chapter1_lesson4/4P.1.png">
              </div>
              <p class="mt-3 text-xs italic text-center text-gray-600 dark:text-gray-400 mb-0">▲ Hình 4P.1. Máy đo địa chấn</p>
            </div>

            <div class="text-box">
              <p class="text-box-text">
                Máy đo địa chấn là một thiết bị được dùng để ghi nhận những chuyển động bất thường của mặt đất gây ra bởi sự lan truyền sóng chấn động từ tâm của những trận động đất.
                Đa phần các máy đo địa chấn thường hoạt động như sau: Một giá treo được gắn chặt vào mặt đất, một vật nặng được treo lơ lửng vào giá và có xu hướng đứng yên trong khi giá treo chuyển động theo mặt đất.
                Chuyển động của lớp vỏ Trái Đất trong các trận động đất được đo tương đối với bất kì vật thể nào, không phụ thuộc vào chuyển động của mặt đất.
                Khi mặt đất rung chuyển, đầu bút trên quả nặng sẽ dao động và vạch lên bản ghi (một cuộn giấy được quay đều).
                Việc phân tích tín hiệu thu được trên bản ghi cho ta biết thông tin của những sóng địa chấn gây ra bởi những trận động đất.
              </p>
            </div>

          `
    }
  ]
}

export default lesson4;