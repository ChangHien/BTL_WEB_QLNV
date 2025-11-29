import React, { useState } from "react";
import { checkin, checkout, importCSV } from "../../api/chamCongApi";

function toLocal(iso){
  const d = new Date(iso);
  const local = new Date(d.getTime() + 7*3600*1000);
  return local.toLocaleString();
}

export default function ChamCongPage(){
  const [ma, setMa] = useState("");
  const [logs, setLogs] = useState([]);
  const [file, setFile] = useState(null);

  async function doCheckin(){
    if (!ma) return alert("Nhập mã NV");
    try{
      const res = await checkin(ma, new Date().toISOString());
      alert("Checkin OK");
      setLogs([res,...logs]);
    }catch(e){ alert("Lỗi: "+e.message); }
  }
  async function doCheckout(){
    if (!ma) return alert("Nhập mã NV");
    try{
      const res = await checkout(ma, new Date().toISOString());
      alert("Checkout OK");
      setLogs([res,...logs]);
    }catch(e){ alert("Lỗi: "+e.message); }
  }
  async function doImport(e){
    e.preventDefault();
    if (!file) return alert("Chưa chọn file");
    try{
      const res = await importCSV(file);
      alert("Import done: "+JSON.stringify(res));
    }catch(e){ alert("Lỗi import: "+e.message); }
  }

  return (
    <div>
      <h2>Chấm công</h2>
      <div>
        <input placeholder="Mã NV" value={ma} onChange={e=>setMa(e.target.value)} />
        <button onClick={doCheckin}>Check-in now</button>
        <button onClick={doCheckout}>Check-out now</button>
      </div>
      <form onSubmit={doImport}>
        <input type="file" accept=".csv" onChange={e=>setFile(e.target.files[0])} />
        <button type="submit">Import CSV</button>
      </form>
      <h3>Logs</h3>
      <ul>
        {logs.map(l=> <li key={l.id}>{l.ma_nhan_vien} - {toLocal(l.checkin_utc)} - {l.checkout_utc? toLocal(l.checkout_utc): "OPEN"}</li>)}
      </ul>
    </div>
  );
}
