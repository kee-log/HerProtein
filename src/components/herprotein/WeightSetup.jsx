import { useState } from 'react'
import {
  activityLevelOptions,
  calculateProteinGoal,
  getProteinMultiplier,
  goalTypeOptions,
} from '../../utils/protein'

export default function WeightSetup({
  initialActivityLevel,
  initialGoalType,
  initialWeight,
  onSave,
  previewFormatter,
}) {
  const [weightInput, setWeightInput] = useState(initialWeight)
  const [activityLevel, setActivityLevel] = useState(initialActivityLevel)
  const [goalType, setGoalType] = useState(initialGoalType)
  const [error, setError] = useState('')
  const weight = Number(weightInput)
  const multiplier = getProteinMultiplier(activityLevel, goalType)
  const previewGoal = weight >= 35 && weight <= 120
    ? previewFormatter(calculateProteinGoal(weight, activityLevel, goalType))
    : '0g'

  function handleSubmit(event) {
    event.preventDefault()
    if (!weight || weight < 35 || weight > 120) {
      setError('Enter a weight between 35kg and 120kg.')
      return
    }
    setError('')
    onSave({ weight, activityLevel, goalType })
  }

  return (
    <main className="app-shell">
      <section className="setup-panel">
        <p className="eyebrow">Daily goal setup</p>
        <h1>Find your daily protein target</h1>
        <p className="subcopy">A calm starting point based on your body, movement, and wellness goal.</p>
        <form className="setup-form" onSubmit={handleSubmit}>
          <label htmlFor="weight">What is your current weight?</label>
          <div className="input-row">
            <input
              id="weight"
              inputMode="decimal"
              max="120"
              min="35"
              required
              step="0.1"
              type="number"
              value={weightInput}
              onChange={(event) => setWeightInput(event.target.value)}
              placeholder="50"
            />
            <span>kg</span>
          </div>
          {error && <p className="form-error">{error}</p>}

          <fieldset className="option-group">
            <legend>How active are you?</legend>
            <div className="choice-list">
              {activityLevelOptions.map((option) => (
                <button
                  className={activityLevel === option.value ? 'selected' : ''}
                  key={option.value}
                  onClick={() => setActivityLevel(option.value)}
                  type="button"
                >
                  <strong>{option.label}</strong>
                  <span>{option.description}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="option-group">
            <legend>What is your goal?</legend>
            <div className="segmented-grid two">
              {goalTypeOptions.map((option) => (
                <button
                  className={goalType === option.value ? 'selected' : ''}
                  key={option.value}
                  onClick={() => setGoalType(option.value)}
                  type="button"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="calculation-preview">
            <span>Your target: {previewGoal} / day</span>
            <small>{multiplier.toFixed(1)}g protein x body weight</small>
          </div>
          <button className="primary-button" type="submit">
            Save target
          </button>
        </form>
      </section>
    </main>
  )
}
