import { suggestedFoods } from '../../data/suggestedFoods'
import { formatGrams, getTodayLabel } from '../../utils/protein'

const quickAddFoods = [
  { name: 'Egg', protein: 6 },
  { name: 'Greek yogurt', protein: 10 },
  { name: 'Chicken breast', protein: 23 },
  { name: 'Tofu', protein: 12 },
  { name: 'Milk', protein: 8 },
  { name: 'Protein shake', protein: 20 },
]

function getCoachMessage(isComplete, progress, remaining) {
  if (isComplete) return 'Nice work. You reached your protein target today.'
  if (progress >= 70) return "You're already 70% of the way there."
  if (progress >= 40) return 'A protein-rich snack can help close the gap.'
  return `You need ${formatGrams(remaining)} more today.`
}

export default function Dashboard({
  foods,
  goal,
  isComplete,
  onAddFood,
  onAddSuggestion,
  onCalendar,
  onEditGoal,
  onQuickAdd,
  onRemoveFood,
  progress,
  remaining,
  suggestions,
  totalProtein,
}) {
  const roundedProgress = Math.round(progress)

  return (
    <main className="app-shell dashboard-shell">
      <header className="dashboard-header">
        <div>
          <p className="date-label">{getTodayLabel()}</p>
          <h1>Today&apos;s Protein</h1>
        </div>
        <button className="small-button" onClick={onEditGoal}>
          Edit target
        </button>
      </header>

      <section className={`coach-panel ${isComplete ? 'complete' : ''}`}>
        <div className="progress-ring" style={{ '--progress': `${roundedProgress}%` }}>
          <div>
            <strong>{roundedProgress}%</strong>
            <span>complete</span>
          </div>
        </div>
        <div className="coach-copy">
          <p className="goal-label">Today&apos;s Protein</p>
          <h2>{formatGrams(totalProtein)} / {formatGrams(goal)}</h2>
          <p>{getCoachMessage(isComplete, progress, remaining)}</p>
        </div>
      </section>

      <section className="section-block quick-add-panel">
        <div className="section-heading">
          <h2>Quick add</h2>
          <span>One tap</span>
        </div>
        <div className="quick-add-grid">
          {quickAddFoods.map((food) => (
            <button key={food.name} onClick={() => onQuickAdd(food)}>
              <strong>{food.name}</strong>
              <span>{formatGrams(food.protein)}</span>
            </button>
          ))}
        </div>
        <button className="secondary-button compact" onClick={onAddFood}>
          Add custom food
        </button>
      </section>

      <section className="section-block suggestions-block">
        <div className="section-heading">
          <h2>{isComplete ? 'Today feels complete' : 'Close the gap'}</h2>
          {!isComplete && <span>{formatGrams(remaining)} more</span>}
        </div>
        {isComplete ? (
          <div className="complete-message">
            <strong>Protein Goal Complete</strong>
            <p>You completed something good for your body today.</p>
          </div>
        ) : (
          <div className="suggestion-grid">
            {(suggestions.length ? suggestions : suggestedFoods.slice(0, 5)).map((food) => (
              <button
                className={`suggestion-card ${food.tone}`}
                key={food.name}
                onClick={() => onAddSuggestion({ name: food.name, protein: food.protein })}
              >
                <span>{food.name}</span>
                <strong>{formatGrams(food.protein)}</strong>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="action-row">
        <button className="secondary-button" onClick={onCalendar}>
          Monthly calendar
        </button>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <h2>Logged today</h2>
          <span>{foods.length}</span>
        </div>
        {foods.length > 0 ? (
          <ul className="food-list">
            {foods.map((food) => (
              <li key={food.id}>
                <div>
                  <strong>{food.name}</strong>
                  <span>
                    {formatGrams(food.protein)} protein
                    {food.timeAte ? ` · ${food.timeAte}` : ''}
                    {food.photoEstimated ? ' · photo estimate' : ''}
                  </span>
                </div>
                <button className="icon-button" onClick={() => onRemoveFood(food.id)} aria-label={`Remove ${food.name}`}>
                  x
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No pressure. Add your first protein food whenever you&apos;re ready.</p>
        )}
      </section>
    </main>
  )
}
