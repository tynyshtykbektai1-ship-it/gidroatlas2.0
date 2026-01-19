import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Navigation } from './components/Navigation';
import { Statistics } from './components/Statistics';
import { Reports } from './components/Reports';
import { Settings } from './components/Settings';
import { Users } from './components/Users';
import { Objects } from './components/Objects';
import { Chatbot } from './components/Chatbot';
import Hardware from './components/Hardware';
import MLAssessment from './components/MLAssessment';

type Page = 'dashboard' | 'statistics' | 'reports' | 'settings' | 'users' | 'objects' | 'chatbot' | 'hardware' | 'ml';

function App() {
  const { user, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-xl text-gray-600">Загрузка...</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation: содержит и desktop sidebar / top и мобильный bottom внутри себя */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main content — добавлен нижний паддинг на мобильных, чтобы мобильный фиксированный navbar не закрывал содержимое */}
      <main className="flex-1 p-4 md:p-6 min-h-screen pb-20 md:pb-6">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'statistics' && <Statistics />}
        {currentPage === 'reports' && <Reports />}
        {currentPage === 'settings' && <Settings />}
        {currentPage === 'users' && user.role === 'expert' && <Users />}
        {currentPage === 'objects' && user.role === 'expert' && <Objects />}
        {currentPage === 'hardware' && user.role === 'expert' && <Hardware />}
        {currentPage === 'chatbot' && <Chatbot />}
        {currentPage === 'ml' && <MLAssessment />}
      </main>
    </div>
  );
}

export default App;