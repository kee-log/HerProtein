import { suggestedFoods } from '../data/suggestedFoods.js'

const aliases = [
  { keywords: ['egg', 'boiled-egg', 'boiled_egg'], food: 'Egg' },
  { keywords: ['greek-yogurt', 'greek_yogurt', 'yogurt', 'yoghurt'], food: 'Greek yogurt' },
  { keywords: ['tofu'], food: 'Tofu 150g' },
  { keywords: ['chicken', 'chicken-breast', 'chicken_breast'], food: 'Chicken breast 100g' },
  { keywords: ['protein-drink', 'protein_drink', 'shake', 'protein'], food: 'Protein drink' },
  { keywords: ['tuna'], food: 'Tuna can' },
  { keywords: ['edamame'], food: 'Edamame' },
  { keywords: ['salmon'], food: 'Salmon' },
]

export function estimateProteinFromPhotoName(fileName) {
  const normalized = fileName.toLowerCase()
  const match = aliases.find(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword)))

  if (!match) return null

  return suggestedFoods.find((food) => food.name === match.food) ?? null
}
