import React, { useMemo, useState } from "react";
import "./reports.css";

// Demo options
const REPORT_TYPES = ["Income Statement", "Balance Sheet", "Cash Flow", "Expense Summary"];
const PERIODS = [
  { id: "current-month", label: "Current Month" },
  { id: "last-month", label: "Last Month" },
  { id: "q1", label: "Q1" },
  { id: "q2", label: "Q2" },
  { id: "q3", label: "Q3" },
  { id: "q4", label: "Q4" },
  { id: "ytd", label: "Year to Date" },
  { id: "last-year", label: "Last Year" },
];
const FORMATS = ["PDF", "CSV", "XLSX"];

function nowISO() {
  return new Date().toISOString();
}

function makeReportName(type, period) {
  return `${type} - ${period}`;
}

export default function Reports() {
  const [form, setForm] = useState({
    type: REPORT_TYPES[0],
    period: PERIODS[0].id,
    format: FORMATS[0],
  });

  const [reports, setReports] = useState([]); // recent generated items
  const [selectedId, setSelectedId] = useState(null); // preview selection

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onReset = () =>
    setForm({ type: REPORT_TYPES[0], period: PERIODS[0].id, format: FORMATS[0] });

  const onGenerate = (e) => {
    e.preventDefault();
    const periodLabel = PERIODS.find((p) => p.id === form.period)?.label ?? form.period;
    const item = {
      id: crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: makeReportName(form.type, periodLabel),
      generatedAt: nowISO(),
      type: form.type,
      period: periodLabel,
      format: form.format,
      // demo payload for preview
      content: {
        title: form.type,
        period: periodLabel,
        generatedAt: new Date().toLocaleString(),
        lines: [
          { label: "Revenue", value: 120000 },
          { label: "Expenses", value: 45000 },
          { label: "Net", value: 75000 },
        ],
      },
    };
    setReports((r) => [item, ...r].slice(0, 20));
    setSelectedId(item.id);
  };

  const onDelete = (id) => {
    const ok = window.confirm("Delete this report?");
    if (!ok) return;
    setReports((prev) => prev.filter((r) => r.id !== id));
    setSelectedId((sid) => (sid === id ? null : sid));
  };

  const selected = useMemo(
    () => reports.find((r) => r.id === selectedId) || null,
    [reports, selectedId]
  );

  const onDownload = () => {
    if (!selected) return;
    const filename = `${selected.name.replace(/\s+/g, "_")}.${selected.format.toLowerCase()}`;
    let blob;

    if (selected.format === "CSV") {
      const csv = ["Label,Value", ...selected.content.lines.map((l) => `${l.label},${l.value}`)].join("\n");
      blob = new Blob([csv], { type: "text/csv" });
    } else if (selected.format === "XLSX") {
      // Placeholder content; for real XLSX, use a library like SheetJS
      const csv = ["Label,Value", ...selected.content.lines.map((l) => `${l.label},${l.value}`)].join("\n");
      blob = new Blob([csv], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    } else {
      // Placeholder PDF text payload; replace with real PDF generation as needed
      const text =
        `${selected.content.title}\n` +
        `Period: ${selected.content.period}\n` +
        `Generated: ${selected.content.generatedAt}\n\n` +
        selected.content.lines.map((l) => `${l.label}: ${l.value}`).join("\n");
      blob = new Blob([text], { type: "application/pdf" });
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onPrint = () => {
    if (!selected) return;
    const w = window.open("", "_blank", "width=900,height=700");
    if (!w) return;
    w.document.write(`
      <html>
        <head>
          <title>${selected.name}</title>
          <style>
            body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; padding: 24px; }
            h1 { margin: 0 0 8px 0; font-size: 20px; }
            .muted { color: #6b7280; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <h1>${selected.content.title}</h1>
          <div class="muted">Period: ${selected.content.period} · Generated: ${selected.content.generatedAt}</div>
          <table>
            <thead><tr><th>Label</th><th>Value</th></tr></thead>
            <tbody>
              ${selected.content.lines.map((l) => `<tr><td>${l.label}</td><td>${l.value}</td></tr>`).join("")}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `);
    w.document.close();
  };

  return (
    <div className="reports-page">
      <h2 className="set-title1">Financial Reports</h2>
      <p className="set-sub">Generate and download financial reports</p>

      <div className="grid">
        {/* Left: form + recent */}
        <div className="col">
          <div className="panel">
            <h4 className="panel-title">Generate Report</h4>
            <form className="report-form" onSubmit={onGenerate}>
              <label className="set-field">
                <span className="set-label">Report Type</span>
                <select name="type" value={form.type} onChange={onChange}>
                  {REPORT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>

              <label className="set-field">
                <span className="set-label">Period</span>
                <select name="period" value={form.period} onChange={onChange}>
                  {PERIODS.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </label>

              <label className="set-field">
                <span className="set-label">Format</span>
                <select name="format" value={form.format} onChange={onChange}>
                  {FORMATS.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </label>

              <div className="toolbar">
                <button type="button" className="btn ghost" onClick={onReset}>Reset</button>
                <button type="submit" className="btn primary">Generate Report</button>
              </div>
            </form>
          </div>

          <div className="panel">
            <h4 className="panel-title">Recent Reports</h4>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Generated</th>
                    <th>Period</th>
                    <th>Format</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className={selectedId === r.id ? "active" : ""}>
                      <td>{r.name}</td>
                      <td>{new Date(r.generatedAt).toLocaleString()}</td>
                      <td>{r.period}</td>
                      <td>{r.format}</td>
                      <td>
                        <button className="link" onClick={() => setSelectedId(r.id)}>Preview</button>
                        <span className="sep"> · </span>
                        <button className="link danger" onClick={() => onDelete(r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {reports.length === 0 && (
                    <tr>
                      <td colSpan={5} className="empty">No results.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: preview */}
        <div className="col">
          <div className="panel preview-panel">
            <div className="preview-head">
              <h4 className="panel-title">Report Preview</h4>
              <div className="actions">
                <button className="btn ghost" onClick={onPrint} disabled={!selected}>Print</button>
                <button className="btn primary" onClick={onDownload} disabled={!selected}>Download</button>
              </div>
            </div>

            {!selected ? (
              <div className="preview-empty">
                <div className="preview-icon">📄</div>
                <div className="preview-text">Select a report to preview</div>
                <div className="preview-sub">Generated reports will appear here before downloading</div>
              </div>
            ) : (
              <div className="preview-body">
                <h3 className="preview-title">{selected.content.title}</h3>
                <div className="preview-meta">
                  Period: {selected.content.period} · Generated: {selected.content.generatedAt}
                </div>
                <ul className="preview-list">
                  {selected.content.lines.map((l, idx) => (
                    <li key={idx}>
                      <span>{l.label}</span>
                      <span>{l.value.toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}