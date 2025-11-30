import { useEffect, useState } from "react";
import nhanVienApi from "../../api/nhanVienApi";
import NhanVienFormModal from "./components/NhanVienFormModal";
import NhanVienFilter from "./components/NhanVienFilter";
import FullPageLoading from "../../components/common/FullPageLoading";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function NhanVienPage() {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState({ keyword: "" });

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [confirmDelete, setConfirmDelete] = useState(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await nhanVienApi.getList(filter);
            setList(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [filter]);

    const handleOpenCreate = () => {
        setEditingItem(null);
        setShowForm(true);
    };

    const handleOpenEdit = (item) => {
        setEditingItem(item);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        await nhanVienApi.delete(id);
        setConfirmDelete(null);
        loadData();
    };

    return (
        <div className="container">
            {loading && <FullPageLoading />}

            <h2 className="page-title">Quản lý Nhân viên</h2>

            <NhanVienFilter onChange={setFilter} />

            <button className="btn btn-primary" onClick={handleOpenCreate}>
                Thêm nhân viên
            </button>

            <table className="table mt-3">
                <thead>
                    <tr>
                        <th>Mã NV</th>
                        <th>Họ tên</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Phòng ban</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {list.length === 0 && (
                        <tr><td colSpan={6}>Không có dữ liệu</td></tr>
                    )}

                    {list.map((nv) => (
                        <tr key={nv.id}>
                            <td>{nv.ma_nv}</td>
                            <td>{nv.ho_ten}</td>
                            <td>{nv.gioi_tinh}</td>
                            <td>{nv.ngay_sinh}</td>
                            <td>{nv.ten_phong_ban}</td>

                            <td>
                                <button className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleOpenEdit(nv)}>
                                    Sửa
                                </button>

                                <button className="btn btn-sm btn-danger"
                                    onClick={() => setConfirmDelete(nv.id)}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && (
                <NhanVienFormModal
                    onClose={() => setShowForm(false)}
                    data={editingItem}
                    onSuccess={loadData}
                />
            )}

            {confirmDelete && (
                <ConfirmModal
                    title="Xác nhận xóa"
                    message="Bạn có chắc muốn xóa nhân viên này?"
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => handleDelete(confirmDelete)}
                />
            )}
        </div>
    );
}
