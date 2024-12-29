// 구글 스프레드시트에서 데이터를 가져오기 위한 CSV URL
const csvUrl =
  "https://docs.google.com/spreadsheets/d/13kWyDNR5larvdzYubROyb9KlqocmFr1_mxDmWAWbqHA/gviz/tq?tqx=out:csv";

// PapaParse로 CSV 데이터 파싱 후 테이블에 추가
function loadData() {
  Papa.parse(csvUrl, {
    download: true,
    complete: function (result) {
      const table = document.getElementById("data-table");

      // 첫 번째 행을 통해 헤더를 판별
      const headers = result.data[0];
      const dateIndex = headers.indexOf("date");
      const contentIndex = headers.indexOf("content");
      const imageIndex = headers.indexOf("img");
      const footnoteIndex = headers.indexOf("footnote");

      // 날짜, 내용, 이미지 열 인덱스를 찾았다면 데이터 추출
      const dates = result.data.slice(1).map((row) => row[dateIndex]);
      const contents = result.data.slice(1).map((row) => row[contentIndex]);
      const images = result.data.slice(1).map((row) => row[imageIndex]);
      const footnotes = result.data.slice(1).map((row) => row[footnoteIndex]);

      // 하나의 행에 date, image, content 쌍을 넣음
      dates.forEach((date, index) => {
        const tr = document.createElement("tr");

        // 셀을 좌우로 배치하여 데이터 넣기
        const td = document.createElement("td");
        const contentWithBreaks = contents[index].replace(/\n/g, "<br>"); // \n을 <br>로 변환
        td.innerHTML = `        
                    <button class="date-button" onclick="showPopup(${index})">${date}</button>
                    <div class="image">
                        <img src="${images[index]}" alt="" />
                    </div>
                    <div class="content">${contentWithBreaks}</div>
                `;

        tr.appendChild(td);
        table.appendChild(tr);
      });
    },
  });
}

// 페이지 로드 시 데이터 로드
window.onload = loadData;

// 팝업을 표시하는 함수
function showPopup(index) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const date = document.querySelectorAll(".date-button")[index].innerText;
  let content = document.querySelectorAll(".content")[index].innerText;
  const imgSrc = document.querySelectorAll(".image img")[index]?.src;

  // 줄바꿈 처리: Ctrl + N을 인식하여 줄바꿈 문자로 변경
  content = content.replace(/\n/g, "<br>"); // \n을 <br>로 변환

  // 이미지가 있을 때만 HTML 삽입
  let imageHTML = "";
  if (imgSrc) {
    imageHTML = `<img src="${imgSrc}" alt="" class="popup-image"/>`;
  }

  popup.innerHTML = `
    <div class="popup-content">
      <button class="close-btn" onclick="closePopup()">X</button>
      <div class="popup-date">${date}</div>
      ${imageHTML} <!-- 이미지 HTML 삽입 -->
      <div class="popup-content-text">${content}</div>
    </div>
  `;

  document.body.appendChild(popup);
}

// 팝업을 닫는 함수
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) {
    popup.remove();
  }
}
