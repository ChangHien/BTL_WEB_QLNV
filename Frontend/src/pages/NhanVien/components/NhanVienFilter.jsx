import { useState, useEffect } from "react";
import useDebounce from "../../../hooks/useDebounce";

export default function NhanVienFilter({ onChange }) {
    const [keyword, setKeyword] = useState("");
    const debouncedKeyword = useDebounce(keyword, 400);

    useEffect(() => {
        onChange({ keyword: debouncedKeyword });
    }, [debouncedKeyword]);

    return (
        <div className="card p-3 mb-3">
            <label>Tìm kiếm</label>
            <input
                className="form-control"
                placeholder="Nhập tên hoặc mã nhân viên..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
        </div>
    );
}
