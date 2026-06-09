'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface VariableDefinition {
  min: number
  max: number
  type: 'int' | 'float'
  decimals?: number
}

interface TheoreticalOption {
  name: string
  value: string
}

type BlueprintType = 'theoretical' | 'calculation'
type BlueprintVariableValue = VariableDefinition | TheoreticalOption[] | string

interface ExerciseBlueprint {
  id: number
  lessonId: string
  chapterId: string
  type: BlueprintType
  questionTemplate: string
  correctAnswerTemplate: string[]
  explanationTemplate: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  category: string
  variables?: Record<string, BlueprintVariableValue>
}

interface PracticeTestSummary {
  _id?: string
  accessCode: string
  lessonId?: string | null
  chapterId?: string | null
  timeAlloted?: number
  exercises?: Array<{
    question?: string
    explanation?: string
    category?: string
  }>
  createdAt?: string
}

interface PracticePreviewExercise {
  id?: number
  chapterId: string
  lessonId: string
  lessonTitle: string
  type: 'multiple-choice' | 'fill-in'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty: 'basic' | 'intermediate' | 'advanced'
  category: string
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
  const [answerError, setAnswerError] = useState<string>('')
  const [answerInput, setAnswerInput] = useState('')
  const questionTemplateRef = useRef<HTMLTextAreaElement | null>(null)
  const [lessons, setLessons] = useState<Array<{
    id: string
    title?: string
    chapterId: string
    chapterOrder?: number
    chapterTitle?: string
  }>>([])

  const [formData, setFormData] = useState({
    lessonId: '1',
    type: 'theoretical' as BlueprintType,
    questionTemplate: '',
    correctAnswerTemplate: [] as string[],
    explanationTemplate: '',
    difficulty: 'basic' as 'basic' | 'intermediate' | 'advanced',
    category: '',
    variables: {} as Record<string, BlueprintVariableValue>
  })
  const [showPracticeTestModal, setShowPracticeTestModal] = useState(false)
  const [practiceBlueprintLessonFilter, setPracticeBlueprintLessonFilter] = useState('')
  const [selectedBlueprintIds, setSelectedBlueprintIds] = useState<number[]>([])
  const [practicePreviewExercises, setPracticePreviewExercises] = useState<PracticePreviewExercise[]>([])
  const [practicePreviewLoading, setPracticePreviewLoading] = useState(false)
  const [practicePreviewStep, setPracticePreviewStep] = useState<'select' | 'preview'>('select')
  const [practiceTests, setPracticeTests] = useState<PracticeTestSummary[]>([])
  const [practiceTestTimeAlloted, setPracticeTestTimeAlloted] = useState(30)
  const [practiceTestQuestionCount, setPracticeTestQuestionCount] = useState(10)
  const [practiceTestDifficulty, setPracticeTestDifficulty] = useState('all')
  const [practiceTestError, setPracticeTestError] = useState('')

