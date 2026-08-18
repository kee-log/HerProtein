import { useEffect, useState } from 'react'
import { estimateProteinFromPhotoName } from '../../utils/photoProtein'

export default function AddFoodScreen({ onAdd, onBack }) {
  const [foodName, setFoodName] = useState('')
  const [proteinInput, setProteinInput] = useState('')
  const [timeAte, setTimeAte] = useState('')
  const [photoPreview, setPhotoPreview] = useState('')
  const [photoStatus, setPhotoStatus] = useState('')
  const [photoEstimated, setPhotoEstimated] = useState(false)

  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview)
    }
  }, [photoPreview])

  function handlePhotoChange(event) {
    const file = event.target.files?.[0]
    if (!file) return

    if (photoPreview) URL.revokeObjectURL(photoPreview)

    const previewUrl = URL.createObjectURL(file)
    const estimate = estimateProteinFromPhotoName(file.name)
    setPhotoPreview(previewUrl)

    if (estimate) {
      setFoodName(estimate.name)
      setProteinInput(String(estimate.protein))
      setPhotoStatus(`Estimated ${estimate.protein}g protein from ${estimate.name}.`)
      setPhotoEstimated(true)
      return
    }

    setPhotoStatus('Photo added. Confirm the food name and protein grams to save it.')
    setPhotoEstimated(false)
  }

  function handleSubmit(event) {
    event.preventDefault()
    const protein = Number(proteinInput)
    if (!foodName.trim() || !protein || protein <= 0) return
    onAdd({ name: foodName.trim(), protein, timeAte, photoEstimated })
    setFoodName('')
    setProteinInput('')
    setTimeAte('')
    setPhotoStatus('')
    setPhotoEstimated(false)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="ghost-button" onClick={onBack}>
          Back
        </button>
        <p>Add food</p>
        <span />
      </header>
      <section className="add-panel">
        <h1>Add protein</h1>
        <form className="food-form" onSubmit={handleSubmit}>
          <label htmlFor="foodName">Food name</label>
          <input
            id="foodName"
            value={foodName}
            onChange={(event) => setFoodName(event.target.value)}
            placeholder="Greek yogurt"
          />
          <label htmlFor="proteinGrams">Protein grams</label>
          <div className="input-row">
            <input
              id="proteinGrams"
              inputMode="decimal"
              min="0.1"
              step="0.1"
              type="number"
              value={proteinInput}
              onChange={(event) => setProteinInput(event.target.value)}
              placeholder="10"
            />
            <span>g</span>
          </div>
          <label htmlFor="timeAte">Time you ate</label>
          <input
            id="timeAte"
            type="time"
            value={timeAte}
            onChange={(event) => setTimeAte(event.target.value)}
          />
          <div className="photo-estimator">
            <div>
              <strong>Add photo</strong>
              <p>Estimate protein</p>
            </div>
            <div className="photo-actions">
              <label className="photo-button" htmlFor="cameraPhoto">
                Take photo
              </label>
              <input
                id="cameraPhoto"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoChange}
                type="file"
              />
              <label className="photo-button" htmlFor="galleryPhoto">
                Gallery
              </label>
              <input
                id="galleryPhoto"
                accept="image/*"
                onChange={handlePhotoChange}
                type="file"
              />
            </div>
            {photoPreview && (
              <img className="photo-preview" src={photoPreview} alt="Selected food" />
            )}
            {photoStatus && <p className="photo-status">{photoStatus}</p>}
          </div>
          <button className="primary-button" type="submit">
            Add to today
          </button>
        </form>
      </section>
    </main>
  )
}
