export default function Dashboard() {
  return (
    <main className="container dashboard_home">
      <h1>Dashboard</h1>
      <div className="dashboard_stats">
        <div className="stat">
          <h2>42</h2>
          <p>Dispositivi Online</p>
        </div>
        <div className="stat">
          <h2>3</h2>
          <p>Dispositivi Offline</p>
        </div>
        <div className="stat">
          <h2>5</h2>
          <p>Alert Toner</p>
        </div>
      </div>
      <div className="dashboard_graphs">
        <div className="graph">Grafico 1</div>
        <div className="graph">Grafico 2</div>
      </div>
    </main>
  );
}
