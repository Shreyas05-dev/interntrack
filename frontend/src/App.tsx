
import { useEffect, useState } from "react";
import "./App.css";

type Application = {
  id: number;
  company: string;
  role: string;
  status: string;
};

const API_URL = "http://127.0.0.1:8000";

function App() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadApplications() {
    try {
      setError("");
      const response = await fetch(`${API_URL}/applications`);
      if (!response.ok) throw new Error("Could not load applications.");
      const data: Application[] = await response.json();
      setApplications(data);
    } catch {
      setError("Cannot connect to the backend. Is FastAPI running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadApplications();
  }, []);

  async function addApplication() {
    const company = window.prompt("Company name?");
    if (!company?.trim()) return;

    const role = window.prompt("Job role?");
    if (!role?.trim()) return;

    try {
      const response = await fetch(`${API_URL}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company: company.trim(),
          role: role.trim(),
          status: "Saved",
        }),
      });

      if (!response.ok) throw new Error("Could not add application.");
      await loadApplications();
    } catch {
      setError("Could not add application. Check that FastAPI is running.");
    }
  }

  async function updateStatus(id: number, status: string) {
    const current = applications.find((app) => app.id === id);
    if (!current) return;

    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...current, status }),
      });

      if (!response.ok) throw new Error("Could not update status.");
      await loadApplications();
    } catch {
      setError("Could not update status. Please try again.");
    }
  }

  async function deleteApplication(id: number) {
    if (!window.confirm("Delete this application?")) return;

    try {
      const response = await fetch(`${API_URL}/applications/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Could not delete application.");
      await loadApplications();
    } catch {
      setError("Could not delete application. Please try again.");
    }
  }

  const filtered = applications.filter((app) =>
    `${app.company} ${app.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const interviews = applications.filter((app) => app.status === "Interview").length;
  const offers = applications.filter((app) => app.status === "Offer").length;

  const statuses = [
    "Saved", "Applied", "Assessment", "Interview", "Offer", "Rejected",
  ];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span>✳</span> InternTrack</div>
        <p className="nav-label">WORKSPACE</p>
        <div className="nav-item active">▦ &nbsp; Dashboard</div>
        <div className="nav-item">▤ &nbsp; Applications</div>
        <div className="nav-item">◷ &nbsp; Interviews</div>
        <div className="nav-item">⚙ &nbsp; Settings</div>
        <div className="sidebar-bottom">
          <div className="avatar">SC</div>
          <div><strong>Student</strong><p>Personal workspace</p></div>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <span>Workspace / Dashboard</span>
          <span className="live-dot">● Connected app</span>
        </header>

        <div className="page-heading">
          <div>
            <p className="eyebrow">YOUR CAREER JOURNEY</p>
            <h1>Dashboard</h1>
            <p className="subtitle">Keep your internship search organized.</p>
          </div>
          <button className="primary-button" onClick={() => void addApplication()}>
            + Add application
          </button>
        </div>

        {error && <p role="alert" className="error-message">{error}</p>}

        <section className="stats-grid">
          <article className="stat-card">
            <span className="stat-icon purple">▤</span>
            <p>Total applications</p>
            <h2>{applications.length}</h2>
            <span className="stat-note">Across all statuses</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon blue">◷</span>
            <p>Interviews</p>
            <h2>{interviews}</h2>
            <span className="stat-note">Interview stage</span>
          </article>
          <article className="stat-card">
            <span className="stat-icon green">✓</span>
            <p>Offers received</p>
            <h2>{offers}</h2>
            <span className="stat-note">Keep going!</span>
          </article>
        </section>

        <section className="applications-panel">
          <div className="panel-heading">
            <div>
              <h2>Your applications</h2>
              <p>Track every opportunity in one place.</p>
            </div>
            <input
              aria-label="Search applications"
              placeholder="Search companies..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <p className="table-footer">Loading applications...</p>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>COMPANY</th><th>ROLE</th><th>STATUS</th><th>ACTION</th></tr>
                </thead>
                <tbody>
                  {filtered.map((app) => (
                    <tr key={app.id}>
                      <td><strong>{app.company}</strong></td>
                      <td>{app.role}</td>
                      <td>
                        <select
                          aria-label={`Status for ${app.company}`}
                          value={app.status}
                          onChange={(event) =>
                            void updateStatus(app.id, event.target.value)
                          }
                          className={`status-select status-${app.status.toLowerCase()}`}
                        >
                          {statuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="delete-button"
                          onClick={() => void deleteApplication(app.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={4}>No applications found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="table-footer">
            Showing {filtered.length} of {applications.length} applications
          </p>
        </section>

        <footer>InternTrack · Built to make your next opportunity easier to manage.</footer>
      </section>
    </main>
  );
}

export default App;
