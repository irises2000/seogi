// 구글 스프레드시트에서 데이터를 가져오기 위한 CSV URL
const csvUrl =
  "https://docs.google.com/spreadsheets/d/13kWyDNR5larvdzYubROyb9KlqocmFr1_mxDmWAWbqHA/gviz/tq?tqx=out:csv";

// PapaParse로 CSV 데이터 파싱 후 테이블에 추가
function loadData() {
  Papa.parse(csvUrl, {
    download: true,
    complete: function (result) {
      console.log("CSV Data loaded:", result.data); // 데이터 확인

      const table = document.getElementById("data-table");
      table.innerHTML = ""; // 테이블 초기화

      if (result.data.length === 0) {
        console.log("No data found in the CSV.");
        return;
      }

      const headers = result.data[0];
      const dateIndex = headers.indexOf("date");
      const contentIndex = headers.indexOf("content");
      const imageIndex = headers.indexOf("img");
      const footnoteIndex = headers.indexOf("footnote");
      const linkIndex = headers.indexOf("link");

      const rows = result.data.slice(1);

      rows.forEach((row) => {
        const date = row[dateIndex] || "";
        let content = row[contentIndex] || "";
        const imgSrc = row[imageIndex] || "";
        let footnote = row[footnoteIndex] || "";
        let link = row[linkIndex] || "";

        content = content.replace(/\\n|Ctrl\+N/g, "\n");
        footnote = footnote.replace(/\\n|Ctrl\+N/g, "\n");

        const tr = document.createElement("tr");
        const td = document.createElement("td");

        const contentWithLineBreak = content.replace(/\n/g, "<br>");
        const footnoteWithLineBreak = footnote.replace(/\n/g, "<br>");

        td.innerHTML = `
          <div class="date">${date}</div>
          <div class="image"><img src="${imgSrc}" alt=""></div>
          <div class="content">${contentWithLineBreak}</div>
        `;

        td.addEventListener("click", () =>
          showPopup(date, imgSrc, content, footnote, link)
        );

        tr.appendChild(td);
        table.appendChild(tr);
      });
    },
    error: function (error) {
      console.error("CSV Parsing Error:", error); // CSV 파싱 오류 확인
    },
  });
}

function showPopup(date, imgSrc, content, footnote, link) {
  const popup = document.createElement("div");
  popup.classList.add("popup");

  const formattedContent = content.replace(/\n/g, "<br>");
  const formattedFootnote = footnote.replace(/\n/g, "<br>");

  const linkButton = link
    ? `<a href="${link}" class="popup-link-button" target="_blank">Visit Link</a>`
    : "";

  popup.innerHTML = `
    <div class="popup-content">
      <button class="close-btn" onclick="closePopup()">✕</button>
      <div class="popup-inner">
        <div class="left-box">
          <div class="popup-link">${linkButton}</div>
        </div>
        <div class="center-box">
          <div class="popup-date">${date}</div>
          <div class="popup-image"><img src="${imgSrc}" alt="Popup Image"></div>
          <div class="popup-content-text">${formattedContent}</div>
        </div>
        <div class="right-box">
          <div class="popup-footnote">${formattedFootnote}</div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(popup);
}

// 팝업 닫기 함수
function closePopup() {
  const popup = document.querySelector(".popup");
  if (popup) popup.remove();
}

// 페이지 로드 시 데이터 로드
window.onload = loadData;
