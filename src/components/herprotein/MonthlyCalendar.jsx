import { useMemo, useState } from 'react'
import { formatGrams, getDateKey, getFoodDateKey, getProteinTotal } from '../../utils/protein'

const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getMonthLabel(date) {
  return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(date)
}

function getCalendarDays(monthDate) {
  const year = monthDate.getFullYear()
  const month = monthDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingDays = firstDay.getDay()
  const days = []

  for (let index = 0; index < leadingDays; index += 1) {
    days.push(null)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    days.push(new Date(year, month, day))
  }

  while (days.length % 7 !== 0) {
    days.push(null)
  }

  return days
}

export default function MonthlyCalendar({ foods, goal, onBack }) {
  const [visibleMonth, setVisibleMonth] = useState(() => new Date())
  const [selectedDateKey, setSelectedDateKey] = useState(() => getDateKey())

  const foodsByDay = useMemo(() => {
    return foods.reduce((groups, food) => {
      const dateKey = getFoodDateKey(food)
      return { ...groups, [dateKey]: [...(groups[dateKey] ?? []), food] }
    }, {})
  }, [foods])

  const calendarDays = getCalendarDays(visibleMonth)
  const selectedFoods = foodsByDay[selectedDateKey] ?? []
  const selectedTotal = getProteinTotal(selectedFoods)
  const selectedComplete = goal > 0 && selectedTotal >= goal

  function moveMonth(direction) {
    setVisibleMonth((current) => new Date(current.getFullYear(), current.getMonth() + direction, 1))
  }

  return (
    <main className="app-shell calendar-shell">
      <header className="topbar calendar-topbar">
        <button className="ghost-button" onClick={onBack}>
          Back
        </button>
        <p>Calendar</p>
        <span />
      </header>

      <section className="calendar-panel">
        <div className="calendar-header">
          <button className="month-button" onClick={() => moveMonth(-1)} aria-label="Previous month">
            &lt;
          </button>
          <div>
            <p className="eyebrow">Monthly progress</p>
            <h1>{getMonthLabel(visibleMonth)}</h1>
          </div>
          <button className="month-button" onClick={() => moveMonth(1)} aria-label="Next month">
            &gt;
          </button>
        </div>

        <div className="weekday-grid">
          {weekdays.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className="month-grid">
          {calendarDays.map((date, index) => {
            if (!date) return <div className="calendar-day empty" key={`empty-${index}`} />

            const dateKey = getDateKey(date)
            const dayFoods = foodsByDay[dateKey] ?? []
            const total = getProteinTotal(dayFoods)
            const complete = goal > 0 && total >= goal
            const selected = dateKey === selectedDateKey

            return (
              <button
                className={`calendar-day ${selected ? 'selected' : ''} ${complete ? 'complete' : ''}`}
                key={dateKey}
                onClick={() => setSelectedDateKey(dateKey)}
              >
                <span>{date.getDate()}</span>
                {dayFoods.length > 0 && <strong>{formatGrams(total)}</strong>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="section-block selected-day-panel">
        <div className="section-heading">
          <h2>{selectedDateKey}</h2>
          <span>{selectedComplete ? 'Complete' : `${formatGrams(Math.max(goal - selectedTotal, 0))} left`}</span>
        </div>
        <div className="selected-day-summary">
          <strong>{formatGrams(selectedTotal)}</strong>
          <p>{selectedComplete ? 'Protein Goal Complete' : `${formatGrams(goal)} daily goal`}</p>
        </div>
        {selectedFoods.length > 0 ? (
          <ul className="food-list">
            {selectedFoods.map((food) => (
              <li key={food.id}>
                <div>
                  <strong>{food.name}</strong>
                  <span>
                    {formatGrams(food.protein)} protein
                    {food.timeAte ? ` · ${food.timeAte}` : ''}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No protein logged for this day yet.</p>
        )}
      </section>
    </main>
  )
}
