import { useState, useEffect } from "react";
import nhanVienApi from "../../../api/nhanVienApi";

export default function NhanVienFormModal({ onClose, onSuccess, data }) {
    const isEdit = Boolean(data);

    const [form, setForm] = useState({
        ma_nv: "",
        ho_ten: "",
        gioi_tinh: "Nam",
        ngay_sinh: "",
        phong_ban_id: ""
    });

    useEffect(() => {
        if (data) setForm(data);
        else {
            const autoId = "NV" + new Date().getFullYear() + Math.floor(Math.random() * 900 + 100);
            setForm((f) => ({ ...f, ma_nv: autoId }));
        }
    }, [data]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEdit) await nhanVienApi.update(data.id, form);
        else await nhanVienApi.create(form);

        onSuccess();
        onClose();
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>{isEdit ? "Sửa nhân viên" : "Thêm nhân viên"}</h3>

                <form onSubmit={handleSubmit}>
                    <label>Mã nhân viên</label>
                    <input value={form.ma_nv} name="ma_nv" onChange={handleChange} disabled />

                    <label>Họ tên</label>
                    <input value={form.ho_ten} name="ho_ten" onChange={handleChange} required />

                    <label>Giới tính</label>
                    <select name="gioi_tinh" value={form.gioi_tinh} onChange={handleChange}>
                        <option>Nam</option>
                        <option>Nữ</option>
                    </select>

                    <label>Ngày sinh</label>
                    <input type="date" name="ngay_sinh" value={form.ngay_sinh} onChange={handleChange} />

                    <label>Phòng ban</label>
                    <input name="phong_ban_id" value={form.phong_ban_id} onChange={handleChange} />

                    <div className="flex mt-3">
                        <button className="btn btn-primary" type="submit">
                            {isEdit ? "Lưu" : "Thêm"}
                        </button>
                        <button className="btn btn-secondary" onClick={onClose}>Hủy</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
