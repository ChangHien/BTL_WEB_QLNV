import React, { useEffect, useState } from "react";
import NhanVienFormModal from "./components/NhanVienFormModal";
import { fetchNhanViens } from "../../api/nhanVienApi";

export default function NhanVienPage(){
  const [list, setList] = useState([]);
  const [q,setQ] = useState("");
  const [open,setOpen] = useState(false);
  const [editing,setEditing] = useState(null);

  async function load(){ try{ const data = await fetchNhanViens({ search: q }); setList(data); }catch(e){ alert("Lỗi tải: "+e.message); } }
  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h2>Danh sách nhân viên</h2>
      <div style={{ marginBottom: 10 }}>
        <input placeholder="Tìm..." value={q} onChange={e=>setQ(e.target.value)} />
        <button onClick={()=>load()}>Tìm</button>
        <button onClick={()=>{ setEditing(null); setOpen(true); }}>Thêm NV</button>
      </div>
      <table>
        <thead><tr><th>Mã</th><th>Tên</th><th>Phòng</th><th>Chức vụ</th><th>Lương</th><th>Hành động</th></tr></thead>
        <tbody>
          {list.map(n=>(
            <tr key={n.ma_nhan_vien}>
              <td>{n.ma_nhan_vien}</td>
              <td>{n.ten_nhan_vien}</td>
              <td>{n.ma_phong}</td>
              <td>{n.ma_chuc_vu}</td>
              <td>{n.muc_luong_co_ban}</td>
              <td><button onClick={()=>{ setEditing(n); setOpen(true); }}>Sửa</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <NhanVienFormModal open={open} editing={editing} onClose={(saved)=>{ setOpen(false); if (saved) load(); }} onSaved={()=>{}} />
    </div>
  );
}
