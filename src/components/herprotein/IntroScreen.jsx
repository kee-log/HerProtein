export default function IntroScreen({ onStart }) {
  return (
    <main className="app-shell intro-shell">
      <section className="intro-panel">
        <p className="eyebrow">HerProtein</p>
        <h1>Know if you&apos;re getting enough protein today.</h1>
        <p className="intro-copy">
          A gentle daily protein coach for women. No calorie restriction,
          no macro clutter, no bodybuilding language.
        </p>
        <div className="intro-meter" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <button className="primary-button" onClick={onStart}>
          Start today
        </button>
      </section>
    </main>
  )
}
