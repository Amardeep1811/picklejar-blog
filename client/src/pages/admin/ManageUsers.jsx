import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import { AuthContext } from '../../context/AuthContext';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function ManageUsers() {
  const { user: currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [changePasswordId, setChangePasswordId] = useState(null);
  const [changePasswordUser, setChangePasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const defaultForm = {
    name: '',
    email: '',
    password: '',
    role: 'editor'
  };

  const [formData, setFormData] = useState(defaultForm);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (userToEdit) => {
    setIsEditing(true);
    setEditingId(userToEdit._id);
    setFormData({
      name: userToEdit.name,
      email: userToEdit.email,
      password: '', // Do not populate password on edit
      role: userToEdit.role
    });
    setErrorMsg('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      alert("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Are you sure you want to remove this user? They will immediately lose access.")) {
      return;
    }
    try {
      const res = await axios.delete(`/users/${id}`);
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData(defaultForm);
    setErrorMsg('');
  };

  const handleChangePasswordClick = (userToChange) => {
    setChangePasswordId(userToChange._id);
    setChangePasswordUser(userToChange);
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangePasswordCancel = () => {
    setChangePasswordId(null);
    setChangePasswordUser(null);
    setNewPassword('');
    setConfirmNewPassword('');
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmNewPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      setPasswordError('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a special character');
      return;
    }

    try {
      const res = await axios.put(`/users/${changePasswordId}/password`, { password: newPassword });
      if (res.data.success) {
        setPasswordSuccess('Password changed successfully!');
        setNewPassword('');
        setConfirmNewPassword('');
        setTimeout(() => {
          handleChangePasswordCancel();
        }, 2000);
      }
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      if (editingId) {
        const updatePayload = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        const res = await axios.put(`/users/${editingId}`, updatePayload);
        if (res.data.success) {
          alert('User updated successfully!');
          handleCancel();
          fetchUsers();
        }
      } else {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(formData.password)) {
          setErrorMsg('Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a special character');
          return;
        }
        const res = await axios.post('/users', formData);
        if (res.data.success) {
          alert('User created successfully!');
          handleCancel();
          fetchUsers();
        }
      }
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Failed to save user');
    }
  };

  if (loading) return <LoadingSpinner />;

  if (currentUser?.role !== 'admin') {
    return (
      <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-[var(--red)] mb-2 font-heading">Access Restricted</h2>
        <p className="text-[var(--gray)]">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-[var(--ink)] max-w-5xl mx-auto py-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-heading text-[var(--ink)]">Manage Users</h1>
        {!isEditing && !changePasswordId && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-[var(--green)] px-5 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm"
          >
            Add New User
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)] font-heading">
            {editingId ? `Editing User: ${formData.name}` : 'Add New User'}
          </h2>
          
          {errorMsg && (
            <div className="bg-[var(--red)]/10 border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded-lg mb-6 font-medium">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-semibold text-[var(--ink-2)]">Role</label>
              <select 
                className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
                disabled={editingId === currentUser?._id}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              {editingId === currentUser?._id && (
                <p className="text-xs text-[var(--gray)] mt-1 font-medium">You cannot change your own role.</p>
              )}
            </div>
            {!editingId && (
              <div>
                <label className="block mb-1 text-sm font-semibold text-[var(--ink-2)]">Password</label>
                <p className="text-xs text-[var(--gray)] mb-2 font-medium">At least 8 chars, 1 uppercase, 1 lowercase, 1 special char</p>
                <input 
                  type="password" 
                  required={!editingId}
                  minLength="8"
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4 border-t border-[var(--line)] mt-8">
            <button type="submit" className="bg-[var(--green)] px-6 py-2.5 rounded-lg text-white font-bold hover:bg-[var(--green-dark)] hover:-translate-y-0.5 transition-all shadow-sm">
              {editingId ? 'Save Changes' : 'Create User'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-white border border-[var(--line)] text-[var(--ink)] px-6 py-2.5 rounded-lg font-bold hover:bg-[var(--bg-2)] transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : changePasswordId ? (
        <form onSubmit={handleChangePasswordSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-[var(--line)] mb-8">
          <h2 className="text-2xl font-bold mb-6 text-[var(--ink)] font-heading">
            Change Password for: {changePasswordUser?.name}
          </h2>
          
          {passwordSuccess && (
            <div className="bg-[var(--green)]/10 border border-[var(--green)] text-[var(--green-dark)] px-4 py-3 rounded-lg mb-6 font-medium">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="bg-[var(--red)]/10 border border-[var(--red)] text-[var(--red)] px-4 py-3 rounded-lg mb-6 font-medium">
              {passwordError}
            </div>
          )}

          {!passwordSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 text-sm font-semibold text-[var(--ink-2)]">New Password</label>
                <p className="text-xs text-[var(--gray)] mb-2 font-medium">At least 8 chars, 1 uppercase, 1 lowercase, 1 special char</p>
                <input 
                  type="password" 
                  required
                  minLength="8"
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-semibold text-[var(--ink-2)]">Confirm New Password</label>
                <p className="text-xs text-[var(--gray)] mb-2 font-medium">At least 8 chars, 1 uppercase, 1 lowercase, 1 special char</p>
                <input 
                  type="password" 
                  required
                  minLength="8"
                  className="w-full bg-white border border-[var(--line)] rounded-lg p-2.5 text-[var(--ink)] focus:outline-none focus:border-[var(--green)] focus:ring-1 focus:ring-[var(--green)] transition-colors"
                  value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)} 
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4 border-t border-[var(--line)] mt-8">
            {!passwordSuccess && (
              <button type="submit" className="bg-[var(--gold)] px-6 py-2.5 rounded-lg text-white font-bold hover:brightness-95 hover:-translate-y-0.5 transition-all shadow-sm">
                Change Password
              </button>
            )}
            <button type="button" onClick={handleChangePasswordCancel} className="bg-white border border-[var(--line)] text-[var(--ink)] px-6 py-2.5 rounded-lg font-bold hover:bg-[var(--bg-2)] transition-colors">
              {passwordSuccess ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl border border-[var(--line)] shadow-sm">
          <table className="w-full text-left text-sm text-[var(--ink)]">
            <thead className="text-xs text-[var(--ink)] uppercase bg-[var(--bg-2)] border-b border-[var(--line)] font-bold">
              <tr>
                <th className="px-6 py-4 font-heading">Name</th>
                <th className="px-6 py-4 font-heading">Email</th>
                <th className="px-6 py-4 font-heading">Role</th>
                <th className="px-6 py-4 font-heading">Joined</th>
                <th className="px-6 py-4 font-heading text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id} className="border-b border-[var(--line)] hover:bg-[var(--bg-2)]/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-[var(--ink)]">
                      {u.name} {isSelf && <span className="text-[var(--gray)] text-xs ml-2">(You)</span>}
                    </td>
                    <td className="px-6 py-4 text-[var(--ink)]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-[var(--gold)]/20 text-[var(--gold)]' : 'bg-[var(--green)]/10 text-[var(--green-dark)]'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[var(--ink)] font-medium">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-4">
                      <button 
                        onClick={() => handleEditClick(u)}
                        className="text-[var(--gray)] hover:text-[var(--green)] text-sm font-bold transition-colors"
                      >
                        Edit
                      </button>
                      {!isSelf && (
                        <>
                          {u.role === 'admin' ? (
                            <span className="text-[var(--gray)] text-xs italic">Admins reset via email</span>
                          ) : (
                            <button 
                              onClick={() => handleChangePasswordClick(u)}
                              className="text-[var(--gray)] hover:text-[var(--gold)] text-sm font-bold transition-colors"
                            >
                              Change Password
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(u._id)}
                            className="text-[var(--red)] opacity-80 hover:opacity-100 text-sm font-bold transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-12 text-center text-[var(--gray)] font-medium">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}