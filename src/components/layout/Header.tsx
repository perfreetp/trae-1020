import { Bell, User, Search, X, MapPin, Cpu, AlertTriangle } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

export const Header = () => {
  const { 
    getPendingAlertsCount, 
    searchKeyword, 
    searchResults, 
    showSearchResults,
    setSearchKeyword,
    setShowSearchResults,
    performSearch,
    setSelectedPondId
  } = useStore();
  const pendingCount = getPendingAlertsCount();
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSearchResults]);

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    performSearch(value);
  };

  const handleResultClick = (result: typeof searchResults[0]) => {
    setShowSearchResults(false);
    setSearchKeyword('');
    
    if (result.type === 'pond') {
      setSelectedPondId(result.id);
      navigate(`/pond?id=${result.id}`);
    } else if (result.type === 'device') {
      navigate('/device');
    } else if (result.type === 'alert') {
      navigate('/alert');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pond': return <MapPin className="w-4 h-4 text-primary-500" />;
      case 'device': return <Cpu className="w-4 h-4 text-secondary-500" />;
      case 'alert': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      default: return <Search className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'pond': return '塘口';
      case 'device': return '设备';
      case 'alert': return '告警';
      default: return '其他';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="relative" ref={searchRef}>
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索塘口、设备、告警..."
            value={searchKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            onFocus={() => searchKeyword && setShowSearchResults(true)}
            className="w-80 pl-10 pr-10 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword('');
                setShowSearchResults(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {showSearchResults && searchKeyword && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="py-2">
                  <p className="px-4 py-1 text-xs font-medium text-gray-500">找到 {searchResults.length} 条结果</p>
                  {searchResults.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{result.title}</p>
                        <p className="text-xs text-gray-500 truncate">{result.description}</p>
                      </div>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                        {getTypeLabel(result.type)}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center">
                  <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">未找到相关结果</p>
                  <p className="text-xs text-gray-400 mt-1">请尝试其他关键词</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/alert')}
          className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>

        <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
          <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-800">管理员</p>
            <p className="text-xs text-gray-500">合作社管理员</p>
          </div>
        </div>
      </div>
    </header>
  );
};
