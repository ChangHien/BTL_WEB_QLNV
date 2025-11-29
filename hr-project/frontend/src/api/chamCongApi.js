const base = "/api/chamcong";
export async function checkin(ma_nv, iso) {
  const res = await fetch(`${base}/checkin`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ma_nhan_vien: ma_nv, timestamp_utc: iso })});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function checkout(ma_nv, iso) {
  const res = await fetch(`${base}/checkout`, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify({ ma_nhan_vien: ma_nv, timestamp_utc: iso })});
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function importCSV(file) {
  const fd = new FormData(); fd.append("file", file);
  const res = await fetch(`${base}/import`, { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
