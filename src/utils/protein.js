export function formatGrams(value) {
  return `${Math.round(Number(value) || 0)}g`
}

export const activityLevelOptions = [
  {
    value: 'sedentary',
    label: 'Mostly sedentary',
    description: 'Little to no exercise',
    adjustment: 0,
  },
  {
    value: 'light',
    label: 'Lightly active',
    description: 'Walking or light exercise 1-2 times/week',
    adjustment: 0.1,
  },
  {
    value: 'active',
    label: 'Active',
    description: 'Exercise 3-5 times/week',
    adjustment: 0.2,
  },
  {
    value: 'very-active',
    label: 'Very active',
    description: 'Exercise 6+ times/week',
    adjustment: 0.3,
  },
]

export const goalTypeOptions = [
  { value: 'general-health', label: 'General health', multiplier: 1 },
  { value: 'weight-loss', label: 'Weight loss', multiplier: 1.3 },
  { value: 'body-toning', label: 'Body toning', multiplier: 1.4 },
  { value: 'muscle-gain', label: 'Muscle gain', multiplier: 1.6 },
]

export function getProteinMultiplier(activityLevel = 'sedentary', goalType = 'general-health') {
  const activity = activityLevelOptions.find((option) => option.value === activityLevel) ?? activityLevelOptions[0]
  const goal = goalTypeOptions.find((option) => option.value === goalType) ?? goalTypeOptions[0]
  return goal.multiplier + activity.adjustment
}

export function calculateProteinGoal(weight, activityLevel, goalType) {
  return Math.round(Number(weight) * getProteinMultiplier(activityLevel, goalType))
}

export function getTodayLabel() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date())
}

export function getDateKey(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getFoodDateKey(food) {
  return getDateKey(food.createdAt ? new Date(food.createdAt) : new Date())
}

export function getProteinTotal(foods) {
  return foods.reduce((sum, food) => sum + Number(food.protein), 0)
}