  const loadPracticeTests = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/practice-tests?list=true', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setPracticeTests(data.tests || [])
      }
    } catch (error) {
      console.error('Error loading practice tests:', error)
    }
  }

  const toggleBlueprintSelection = (blueprintId: number) => {
    setSelectedBlueprintIds((prev) => (
      prev.includes(blueprintId)
        ? prev.filter((id) => id !== blueprintId)
        : [...prev, blueprintId]
    ))
  }

  const generatePracticePreview = async () => {
    if (!selectedBlueprintIds.length) {
      setPracticeTestError('Vui lòng chọn ít nhất một dạng bài tập để tạo đề')
      return
    }

    try {
      setPracticePreviewLoading(true)
      setPracticeTestError('')
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/practice-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          blueprintIds: selectedBlueprintIds,
          previewOnly: true,
          timeAlloted: practiceTestTimeAlloted,
          numQuestions: practiceTestQuestionCount,
          difficulty: practiceTestDifficulty
        })
      })

      const data = await res.json()
      if (data.success) {
        setPracticePreviewExercises((data.exercises || []).map((exercise: PracticePreviewExercise) => ({
          ...exercise,
          correctAnswer: String(exercise.correctAnswer ?? '')
        })))
        setPracticePreviewStep('preview')
      } else {
        setPracticeTestError(data.message || 'Không thể tạo bản xem trước đề')
      }
    } catch (error) {
      console.error('Error generating practice preview:', error)
      setPracticeTestError('Có lỗi khi tạo bản xem trước đề')
    } finally {
      setPracticePreviewLoading(false)
    }
  }

  const updatePreviewExerciseField = (index: number, field: 'question' | 'explanation' | 'correctAnswer', value: string) => {
    setPracticePreviewExercises((prev) => prev.map((exercise, exerciseIndex) => {
      if (exerciseIndex !== index) return exercise
      if (field === 'correctAnswer') {
        return { ...exercise, correctAnswer: value }
      }
      return { ...exercise, [field]: value }
    }))
  }

  const confirmPracticeTestCreation = async () => {
    if (!practicePreviewExercises.length) {
      setPracticeTestError('Bản xem trước chưa có câu hỏi nào')
      return
    }

    try {
      setPracticePreviewLoading(true)
      setPracticeTestError('')
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/practice-tests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          previewExercises: practicePreviewExercises,
          timeAlloted: practiceTestTimeAlloted,
          numQuestions: practiceTestQuestionCount,
          difficulty: practiceTestDifficulty,
          lessonId: practicePreviewExercises[0]?.lessonId || null,
          chapterId: practicePreviewExercises[0]?.chapterId || null
        })
      })

      const data = await res.json()
      if (data.success) {
        alert('Tạo đề luyện tập thành công!')
        setShowPracticeTestModal(false)
        setPracticePreviewStep('select')
        setPracticePreviewExercises([])
        setSelectedBlueprintIds([])
        setPracticeBlueprintLessonFilter('')
        setPracticeTestTimeAlloted(30)
        setPracticeTestQuestionCount(10)
        setPracticeTestDifficulty('all')
        setPracticeTestError('')
        loadPracticeTests()
      } else {
        setPracticeTestError(data.message || 'Không thể tạo đề luyện tập')
      }
    } catch (error) {
      console.error('Error creating practice test:', error)
      setPracticeTestError('Có lỗi khi lưu đề luyện tập')
    } finally {
      setPracticePreviewLoading(false)
    }
  }

  const filteredPracticeBlueprints = blueprints.filter((blueprint) => {
    if (!practiceBlueprintLessonFilter) return true
    return blueprint.lessonId === practiceBlueprintLessonFilter
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
      loadPracticeTests()
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

  const normalizeVariables = (value: Record<string, any> | undefined, type: BlueprintType) => {
    if (type === 'calculation') {
      return Object.entries(value || {}).reduce((acc, [key, item]) => {
        if (item && typeof item === 'object' && 'min' in item && 'max' in item) {
          acc[key] = item as VariableDefinition
        } else {
          acc[key] = { min: 0, max: 10, type: 'int' } as VariableDefinition
        }
        return acc
      }, {} as Record<string, BlueprintVariableValue>)
    }

    return Object.entries(value || {}).reduce((acc, [key, item]) => {
      if (Array.isArray(item)) {
        acc[key] = item.map((option: any) => ({
          name: typeof option?.name === 'string' ? option.name : '',
          value: typeof option?.value === 'string' ? option.value : ''
        })) as TheoreticalOption[]
      } else {
        acc[key] = [] as TheoreticalOption[]
      }

      return acc
    }, {} as Record<string, BlueprintVariableValue>)
  }

  const insertBlankIntoQuestion = () => {
    const textarea = questionTemplateRef.current
    if (!textarea) return

    const start = textarea.selectionStart ?? formData.questionTemplate.length
    const end = textarea.selectionEnd ?? formData.questionTemplate.length
    const nextValue = `${formData.questionTemplate.slice(0, start)}__${formData.questionTemplate.slice(end)}`
    setFormData(prev => ({ ...prev, questionTemplate: nextValue }))

    requestAnimationFrame(() => {
      textarea.focus()
      const cursorPosition = start + 2
      textarea.setSelectionRange(cursorPosition, cursorPosition)
    })
  }

  const updateTheoreticalBlankName = (oldName: string, nextName: string) => {
    if (!nextName.trim()) return
    if (oldName === nextName) return
    if (formData.variables[nextName]) {
      alert('Tên chỗ trống đã tồn tại!')
      return
    }

    const nextVariables = { ...formData.variables }
    const currentValue = nextVariables[oldName]
    delete nextVariables[oldName]
    nextVariables[nextName] = currentValue
    setFormData({ ...formData, variables: nextVariables })
  }

  const addOptionToBlank = (blankName: string) => {
    const currentValue = formData.variables[blankName]
    if (!Array.isArray(currentValue)) return

    const nextOptions = [
      ...currentValue,
      { name: `opt${blankName}${currentValue.length + 1}`, value: '' }
    ]

    setFormData({
      ...formData,
      variables: {
        ...formData.variables,
        [blankName]: nextOptions
      }
    })
  }

  const updateOptionInBlank = (blankName: string, optionIndex: number, field: 'name' | 'value', value: string) => {
    const currentValue = formData.variables[blankName]
    if (!Array.isArray(currentValue)) return

    const nextOptions = currentValue.map((option, index) =>
      index === optionIndex ? { ...option, [field]: value } : option
    )

    setFormData({
      ...formData,
      variables: {
        ...formData.variables,
        [blankName]: nextOptions
      }
    })
  }

  const removeOptionFromBlank = (blankName: string, optionIndex: number) => {
    const currentValue = formData.variables[blankName]
    if (!Array.isArray(currentValue)) return

    const nextOptions = currentValue.filter((_, index) => index !== optionIndex)

    setFormData({
      ...formData,
      variables: {
        ...formData.variables,
        [blankName]: nextOptions
      }
    })
  }

  const removeTheoreticalBlank = (blankName: string) => {
    const nextVariables = { ...formData.variables }
    delete nextVariables[blankName]
    setFormData({ ...formData, variables: nextVariables })
  }

  const getBlankCount = () => {
    return (formData.questionTemplate.match(/__/g) || []).length
  }

  const buildAnswerInputPlaceholder = (blankCount: number) => {
    if (blankCount <= 0) return ''
    const placeholders = Array.from({ length: blankCount }, (_, index) => `opt${index + 1}`)
    return `{${placeholders.join(', ')}}`
  }

  const formatAnswerTemplateForInput = (answers: string[], type: BlueprintType) => {
    if (type !== 'theoretical') {
      return answers.join(', ')
    }

    return answers.map((answer) => `{${answer}}`).join(', ')
  }

  const parseAnswerInput = (input: string, type: BlueprintType) => {
    if (type !== 'theoretical') {
      const trimmed = input.trim()
      return trimmed ? [trimmed] : []
    }

    const matches = input.match(/\{([^{}]*)\}/g)
    if (matches && matches.length > 0) {
      return matches.map((group) => group.slice(1, -1).split(',').map((value) => value.trim()).filter(Boolean).join(', '))
    }

    const trimmed = input.trim()
    return trimmed ? [trimmed] : []
  }

  const validateCorrectAnswers = (input: string, type: BlueprintType) => {
    if (type !== 'theoretical') {
      return true
    }

    const blankCount = getBlankCount()
    const parsedAnswers = parseAnswerInput(input, type)

    if (!parsedAnswers.length) {
      return false
    }

    return parsedAnswers.every((group) => {
      const opts = group.split(',').map((value) => value.trim()).filter(Boolean)
      return opts.length === blankCount
    })
  }

  useEffect(() => {
    if (formData.type !== 'theoretical') return

    const blankCount = getBlankCount()
    if (blankCount <= 0) return

    const existingBlankNames = Object.keys(formData.variables).filter((name) => {
      const value = formData.variables[name]
      return typeof value === 'object' && value !== null && Array.isArray(value)
    })

    if (existingBlankNames.length >= blankCount) return

    const nextVariables = { ...formData.variables }
    for (let index = existingBlankNames.length + 1; index <= blankCount; index += 1) {
      const blankName = `blank${index}`
      if (!nextVariables[blankName]) {
        nextVariables[blankName] = []
      }
    }

    setFormData(prev => ({ ...prev, variables: nextVariables }))
  }, [formData.questionTemplate, formData.type, formData.variables])

  useEffect(() => {
    if (formData.type !== 'theoretical') {
      setAnswerError('')
      return
    }
    if (formData.correctAnswerTemplate.length > 0 || answerInput.trim()) return

    const blankCount = getBlankCount()
    if (blankCount <= 0) return

    setAnswerInput(buildAnswerInputPlaceholder(blankCount))
  }, [formData.type, formData.questionTemplate, answerInput, formData.correctAnswerTemplate.length])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.questionTemplate.trim() || !formData.explanationTemplate.trim() || !formData.category.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    let nextCorrectAnswerTemplate = formData.correctAnswerTemplate

    if (formData.type === 'theoretical') {
      const parsedAnswers = parseAnswerInput(answerInput, formData.type)
      if (!parsedAnswers.length || !validateCorrectAnswers(answerInput, formData.type)) {
        alert('Mẫu đáp án không hợp lệ: số lựa chọn không khớp số chỗ trống')
        return
      }

      if (parsedAnswers.some((answer) => !answer.trim())) {
        alert('Vui lòng điền đáp án đúng!')
        return
      }

      nextCorrectAnswerTemplate = parsedAnswers
      setFormData((prev) => ({ ...prev, correctAnswerTemplate: parsedAnswers }))
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
        correctAnswerTemplate: nextCorrectAnswerTemplate,
        explanationTemplate: formData.explanationTemplate,
        difficulty: formData.difficulty,
        category: formData.category,
        variables: Object.fromEntries(
          Object.entries(formData.variables).map(([key, varDef]) => {
            if (typeof varDef === 'object' && varDef !== null && 'type' in varDef && varDef.type === 'int') {
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
    setAnswerInput(
      formatAnswerTemplateForInput(blueprint.correctAnswerTemplate || [], blueprint.type)
    )

    setFormData({
      lessonId: blueprint.lessonId,
      type: blueprint.type,
      questionTemplate: blueprint.questionTemplate,
      correctAnswerTemplate: blueprint.correctAnswerTemplate,
      explanationTemplate: blueprint.explanationTemplate,
      difficulty: blueprint.difficulty,
      category: blueprint.category,
      variables: normalizeVariables(blueprint.variables as Record<string, any> | undefined, blueprint.type)
    })
    setShowAddModal(true)
  }

  const resetForm = () => {
    setFormData({
      lessonId: '1',
      type: 'theoretical',
      questionTemplate: '',
      correctAnswerTemplate: [] as string[],
      explanationTemplate: '',
      difficulty: 'basic',
      category: '',
      variables: {}
    })
    setNewVarName('')
    setAnswerInput('')
    setAnswerError('')
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
                  setShowPracticeTestModal(true)
                  setPracticePreviewStep('select')
                  setPracticePreviewExercises([])
                  setSelectedBlueprintIds([])
                  setPracticeBlueprintLessonFilter('')
                  setPracticeTestTimeAlloted(30)
                  setPracticeTestError('')
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Tạo đề luyện tập
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
                  <option value="theoretical">Lý thuyết</option>
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
                <option value="intermediate">Thông hiểu</option>
                <option value="advanced">Vận dụng cao</option>
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

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Đề luyện tập đã tạo</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Theo dõi các đề đã được tạo để chia sẻ cho học sinh.</p>
            </div>
          </div>
          {practiceTests.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Chưa có đề luyện tập nào được tạo.</p>
          ) : (
            <div className="space-y-3">
              {practiceTests.map((test) => (
                <div key={test._id || test.accessCode} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">Mã truy cập: {test.accessCode}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Thời gian: {test.timeAlloted || 30} phút • Số câu: {test.exercises?.length || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {test.lessonId ? `Bài ${test.lessonId}` : 'Đề tổng hợp'}
                        {test.chapterId ? ` • Chương ${test.chapterId}` : ''}
                      </p>
                    </div>
                    <a
                      href={`/practice?accessCode=${encodeURIComponent(test.accessCode)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Mở đề
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
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
                      {blueprint.difficulty === 'basic' ? 'Cơ bản' : blueprint.difficulty === 'intermediate' ? 'Thông hiểu' : 'Vận dụng cao'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                      {blueprint.category}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                      {blueprint.type === 'theoretical' ? 'Lý thuyết' : blueprint.type === 'calculation' ? 'Tính toán' : 'Đúng/Sai'}
                    </span>
                  </div>
                  <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                    Mẫu câu hỏi: {blueprint.questionTemplate}
                  </h4>
                  {blueprint.variables && Object.keys(blueprint.variables).length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {blueprint.type === 'calculation' ? 'Biến:' : 'Lựa chọn:'}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(blueprint.variables).map(([key, varDef]) => {
                          if (blueprint.type === 'calculation' && typeof varDef === 'object' && varDef !== null && 'min' in varDef) {
                            return (
                              <span key={key} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
                                {`${key}: ${varDef.min}-${varDef.max} (${varDef.type}${varDef.decimals ? `, ${varDef.decimals}dp` : ''})`}
                              </span>
                            )
                          }

                          if (blueprint.type === 'theoretical' && Array.isArray(varDef)) {
                            return (
                              <span key={key} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
                                {`${key}: ${varDef.map(option =>
                                  `${option.name} = ${option.value}`
                                ).join(' | ')}`}
                              </span>
                            )
                          }

                          return (
                            <span key={key} className="px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded">
                              {`${key}: ${String(varDef)}`}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-green-600 dark:text-green-400 font-medium mt-2">
                    Mẫu đáp án: {blueprint.correctAnswerTemplate}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    Mẫu giải thích: {blueprint.explanationTemplate}
                  </p>
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
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as BlueprintType })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="theoretical">Lý thuyết</option>
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
                  <option value="intermediate">Thông hiểu</option>
                  <option value="advanced">Vận dụng cao</option>
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
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mẫu câu hỏi</label>
                  {formData.type === 'theoretical' && (
                    <button
                      type="button"
                      onClick={insertBlankIntoQuestion}
                      className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Thêm chỗ trống __
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {formData.type === 'theoretical'
                    ? 'Dùng __ để tạo chỗ trống. Mỗi chỗ trống có thể có bộ lựa chọn riêng.'
                    : 'Có thể dùng các biến ở dạng {variableName} trong câu hỏi.'}
                </p>
                <textarea
                  ref={questionTemplateRef}
                  value={formData.questionTemplate}
                  onChange={e => setFormData({ ...formData, questionTemplate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  rows={3}
                />
                {formData.type === 'theoretical' && (
                  <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    Số chỗ trống hiện có: {getBlankCount()}
                  </p>
                )}
              </div>

              {/* Variables */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formData.type === 'calculation' ? 'Biến' : 'Lựa chọn'}
                </label>
                {formData.type === 'theoretical' && (
                  <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                    Mỗi chỗ trống (__) trong mẫu câu hỏi sẽ có lựa chọn riêng tương ứng.
                  </p>
                )}
                <div>
                  <div className="space-y-2">
                    {formData.type === 'calculation' ? (
                      Object.entries(formData.variables).map(([varName, varDef]) => (
                        <div key={varName} className="grid grid-cols-7 gap-2 items-center">
                          <input
                            type="text"
                            value={varName}
                            readOnly
                            className="px-2 py-1 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white w-full"
                          />
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null && 'min' in varDef ? varDef.min : ''}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null && 'min' in varDef) {
                                const value = parseFloat(e.target.value)
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, min: value } }
                                })
                              }
                            }}
                            placeholder="Min"
                            className="px-2 py-1 border rounded-lg w-full"
                            disabled={typeof varDef !== 'object' || varDef === null || !('min' in varDef)}
                          />
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null && 'max' in varDef ? varDef.max : ''}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null && 'max' in varDef) {
                                const value = parseFloat(e.target.value)
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, max: value } }
                                })
                              }
                            }}
                            placeholder="Max"
                            className="px-2 py-1 border rounded-lg w-full"
                            disabled={typeof varDef !== 'object' || varDef === null || !('max' in varDef)}
                          />
                          <select
                            value={typeof varDef === 'object' && varDef !== null && 'type' in varDef ? varDef.type : 'int'}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null && 'type' in varDef) {
                                const value = e.target.value as 'int' | 'float'
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, type: value } }
                                })
                              }
                            }}
                            className="px-2 py-1 border rounded-lg w-full col-span-2"
                            disabled={typeof varDef !== 'object' || varDef === null || !('type' in varDef)}
                          >
                            <option value="int">Số nguyên</option>
                            <option value="float">Số thập phân</option>
                          </select>
                          <input
                            type="number"
                            value={typeof varDef === 'object' && varDef !== null && 'type' in varDef && varDef.type === 'float' ? varDef.decimals ?? 2 : 0}
                            onChange={(e) => {
                              if (typeof varDef === 'object' && varDef !== null && 'type' in varDef && varDef.type === 'float') {
                                const value = parseInt(e.target.value) || 0
                                setFormData({
                                  ...formData,
                                  variables: { ...formData.variables, [varName]: { ...varDef, decimals: value } }
                                })
                              }
                            }}
                            placeholder="Decimals"
                            className={`px-2 py-1 border rounded-lg w-full ${typeof varDef === 'object' && varDef !== null && 'type' in varDef && varDef.type === 'int' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white'}`}
                            readOnly={typeof varDef === 'object' && varDef !== null && 'type' in varDef && varDef.type === 'int'}
                            disabled={typeof varDef !== 'object' || varDef === null || !('type' in varDef)}
                          />
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
                      Object.entries(formData.variables).map(([blankName, blankValue]) => {
                        const options = Array.isArray(blankValue) ? blankValue : []
                        return (
                          <div key={blankName} className="rounded-lg border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={blankName}
                                onChange={(e) => updateTheoreticalBlankName(blankName, e.target.value)}
                                className="flex-1 px-2 py-1 border rounded-lg"
                                placeholder="Tên chỗ trống"
                              />
                              <button
                                type="button"
                                onClick={() => removeTheoreticalBlank(blankName)}
                                className="px-2 py-1 bg-red-500 text-white rounded-lg"
                              >
                                Xóa
                              </button>
                            </div>
                            {options.map((option, optionIndex) => (
                              <div key={`${blankName}-${optionIndex}`} className="grid grid-cols-[1fr,2fr,auto] gap-2">
                                <input
                                  type="text"
                                  value={option.name}
                                  onChange={(e) => updateOptionInBlank(blankName, optionIndex, 'name', e.target.value)}
                                  placeholder="Tên lựa chọn"
                                  className="px-2 py-1 border rounded-lg"
                                />
                                <input
                                  type="text"
                                  value={option.value}
                                  onChange={(e) => updateOptionInBlank(blankName, optionIndex, 'value', e.target.value)}
                                  placeholder="Nội dung lựa chọn"
                                  className="px-2 py-1 border rounded-lg"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOptionFromBlank(blankName, optionIndex)}
                                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                                >
                                  Xóa
                                </button>
                              </div>
                            ))}
                            <button
                              type="button"
                              onClick={() => addOptionToBlank(blankName)}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg"
                            >
                              + Thêm lựa chọn
                            </button>
                          </div>
                        )
                      })
                    )}

                    {formData.type === 'calculation' && (
                      <div className="flex gap-2 mt-2">
                        <input
                          type="text"
                          placeholder="Tên biến"
                          value={newVarName}
                          onChange={(e) => setNewVarName(e.target.value)}
                          className="px-2 py-1 border rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newVarName.trim()) return
                            if (formData.variables[newVarName]) {
                              alert('Biến đã tồn tại!')
                              return
                            }
                            setFormData({
                              ...formData,
                              variables: {
                                ...formData.variables,
                                [newVarName]: { min: 0, max: 10, type: 'int' }
                              }
                            })
                            setNewVarName('')
                          }}
                          className="px-3 py-1 bg-green-500 text-white rounded-lg"
                        >
                          Thêm biến
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Correct Answer Template */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mẫu đáp án đúng</label>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  {formData.type === 'theoretical' ? (
                    <>
                      Nhập từng đáp án đúng theo cú pháp {'{LựaChọnChỗTrống1, LựaChọnChỗTrống2, LựaChọnChỗTrống3}'}.
                      <span className="font-semibold">
                        (Số lựa chọn trong đáp án đúng phải bằng với số chỗ trống trong mẫu câu hỏi)
                      </span>
                      <br />
                      Các đáp án đúng sẽ được phân tách bằng dấu phẩy.
                    </>
                  ) : (
                    'Có thể dùng biểu thức tính toán như {a} + {b}.'
                  )}
                </p>
                <input
                  type="text"
                  value={answerInput}
                  onChange={(e) => {
                    const nextValue = e.target.value
                    const parsedAnswers = parseAnswerInput(nextValue, formData.type)
                    const blankCount = getBlankCount()
                    const invalid = formData.type === 'theoretical' && parsedAnswers.some((group) => {
                      const opts = group.split(',').map((value) => value.trim()).filter(Boolean)
                      return opts.length > 0 && opts.length !== blankCount
                    })

                    setAnswerInput(nextValue)
                    setAnswerError(
                      invalid && formData.type === 'theoretical'
                        ? `Số lựa chọn trong mỗi {} phải bằng số chỗ trống (__ = ${blankCount})`
                        : ''
                    )

                    setFormData({
                      ...formData,
                      correctAnswerTemplate: parsedAnswers
                    })
                  }}
                  className="w-full px-3 py-2 border rounded-lg"
                />
                {answerError && (
                  <p className="text-sm text-red-500 mt-2">
                    {answerError}
                  </p>
                )}
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

      {showPracticeTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-5xl p-6 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Tạo đề luyện tập
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Chọn dạng bài tập, xem trước câu hỏi và chỉnh sửa dữ liệu trước khi lưu đề.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPracticeTestModal(false)
                  setPracticePreviewStep('select')
                  setPracticePreviewExercises([])
                  setSelectedBlueprintIds([])
                  setPracticeBlueprintLessonFilter('')
                  setPracticeTestTimeAlloted(30)
                  setPracticeTestQuestionCount(10)
                  setPracticeTestDifficulty('all')
                  setPracticeTestError('')
                }}
                className="px-3 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
              >
                Đóng
              </button>
            </div>

            {practicePreviewStep === 'select' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Thời gian làm bài
                    </label>
                    <select
                      value={practiceTestTimeAlloted}
                      onChange={(e) => setPracticeTestTimeAlloted(Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {Array.from({ length: 12 }, (_, index) => 15 + index * 15).map((option) => (
                        <option key={option} value={option}>{option} phút</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Số câu
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={practiceTestQuestionCount}
                      onChange={(e) => setPracticeTestQuestionCount(Math.max(1, Math.min(100, Number(e.target.value) || 1)))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Độ khó
                    </label>
                    <select
                      value={practiceTestDifficulty}
                      onChange={(e) => setPracticeTestDifficulty(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">Tất cả</option>
                      <option value="basic">Cơ bản</option>
                      <option value="intermediate">Thông hiểu</option>
                      <option value="advanced">Vận dụng cao</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Lọc theo bài học
                    </label>
                    <select
                      value={practiceBlueprintLessonFilter}
                      onChange={(e) => setPracticeBlueprintLessonFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Tất cả bài học</option>
                      {lessons.map((lesson) => (
                        <option key={lesson.id} value={lesson.id}>
                          Bài {lesson.id}: {lesson.title || lesson.id}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-2">
                  {filteredPracticeBlueprints.map((blueprint) => (
                    <label
                      key={blueprint.id}
                      className="flex items-start gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/60"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBlueprintIds.includes(blueprint.id)}
                        onChange={() => toggleBlueprintSelection(blueprint.id)}
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-gray-900 dark:text-white">{blueprint.questionTemplate}</span>
                          <span className="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {blueprint.type === 'theoretical' ? 'Lý thuyết' : 'Tính toán'}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                          Bài {blueprint.lessonId} • Độ khó: {blueprint.difficulty === 'basic' ? 'Cơ bản' : blueprint.difficulty === 'intermediate' ? 'Thông hiểu' : blueprint.difficulty === 'advanced' ? 'Vận dụng cao' : blueprint.difficulty}
                        </p>
                      </div>
                    </label>
                  ))}
                  {filteredPracticeBlueprints.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Không có dạng bài tập nào phù hợp.</p>
                  )}
                </div>

                {practiceTestError && (
                  <p className="mt-3 text-sm text-red-500">{practiceTestError}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPracticeTestModal(false)
                      setPracticePreviewStep('select')
                      setPracticePreviewExercises([])
                      setSelectedBlueprintIds([])
                      setPracticeBlueprintLessonFilter('')
                      setPracticeTestTimeAlloted(30)
                      setPracticeTestQuestionCount(10)
                      setPracticeTestDifficulty('all')
                      setPracticeTestError('')
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={generatePracticePreview}
                    disabled={practicePreviewLoading}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white rounded-lg transition-colors"
                  >
                    {practicePreviewLoading ? 'Đang tạo...' : 'Xem trước'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Đã tạo {practicePreviewExercises.length} câu hỏi. Bạn có thể chỉnh sửa nội dung trước khi lưu đề.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPracticePreviewStep('select')}
                    className="px-3 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                  >
                    Quay lại
                  </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                  {practicePreviewExercises.map((exercise, index) => (
                    <div key={exercise.id ?? index} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Câu {index + 1}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${exercise.difficulty === 'basic'
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : exercise.difficulty === 'intermediate'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                          }`}>
                          {exercise.difficulty === 'basic' ? 'Cơ bản' : exercise.difficulty === 'intermediate' ? 'Thông hiểu' : exercise.difficulty === 'advanced' ? 'Vận dụng cao' : exercise.difficulty}
                        </span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-1 text-xs rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300">
                            {Array.isArray(exercise.options) && exercise.options.length > 0 ? 'Trắc nghiệm' : 'Điền số'}
                          </span>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Câu hỏi</label>
                          <textarea
                            value={exercise.question}
                            onChange={(event) => updatePreviewExerciseField(index, 'question', event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={3}
                          />
                        </div>
                        {Array.isArray(exercise.options) && exercise.options.length > 0 && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Các lựa chọn</label>
                            <ul className="space-y-1 rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                              {exercise.options.map((option, optionIndex) => (
                                <li key={`${option}-${optionIndex}`} className="text-sm text-gray-700 dark:text-gray-300">
                                  <span className="mr-2 font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                                  {option}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Đáp án đúng</label>
                          <input
                            type="text"
                            value={exercise.correctAnswer}
                            onChange={(event) => updatePreviewExerciseField(index, 'correctAnswer', event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Giải thích</label>
                          <textarea
                            value={exercise.explanation}
                            onChange={(event) => updatePreviewExerciseField(index, 'explanation', event.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {practiceTestError && (
                  <p className="mt-3 text-sm text-red-500">{practiceTestError}</p>
                )}

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPracticeTestModal(false)
                      setPracticePreviewStep('select')
                      setPracticePreviewExercises([])
                      setSelectedBlueprintIds([])
                      setPracticeBlueprintLessonFilter('')
                      setPracticeTestTimeAlloted(30)
                      setPracticeTestQuestionCount(10)
                      setPracticeTestDifficulty('all')
                      setPracticeTestError('')
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={confirmPracticeTestCreation}
                    disabled={practicePreviewLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-lg transition-colors"
                  >
                    {practicePreviewLoading ? 'Đang lưu...' : 'Xác nhận tạo đề'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
