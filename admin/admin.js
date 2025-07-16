const adminTableBody = document.querySelector('#adminTable tbody');
const filterStatus = document.getElementById('filterStatus');
const adminNoDataMsg = document.getElementById('adminNoDataMsg');

function loadData() {
  return JSON.parse(localStorage.getItem('lotteryData') || '[]');
}
function saveData(data) {
  localStorage.setItem('lotteryData', JSON.stringify(data));
}

function statusText(status) {
  switch(status) {
    case 'pending': return 'รอดำเนินการ';
    case 'checked': return 'ตรวจสอบแล้ว';
    case 'rejected': return 'ไม่ถูกรางวัล';
    default: return '-';
  }
}

function renderAdminTable() {
  const data = loadData();
  const filter = filterStatus.value;

  adminTableBody.innerHTML = '';
  const filtered = filter === 'all' ? data : data.filter(item => item.status === filter);

  if (filtered.length === 0) {
    adminNoDataMsg.style.display = 'block';
    return;
  } else {
    adminNoDataMsg.style.display = 'none';
  }

  filtered.forEach(item => {
    const tr = document.createElement('tr');
    const imgHTML = item.image ? `<img src="${item.image}" alt="รูปภาพล็อตเตอรี่" class="thumb" />` : '-';
    tr.innerHTML = `
      <td>${item.id}</td>
      <td>${item.number}</td>
      <td>${item.date}</td>
      <td>${imgHTML}</td>
      <td><span class="status ${item.status}">${statusText(item.status)}</span></td>
      <td>
        ${item.status === 'pending' ? 
          `<select class="result-select" data-id="${item.id}">
            <option value="">-- เลือกผลตรวจสอบ --</option>
            <option value="ถูกรางวัลที่ 1">ถูกรางวัลที่ 1</option>
            <option value="ถูกรางวัลเลขท้าย 2 ตัว">ถูกรางวัลเลขท้าย 2 ตัว</option>
            <option value="ถูกรางวัลเลขท้าย 3 ตัว">ถูกรางวัลเลขท้าย 3 ตัว</option>
            <option value="ไม่ถูกรางวัล">ไม่ถูกรางวัล</option>
          </select>`
          : item.result
        }
      </td>
      <td>
        ${item.status === 'pending' ? `<button data-id="${item.id}" class="update-btn">อัปเดตผล</button>` : '-'}
      </td>
      <td>
        <button data-id="${item.id}" class="delete-btn">ลบ</button>
      </td>
    `;
    adminTableBody.appendChild(tr);
  });
}

function updateResult(id, result) {
  let data = loadData();
  let item = data.find(e => e.id === id);
  if (!item) return false;
  item.result = result;
  if (result === 'ไม่ถูกรางวัล') {
    item.status = 'rejected';
  } else {
    item.status = 'checked';
  }
  saveData(data);
  return true;
}

function deleteEntry(id) {
  let data = loadData();
  data = data.filter(item => item.id !== id);
  saveData(data);
}

adminTableBody.addEventListener('click', e => {
  const target = e.target;

  if (target.classList.contains('update-btn')) {
    const id = parseInt(target.dataset.id);
    const select = adminTableBody.querySelector(`select.result-select[data-id="${id}"]`);
    if (!select) return alert('ไม่พบผลตรวจสอบ');
    const result = select.value;
    if (!result) return alert('กรุณาเลือกผลตรวจสอบก่อน');
    if (updateResult(id, result)) {
      alert('อัปเดตผลตรวจสอบเรียบร้อย');
      renderAdminTable();
    }
  }

  if (target.classList.contains('delete-btn')) {
    const id = parseInt(target.dataset.id);
    if (confirm('คุณแน่ใจจะลบรายการนี้? ไม่สามารถกู้คืนได้')) {
      deleteEntry(id);
      renderAdminTable();
    }
  }
});

filterStatus.addEventListener('change', renderAdminTable);

renderAdminTable();
