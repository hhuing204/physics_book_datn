'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface VariableDefinition {
  min: number
  max: number
  type: 'int' | 'float'
  decimals?: number
}

interface ExerciseBlueprint {
  id: number
  lessonId: string
  chapterId: string
  type: 'multiple-choice' | 'calculation'
  questionTemplate: string
  correctAnswerTemplate: string
  explanationTemplate: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  category: string
  variables?: Record<string, VariableDefinition | string>
}

export default function AdminExerciseBlueprints() {
  const { user } = useAuth()
  const router = useRouter()
  const [blueprints, setBlueprints] = useState<ExerciseBlueprint[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingBlueprint, setEditingBlueprint] = useState<ExerciseBlueprint | null>(null)
  const [filterLesson, setFilterLesson] = useState<string>('')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)
  const [newVarName, setNewVarName] = useState('')
  const [lessons, setLessons] = useState<Array<{
    id: string
    title?: string
    chapterId: string
    chapterOrder?: number
    chapterTitle?: string
  }>>([])

  const [formData, setFormData] = useState({
    lessonId: '1',
    type: 'multiple-choice' as 'multiple-choice' | 'calculation',
    questionTemplate: '',
    correctAnswerTemplate: '',
    explanationTemplate: '',
    difficulty: 'basic' as 'basic' | 'intermediate' | 'advanced',
    category: '',
    variables: {} as Record<string, VariableDefinition | string>
  })

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const res = await fetch('/api/chapters')
        if (!res.ok) {
          console.error('Failed to fetch chapters for lessons filter')
          return
        }

        const chapters = await res.json()
        if (!Array.isArray(chapters)) {
          return
        }

        const lessonOptions = chapters.flatMap((chapter: any) => {
          if (!Array.isArray(chapter.lessons)) return []
          return chapter.lessons.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            chapterId: chapter.id || chapter.chapterId || '',
            chapterOrder: chapter.order,
            chapterTitle: chapter.title
          }))
        })

        lessonOptions.sort((a, b) => {
          const chapterOrderA = a.chapterOrder ?? 0
          const chapterOrderB = b.chapterOrder ?? 0
          if (chapterOrderA !== chapterOrderB) return chapterOrderA - chapterOrderB
          return Number(a.id) - Number(b.id)
        })

        setLessons(lessonOptions)
      } catch (error) {
        console.error('Error fetching chapters for lessons filter:', error)
      }
    }

    fetchLessons()

    if (user && (user.role || '').toLowerCase() !== 'teacher') {
      router.push('/')
      return
    }
    if (user) {
      loadBlueprints()
    }
  }, [user, router])

  const loadBlueprints = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/admin/exercise-blueprints', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setBlueprints(data.blueprints)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error loading exercise blueprints:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.questionTemplate.trim() || !formData.explanationTemplate.trim() || !formData.category.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    if (!formData.correctAnswerTemplate.trim()) {
      alert('Vui lòng điền đáp án đúng!')
      return
    }

    try {
      const token = localStorage.getItem('auth_token')
      const method = editingBlueprint ? 'PUT' : 'POST'
      const url = '/api/admin/exercise-blueprints'

      // Generate a numeric ID if creating a new blueprint
      const newId = editingBlueprint
        ? editingBlueprint.id
        : Math.max(0, ...blueprints.map(bp => bp.id)) + 1 // simple auto-increment

      const payload = {
        id: newId,
        lessonId: formData.lessonId,
        chapterId: lessons.find(l => l.id === formData.lessonId)?.chapterId || '',
        type: formData.type,
        questionTemplate: formData.questionTemplate,
        correctAnswerTemplate: formData.correctAnswerTemplate,
        explanationTemplate: formData.explanationTemplate,
        difficulty: formData.difficulty,
        category: formData.category,
        variables: Object.fromEntries(
          Object.entries(formData.variables).map(([key, varDef]) => {
            if (typeof varDef === 'object' && varDef.type === 'int') {
              const { decimals, ...rest } = varDef
              return [key, rest]
            }
            return [key, varDef]
          })
        )
      }

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success) {
        alert(editingBlueprint ? 'Cập nhật dạng bài tập thành công!' : 'Thêm dạng bài tập thành công!')
        setShowAddModal(false)
        setEditingBlueprint(null)
        resetForm()
        loadBlueprints()
      } else {
        alert(data.message || 'Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error saving exercise blueprint:', error)
      alert('Có lỗi xảy ra khi lưu dạng bài tập!')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa dạng bài tập này?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/admin/exercise-blueprints?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = await res.json()

      if (data.success) {
        alert('Xóa dạng bài tập thành công!')
        loadBlueprints()
      } else {
        alert(data.message || 'Có lỗi xảy ra!')
      }
    } catch (error) {
      console.error('Error deleting exercise blueprint:', error)
      alert('Có lỗi xảy ra khi xóa dạng bài tập!')
    }
  }

  const handleEdit = (blueprint: ExerciseBlueprint) => {
    setEditingBlueprint(blueprint)
    setFormData({
      lessonId: blueprint.lessonId,
      type: blueprint.type,
      questionTemplate: blueprint.questionTemplate,
      correctAnswerTemplate: blueprint.correctAnswerTemplate,
      explanationTemplate: blueprint.explanationTemplate,
      difficulty: blueprint.difficulty,
      category: blueprint.category,
      variables: blueprint.variables || {}
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      lessonId: '1',
      type: 'multiple-choice',
      questionTemplate: '',
      correctAnswerTemplate: '',
      explanationTemplate: '',
      difficulty: 'basic',
      category: '',
      variables: {}
    })
    setNewVarName('')
  }

  const filteredBlueprints = blueprints.filter(bp => {
    if (filterLesson && bp.lessonId !== filterLesson) return false
    if (filterDifficulty !== 'all' && bp.difficulty !== filterDifficulty) return false
    if (filterType !== 'all' && bp.type !== filterType) return false
    if (filterCategory !== 'all' && bp.category !== filterCategory) return false
    if (searchQuery && !(
      bp.questionTemplate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bp.category.toLowerCase().includes(searchQuery.toLowerCase())
    )) return false
    return true
  })

  const totalPages = Math.ceil(filteredBlueprints.length / pageSize)
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedBlueprints = filteredBlueprints.slice(startIndex, endIndex)

  const handleFilterChange = () => setPage(1)

  if (!user || (user.role || '').toLowerCase() !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Truy cập bị từ chối</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải...</p>
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
                Quản lý Dạng Bài Tập
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Tổng số: {filteredBlueprints.length} dạng bài tập {filteredBlueprints.length !== blueprints.length && `(đã lọc từ ${blueprints.length})`}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                ← Dashboard
              </button>
              <button
                onClick={() => {
                  setEditingBlueprint(null)
                  resetForm()
                  setShowAddModal(true)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm Dạng Bài Tập
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bài học
              </label>
              <select
                value={filterLesson}
                onChange={(e) => {
                  setFilterLesson(e.target.value)
                  handleFilterChange()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Chọn bài học</option>
                {lessons.map((lesson: any) => (
                  <option key={lesson.id} value={lesson.id}>
                    {`Bài ${lesson.id}: ${lesson.title || lesson.id} - Chương ${lesson.chapterOrder ?? lesson.chapterId}: ${lesson.chapterTitle || lesson.chapterId}`}
                  </option>
                ))}
              </select>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Loại
                </label>
                <select
                  value={filterType}
                  onChange={(e) => {
                    setFilterType(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tất cả</option>
                  <option value="multiple-choice">Trắc nghiệm</option>
                  <option value="calculation">Tính toán</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ khó
              </label>
              <select
                value={filterDifficulty}
                onChange={(e) => {
                  setFilterDifficulty(e.target.value)
                  handleFilterChange()
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">Tất cả</option>
                <option value="basic">Cơ bản</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Danh mục
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => {
                    setFilterCategory(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">Tất cả</option>
                  {Array.from(new Set(blueprints.map(bp => bp.category))).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleFilterChange()
                  }}
                  placeholder="Tìm mẫu câu hỏi..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Reset Filters */}
              <div className="mt-auto">
                <button
                  onClick={() => {
                    setFilterLesson('')
                    setFilterDifficulty('all')
                    setFilterType('all')
                    setFilterCategory('all')
                    setSearchQuery('')
                    handleFilterChange()
                  }}
                  className="w-full px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Blueprint List */}
        <div className="space-y-4">
          {paginatedBlueprints.map((blueprint) => (
            <div key={blueprint.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="px-2 py-1 text-xs font-medium rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                      Bài {blueprint.lessonId}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${blueprint.difficulty === 'basic'
                      ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                      : blueprint.difficulty === 'intermediate'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      }`}>
                      {blueprint.difficulty === 'basic' ? 'Cơ bản' : blueprint.difficulty === 'intermediate' ? 'Trung bình' : 'Nâng cao'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {blueprint.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {blueprint.type === 'multiple-choice' ? 'Trắc nghiệm' : blueprint.type === 'calculation' ? 'Tính toán' : 'Đúng/Sai'}
                    </span>
                  </div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Mẫu câu hỏi: {blueprint.questionTemplate}
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Mẫu đáp án: {blueprint.correctAnswerTemplate}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Mẫu giải thích: {blueprint.explanationTemplate}
                  </p>
                  {blueprint.variables && Object.keys(blueprint.variables).length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {blueprint.type === 'calculation' ? 'Biến:' : 'Lựa chọn:'}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(blueprint.variables).map(([key, varDef]) => (
                          <span
                            key={key}
                            className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded"
                          >
                            {blueprint.type === 'calculation' && typeof varDef === 'object' && varDef !== null
                              ? `${key}: ${varDef.min}-${varDef.max} (${varDef.type}${varDef.decimals ? `, ${varDef.decimals}dp` : ''})`
                              : `${key}: ${varDef}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(blueprint)}
                    className="px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(blueprint.id)}
                    className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
          {paginatedBlueprints.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">Không tìm thấy dạng bài tập nào</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="text-sm text-gray-700 dark:text-gray-300"></div>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                ««
              </button>
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                « Trước
              </button>

              <span className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {page} / {totalPages}
              </span>

              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Tiếp »
              </button>
              <button
                onClick={() => setPage(totalPages)}
                disabled={page === totalPages}
                className="px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                »»
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              {editingBlueprint ? 'Sửa Dạng Bài Tập' : 'Thêm Dạng Bài Tập'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Lesson */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bài học</label>
                <select
                  value={formData.lessonId}
                  onChange={e => setFormData({ ...formData, lessonId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {lessons.map(lesson => (
                    <option key={lesson.id} value={lesson.id}>
                      Bài {lesson.id} - {lesson.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Loại</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as 'multiple-choice' | 'calculation' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="multiple-choice">Trắc nghiệm</option>
                  <option value="calculation">Tính toán</option>
                </select>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Độ khó</label>
                <select
                  value={formData.difficulty}
                  onChange={e => setFormData({ ...formData, difficulty: e.target.value as 'basic' | 'intermediate' | 'advanced' })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="basic">Cơ bản</option>
                  <option value="intermediate">Trung bình</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Danh mục</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* Question Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mẫu câu hỏi</label>
                <textarea
                  value={formData.questionTemplate}
                  onChange={e => setFormData({ ...formData, questionTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Correct Answer Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mẫu đáp án đúng</label>
                <textarea
                  value={formData.correctAnswerTemplate}
                  onChange={e => setFormData({ ...formData, correctAnswerTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={2}
                />
              </div>

              {/* Explanation Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mẫu giải thích</label>
                <textarea
                  value={formData.explanationTemplate}
                  onChange={e => setFormData({ ...formData, explanationTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
              </div>

              {/* Variables */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.type === 'calculation' ? 'Biến' : 'Lựa chọn'}
                </label>
                <div>
                  <div className="space-y-2">
                    {formData.type === 'calculation' ? (
                      Object.entries(formData.variables).map(([varName, varDef]) => (
                        <div key={varName} className="grid grid-cols-7 gap-2 items-center">
                          {/* Variable Name */}
                          <input
                            type="text"
                            value={varName}
                            readOnly
                            className="px-2 py-1 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                          />

                          {/* Min */}
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null ? varDef.min : ''}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null) {
                                const value = parseFloat(e.target.value)
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, min: value } }
                                })
                              }
                            }}
                            placeholder="Min"
                            className="px-2 py-1 border rounded-lg w-full"
                            disabled={typeof varDef !== 'object' || varDef === null}
                          />

                          {/* Max */}
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null ? varDef.max : ''}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null) {
                                const value = parseFloat(e.target.value)
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, max: value } }
                                })
                              }
                            }}
                            placeholder="Max"
                            className="px-2 py-1 border rounded-lg w-full"
                            disabled={typeof varDef !== 'object' || varDef === null}
                          />

                          {/* Type */}
                          <select
                            value={typeof varDef === 'object' && varDef !== null ? varDef.type : 'int'}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null) {
                                const value = e.target.value as 'int' | 'float'
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, type: value } }
                                })
                              }
                            }}
                            className="px-2 py-1 border rounded-lg w-full col-span-2"
                            disabled={typeof varDef !== 'object' || varDef === null}
                          >
                            <option value="int">Số nguyên</option>
                            <option value="float">Số thập phân</option>
                          </select>

                          {/* Decimals */}
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null && varDef.type === 'float' ? varDef.decimals ?? 2 : 0}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null && varDef.type === 'float') {
                                const value = parseInt(e.target.value) || 0
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, decimals: value } }
                                })
                              }
                            }}
                            placeholder="Decimals"
                            className={`px-2 py-1 border rounded-lg w-full ${typeof varDef === 'object' && varDef !== null && varDef.type === 'int' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
                            readOnly={typeof varDef === 'object' && varDef !== null && varDef.type === 'int'}
                            disabled={typeof varDef !== 'object' || varDef === null}
                          />

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => {
                              const newVars = { ...formData.variables }
                              delete newVars[varName]
                              setFormData({ ...formData, variables: newVars })
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded-lg"
                          >
                            Xóa
                          </button>
                        </div>
                      ))
                    ) : (
                      Object.entries(formData.variables).map(([optionName, optionValue]) => (
                        <div key={optionName} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={optionName}
                            readOnly
                            className="px-2 py-1 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                          />
                          <input
                            type="text"
                            value={optionValue as string}
                            onChange={(e) => {
                              const value = e.target.value
                              setFormData({
                                ...formData,
                                variables: { ...formData.variables, [optionName]: value }
                              })
                            }}
                            placeholder="Giá trị lựa chọn"
                            className="px-2 py-1 border rounded-lg w-full"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = { ...formData.variables }
                              delete newOptions[optionName]
                              setFormData({ ...formData, variables: newOptions })
                            }}
                            className="px-2 py-1 bg-red-500 text-white rounded-lg"
                          >
                            Xóa
                          </button>
                        </div>
                      ))
                    )}

                    {/* Add New Variable/Option */}
                    <div className="flex gap-2 mt-2">
                      <input
                        type="text"
                        placeholder={formData.type === 'calculation' ? "Tên biến" : "Tên lựa chọn"}
                        value={newVarName}
                        onChange={(e) => setNewVarName(e.target.value)}
                        className="px-2 py-1 border rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newVarName.trim()) return
                          if (formData.variables[newVarName]) {
                            alert(formData.type === 'calculation' ? 'Biến đã tồn tại!' : 'Lựa chọn đã tồn tại!')
                            return
                          }
                          setFormData({
                            ...formData,
                            variables: {
                              ...formData.variables,
                              [newVarName]: formData.type === 'calculation'
                                ? { min: 0, max: 10, type: 'int' }
                                : ''
                            }
                          })
                          setNewVarName('')
                        }}
                        className="px-3 py-1 bg-green-500 text-white rounded-lg"
                      >
                        {formData.type === 'calculation' ? 'Thêm biến' : 'Thêm lựa chọn'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false)
                    setEditingBlueprint(null)
                    resetForm()
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
