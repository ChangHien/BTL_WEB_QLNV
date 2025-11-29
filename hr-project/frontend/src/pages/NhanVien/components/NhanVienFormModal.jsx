import React, { useState, useEffect } from "react";

export default function NhanVienFormModal({ open, onClose, editing, onSaved }) {
  const [form,setForm] = useState({ ten_nhan_vien:"", ma_phong:"", ma_chuc_vu:"", muc_luong_co_ban:0, ngay_vao_lam:"", auto_generate:true, ma_nhan_vien:"" });
  useEffect(()=> {
    if (editing) setForm({...editing, auto_generate:true});
    else setForm({ ten_nhan_vien:"", ma_phong:"", ma_chuc_vu:"", muc_luong_co_ban:0, ngay_vao_lam:"", auto_generate:true, ma_nhan_vien:"" });
  },[editing,open]);
  function onChange(e){ const {name,value,type,checked}=e.target; setForm(prev=>({ ...prev, [name]: type==='checkbox'? checked: value }));}
  async function handleSubmit(e){
    e.preventDefault();
    try{
      const payload = { ten_nhan_vien: form.ten_nhan_vien, ma_phong: form.ma_phong, ma_chuc_vu: form.ma_chuc_vu, muc_luong_co_ban: Number(form.muc_luong_co_ban), ngay_vao_lam: form.ngay_vao_lam || null, auto_generate: form.auto_generate };
      if (!form.auto_generate) payload.ma_nhan_vien = form.ma_nhan_vien;
      const res = await fetch("/api/nhanvien", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      onSaved && onSaved(data);
      onClose(true);
    }catch(err){ alert("Lỗi: "+err.message); }
  }
  if (!open) return null;
  return (
    <div className="modal">
      <form className="modal-content" onSubmit={handleSubmit}>
        <h3>{editing? "Sửa NV": "Thêm NV"}</h3>
        <label>Tên <input name="ten_nhan_vien" value={form.ten_nhan_vien} onChange={onChange} required /></label>
        <label>Mã phòng <input name="ma_phong" value={form.ma_phong} maxLength={3} onChange={onChange} required /></label>
        <label>Mã chức vụ <input name="ma_chuc_vu" value={form.ma_chuc_vu} maxLength={1} onChange={onChange} required /></label>
        <label>Lương <input name="muc_luong_co_ban" type="number" value={form.muc_luong_co_ban} onChange={onChange} required /></label>
        <label>Ngày vào <input name="ngay_vao_lam" type="date" value={form.ngay_vao_lam} onChange={onChange} /></label>
        <label><input type="checkbox" name="auto_generate" checked={form.auto_generate} onChange={onChange} /> Tự sinh mã NV</label>
        {!form.auto_generate && <label>Mã NV <input name="ma_nhan_vien" value={form.ma_nhan_vien} onChange={onChange} /></label>}
        <div style={{ marginTop:10 }}><button type="submit">Lưu</button> <button type="button" onClick={()=>onClose(false)}>Hủy</button></div>
      </form>
    </div>
  );
}
