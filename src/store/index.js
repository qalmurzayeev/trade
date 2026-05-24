import { create } from 'zustand';

export const useStore = create((set, get) => ({
  // Auth state
  user: null,
  isLoading: true,
  needsOnboarding: false,
  
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setNeedsOnboarding: (needs) => set({ needsOnboarding: needs }),
  
  // Courses
  courses: [],
  setCourses: (courses) => set({ courses }),
  
  // Current course
  currentCourse: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),
  
  // Progress
  progress: [],
  setProgress: (progress) => set({ progress }),
  
  // Navigation
  activeTab: 'home',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
