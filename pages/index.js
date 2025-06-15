import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  CircularProgressbar,
  buildStyles,
} from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const online = 20;
  const total = 30;
  const percentage = (online / total) * 100;

  const lineData = {
    labels: ['Lun', 'Mar', 'Mer', 'Gio', 'Ven'],
    datasets: [
      {
        label: 'Consumo Toner',
        data: [10, 8, 12, 6, 9],
        borderColor: '#0004ff',
        backgroundColor: 'rgba(0,4,255,0.2)',
      },
    ],
  };

  const barData = {
    labels: ['Elite', 'Pewex', 'Stefanelli'],
    datasets: [
      {
        label: 'Stampe Mensili',
        data: [200, 150, 180],
        backgroundColor: '#4caf50',
      },
    ],
  };

  return (
    <main className="container dashboard_home">
      <h1>Dashboard</h1>
      <div className="dashboard_stats">
        <div className="stat">
          <CircularProgressbar
            value={percentage}
            text={`${online}/${total}`}
            styles={buildStyles({
              textSize: '24px',
              pathColor: '#0004ff',
              textColor: '#0004ff',
            })}
          />
          <p>Dispositivi Online</p>
        </div>
        <div className="stat">
          <h2>3</h2>
          <p>Societá Registrate</p>
        </div>
        <div className="stat">
          <h2>5</h2>
          <p>Alert Toner</p>
        </div>
      </div>
      <div className="dashboard_graphs">
        <div className="graph">
          <Line data={lineData} />
        </div>
        <div className="graph">
          <Bar data={barData} />
        </div>
      </div>
    </main>
  );
}
