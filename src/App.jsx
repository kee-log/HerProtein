import { useEffect, useMemo, useState } from 'react'
import AddFoodScreen from './components/herprotein/AddFoodScreen'
import Dashboard from './components/herprotein/Dashboard'
import IntroScreen from './components/herprotein/IntroScreen'
import MonthlyCalendar from './components/herprotein/MonthlyCalendar'
import WeightSetup from './components/herprotein/WeightSetup'
import { suggestedFoods } from './data/suggestedFoods'
import {
  calculateProteinGoal,
  formatGrams,
  getDateKey,
  getFoodDateKey,
  getProteinTotal,
} from './utils/protein'
import './index.css'

const STORAGE_KEY = 'herprotein-state-v1'

const initialState = {
  hasSeenIntro: false,
  weight: '',
  activityLevel: 'sedentary',
  goalType: 'general-health',
  foods: [],
}

function loadState() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored ? { ...initialState, ...JSON.parse(stored) } : initialState
  } catch {
    return initialState
  }
}

export default function App() {
  const [appState, setAppState] = useState(loadState)
  const [screen, setScreen] = useState(() => {
    if (!appState.hasSeenIntro) return 'intro'
    return appState.weight ? 'dashboard' : 'setup'
  })

  const weight = Number(appState.weight) || 0
  const goal = calculateProteinGoal(weight, appState.activityLevel, appState.goalType)
  const todayFoods = appState.foods.filter((food) => getFoodDateKey(food) === getDateKey())
  const totalProtein = getProteinTotal(todayFoods)
  const remaining = Math.max(goal - totalProtein, 0)
  const progress = goal > 0 ? Math.min((totalProtein / goal) * 100, 100) : 0
  const isComplete = goal > 0 && totalProtein >= goal

  const usefulSuggestions = useMemo(() => {
    if (isComplete || remaining <= 0) return []
    return suggestedFoods
      .filter((food) => food.protein <= remaining + 12)
      .sort((a, b) => Math.abs(remaining - a.protein) - Math.abs(remaining - b.protein))
      .slice(0, 5)
  }, [isComplete, remaining])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appState))
  }, [appState])

  function beginSetup() {
    setAppState((current) => ({ ...current, hasSeenIntro: true }))
    setScreen('setup')
  }

  function saveGoal(goalSettings) {
    setAppState((current) => ({
      ...current,
      hasSeenIntro: true,
      weight: String(goalSettings.weight),
      activityLevel: goalSettings.activityLevel,
      goalType: goalSettings.goalType,
    }))
    setScreen('dashboard')
  }

  function addFood(food) {
    setAppState((current) => ({
      ...current,
      foods: [{ ...food, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...current.foods],
    }))
    setScreen('dashboard')
  }

  function removeFood(id) {
    setAppState((current) => ({
      ...current,
      foods: current.foods.filter((food) => food.id !== id),
    }))
  }

  if (screen === 'intro') {
    return <IntroScreen onStart={beginSetup} />
  }

  if (screen === 'setup') {
    return (
      <WeightSetup
        initialActivityLevel={appState.activityLevel}
        initialGoalType={appState.goalType}
        initialWeight={appState.weight}
        onSave={saveGoal}
        previewFormatter={formatGrams}
      />
    )
  }

  if (screen === 'add') {
    return <AddFoodScreen onAdd={addFood} onBack={() => setScreen('dashboard')} />
  }

  if (screen === 'calendar') {
    return (
      <MonthlyCalendar
        foods={appState.foods}
        goal={goal}
        onBack={() => setScreen('dashboard')}
      />
    )
  }

  return (
    <Dashboard
      foods={todayFoods}
      goal={goal}
      isComplete={isComplete}
      onAddFood={() => setScreen('add')}
      onAddSuggestion={addFood}
      onQuickAdd={addFood}
      onCalendar={() => setScreen('calendar')}
      onEditGoal={() => setScreen('setup')}
      onRemoveFood={removeFood}
      progress={progress}
      remaining={remaining}
      suggestions={usefulSuggestions}
      totalProtein={totalProtein}
    />
  )
}
