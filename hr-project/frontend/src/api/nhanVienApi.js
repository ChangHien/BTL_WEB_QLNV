const base = "/api/nhanvien";
export async function fetchNhanViens(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${base}?${qs}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function createNhanVien(payload) {
  const res = await fetch(base, { method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(payload) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function getNhanVien(ma) {
  const res = await fetch(`${base}/${ma}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
