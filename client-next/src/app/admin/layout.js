
import { AuthProvider } from '@/context/AuthContext';

export default function AdminRootLayout({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
