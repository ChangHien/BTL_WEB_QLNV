import React, { useState, useEffect, useRef } from 'react';
import dayjs from 'dayjs';
import { Search, ChevronDown, User, X, Check, Layers, Briefcase, Cpu, Calendar } from 'react-feather';

const SearchableSelect = ({ 
  options = [], 
  value, 
  onChange, 
  placeholder = "Chọn...", 
  icon: Icon,
  labelKey = "label", 
  valueKey = "value",
  customDisplay 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  const getLabel = (item) => {
    if (!item) return '';
    if (customDisplay) return customDisplay(item);
    return item[labelKey];
  };

  const getValue = (item) => item ? item[valueKey] : undefined;

  useEffect(() => {
    if (value !== undefined && value !== null && value !== '') {
      const selected = options.find(item => getValue(item) === value);
      if (selected) setSearchTerm(getLabel(selected));
    } else {
      setSearchTerm('');
    }
  }, [value, options]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (value) {
            const selected = options.find(item => getValue(item) === value);
            if (selected) setSearchTerm(getLabel(selected));
        } else {
            setSearchTerm('');
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef, value, options]);

  const filteredOptions = options.filter(item => {
    const term = searchTerm.toLowerCase();
    const label = getLabel(item).toLowerCase();
    const val = String(getValue(item)).toLowerCase();
    return label.includes(term) || val.includes(term);
  });

  const handleSelect = (item) => {
    onChange(getValue(item));
    setSearchTerm(getLabel(item));
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(undefined);
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <div 
        className={`relative flex items-center w-full border rounded-lg bg-white transition-all h-10 ${isOpen ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
      >
        <div className="pl-2 text-gray-400">
          {Icon ? <Icon size={16} /> : <Search size={16} />}
        </div>
        <input
          type="text"
          className="w-full h-full px-2 text-sm text-gray-700 bg-transparent focus:outline-none rounded-lg placeholder-gray-400"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === '') onChange(undefined);
          }}
          onFocus={() => setIsOpen(true)}
        />
        {value && (
          <button onClick={handleClear} className="p-1 mr-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 transition-colors">
            <X size={14} />
          </button>
        )}
        <div className="pr-2 text-gray-400">
           {!value && <ChevronDown size={14} />}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100 left-0">
          {filteredOptions.length > 0 ? (
            <ul className="py-1">
                {filteredOptions.map((item) => {
                const itemVal = getValue(item);
                const itemLabel = getLabel(item);
                const isSelected = value === itemVal;
                return (
                    <li 
                        key={itemVal} 
                        onClick={() => handleSelect(item)} 
                        className={`px-3 py-2 text-sm cursor-pointer flex justify-between items-center group transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'}`}
                    >
                    <div className="flex flex-col">
                        <span>{itemLabel}</span>
                    </div>
                    {isSelected && <Check size={16} />}
                    </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">Không tìm thấy kết quả</div>
          )}
        </div>
      )}
    </div>
  );
};

const SalaryFilter = ({
  listPhongBan, listChucVu, filteredNhanVien,
  selectedPhong, setSelectedPhong,
  selectedChucVu, setSelectedChucVu,
  targetMaNV, setTargetMaNV,
  selectedMonth, setSelectedMonth,
  onCalculate, loading
}) => {

  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1";

  // Tạo danh sách kỳ lương
  const generateMonthOptions = () => {
    const options = [];
    const current = dayjs().subtract(6, 'month'); 
    for (let i = 0; i < 18; i++) {
        const date = current.add(i, 'month');
        options.push({
            label: date.format('MM/YYYY'), 
            value: date.format('YYYY-MM-01') 
        });
    }
    return options.reverse(); 
  };
  const monthOptions = generateMonthOptions();

  const handleSelectPeriod = (val) => {
      if (val) setSelectedMonth(dayjs(val));
      else setSelectedMonth(dayjs());
  };
  const currentPeriodValue = selectedMonth ? selectedMonth.format('YYYY-MM-01') : '';

  return (
    <div className="max-w-7xl mx-auto bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
      
      <div className="mb-5 border-b border-gray-100 pb-3">
         <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            💰 Tính Lương (Payroll)
         </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
        <div className="col-span-1">
          <label className={labelClass}>Phòng ban</label>
          <SearchableSelect 
            options={listPhongBan}
            value={selectedPhong}
            onChange={setSelectedPhong}
            labelKey="ten_phong"
            valueKey="ma_phong"
            placeholder="Tất cả"
            icon={Layers}
          />
        </div>

        <div className="col-span-1">
          <label className={labelClass}>Chức vụ</label>
          <SearchableSelect 
            options={listChucVu}
            value={selectedChucVu}
            onChange={setSelectedChucVu}
            labelKey="ten_chuc_vu"
            valueKey="ma_chuc_vu"
            placeholder="Tất cả"
            icon={Briefcase}
          />
        </div>

        <div className="col-span-1">
          <label className={labelClass}>Nhân viên</label>
          <SearchableSelect 
            options={filteredNhanVien} 
            value={targetMaNV} 
            onChange={setTargetMaNV}
            valueKey="ma_nhan_vien"
            customDisplay={(item) => `${item.ten_nhan_vien}`}
            placeholder="Tìm NV..."
            icon={User}
          />
        </div>

        <div className="col-span-1">
          <label className={labelClass}>Kỳ lương</label>
          <SearchableSelect 
            options={monthOptions}
            value={currentPeriodValue}
            onChange={handleSelectPeriod}
            labelKey="label"
            valueKey="value"
            placeholder="Chọn kỳ..."
            icon={Calendar}
          />
        </div>

        <div className="col-span-1">
          <button 
            onClick={onCalculate} 
            disabled={loading}
            className={`w-full h-10 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div> : <Cpu size={16} />}
            <span className="text-sm">{loading ? 'Đang xử lý...' : 'Tính Lương'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalaryFilter;