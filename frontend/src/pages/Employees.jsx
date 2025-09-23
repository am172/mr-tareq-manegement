import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import './Employees.css';
import { useLanguage } from '../context/LanguageContext';

// كائن الترجمات
const translations = {
    ar: {
        title: "الموظفين",
        noPermission: "ليس لديك صلاحية لإدارة الموظفين",
        toggleForm: "إظهار/إخفاء النموذج",
        addEmployee: "إضافة موظف",
        editEmployee: "تعديل موظف",
        hideForm: "إخفاء نموذج الموظف",
        employeeName: "اسم الموظف *",
        address: "العنوان",
        username: "اسم المستخدم",
        password: "كلمة المرور",
        salary: "الراتب",
        phone: "رقم الهاتف",
        hireDate: "تاريخ التوظيف",
        notes: "ملاحظات",
        role: "الدور",
        employeeRole: "موظف",
        adminRole: "مدير",
        permissions: "الصلاحيات",
        saveEmployee: "حفظ الموظف",
        employeesList: "قائمة الموظفين",
        name: "الاسم",
        roleHeader: "الدور",
        salaryHeader: "الراتب",
        phoneHeader: "الهاتف",
        hireDateHeader: "تاريخ التوظيف",
        notesHeader: "ملاحظات",
        permissionsHeader: "صلاحيات",
        actions: "أوامر",
        edit: "تعديل",
        delete: "حذف",
        confirmDelete: "هل تريد حذف الموظف",
        successAdd: "تمت إضافة الموظف بنجاح",
        successEdit: "تم تعديل الموظف بنجاح",
        error: "حدث خطأ أثناء الحفظ",
        inventory: "المخزن",
        purchases: "المشتريات",
        sales: "المبيعات",
        expenses: "المصروفات",
        reports: "التقارير",
        showPassword: "إظهار كلمة المرور",
        optional: "(اختياري)"
    },
    en: {
        title: "Employees",
        noPermission: "You don't have permission to manage employees",
        toggleForm: "Show/Hide Form",
        addEmployee: "Add Employee",
        editEmployee: "Edit Employee",
        hideForm: "Hide Employee Form",
        employeeName: "Employee Name *",
        address: "Address",
        username: "Username",
        password: "Password",
        salary: "Salary",
        phone: "Phone Number",
        hireDate: "Hire Date",
        notes: "Notes",
        role: "Role",
        employeeRole: "Employee",
        adminRole: "Admin",
        permissions: "Permissions",
        saveEmployee: "Save Employee",
        employeesList: "Employees List",
        name: "Name",
        roleHeader: "Role",
        salaryHeader: "Salary",
        phoneHeader: "Phone",
        hireDateHeader: "Hire Date",
        notesHeader: "Notes",
        permissionsHeader: "Permissions",
        actions: "Actions",
        edit: "Edit",
        delete: "Delete",
        confirmDelete: "Are you sure you want to delete employee",
        successAdd: "Employee added successfully",
        successEdit: "Employee updated successfully",
        error: "An error occurred while saving",
        inventory: "Inventory",
        purchases: "Purchases",
        sales: "Sales",
        expenses: "Expenses",
        reports: "Reports",
        showPassword: "Show Password",
        optional: "(optional)"
    },
    zh: {
        title: "员工管理",
        noPermission: "您没有权限管理员工",
        toggleForm: "显示/隐藏表单",
        addEmployee: "添加员工",
        editEmployee: "编辑员工",
        hideForm: "隐藏员工表单",
        employeeName: "员工姓名 *",
        address: "地址",
        username: "用户名",
        password: "密码",
        salary: "工资",
        phone: "电话号码",
        hireDate: "雇佣日期",
        notes: "备注",
        role: "角色",
        employeeRole: "员工",
        adminRole: "管理员",
        permissions: "权限",
        saveEmployee: "保存员工",
        employeesList: "员工列表",
        name: "姓名",
        roleHeader: "角色",
        salaryHeader: "工资",
        phoneHeader: "电话",
        hireDateHeader: "雇佣日期",
        notesHeader: "备注",
        permissionsHeader: "权限",
        actions: "操作",
        edit: "编辑",
        delete: "删除",
        confirmDelete: "您确定要删除员工",
        successAdd: "员工添加成功",
        successEdit: "员工更新成功",
        error: "保存时发生错误",
        inventory: "库存",
        purchases: "采购",
        sales: "销售",
        expenses: "支出",
        reports: "报告",
        showPassword: "显示密码",
        optional: "(可选)"
    }
};

const initialForm = {
    realName: '',
    address: '',
    username: '',
    password: '',
    role: 'employee',
    salary: '',
    phone: '',
    hireDate: '',
    notes: '',
    permissions: {
        inventory: false,
        purchases: false,
        sales: false,
        expenses: false,
        reports: false,
    }
};

const Employees = () => {
    const { user, api } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const { language } = useLanguage();
    const [loading, setLoading] = useState(true);


    const t = translations[language];

    const fetchEmployees = async () => {
        try {
            setLoading(true);   // 👈 بدء التحميل
            const res = await api.get('/api/employees');
            setEmployees(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);  // 👈 إنهاء التحميل
        }
    };


    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name in form.permissions) {
            setForm({ ...form, permissions: { ...form.permissions, [name]: checked } });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = { ...form };

            if (editingEmployee && !formData.password) {
                delete formData.password;
            }

            if (editingEmployee) {
                const res = await api.put(`/api/employees/${editingEmployee._id}`, formData);
                setMessage(t.successEdit);
                setEmployees(prev => prev.map(emp => emp._id === editingEmployee._id ? res.data.employee : emp));
            } else {
                const res = await api.post('/api/employees', formData);
                setMessage(t.successAdd);
                setEmployees(prev => [...prev, res.data.user]);
            }
            setMessageType('success');
            setForm(initialForm);
            setEditingEmployee(null);
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || t.error);
            setMessageType('error');
        }
    };

    const handleEdit = (emp) => {
        setForm({
            realName: emp.realName,
            address: emp.address || '',
            username: emp.username || '',
            password: '', // اتركها فارغة للحفاظ على الباسورد الحالي
            role: emp.role,
            salary: emp.salary,
            phone: emp.phone || '',
            hireDate: emp.hireDate ? emp.hireDate.split('T')[0] : '',
            notes: emp.notes || '',
            permissions: {
                inventory: emp.permissions?.inventory || false,
                purchases: emp.permissions?.purchases || false,
                sales: emp.permissions?.sales || false,
                expenses: emp.permissions?.expenses || false,
                reports: emp.permissions?.reports || false,
            }
        });
        setEditingEmployee(emp);
        setShowForm(true);
    };

    const handleDelete = async (emp) => {
        // التنبيه الأول
        if (!window.confirm(`${t.confirmDelete} "${emp.realName}"؟`)) return;

        // فرق زمني 500ms قبل التنبيه الثاني
        await new Promise(resolve => setTimeout(resolve, 500));

        // التنبيه الثاني
        if (!window.confirm(`هذه عملية حذف نهائية لـ "${emp.realName}"! هل تريد المتابعة؟`)) return;

        try {
            await api.delete(`/api/employees/${emp._id}`);
            setEmployees(prev => prev.filter(e => e._id !== emp._id));
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || t.error);
        }
    };


    const resetForm = () => {
        setForm(initialForm);
        setEditingEmployee(null);
        setShowForm(false);
    };

    return (
        <div className="page">
            <h1>{t.title}</h1>

            {user?.role !== 'admin' && <p>{t.noPermission}</p>}

            {user?.role === 'admin' && (
                <>
                    <button
                        className="toggle-form-btn"
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                            }
                        }}
                    >
                        {showForm ? t.hideForm : t.addEmployee}
                    </button>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="employee-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t.employeeName}</label>
                                    <input type="text" name="realName" value={form.realName} onChange={handleChange} required />
                                </div>

                                <div className="form-group">
                                    <label>{t.address} {t.optional}</label>
                                    <input type="text" name="address" value={form.address} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>{t.username} {t.optional}</label>
                                    <input type="text" name="username" value={form.username} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>{t.password} {t.optional}</label>
                                    <div className="password-wrapper">
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            placeholder={editingEmployee ? "اتركه فارغاً للحفاظ على كلمة المرور الحالية" : ""}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>{t.salary} {t.optional}</label>
                                    <input type="number" name="salary" value={form.salary} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>{t.phone} {t.optional}</label>
                                    <input type="text" name="phone" value={form.phone} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label>{t.hireDate} {t.optional}</label>
                                    <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} />
                                </div>

                                <div className="form-group full-width">
                                    <label>{t.notes} {t.optional}</label>
                                    <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}></textarea>
                                </div>

                                <div className="form-group">
                                    <label>{t.role}</label>
                                    <select name="role" value={form.role} onChange={handleChange}>
                                        <option value="employee">{t.employeeRole}</option>
                                        <option value="admin">{t.adminRole}</option>
                                    </select>
                                </div>

                                <div className="form-group full-width">
                                    <fieldset>
                                        <legend>{t.permissions} {t.optional}</legend>
                                        <div className="permissions-grid">
                                            {Object.keys(form.permissions).map((perm) => (
                                                <label key={perm} className="permission-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        name={perm}
                                                        checked={form.permissions[perm]}
                                                        onChange={handleChange}
                                                    />
                                                    <span>{t[perm] || perm}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </fieldset>
                                </div>
                            </div>

                            <div className="form-buttons">
                                <button type="submit">{t.saveEmployee}</button>
                                <button type="button" onClick={resetForm}>إلغاء</button>
                            </div>
                        </form>
                    )}

                    {message && (
                        <p className={`message ${messageType}`}>{message}</p>
                    )}

                    <h2>{t.employeesList}</h2>
                    <div className="table-wrapper">
                        <table className="employees-table">
                            <thead>
                                <tr>
                                    <th>{t.name}</th>
                                    <th>{t.username}</th>
                                    <th>{t.password}</th>
                                    <th>{t.address}</th>
                                    <th>{t.roleHeader}</th>
                                    <th>{t.salaryHeader}</th>
                                    <th>{t.phoneHeader}</th>
                                    <th>{t.hireDateHeader}</th>
                                    <th>{t.notesHeader}</th>
                                    <th>{t.permissionsHeader}</th>
                                    <th>{t.actions}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="11" style={{ textAlign: "center", padding: "40px" }}>
                                            <div
                                                style={{
                                                    border: "8px solid #f3f3f3",
                                                    borderTop: "8px solid #007bff",
                                                    borderRadius: "50%",
                                                    width: "60px",
                                                    height: "60px",
                                                    margin: "auto",
                                                    animation: "spin 1.5s linear infinite"
                                                }}
                                            />
                                            <style>
                                                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    `}
                                            </style>
                                        </td>
                                    </tr>
                                ) : (
                                    employees.map(emp => (
                                        <tr key={emp._id}>
                                            <td>{emp.realName}</td>
                                            <td>{emp.username || '-'}</td>
                                            <td className="password-cell">{emp.plainPassword || '-'}</td>
                                            <td>{emp.address || '-'}</td>
                                            <td>{emp.role === 'employee' ? t.employeeRole : t.adminRole}</td>
                                            <td>{emp.salary || '-'}</td>
                                            <td>{emp.phone || '-'}</td>
                                            <td>{emp.hireDate ? new Date(emp.hireDate).toLocaleDateString() : '-'}</td>
                                            <td>{emp.notes || '-'}</td>
                                            <td>
                                                {emp.permissions && Object.entries(emp.permissions)
                                                    .filter(([_, val]) => val)
                                                    .map(([key]) => t[key] || key)
                                                    .join(', ') || '-'}
                                            </td>
                                            <td className="actions-cell">
                                                <button onClick={() => handleEdit(emp)} title={t.edit}><FaEdit /></button>
                                                <button onClick={() => handleDelete(emp)} title={t.delete}><FaTrash /></button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>

                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Employees;
