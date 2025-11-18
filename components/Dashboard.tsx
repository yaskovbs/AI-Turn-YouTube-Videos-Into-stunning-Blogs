// components/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { blogStorage, BlogPost, DomainSettings } from '../services/blogStorageService';
import { formatMarkdownToHtml } from '../utils/file';

interface DashboardProps {
  showToast: (message: string, type?: string) => void;
  currentUser: any;
}

const Dashboard: React.FC<DashboardProps> = ({ showToast, currentUser }) => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [domainSettings, setDomainSettings] = useState<DomainSettings | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const allBlogs = blogStorage.getAllBlogs();
      const settings = blogStorage.getDomainSettings();

      setBlogs(allBlogs);
      setDomainSettings(settings);

      if (!settings && currentUser) {
        // Initialize default domain settings
        const defaultSettings: DomainSettings = {
          userId: currentUser.id || 'default',
          isActive: false
        };
        blogStorage.saveDomainSettings(defaultSettings);
        setDomainSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showToast('Error loading dashboard data', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBlogs = searchQuery
    ? blogStorage.searchBlogs(searchQuery)
    : blogs;

  const handleDeleteBlog = (blogId: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      const success = blogStorage.deleteBlog(blogId);
      if (success) {
        setBlogs(prev => prev.filter(blog => blog.id !== blogId));
        showToast('Blog deleted successfully', 'success');
        if (selectedBlog?.id === blogId) {
          setSelectedBlog(null);
        }
      } else {
        showToast('Error deleting blog', 'error');
      }
    }
  };

  const handlePublishToggle = (blogId: string, isPublished: boolean) => {
    const updatedBlog = blogStorage.updateBlog(blogId, { isPublished: !isPublished });
    if (updatedBlog) {
      setBlogs(prev => prev.map(blog =>
        blog.id === blogId ? updatedBlog : blog
      ));
      showToast(`${isPublished ? 'Unpublished' : 'Published'} successfully`, 'success');
    }
  };

  const handleDomainSettingsUpdate = (settings: DomainSettings) => {
    blogStorage.saveDomainSettings(settings);
    setDomainSettings(settings);
    showToast('Domain settings updated', 'success');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-linear-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
          🏠 דשבורד משתמש
        </h1>
        <p className="text-gray-400">
          נהל את הבלוגים שלך והגדר את הדומיין האישי
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/30">
          <div className="text-3xl mb-2">📝</div>
          <div className="text-2xl font-bold text-cyan-400">{blogs.length}</div>
          <div className="text-gray-400 text-sm">סך הבלוגים</div>
        </div>
        <div className="bg-linear-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
          <div className="text-3xl mb-2">📢</div>
          <div className="text-2xl font-bold text-emerald-400">
            {blogs.filter(b => b.isPublished).length}
          </div>
          <div className="text-gray-400 text-sm">בלוגים מפורסמים</div>
        </div>
        <div className="bg-linear-to-br from-orange-900/30 to-yellow-900/30 rounded-2xl p-6 border border-orange-500/30">
          <div className="text-3xl mb-2">💾</div>
          <div className="text-2xl font-bold text-yellow-400">
            {blogs.filter(b => !b.isPublished).length}
          </div>
          <div className="text-gray-400 text-sm">בלוגים בטיוטה</div>
        </div>
        <div className="bg-linear-to-br from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-500/30">
          <div className="text-3xl mb-2">🌐</div>
          <div className="text-2xl font-bold text-pink-400">
            {domainSettings?.isActive ? 'פעיל' : 'לא פעיל'}
          </div>
          <div className="text-gray-400 text-sm">דומיין מותאם</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="חפש בלוגים..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 rounded-xl border border-gray-600 focus:border-purple-400 focus:outline-none text-white placeholder-gray-400"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-4 py-3 rounded-xl border transition-colors ${
              viewMode === 'grid'
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ≡≡
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-3 rounded-xl border transition-colors ${
              viewMode === 'list'
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'
            }`}
          >
            ☰☰
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Blog List/Grid */}
        <div className="lg:col-span-2">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 rounded-2xl">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchQuery ? 'לא נמצאו בלוגים תואמים' : 'אין בלוגים עדיין'}
              </h3>
              <p className="text-gray-500">
                {searchQuery ? 'נסה לשנות את החיפוש' : 'התחל להמיר סרטוני יוטיוב לבלוגים'}
              </p>
            </div>
          ) : (
            <div className={`grid gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1'
            }`}>
              {filteredBlogs.map(blog => (
                <div
                  key={blog.id}
                  className={`bg-gray-800 rounded-2xl border transition-all cursor-pointer ${
                    selectedBlog?.id === blog.id
                      ? 'border-purple-400 shadow-lg shadow-purple-500/20'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedBlog(blog)}
                >
                  <div className="p-6">
                    {/* Video Thumbnail */}
                    {blog.videoEmbedUrl ? (
                      <div className="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
                        <iframe
                          src={blog.videoEmbedUrl}
                          title={blog.videoTitle}
                          className="w-full h-full"
                          frameBorder="0"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-linear-to-br from-purple-900 to-cyan-900 rounded-lg mb-4 flex items-center justify-center">
                        <div className="text-4xl">🎥</div>
                      </div>
                    )}

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {blog.videoTitle}
                    </h3>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        blog.isPublished
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {blog.isPublished ? 'פורסם' : 'טיוטה'}
                      </span>
                    </div>

                    {viewMode === 'list' && (
                      <>
                      <div className="text-gray-300 text-sm mb-4 line-clamp-3">
                        {blog.blogContent.substring(0, 200)}...
                      </div>
                      {blog.isPublished && domainSettings && (
                        <div className="text-sm text-purple-300 mb-4">
                          <span className="font-semibold">כתובת הבלוג:</span>
                          {domainSettings && (domainSettings.customDomain || domainSettings.subdomain) ? (
                            <a
                              href={domainSettings.customDomain
                                ? `https://${domainSettings.customDomain}/${blog.id}`
                                : `https://${domainSettings.subdomain}.blog.ai/${blog.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-300 hover:text-purple-100 underline ml-2 break-all"
                            >
                              {domainSettings.customDomain
                                ? `${domainSettings.customDomain}/${blog.id}`
                                : `${domainSettings.subdomain}.blog.ai/${blog.id}`}
                            </a>
                          ) : (
                            <span className="text-gray-400 ml-2">הגדר דומיין בדשבורד להצגת כתובת אמיתית</span>
                          )}
                        </div>
                      )}
                      </>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePublishToggle(blog.id, blog.isPublished);
                        }}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                          blog.isPublished
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                        }`}
                      >
                        {blog.isPublished ? 'בטל פרסום' : 'פרסם'}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteBlog(blog.id);
                        }}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Domain Settings & Selected Blog Details */}
        <div className="space-y-6">
          {/* Domain Settings */}
          <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">⚙️ הגדרות דומיין</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  תת-דומיין מותאם
                </label>
                <input
                  type="text"
                  value={domainSettings?.subdomain || ''}
                  onChange={(e) => {
                    const newSettings = {
                      ...domainSettings,
                      userId: currentUser?.id || 'default',
                      subdomain: e.target.value,
                      isActive: !!e.target.value
                    };
                    setDomainSettings(newSettings as DomainSettings);
                  }}
                  placeholder="myblog"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
                {domainSettings?.subdomain && (
                  <p className="text-sm text-gray-400 mt-2">
                    יופיע כ: https://{domainSettings.subdomain}.yourblogsite.com
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  דומיין מותאם (אופציונלי)
                </label>
                <input
                  type="text"
                  value={domainSettings?.customDomain || ''}
                  onChange={(e) => {
                    const newSettings = {
                      ...domainSettings,
                      userId: currentUser?.id || 'default',
                      customDomain: e.target.value
                    };
                    setDomainSettings(newSettings as DomainSettings);
                  }}
                  placeholder="myblog.com"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                />
              </div>

              <button
                onClick={() => domainSettings && handleDomainSettingsUpdate(domainSettings)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                שמור הגדרות
              </button>
            </div>
          </div>

          {/* Selected Blog Details */}
          {selectedBlog && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-purple-400 shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">📄 פרטי הבלוג</h3>
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-purple-400 mb-2">{selectedBlog.videoTitle}</h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>קהל יעד: {selectedBlog.targetAudience}</p>
                    <p>טון: {selectedBlog.desiredTone}</p>
                    <p>נוצר: {formatDate(selectedBlog.createdAt)}</p>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h5 className="font-semibold text-gray-300 mb-2">תוכן הבלוג:</h5>
                  <div
                    className="text-sm text-gray-300 prose prose-invert max-w-none line-clamp-6"
                    dangerouslySetInnerHTML={{
                      __html: formatMarkdownToHtml(selectedBlog.blogContent)
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
