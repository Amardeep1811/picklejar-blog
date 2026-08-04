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

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
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
        if (formData.password.length < 6) {
          setErrorMsg('Password must be at least 6 characters');
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
      <div className="p-6 text-white max-w-5xl mx-auto text-center mt-20">
        <h2 className="text-2xl font-bold text-red-500 mb-2">Access Restricted</h2>
        <p className="text-gray-400">This page is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        {!isEditing && !changePasswordId && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-blue-600 px-4 py-2 rounded text-white font-bold hover:bg-blue-700 transition-colors"
          >
            Add New User
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            {editingId ? `Editing User: ${formData.name}` : 'Add New User'}
          </h2>
          
          {errorMsg && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Role</label>
              <select 
                className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})}
                disabled={editingId === currentUser?._id}
              >
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
              {editingId === currentUser?._id && (
                <p className="text-xs text-gray-500 mt-1">You cannot change your own role.</p>
              )}
            </div>
            {!editingId && (
              <div>
                <label className="block mb-2 text-sm font-medium">Password</label>
                <input 
                  type="password" 
                  required={!editingId}
                  minLength="6"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-blue-500"
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            )}
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700 transition-colors">
              {editingId ? 'Save Changes' : 'Create User'}
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      ) : changePasswordId ? (
        <form onSubmit={handleChangePasswordSubmit} className="space-y-6 bg-gray-900 p-6 rounded-lg shadow-lg mb-8 border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-yellow-400">
            Change Password for: {changePasswordUser?.name}
          </h2>
          
          {passwordSuccess && (
            <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded mb-4">
              {passwordSuccess}
            </div>
          )}

          {passwordError && (
            <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded mb-4">
              {passwordError}
            </div>
          )}

          {!passwordSuccess && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium">New Password</label>
                <input 
                  type="password" 
                  required
                  minLength="6"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-yellow-500"
                  value={newPassword} 
                  onChange={e => setNewPassword(e.target.value)} 
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">Confirm New Password</label>
                <input 
                  type="password" 
                  required
                  minLength="6"
                  className="w-full bg-gray-800 border border-gray-600 rounded p-2 focus:outline-none focus:border-yellow-500"
                  value={confirmNewPassword} 
                  onChange={e => setConfirmNewPassword(e.target.value)} 
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            {!passwordSuccess && (
              <button type="submit" className="bg-yellow-600 px-6 py-2 rounded font-bold hover:bg-yellow-700 transition-colors text-white">
                Change Password
              </button>
            )}
            <button type="button" onClick={handleChangePasswordCancel} className="bg-gray-600 px-6 py-2 rounded font-bold hover:bg-gray-700 transition-colors">
              {passwordSuccess ? 'Close' : 'Cancel'}
            </button>
          </div>
        </form>
      ) : (
        <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-700 shadow-lg">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-800 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => {
                const isSelf = u._id === currentUser?._id;
                return (
                  <tr key={u._id} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      {u.name} {isSelf && <span className="text-blue-400 text-xs ml-2">(You)</span>}
                    </td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-3">
                      <button 
                        onClick={() => handleEditClick(u)}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {!isSelf && (
                        <>
                          <button 
                            onClick={() => handleChangePasswordClick(u)}
                            className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                          >
                            Change Password
                          </button>
                          <button 
                            onClick={() => handleDelete(u._id)}
                            className="text-red-400 hover:text-red-300 font-medium transition-colors"
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
            <div className="p-8 text-center text-gray-400">
              No users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}