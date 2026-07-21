import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  
  const allLinks = [
    { title: 'Manage Posts', path: '/admin/posts', description: 'Create, edit, and publish articles' },
    { title: 'Manage Verticals', path: '/admin/verticals', description: 'Manage content categories and slugs' },
    { title: 'Manage Petitions', path: '/admin/petitions', description: 'Manage trending petitions and goals' },
    { title: 'Manage Ads', path: '/admin/ads', description: 'Configure banner and sponsored placements' },
    { title: 'Manage Users', path: '/admin/users', description: 'Control access and roles' },
  ];

  // Filter links for editors to only see Posts
  const adminLinks = user?.role === 'editor' 
    ? allLinks.filter(link => link.path === '/admin/posts')
    : allLinks;

  return (
    <div className="p-6 text-white max-w-5xl mx-auto min-h-screen">
      <h1 className="text-4xl font-bold mb-2">
        {user?.role === 'editor' ? 'Editor Dashboard' : 'Admin Dashboard'}
      </h1>
      <p className="text-gray-400 mb-8">
        {user?.role === 'editor' 
          ? 'Welcome back. Access your assigned publishing tools below.' 
          : 'Welcome back. Select a module to manage your site content.'}
      </p>
      
      <div className={`grid grid-cols-1 ${user?.role === 'editor' ? 'md:grid-cols-1 max-w-xl' : 'md:grid-cols-2'} gap-6`}>
        {adminLinks.map((link) => (
          <Link 
            key={link.path} 
            to={link.path}
            className="block p-6 bg-gray-900 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-800 hover:border-blue-500 transition-all duration-200 group"
          >
            <h2 className="text-2xl font-bold mb-2 text-blue-400 group-hover:text-blue-300">{link.title}</h2>
            <p className="text-gray-400 group-hover:text-gray-300">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}