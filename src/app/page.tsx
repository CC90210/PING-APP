export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white', color: 'black', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <div style={{ height: '40px', width: '40px', backgroundColor: '#2563eb', borderRadius: '50%', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ height: '16px', width: '16px', backgroundColor: 'white', borderRadius: '50%' }}></div>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>Ping.</h1>
        <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '2.5rem', lineHeight: '1.6' }}>
          AI-powered relationship intelligence. Never let a professional or personal connection go cold again.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <a href="/dashboard" style={{ backgroundColor: 'black', color: 'white', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Get Started
          </a>
          <a href="/dashboard" style={{ border: '2px solid #e5e7eb', color: 'black', padding: '0.75rem 2rem', borderRadius: '0.75rem', fontWeight: 'bold', textDecoration: 'none' }}>
            Learn More
          </a>
        </div>
      </div>

      <div style={{ marginTop: '4rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', width: '100%', maxWidth: '800px', display: 'grid', gap: '2rem' }}>
        <div style={{ padding: '1.5rem', border: '1px solid #f3f4f6', borderRadius: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Warmth Scoring</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Track the health of every connection automatically.</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #f3f4f6', borderRadius: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Coaching</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Personalized advice on when and how to reach out.</p>
        </div>
        <div style={{ padding: '1.5rem', border: '1px solid #f3f4f6', borderRadius: '1rem' }}>
          <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>Zero Config</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Syncs with WhatsApp and iMessage out of the box.</p>
        </div>
      </div>
    </div>
  );
}
