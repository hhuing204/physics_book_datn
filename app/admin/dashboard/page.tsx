'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface Stats {
  users: {
    total: number
    active: number
    newThisMonth: number
  }
  chapters: {
    total: number
    published: number
    drafts: number
  }
  lessons: {
    total: number
  }
  progress: {
    totalRecords: number
    averageCompletion: number
    activeUsers: number
  }
}

interface User {
  _id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
  lessonsCompleted: number
  practiceTestsDone: number
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentUsers, setRecentUsers] = useState<User[]>([])
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  // Chọn/bỏ chọn 1 user
  const handleSelectUser = (userId: string) => {
    setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  // Chọn/bỏ chọn tất cả user trên trang hiện tại
  const handleSelectAll = () => {
    if (recentUsers.every(u => selectedUserIds.includes(u._id))) {
      setSelectedUserIds(prev => prev.filter(id => !recentUsers.some(u => u._id === id)));
    } else {
      setSelectedUserIds(prev => ([...prev, ...recentUsers.filter(u => !prev.includes(u._id)).map(u => u._id)]));
    }
  };

  // Xóa hàng loạt user
  const handleDeleteSelected = async () => {
    if (!selectedUserIds.length) return;
    if (!confirm('Bạn có chắc chắn muốn xóa các tài khoản đã chọn?')) return;
    try {
      const token = localStorage.getItem('auth_token');
      // Xóa đồng thời tất cả user
      const results = await Promise.all(selectedUserIds.map(userId =>
        fetch(`/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        }).then(res => res.json())
      ));
      const allSuccess = results.every(r => r.success);
      setSelectedUserIds([]);
      if (allSuccess) {
        alert('Đã xóa tất cả tài khoản đã chọn thành công!');
      } else {
        alert('Có một số tài khoản xóa thất bại!');
      }
      // Sau khi xóa, tính lại tổng số user và trang hợp lệ
      const newTotal = totalUsers - selectedUserIds.length;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
      // Nếu page hiện tại lớn hơn tổng số trang mới, chuyển về trang cuối cùng hợp lệ
      if (page > newTotalPages) {
        setPage(newTotalPages);
      } else {
        // Reload lại trang hiện tại để lấp đầy bảng bằng user phía sau
        loadDashboardData(page);
      }
    } catch (err) {
      alert('Có lỗi xảy ra khi xóa tài khoản');
    }
  };
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)

  const totalPages = Math.max(1, Math.ceil(totalUsers / pageSize));

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/')
      return
    }
    if (user) {
      loadDashboardData(page)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page])

  const loadDashboardData = async (pageNum = 1) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/')
        return
      }
      // Load statistics
      const statsRes = await fetch('/api/admin/dashboard/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const statsData = await statsRes.json()
      if (statsData.message === 'Unauthorized - Admin access required') {
        router.push('/')
        return
      }
      if (statsData.success) {
        setStats(statsData.stats)
      }
      // Load paginated users, sorted by name
      const usersRes = await fetch(`/api/admin/dashboard/recent-users?page=${pageNum}&pageSize=${pageSize}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const usersData = await usersRes.json()
      if (usersData.success) {
        // Sau khi loadDashboardData xong và setRecentUsers(usersData.users):
        if (selectedUserIds.length > 0) {
          setRecentUsers(usersData.users.filter(function (u: User) { return !selectedUserIds.includes(u._id); }));
        } else {
          setRecentUsers(usersData.users);
        }
        setTotalUsers(usersData.total)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
      setLoading(false)
      router.push('/')
    }
  }

  // Xóa user (chỉ user thường)
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) return
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setRecentUsers(prev => prev.filter(u => u._id !== userId))
        alert('Xóa tài khoản thành công!')
      } else {
        alert(data.message || 'Xóa thất bại!')
      }
    } catch (err) {
      console.error('Delete user error', err)
      alert('Có lỗi xảy ra khi xóa tài khoản')
    }
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-lock text-4xl text-red-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Truy cập bị từ chối</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-500 mb-4"></i>
          <p className="text-gray-600 dark:text-gray-400">Đang tải bảng điều khiển...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Bảng Điều Khiển Quản Trị
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Chào mừng trở lại, {user.name}
              </p>
            </div>
            <div className="flex gap-3">
              <a
                href="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center"
              >
                <i className="fas fa-home mr-2"></i>
                Về Trang Chủ
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {/* Total Users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900 rounded-md p-3">
                  <i className="fas fa-users text-2xl text-blue-600 dark:text-blue-400"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng Người <br />
                      Dùng
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.users.total}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {stats.users.active}
                </span>{' '}
                đang hoạt động
              </div>
            </div>

            {/* New Users */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 dark:bg-green-900 rounded-md p-3">
                  <i className="fas fa-user-plus text-2xl text-green-600 dark:text-green-400"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Mới Tháng Này
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.users.newThisMonth}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Total Chapters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md p-3">
                  <i className="fas fa-book text-2xl text-purple-600 dark:text-purple-400"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng Chương
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.chapters.total}
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-green-600 dark:text-green-400 font-medium">
                  {stats.chapters.published}
                </span>{' '}
                đã xuất bản
              </div>
            </div>

            {/* Total Lessons */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-orange-100 dark:bg-orange-900 rounded-md p-3">
                  <i className="fas fa-list-ol text-2xl text-orange-600 dark:text-orange-400"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tổng Bài Học
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.lessons.total}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>

            {/* Average Progress */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 dark:bg-yellow-900 rounded-md p-3">
                  <i className="fas fa-chart-line text-2xl text-yellow-600 dark:text-yellow-400"></i>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                      Tiến Độ TB
                    </dt>
                    <dd className="text-3xl font-semibold text-gray-900 dark:text-white">
                      {stats.progress.averageCompletion}%
                    </dd>
                  </dl>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="text-blue-600 dark:text-blue-400 font-medium">
                  {stats.progress.activeUsers}
                </span>{' '}
                học viên hoạt động
              </div>
            </div>
          </div>
        )}

        {/* Recent Users Table */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Người Dùng Gần Đây
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={recentUsers.length > 0 && recentUsers.every(u => selectedUserIds.includes(u._id))}
                      onChange={handleSelectAll}
                      aria-label="Chọn tất cả"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    TÊN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    EMAIL
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    VAI TRÒ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    TIÉN ĐỘ LÝ THUYẾT
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    QUÁ TRÌNH LUYỆN TẬP
                  </th>
                  <th className="pl-4 pr-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    TRẠNG THÁI
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    NGÀY THAM GIA
                  </th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {recentUsers.map((user) => (
                  <tr key={user._id}>
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.role === 'admin' ? 'Ẩn' : user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="pl-6 pr-4 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs text-right leading-5 font-semibold rounded-full ${user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                      {user.lessonsCompleted || 0} / {stats?.lessons.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                      {user.practiceTestsDone || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                        {user.isActive ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500 dark:text-gray-400">
                      {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    {(user.role || '').toLowerCase() === 'learner' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded transition-colors"
                        >
                          Xóa
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Bulk delete button */}
          <div className="flex items-center gap-4 px-6 py-2">
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={selectedUserIds.length === 0}
              onClick={handleDeleteSelected}
            >
              Xóa đã chọn
            </button>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {selectedUserIds.length > 0 ? `${selectedUserIds.length} tài khoản được chọn` : ''}
            </span>
          </div>
          {/* Pagination */}
          <div className="flex justify-end items-center gap-2 px-6 py-4">
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Trang trước
            </button>
            <span className="mx-2">
              Trang {page} / {totalPages}
            </span>
            <button
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 disabled:opacity-50"
              onClick={() => setPage(page + 1)}
              disabled={page * pageSize >= totalUsers}
            >
              Trang sau
            </button>
          </div>
        </div>


      </div>
    </div>
  )
}
