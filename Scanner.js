import React, { useState } from 'react';
import axios from 'axios';
import jsQR from 'jsqr';

const RISK_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f59e0b',
  MEDIUM: '#eab308',
  LOW: '#10b981',
};

function RiskBar({ score, level }) {
  return (
    <div className="risk-bar-container">
      <div className="risk-bar-label">
        <span>Risk Score</span>
        <span style={{ color: RISK_COLORS[level] || '#94a3b8' }}>
          {score}/100 — {level}
        </span>
      </div>
      <div className="risk-bar">
        <div
          className="risk-bar-fill"
          style={{
            width: `${score}%`,
            background: RISK_COLORS[level] || '#94a3b8',
          }}
        />
      </div>
    </div>
  );
}

function ResultCard({ result, type, onDownload, downloading }) {
  if (!result) return null;
  const isPhishing = result.is_phishing;
  const actionMessages = {
    CRITICAL: '🚫 Do NOT visit this URL. It is highly suspicious and may be dangerous.',
    HIGH: '⚠️ Very suspicious. Verify the source through official channels before proceeding.',
    MEDIUM: '🟡 Risky. Exercise extreme caution and confirm details before trusting this URL.',
    LOW: '✅ Likely safe. Continue carefully and avoid entering sensitive information unless verified.',
  };

  const renderSummaryCard = (title, rows) => (
    <div className="enrichment-card">
      <div className="enrichment-title">{title}</div>
      {rows.map((row) => (
        <div key={row.label} className="enrichment-row">
          <span>{row.label}</span>
          <span>{row.value}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div
      className="result-card"
      style={{
        border: `1px solid ${isPhishing ? '#ef444440' : '#10b98140'}`,
      }}
    >
      <div className="result-header">
        <div className="result-icon">{isPhishing ? '🚨' : '✅'}</div>
        <div>
          <div className="result-title" style={{ color: isPhishing ? '#f87171' : '#34d399' }}>
            {isPhishing ? 'Phishing Detected!' : 'Looks Safe'}
          </div>
          <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
            Confidence: {(result.confidence * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <RiskBar score={result.risk_score} level={result.risk_level} />

      <div style={{ marginTop: 12, padding: 12, borderRadius: 10, background: isPhishing ? 'rgba(248,113,113,0.08)' : 'rgba(52,211,153,0.08)', color: isPhishing ? '#b91c1c' : '#047857', fontSize: 13, fontWeight: 600 }}>
        {actionMessages[result.risk_level] || 'Review the indicators and proceed with caution.'}
      </div>

      {result.indicators?.length > 0 && (
        <div className="indicators-list">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#94a3b8' }}>
            Threat Indicators ({result.indicators.length})
          </div>
          {result.indicators.map((ind, i) => (
            <div key={i} className="indicator-item">
              <span>⚠️</span>
              <span>{ind}</span>
            </div>
          ))}
        </div>
      )}

      {result.analysis && Object.keys(result.analysis).length > 0 && (
        <div className="analysis-details">
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10, color: '#64748b' }}>Analysis Details</div>
          <div className="analysis-grid">
            {Object.entries(result.analysis).map(([key, value]) => (
              <div key={key} className="analysis-row">
                <div className="analysis-key">{key.replace(/_/g, ' ')}</div>
                <div className="analysis-value">{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value || '—'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(result.whois || result.ssl || result.virus_total || result.safe_browsing) && (
        <div className="enrichment-grid">
          {result.whois && renderSummaryCard('WHOIS Lookup', [
            { label: 'Registrar', value: result.whois.registrar || 'N/A' },
            { label: 'Created', value: result.whois.created_date || 'N/A' },
            { label: 'Expiry', value: result.whois.expiry_date || 'N/A' },
            { label: 'Age (days)', value: result.whois.domain_age_days ?? 'N/A' },
          ])}
          {result.ssl && renderSummaryCard('SSL Certificate', [
            { label: 'Valid', value: result.ssl.valid ? 'Yes' : 'No' },
            { label: 'Issuer', value: result.ssl.issuer || 'N/A' },
            { label: 'Valid To', value: result.ssl.valid_to || 'N/A' },
            { label: 'Days Left', value: result.ssl.days_until_expiry ?? 'N/A' },
          ])}
          {result.virus_total && renderSummaryCard('VirusTotal', [
            { label: 'Available', value: result.virus_total.available ? 'Yes' : 'No' },
            { label: 'Malicious', value: result.virus_total.stats?.malicious ?? 'N/A' },
            { label: 'Suspicious', value: result.virus_total.stats?.suspicious ?? 'N/A' },
            { label: 'Undetected', value: result.virus_total.stats?.undetected ?? 'N/A' },
          ])}
          {result.safe_browsing && renderSummaryCard('Safe Browsing', [
            { label: 'Safe', value: result.safe_browsing.safe ? 'Yes' : 'No' },
            { label: 'Available', value: result.safe_browsing.available ? 'Yes' : 'No' },
            { label: 'Matches', value: result.safe_browsing.details?.length ?? 0 },
          ])}
        </div>
      )}

      {result.recommendations?.length > 0 && (
        <div className="recommendation-box" style={{ marginTop: 18 }}>
          <div className="recommendation-title">AI Recommendations</div>
          {result.recommendations.map((rec, i) => (
            <div key={i} className="recommendation-item">{rec}</div>
          ))}
        </div>
      )}

      {onDownload && (
        <div className="result-footer">
          <button className="btn-report" onClick={onDownload} disabled={downloading}>
            {downloading ? 'Generating report...' : 'Download PDF Report'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Scanner() {
  const [mode, setMode] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [emailData, setEmailData] = useState({ sender: '', subject: '', body: '' });
  const [qrFileName, setQrFileName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const decodeQrCodeFromFile = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const image = new Image();
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const decoded = jsQR(imageData.data, imageData.width, imageData.height);

          if (!decoded) {
            setError('No QR code found in the selected image. Please upload a clearer image.');
            return;
          }

          const decodedUrl = decoded.data.trim();
          if (!decodedUrl.startsWith('http://') && !decodedUrl.startsWith('https://')) {
            setError('The QR code does not appear to contain a valid URL.');
            return;
          }

          setUrlInput(decodedUrl);
          setMode('url');
          setError(null);
          setResult(null);
        };
        image.src = reader.result;
      } catch (scanErr) {
        setError('Unable to read this QR code image. Please try another file.');
      }
    };

    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      let response;
      if (mode === 'url' || mode === 'qr') {
        response = await axios.post('/api/scan/url', { url: urlInput });
      } else {
        response = await axios.post('/api/scan/email', emailData);
      }
      setResult(response.data);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Scan failed';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async () => {
    if (!result) return;
    setDownloading(true);
    setError(null);

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Unable to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `scan-report-${result.scan_id || 'report'}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'PDF export failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>URL & Email Scanner</h1>
      <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: 14 }}>
        Scan URLs or emails for phishing indicators using AI analysis
      </p>

      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['url', 'qr', 'email'].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setResult(null); setError(null); }}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              background: mode === m ? 'rgba(99,102,241,0.2)' : 'transparent',
              borderColor: mode === m ? '#6366f1' : 'rgba(255,255,255,0.1)',
              color: mode === m ? '#818cf8' : '#94a3b8',
            }}
          >
            {m === 'url' ? '🔗 URL Scan' : m === 'qr' ? '📷 QR URL Scan' : '📧 Email Scan'}
          </button>
        ))}
      </div>

      {/* QR Mode */}
      {mode === 'qr' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="qr-upload-box">
            <label className="qr-upload-label">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setQrFileName(file ? file.name : '');
                  decodeQrCodeFromFile(file);
                }}
              />
              <span>Choose QR code image</span>
            </label>
            {qrFileName && <div className="qr-file-name">Selected: {qrFileName}</div>}
            <div className="qr-help-text">Upload a QR code that contains a URL, then the decoded link will be scanned automatically.</div>
          </div>
        </div>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="scanner-form">
          <input
            className="scanner-input"
            placeholder="https://example.com/login"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleScan()}
          />
          <button className="btn-scan" onClick={handleScan} disabled={loading || !urlInput}>
            {loading ? '⏳ Scanning...' : '🔍 Scan URL'}
          </button>
        </div>
      )}

      {mode === 'qr' && urlInput && (
        <div className="qr-decoded-banner">
          <strong>Decoded URL:</strong> {urlInput}
          <button className="btn-scan" onClick={handleScan} disabled={loading} style={{ marginLeft: 12 }}>
            {loading ? '⏳ Scanning...' : '🔍 Scan Decoded Link'}
          </button>
        </div>
      )}

      {/* Email Mode */}
      {mode === 'email' && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input
              className="scanner-input"
              placeholder="Sender email address"
              value={emailData.sender}
              onChange={(e) => setEmailData({ ...emailData, sender: e.target.value })}
            />
            <input
              className="scanner-input"
              placeholder="Email subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
            <textarea
              className="scanner-input"
              placeholder="Paste email body here..."
              rows={6}
              value={emailData.body}
              onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
              style={{ resize: 'vertical' }}
            />
            <button
              className="btn-scan"
              onClick={handleScan}
              disabled={loading || !emailData.sender || !emailData.body}
              style={{ alignSelf: 'flex-end' }}
            >
              {loading ? '⏳ Analyzing...' : '📧 Analyze Email'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 8,
          padding: 16,
          color: '#f87171',
          fontSize: 14,
        }}>
          ❌ {error}
        </div>
      )}

      <ResultCard result={result} type={mode} onDownload={downloadReport} downloading={downloading} />
    </div>
  );
}
