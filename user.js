const userForm = document.getElementById('userForm');
const userHistoryTableBody = document.querySelector('#userHistoryTable tbody');
const userNoDataMsg = document.getElementById('userNoDataMsg');
const refreshBtn = document.getElementById('refreshHistoryBtn');

function loadData() {
  return JSON.parse(localStorage.getItem('lotteryData') || '[]');
}
function saveData(data) {
  localStorage.setItem('lotteryData', JSON.stringify(data));
}

userForm.addEventListener('submit', e => {
  e.preventDefault();

  const numberInput = document.getElementById('lotteryNumber');
  const dateInput = document.getElementById('purchaseDate');
  const fileInput = document.getElementById('imageFile');

  const number = numberInput.value.trim();
  const date = dateInput.value;

  if (!/^\d{2}$/.test(number)) {
    alert('กรุณากรอกเลขล็อตเตอรี่ให้ถูกต้อง 2 ตัว (00-99)');
    return;
  }
  if (!date) {
    alert('กรุณาเลือกวันที่ซื้อ');
    return;
  }

  let data = loadData();
  if (data.some(item => item.number === number && item.date === date)) {
    alert('เลขล็อตเตอรี่และวันที่นี้ได้ส่งตรวจสอบไปแล้ว');
    return;
  }

  if (fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
      addEntry(event.target.result);
    };
    reader.readAsDataURL(file);
  } else {
    addEntry(null);
  }

  function addEntry(imageData) {
    const id = Date.now();
    data.push({
      id,
      number,
      date,
      status: 'pending',
      result: '',
      image: imageData
    });
    saveData(data);
    alert('ส่งเลขล็อตเตอรี่พร้อมรูปภาพเรียบร้อย รอ Admin ตรวจสอบ');
    userForm.reset();
    renderUserHistory();
  }
});

function statusText(status) {
  switch(status) {
    case 'pending': return 'รอดำเนินการ';
    case 'checked': return 'ตรวจสอบแล้ว';
    case 'rejected': return 'ไม่ถูกรางวัล';
    default: return '-';
  }
}

function renderUserHistory() {
  const data = loadData();
  userHistoryTableBody.innerHTML = '';
  if (data.length === 0) {
    userNoDataMsg.style.display = 'block';
    return;
  } else {
    userNoDataMsg.style.display = 'none';
  }

  data.forEach(item => {
    const tr = document.createElement('tr');
    const imgHTML = item.image ? `<img src="${item.image}" alt="รูปภาพล็อตเตอรี่" class="thumb" />` : '-';
    tr.innerHTML = `
      <td>${item.number}</td>
      <td>${item.date}</td>
      <td><span class="status ${item.status}">${statusText(item.status)}</span></td>
      <td>${item.result || '-'}</td>
      <td>${imgHTML}</td>
    `;
    userHistoryTableBody.appendChild(tr);
  });
}

// เพิ่ม event ให้ปุ่มรีเฟรช
refreshBtn.addEventListener('click', () => {
  renderUserHistory();
});

renderUserHistory();


renderUserHistory();
