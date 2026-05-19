import { ObjectId } from "mongodb"

export interface Slide {
  id: number
  title: string
  content: string
  // Chỉ giữ các type mà SlidePresentation hỗ trợ
  type: string
  images?: string[]
  notes?: string
  simulationType?: string
}

export interface Formula {
  id: string
  latex: string
}

export interface ImageAsset {
  id: string
  src: string
}


export interface Lesson {
  id: string
  title: string
  slides?: Slide[]
  formulas?: Formula[]
  images?: ImageAsset[]
  duration?: string
  description?: string
}

export interface Chapter {
  _id: ObjectId
  chapterId: string  // "1", "2", "3", ...
  title: string
  subtitle?: string
  description?: string
  icon?: string
  content?: string
  lessons: Lesson[]
  exercises?: any[]
  order?: number
  isPublished?: boolean
  createdAt?: string
  updatedAt?: string
  __v?: number
  sections?: any[]
}