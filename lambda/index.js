'use strict';

// API handler for api.human0.me
// Routes:
//   GET /health                -> 200
//   GET /human-stats           -> real stats (best-effort), fallback values
//   GET /api/human-stats       -> alias for /human-stats

const DEFAULT_ORIGINS = ['*'];

const getAllowedOrigins = () => {
  const raw = process.env.CORS_ORIGINS;
  if (!raw) return DEFAULT_ORIGINS;
  return raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
};

const allowOriginHeader = (event, origins) => {
  const requestOrigin =
    event?.headers?.origin ||
    event?.headers?.Origin ||
    event?.headers?.ORIGIN ||
    '';
  if (!requestOrigin) return origins.includes('*') ? '*' : origins[0] || '*';
  return origins.includes('*') || origins.includes(requestOrigin)
    ? requestOrigin
    : origins[0] || '*';
};

const jsonResponse = (event, statusCode, body) => {
  const origins = getAllowedOrigins();
  const originHeader = allowOriginHeader(event, origins);
  return {
    statusCode,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'access-control-allow-origin': originHeader,
      'access-control-allow-methods': 'GET,OPTIONS',
      'access-control-allow-headers': 'Content-Type,Authorization',
    },
    body: JSON.stringify(body),
  };
};

const health = (event) =>
  jsonResponse(event, 200, {
    status: 'ok',
    timestamp: new Date().toISOString(),
  });

const fetchHumanStats = async () => {
  // TODO: Replace this placeholder with a real data source (database, on-chain, etc.)
  const verifiedHumans = 1234;

  // Best-effort World Bank data with safe fallbacks
  let totalHumans = 8_260_837_082;
  let netChangePerSecond = 2.5; // approximate historical net increase per second
  let baselineYear = null;

  try {
    const worldBankBaseUrl = 'https://api.worldbank.org/v2/country/WLD/indicator';

    const [popRes, birthRes, deathRes] = await Promise.all([
      fetch(`${worldBankBaseUrl}/SP.POP.TOTL?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CBRT.IN?format=json&per_page=1`),
      fetch(`${worldBankBaseUrl}/SP.DYN.CDRT.IN?format=json&per_page=1`),
    ]);

    const parseLatest = async (res) => {
      if (!res.ok) return null;
      const json = await res.json();
      const latest = Array.isArray(json) && Array.isArray(json[1]) ? json[1][0] : null;
      return latest;
    };

    const [popLatest, birthLatest, deathLatest] = await Promise.all([
      parseLatest(popRes),
      parseLatest(birthRes),
      parseLatest(deathRes),
    ]);

    if (popLatest && typeof popLatest.value === 'number') {
      totalHumans = popLatest.value;
      if (typeof popLatest.date === 'string') {
        const year = Number(popLatest.date);
        if (Number.isFinite(year)) baselineYear = year;
      }
    }

    const birthRatePerThousand =
      birthLatest && typeof birthLatest.value === 'number' ? birthLatest.value : null;
    const deathRatePerThousand =
      deathLatest && typeof deathLatest.value === 'number' ? deathLatest.value : null;

    if (birthRatePerThousand !== null && deathRatePerThousand !== null) {
      const secondsPerYear = 365.25 * 24 * 60 * 60;
      const birthsPerYear = (birthRatePerThousand / 1000) * totalHumans;
      const deathsPerYear = (deathRatePerThousand / 1000) * totalHumans;
      const netPerYear = birthsPerYear - deathsPerYear;
      netChangePerSecond = netPerYear / secondsPerYear;
    }
  } catch {
    // keep fallback values
  }

  const baselineTimestamp = new Date().toISOString();

  const sources = [
    {
      name: 'World Bank - World Development Indicators',
      url: 'https://data.worldbank.org/indicator/SP.POP.TOTL?locations=1W',
      indicator: 'SP.POP.TOTL',
    },
    {
      name: 'World Bank - Crude birth rate (per 1,000 people)',
      url: 'https://data.worldbank.org/indicator/SP.DYN.CBRT.IN?locations=1W',
      indicator: 'SP.DYN.CBRT.IN',
    },
    {
      name: 'World Bank - Crude death rate (per 1,000 people)',
      url: 'https://data.worldbank.org/indicator/SP.DYN.CDRT.IN?locations=1W',
      indicator: 'SP.DYN.CDRT.IN',
    },
  ];

  return {
    verifiedHumans,
    totalHumans,
    baselinePopulation: totalHumans,
    baselineTimestamp,
    netChangePerSecond,
    baselineYear,
    sources,
  };
};

exports.handler = async (event) => {
  const method = event?.requestContext?.http?.method || event?.httpMethod || 'GET';
  const rawPath = event?.rawPath || event?.path || '/';
  const path = rawPath.toLowerCase();

  if (method === 'OPTIONS') {
    return jsonResponse(event, 200, { ok: true });
  }

  try {
    if (method === 'GET' && (path === '/health' || path === '/')) {
      return health(event);
    }

    if (method === 'GET' && (path === '/human-stats' || path === '/api/human-stats')) {
      const payload = await fetchHumanStats();
      return jsonResponse(event, 200, payload);
    }

    return jsonResponse(event, 404, { error: 'Not found', path });
  } catch (err) {
    console.error('Lambda error', err);
    return jsonResponse(event, 500, { error: 'Internal error' });
  }
};
