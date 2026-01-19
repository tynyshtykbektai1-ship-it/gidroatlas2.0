import { BarChart3, Droplets, FileText, Settings, Users as UsersIcon, LogOut, MessageCircle, Cpu, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Page = 'dashboard' | 'statistics' | 'reports' | 'settings' | 'users' | 'objects' | 'chatbot' | 'hardware' | 'ml';

interface NavigationProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  const { user, logout } = useAuth();

  const links: { key: Page; label: string; icon: React.ReactNode; show?: boolean }[] = [
    { key: 'dashboard', label: 'Обзор', icon: <BarChart3 className="w-3 h-3" /> },
    { key: 'statistics', label: 'Статистика', icon: <Activity className="w-3 h-3" /> },
    { key: 'reports', label: 'Отчеты', icon: <FileText className="w-3 h-3" /> },
    { key: 'ml', label: 'ML-оценка', icon: <Activity className="w-3 h-3" /> },
    { key: 'settings', label: 'Настройки', icon: <Settings className="w-3 h-3" /> },
    { key: 'users', label: 'Пользователи', icon: <UsersIcon className="w-3 h-3" />, show: user?.role === 'expert' },
    { key: 'objects', label: 'Объекты', icon: <Droplets className="w-3 h-3" />, show: user?.role === 'expert' },
    { key: 'hardware', label: 'Оборудование', icon: <Cpu className="w-3 h-3" />, show: user?.role === 'expert' },
    { key: 'chatbot', label: 'Чат', icon: <MessageCircle className="w-3 h-3" /> },
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Droplets className="w-7 h-7" />
            <span className="font-bold text-lg">ГидроАтлас</span>
          </div>

          {/* Navigation Links (desktop) */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((l) =>
              (l.show ?? true) ? (
                <button
                  key={l.key}
                  onClick={() => onPageChange(l.key)}
                  className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                    currentPage === l.key ? 'bg-blue-700' : 'hover:bg-blue-500'
                  }`}
                >
                  {l.icon}
                  <span className="text-xs font-medium">{l.label}</span>
                </button>
              ) : null
            )}
          </div>

          {/* User Info and Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1">
              <div className="w-7 h-7 bg-blue-700 rounded-full flex items-center justify-center text-xs font-semibold">
                {user?.login?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-xs font-medium">{user?.login}</p>
                <p className="text-[10px] text-blue-100">{user?.role === 'expert' ? 'Эксперт' : 'Гость'}</p>
              </div>
            </div>
            <button
              onClick={() => logout()}
              className="bg-blue-700 hover:bg-blue-800 text-white px-2 py-1 rounded-lg flex items-center space-x-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline text-xs">Выход</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-1 pb-2 overflow-x-auto">
          {links.filter((l) => l.show ?? true).map((l) => (
            <button
              key={l.key}
              onClick={() => onPageChange(l.key)}
              className={`flex flex-col items-center space-y-1 px-2 py-1 rounded-lg text-[10px] whitespace-nowrap transition-colors ${
                currentPage === l.key ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              {l.icon}
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}