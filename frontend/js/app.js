(function () {
  const MONTHS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const CHART_COLORS = ["#28c76f", "#2aa8ff", "#ffbf4d", "#7b7fff", "#ff5b6e", "#00d4c7"];
  const DASHBOARD_REFERENCE_DATE = new Date(2026, 3, 9, 12);
  const DASHBOARD_MIN_DATE = new Date(2018, 0, 1, 12);
  const DASHBOARD_DEFAULT_START = "2018-01-01";
  const DASHBOARD_DEFAULT_END = "2026-04-09";
  const TYPE_FILTERS = [
    { id: "all", label: "Todos" },
    { id: "acao_br", label: "Ações BR" },
    { id: "fii", label: "FIIs" },
    { id: "acao_int", label: "Internacional" },
    { id: "renda_fixa", label: "Renda Fixa" },
    { id: "previdência", label: "Previdência" },
    { id: "cripto", label: "Cripto" },
  ];
  const NAV_ITEMS = [
    { id: "dashboard", label: "Controle Geral", icon: "dashboard" },
    { id: "assets", label: "Ativos", icon: "bars" },
    { id: "proventos", label: "Proventos", icon: "money" },
    { id: "smart_portfolio", label: "Smart Portfólio", icon: "spark" },
    { id: "ai", label: "FinanceAI", icon: "brain" },
    { id: "broker", label: "Traide Análise", icon: "candles" },
  ];
  let RAW_ASSETS = [];
  const AI_INSIGHTS = [
    { id: "1", assetId: "6", type: "alert", severity: "high", title: "Queda acentuada - MGLU3", message: "Magazine Luiza caiu forte na última semana. Vale revisar exposição e definir stop de risco.", timestamp: "2026-04-08T10:30:00-03:00" },
    { id: "2", assetId: "14", type: "suggestion", severity: "low", title: "Momentum forte - NVDA", message: "NVIDIA segue com tracao positiva, nota de IA elevada e tendência compradora consistente.", timestamp: "2026-04-08T09:15:00-03:00" },
    { id: "3", assetId: "1", type: "insight", severity: "medium", title: "Dividendo atrativo - PETR4", message: "Petrobras continua acima da média do setor em dividend yield e sustentacao de caixa.", timestamp: "2026-04-08T08:45:00-03:00" },
    { id: "4", assetId: "4", type: "suggestion", severity: "low", title: "Oportunidade - BBAS3", message: "Banco do Brasil combina P/L comprimido com retorno atrativo em dividendos.", timestamp: "2026-04-08T08:00:00-03:00" },
    { id: "5", assetId: "13", type: "alert", severity: "high", title: "Volatilidade elevada - TSLA", message: "Tesla segue sensivel a oscilacoes de curto prazo. Melhor manter tamanho de posicao controlado.", timestamp: "2026-04-08T07:30:00-03:00" },
    { id: "6", assetId: "8", type: "insight", severity: "low", title: "FII estável - HGLG11", message: "HGLG11 preserva fluxo de proventos e comportamento defensivo na carteira.", timestamp: "2026-04-08T07:00:00-03:00" },
    { id: "7", assetId: "12", type: "suggestion", severity: "low", title: "Blue chip robusta - MSFT", message: "Microsoft combina crescimento operacional com qualidade de negocio acima da média.", timestamp: "2026-04-08T06:30:00-03:00" },
    { id: "8", assetId: "2", type: "alert", severity: "medium", title: "Correcao em VALE3", message: "Vale perde força no curtissimo prazo e merece monitoramento com minerio e cambio.", timestamp: "2026-04-08T06:00:00-03:00" },
  ];
  const DIVIDEND_MONTHLY_HISTORY = [
    { year: 2025, month: 5, label: "Mai/25", value: 218.4, aporte: 3200 },
    { year: 2025, month: 6, label: "Jun/25", value: 236.2, aporte: 3400 },
    { year: 2025, month: 7, label: "Jul/25", value: 251.9, aporte: 3600 },
    { year: 2025, month: 8, label: "Ago/25", value: 279.1, aporte: 3550 },
    { year: 2025, month: 9, label: "Set/25", value: 301.6, aporte: 3700 },
    { year: 2025, month: 10, label: "Out/25", value: 318.9, aporte: 3900 },
    { year: 2025, month: 11, label: "Nov/25", value: 320.5, aporte: 3800 },
    { year: 2025, month: 12, label: "Dez/25", value: 410.25, aporte: 4100 },
    { year: 2026, month: 1, label: "Jan/26", value: 385, aporte: 4000 },
    { year: 2026, month: 2, label: "Fev/26", value: 450.8, aporte: 4200 },
    { year: 2026, month: 3, label: "Mar/26", value: 520.1, aporte: 4300 },
    { year: 2026, month: 4, label: "Abr/26", value: 610, aporte: 4500 },
  ];
  const SMART_RANGE_OPTIONS = [
    { id: "7d", label: "7d", days: 7 },
    { id: "30d", label: "30d", days: 30 },
    { id: "1y", label: "1y", days: 252 },
  ];
  const BROKER_RANGE_OPTIONS = [
    { id: "dia", label: "Dia", candles: 24 },
    { id: "semana", label: "Semana", candles: 25 },
    { id: "mes", label: "Mes", candles: 30 },
    { id: "ano", label: "Ano", candles: 24 },
  ];
  const SMART_TARGET_ALLOCATION = [
    { name: "Ações", target: 40 },
    { name: "FIIs", target: 20 },
    { name: "Renda Fixa", target: 35 },
    { name: "Cripto", target: 5 },
  ];
  const SMART_BENCHMARK_CONFIG = [
    { id: "cdi", label: "CDI", color: "#2aa8ff", annualRate: 11.4, waveScale: 0.002, waveFreq: 0.11, wavePhase: 0.6 },
    { id: "ibov", label: "IBOV", color: "#ffbf4d", annualRate: 13.2, waveScale: 0.006, waveFreq: 0.16, wavePhase: 1.3 },
    { id: "sp500", label: "S&P500", color: "#7b7fff", annualRate: 10.1, waveScale: 0.005, waveFreq: 0.14, wavePhase: 2.1 },
  ];
  const ICONS = {
    dashboard: '<path d="M4 13h7V4H4zm9 7h7v-9h-7zM4 20h7v-5H4zm9-12h7V4h-7z"></path>',
    bars: '<path d="M5 20V10M12 20V4M19 20v-7"></path><path d="M3 20h18"></path>',
    brain: '<path d="M9 3a3 3 0 0 0-3 3v1.2A3.8 3.8 0 0 0 3 11a3.8 3.8 0 0 0 3 3.8V16a3 3 0 0 0 3 3h1v-6H8"></path><path d="M15 3a3 3 0 0 1 3 3v1.2A3.8 3.8 0 0 1 21 11a3.8 3.8 0 0 1-3 3.8V16a3 3 0 0 1-3 3h-1v-6h2"></path><path d="M12 7v10"></path>',
    candles: '<path d="M6 4v16M18 4v16"></path><rect x="4" y="8" width="4" height="5" rx="1"></rect><rect x="16" y="11" width="4" height="6" rx="1"></rect><rect x="10" y="6" width="4" height="10" rx="1"></rect>',
    trendUp: '<path d="M4 15l5-5 4 4 7-8"></path><path d="M14 6h6v6"></path>',
    trendDown: '<path d="M4 9l5 5 4-4 7 8"></path><path d="M14 18h6v-6"></path>',
    collapse: '<path d="M15 18l-6-6 6-6"></path>',
    expand: '<path d="M9 18l6-6-6-6"></path>',
    bot: '<rect x="5" y="7" width="14" height="11" rx="3"></rect><path d="M12 3v4M9 12h.01M15 12h.01M9 16h6"></path>',
    user: '<path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Z"></path><path d="M4 20a8 8 0 0 1 16 0"></path>',
    send: '<path d="M3 11.5 21 3l-5.6 18-3.6-7.2z"></path><path d="M11.8 13.8 21 3"></path>',
    close: '<path d="m6 6 12 12M18 6 6 18"></path>',
    alert: '<path d="M12 4 3.5 19h17Z"></path><path d="M12 9v4M12 17h.01"></path>',
    bulb: '<path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.6 14a5 5 0 1 1 6.8 0c-.9.8-1.4 1.6-1.4 2.5h-4c0-.9-.5-1.7-1.4-2.5Z"></path>',
    spark: '<path d="M4 17l5-6 4 3 7-8"></path><path d="M4 20h16"></path>',
    buy: '<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8M12 8v8"></path>',
    hold: '<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path>',
    sell: '<circle cx="12" cy="12" r="9"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path>',
    money: '<path d="M4 7h16v10H4z"></path><path d="M12 10v4"></path><path d="M10.2 11.5a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0Z"></path>',
    shield: '<path d="M12 3 5 6v5c0 4.2 2.6 8 7 10 4.4-2 7-5.8 7-10V6z"></path>',
    activity: '<path d="M4 13h4l2-4 4 8 2-4h4"></path>',
  };

  const app = {
    ticker: document.getElementById("ticker-bar"),
    sidebar: document.getElementById("sidebar"),
    main: document.getElementById("main-content"),
    chat: document.getElementById("chat-root"),
    toast: document.getElementById("toast-container"),
  };

  const currencyFormatter = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const numberFormatter = new Intl.NumberFormat("pt-BR");

  const state = {
    assets: [],
    activeTab: "dashboard",
    sidebarCollapsed: false,
    assetFilter: "all",
    assetSearch: "",
    dashboardDateStart: DASHBOARD_DEFAULT_START,
    dashboardDateEnd: DASHBOARD_DEFAULT_END,
    smartRange: "30d",
    brokerRange: "dia",
    brokerAllocationFilter: "all",
    brokerAssetSearch: "",
    aiSimFromClass: "Ações",
    aiSimToClass: "Renda Fixa",
    aiSimShiftPercent: 5,
    selectedAssetId: null,
    orderType: "compra",
    orderQty: "10",
    orderHistory: [],
    chatOpen: false,
    chatInput: "",
    messages: [
      {
        role: "bot",
        text: "Ola! Sou o FinanceAI Assistant. Posso resumir a carteira, mostrar ativos em queda, sugerir oportunidades, explicar risco e dividendos.",
      },
    ],
  };

  state.selectedAssetId = null;

  function icon(name, className) {
    const safeClass = className ? " " + className : "";
    return '<svg class="icon' + safeClass + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || "") + "</svg>";
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeText(value) {
    return String(value)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function round(value, places) {
    const factor = Math.pow(10, places || 2);
    return Math.round(value * factor) / factor;
  }

  function formatCurrency(value, digits) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: digits == null ? 2 : digits,
      maximumFractionDigits: digits == null ? 2 : digits,
    }).format(value);
  }

  function formatCurrencyCompact(value) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      notation: "compact",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value);
  }

  function formatNumber(value) {
    return numberFormatter.format(value);
  }

  function truncateLabel(value, maxLength) {
    const text = String(value == null ? "" : value);
    if (text.length <= maxLength) {
      return text;
    }
    return text.slice(0, Math.max(1, maxLength - 1)) + "…";
  }

  function formatPercent(value, digits) {
    return round(value, digits == null ? 2 : digits).toLocaleString("pt-BR", {
      minimumFractionDigits: digits == null ? 2 : digits,
      maximumFractionDigits: digits == null ? 2 : digits,
    }) + "%";
  }

  function formatSignedPercent(value, digits) {
    return (value >= 0 ? "+" : "") + formatPercent(value, digits);
  }

  function formatDateTime(value) {
    return new Date(value).toLocaleString("pt-BR");
  }

  function addDays(date, amount) {
    const next = new Date(date.getTime());
    next.setDate(next.getDate() + amount);
    return next;
  }

  function dateToInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return year + "-" + month + "-" + day;
  }

  function parseInputDate(value) {
    const parts = String(value || "").split("-");
    if (parts.length !== 3) {
      return new Date(DASHBOARD_REFERENCE_DATE.getTime());
    }

    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]), 12);
  }

  function differenceInDays(start, end) {
    const startValue = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endValue = new Date(end.getFullYear(), end.getMonth(), end.getDate()).getTime();
    return Math.round((endValue - startValue) / 86400000);
  }

  function clampDate(date, min, max) {
    if (date.getTime() < min.getTime()) {
      return new Date(min.getTime());
    }

    if (date.getTime() > max.getTime()) {
      return new Date(max.getTime());
    }

    return new Date(date.getTime());
  }

  function formatDateShort(date) {
    return date.toLocaleDateString("pt-BR");
  }

  function formatDateDayMonth(date) {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  function formatDateMedium(date) {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" });
  }

  function formatDashboardRangeLabel(start, end) {
    if (dateToInputValue(start) === dateToInputValue(end)) {
      return formatDateMedium(start);
    }

    return formatDateMedium(start) + " ate " + formatDateMedium(end);
  }

  function createSeededRandom(seedInput) {
    const text = String(seedInput);
    let seed = 0;

    for (let index = 0; index < text.length; index += 1) {
      seed = (seed * 31 + text.charCodeAt(index)) >>> 0;
    }

    return function random() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
  }

  function generateHistory(base, trend, volatility, days, seedKey) {
    const random = createSeededRandom(seedKey);
    const history = [];
    let price = base * (1 - trend * days * 0.008);

    for (let index = 0; index < days; index += 1) {
      const drift = trend * 0.009;
      const noise = (random() - 0.48) * volatility * 0.013;
      price += price * (drift + noise);
      price = Math.max(price, base * 0.3);
      history.push(round(price, 2));
    }

    return history;
  }

  function generateCandles(history, seedKey) {
    const random = createSeededRandom(seedKey + "-candles");
    return history.map(function mapHistory(close, index) {
      const open = index > 0 ? history[index - 1] : close * (0.985 + random() * 0.02);
      const high = Math.max(open, close) * (1 + random() * 0.018);
      const low = Math.min(open, close) * (1 - random() * 0.018);
      return {
        open: round(open, 2),
        high: round(high, 2),
        low: round(low, 2),
        close: round(close, 2),
      };
    });
  }

  function enrichAssets(rawAssets) {
    return rawAssets.map(function mapAsset(asset) {
      const change = round(asset.price - asset.previousPrice, 2);
      const changePercent = round((change / asset.previousPrice) * 100, 2);
      const trend = changePercent > 0 ? 0.32 : -0.28;
      const volatility = asset.risk === "Alto" ? 3 : asset.risk === "Moderado" ? 2 : 1;
      const history = generateHistory(asset.price, trend, volatility, 30, asset.ticker);

      return Object.assign({}, asset, {
        change: change,
        changePercent: changePercent,
        history: history,
        candlestick: generateCandles(history, asset.ticker),
      });
    });
  }

  function getLiquidAssets() {
    return state.assets.filter(function filterAsset(asset) {
      return asset.volume > 0;
    });
  }

  function getSelectedAsset() {
    const found = state.assets.find(function findAsset(asset) {
      return asset.id === state.selectedAssetId;
    });
    return found || getLiquidAssets()[0] || state.assets[0];
  }

  function getBrokerRangeConfig() {
    return (
      BROKER_RANGE_OPTIONS.find(function(option) {
        return option.id === state.brokerRange;
      }) || BROKER_RANGE_OPTIONS[0]
    );
  }

  function getBrokerFilteredAssets() {
    const term = normalizeText(state.brokerAssetSearch);
    return getLiquidAssets()
      .filter(function(asset) {
        if (state.brokerAllocationFilter !== "all" && asset.type !== state.brokerAllocationFilter) {
          return false;
        }
        if (!term) {
          return true;
        }
        return normalizeText(asset.ticker).includes(term) || normalizeText(asset.name).includes(term);
      })
      .sort(function(a, b) {
        return normalizeText(a.ticker).localeCompare(normalizeText(b.ticker));
      });
  }

  function getBrokerMoversData() {
    const liquid = getLiquidAssets();
    const gainers = liquid
      .slice()
      .sort(function(a, b) {
        return b.changePercent - a.changePercent;
      })
      .slice(0, 5)
      .map(function(asset) {
        return {
          ticker: asset.ticker,
          name: asset.name,
          changePercent: asset.changePercent,
          direction: "up",
        };
      });
    const losers = liquid
      .slice()
      .sort(function(a, b) {
        return a.changePercent - b.changePercent;
      })
      .slice(0, 5)
      .map(function(asset) {
        return {
          ticker: asset.ticker,
          name: asset.name,
          changePercent: asset.changePercent,
          direction: "down",
        };
      });

    return gainers.concat(losers);
  }

  function getPortfolioMetrics() {
    const activeAssets = state.assets.filter(function filterByQuantity(asset) {
      return asset.quantity > 0;
    });

    const totalInvested = activeAssets.reduce(function sumInvested(total, asset) {
      return total + asset.avgPrice * asset.quantity;
    }, 0);
    const totalCurrent = activeAssets.reduce(function sumCurrent(total, asset) {
      return total + asset.price * asset.quantity;
    }, 0);
    const totalReturn = totalCurrent - totalInvested;
    const returnPercent = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0;

    const allocationMap = {};
    activeAssets.forEach(function countAllocation(asset) {
      const total = asset.price * asset.quantity;
      allocationMap[asset.typeLabel] = (allocationMap[asset.typeLabel] || 0) + total;
    });

    const allocation = Object.keys(allocationMap)
      .map(function mapAllocation(name) {
        const value = allocationMap[name];
        return {
          name: name,
          value: round(value, 0),
          percent: totalCurrent > 0 ? round((value / totalCurrent) * 100, 2) : 0,
        };
      })
      .sort(function sortAllocation(a, b) {
        return b.value - a.value;
      });

    const upCount = state.assets.filter(function filterUp(asset) {
      return asset.changePercent > 0;
    }).length;
    const downCount = state.assets.filter(function filterDown(asset) {
      return asset.changePercent < 0;
    }).length;

    const avgRiskValue =
      activeAssets.reduce(function sumRisk(total, asset) {
        return total + (asset.risk === "Alto" ? 3 : asset.risk === "Moderado" ? 2 : 1);
      }, 0) / (activeAssets.length || 1);

    return {
      totalInvested: round(totalInvested, 0),
      totalCurrent: round(totalCurrent, 0),
      totalReturn: round(totalReturn, 0),
      returnPercent: round(returnPercent, 2),
      allocation: allocation,
      upCount: upCount,
      downCount: downCount,
      avgRisk: avgRiskValue <= 1.5 ? "Baixo" : avgRiskValue <= 2.2 ? "Moderado" : "Alto",
      maxDrawdown: -8.3,
      sharpeRatio: 1.42,
      volatility: 14.8,
    };
  }

  function getTopAssets() {
    return state.assets
      .filter(function filterByQuantity(asset) {
        return asset.quantity > 0;
      })
      .map(function mapAsset(asset) {
        const returnPercent = asset.avgPrice > 0 ? round(((asset.price - asset.avgPrice) / asset.avgPrice) * 100, 1) : 0;
        return {
          ticker: asset.ticker,
          name: asset.name,
          returnPercent: returnPercent,
        };
      })
      .sort(function sortAssets(a, b) {
        return b.returnPercent - a.returnPercent;
      })
      .slice(0, 6);
  }

  function getPortfolioHistory() {
    const metrics = getPortfolioMetrics();
    const base = metrics.totalInvested * 0.78;
    const diff = metrics.totalCurrent - base;
    const oscillation = [0, 0.02, -0.01, 0.015, -0.008, 0.01, 0.02, -0.005, 0.013, 0.028, 0.016, 0.03];

    return MONTHS.map(function mapMonth(month, index) {
      const progress = index / (MONTHS.length - 1);
      const value = base + diff * progress + metrics.totalCurrent * oscillation[index];
      return {
        label: month,
        value: round(value, 0),
      };
    });
  }

  function getDashboardRange() {
    let start = clampDate(parseInputDate(state.dashboardDateStart), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);
    let end = clampDate(parseInputDate(state.dashboardDateEnd), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);

    if (start.getTime() > end.getTime()) {
      start = new Date(end.getTime());
    }

    return {
      start: start,
      end: end,
      startValue: dateToInputValue(start),
      endValue: dateToInputValue(end),
      totalDays: differenceInDays(start, end) + 1,
      label: formatDashboardRangeLabel(start, end),
    };
  }

  function getDashboardSeed(asset) {
    return String(asset.id + "-" + asset.ticker)
      .split("")
      .reduce(function(acc, char) {
        return (acc * 31 + char.charCodeAt(0)) % 997;
      }, 17);
  }

  function getDashboardPriceAtDate(asset, targetDate) {
    const maxDays = differenceInDays(DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE) || 1;
    const daysAgo = Math.max(0, Math.min(maxDays, differenceInDays(targetDate, DASHBOARD_REFERENCE_DATE)));
    const progress = 1 - daysAgo / maxDays;
    const smoothProgress = progress * progress * (3 - 2 * progress);
    const seed = getDashboardSeed(asset);
    const riskAmplitude = asset.risk === "Alto" ? 0.16 : asset.risk === "Moderado" ? 0.1 : 0.06;
    const startMultiplier = 0.82 + (seed % 11) * 0.018;
    const startPrice = asset.avgPrice * startMultiplier;
    const wave =
      Math.sin(progress * Math.PI * (2.2 + (seed % 5) * 0.22) + seed * 0.08) *
      asset.price *
      riskAmplitude *
      progress *
      (1 - progress) *
      1.45;
    const secondaryWave =
      Math.cos(progress * Math.PI * (1.6 + (seed % 7) * 0.13)) *
      asset.price *
      0.03 *
      progress *
      (1 - progress);
    const simulatedPrice = startPrice + (asset.price - startPrice) * smoothProgress + wave + secondaryWave;

    return Math.max(asset.price * 0.35, round(simulatedPrice, 2));
  }

  function formatDashboardAxisLabel(date, totalDays) {
    if (totalDays > 180) {
      return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
    }

    if (totalDays > 45) {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
    }

    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }

  function sampleDataPoints(items, targetCount) {
    if (items.length <= targetCount) {
      return items;
    }

    const step = (items.length - 1) / (targetCount - 1);
    const seen = {};

    return Array.from({ length: targetCount }, function(_, index) {
      return items[Math.round(step * index)];
    }).filter(function(item) {
      const key = item.date ? item.date.getTime() : item.label;
      if (seen[key]) {
        return false;
      }
      seen[key] = true;
      return true;
    });
  }

  function getDashboardData() {
    const range = getDashboardRange();
    const activeAssets = state.assets.filter(function filterByQuantity(asset) {
      return asset.quantity > 0;
    });

    const series = Array.from({ length: range.totalDays }, function(_, offset) {
      const date = addDays(range.start, offset);
      const totalValue = activeAssets.reduce(function(sum, asset) {
        return sum + getDashboardPriceAtDate(asset, date) * asset.quantity;
      }, 0);

      return {
        date: date,
        label: formatDashboardAxisLabel(date, range.totalDays),
        value: round(totalValue, 0),
      };
    });

    const startValue = series[0] ? series[0].value : 0;
    const endValue = series[series.length - 1] ? series[series.length - 1].value : 0;
    let peakValue = startValue;
    let maxDrawdownPercent = 0;

    const temporalSeries = series.map(function(point, index) {
      const previousValue = index > 0 ? series[index - 1].value : point.value;
      peakValue = Math.max(peakValue, point.value);
      const drawdownValue = round(point.value - peakValue, 0);
      const drawdownPercent = peakValue > 0 ? (drawdownValue / peakValue) * 100 : 0;
      maxDrawdownPercent = Math.min(maxDrawdownPercent, drawdownPercent);

      return {
        date: point.date,
        label: point.label,
        value: point.value,
        dailyChange: round(point.value - previousValue, 0),
        profit: round(point.value - startValue, 0),
        drawdown: drawdownValue,
      };
    });

    const dailyReturns = series.slice(1).map(function(point, index) {
      const previous = series[index] ? series[index].value : point.value;
      return previous ? ((point.value - previous) / previous) * 100 : 0;
    });
    const meanReturn = dailyReturns.length
      ? dailyReturns.reduce(function(sum, value) { return sum + value; }, 0) / dailyReturns.length
      : 0;
    const variance = dailyReturns.length
      ? dailyReturns.reduce(function(sum, value) { return sum + Math.pow(value - meanReturn, 2); }, 0) / dailyReturns.length
      : 0;
    const volatility = Math.sqrt(variance) * Math.sqrt(252);
    const previousDate = clampDate(addDays(range.end, -1), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);

    const snapshots = activeAssets.map(function(asset) {
      const startPrice = getDashboardPriceAtDate(asset, range.start);
      const endPrice = getDashboardPriceAtDate(asset, range.end);
      const previousPrice = getDashboardPriceAtDate(asset, previousDate);
      const startPositionValue = startPrice * asset.quantity;
      const periodChangePercent = startPrice ? ((endPrice - startPrice) / startPrice) * 100 : 0;
      const totalReturnPercent = asset.avgPrice ? ((endPrice - asset.avgPrice) / asset.avgPrice) * 100 : 0;
      const dailyChangePercent = previousPrice ? ((endPrice - previousPrice) / previousPrice) * 100 : 0;
      const endValue = round(endPrice * asset.quantity, 0);
      const periodProfitValue = round(endValue - startPositionValue, 0);

      return {
        asset: asset,
        startPrice: startPrice,
        endPrice: endPrice,
        previousPrice: previousPrice,
        endValue: endValue,
        periodProfitValue: periodProfitValue,
        periodChangePercent: round(periodChangePercent, 2),
        totalReturnPercent: round(totalReturnPercent, 2),
        dailyChangePercent: round(dailyChangePercent, 2),
      };
    });

    const upCount = snapshots.filter(function(item) { return item.dailyChangePercent > 0; }).length;
    const downCount = snapshots.filter(function(item) { return item.dailyChangePercent < 0; }).length;
    const periodReturnValue = round(endValue - startValue, 0);
    const periodReturnPercent = startValue ? round((periodReturnValue / startValue) * 100, 2) : 0;
    const averageDailyReturn = round(periodReturnPercent / Math.max(range.totalDays - 1, 1), 2);
    const riskLabel = volatility <= 12 ? "Baixo" : volatility <= 22 ? "Moderado" : "Alto";
    const totalInvested = activeAssets.reduce(function(sum, asset) {
      return sum + asset.avgPrice * asset.quantity;
    }, 0);

    const allocationMap = {};
    snapshots.forEach(function(snapshot) {
      const key = snapshot.asset.typeLabel;
      if (!allocationMap[key]) {
        allocationMap[key] = {
          name: key,
          invested: 0,
          start: 0,
          current: 0,
        };
      }

      allocationMap[key].invested += snapshot.asset.avgPrice * snapshot.asset.quantity;
      allocationMap[key].start += snapshot.startPrice * snapshot.asset.quantity;
      allocationMap[key].current += snapshot.endValue;
    });

    const allocation = Object.keys(allocationMap)
      .map(function(name) {
        const item = allocationMap[name];
        return {
          name: name,
          invested: round(item.invested, 0),
          current: round(item.current, 0),
          share: endValue ? round((item.current / endValue) * 100, 2) : 0,
          periodReturnPercent: item.start ? round(((item.current - item.start) / item.start) * 100, 2) : 0,
          totalReturnPercent: item.invested ? round(((item.current - item.invested) / item.invested) * 100, 2) : 0,
        };
      })
      .sort(function(a, b) {
        return b.current - a.current;
      });

    const sectorMap = {};
    snapshots.forEach(function(snapshot) {
      const key = snapshot.asset.sector || snapshot.asset.typeLabel;
      if (!sectorMap[key]) {
        sectorMap[key] = {
          name: key,
          start: 0,
          current: 0,
        };
      }
      sectorMap[key].start += snapshot.startPrice * snapshot.asset.quantity;
      sectorMap[key].current += snapshot.endValue;
    });

    const sectorPerformance = Object.keys(sectorMap)
      .map(function(name) {
        const item = sectorMap[name];
        const performanceValue = round(item.current - item.start, 0);
        return {
          name: name,
          start: round(item.start, 0),
          current: round(item.current, 0),
          performanceValue: performanceValue,
          periodReturnPercent: item.start ? round((performanceValue / item.start) * 100, 2) : 0,
        };
      })
      .sort(function(a, b) {
        return b.current - a.current;
      })
      .slice(0, 8)
      .sort(function(a, b) {
        return b.periodReturnPercent - a.periodReturnPercent;
      });

    const topAssets = snapshots
      .slice()
      .sort(function(a, b) {
        return b.periodProfitValue - a.periodProfitValue;
      })
      .slice(0, 5);

    const healthScore = Math.max(
      32,
      Math.min(
        95,
        Math.round(
          64 +
          periodReturnPercent * 1.6 +
          (upCount / (activeAssets.length || 1)) * 14 +
          allocation.length * 1.8 -
          Math.abs(maxDrawdownPercent) * 1.9 -
          volatility * 0.55
        )
      )
    );

    const healthStatus = healthScore >= 78 ? "Saudável" : healthScore >= 58 ? "Em atenção" : "Risco elevado";
    const healthTone = healthScore >= 78 ? "positive" : healthScore >= 58 ? "warning" : "negative";
    const recentWindow = temporalSeries.slice(-Math.min(30, temporalSeries.length)).map(function(item) {
      return {
        date: item.date,
        label: formatDateDayMonth(item.date),
        value: item.value,
        dailyChange: item.dailyChange,
      };
    });
    const lineSeries = recentWindow;
    const performanceSeries = recentWindow;

    return {
      range: range,
      totalCurrent: round(endValue, 0),
      totalInvested: round(totalInvested, 0),
      periodReturnValue: periodReturnValue,
      periodReturnPercent: periodReturnPercent,
      averageDailyReturn: averageDailyReturn,
      riskLabel: riskLabel,
      volatility: round(volatility, 2),
      upCount: upCount,
      downCount: downCount,
      maxDrawdownPercent: round(maxDrawdownPercent, 2),
      healthScore: healthScore,
      healthStatus: healthStatus,
      healthTone: healthTone,
      lineSeries: lineSeries,
      performanceSeries: performanceSeries,
      allocation: allocation,
      sectorPerformance: sectorPerformance,
      topAssets: topAssets,
      currentDateLabel: formatDateShort(range.end),
    };
  }

  function getFilteredAssets() {
    const term = normalizeText(state.assetSearch);
    return state.assets.filter(function filterAsset(asset) {
      if (state.assetFilter !== "all" && asset.type !== state.assetFilter) {
        return false;
      }

      if (!term) {
        return true;
      }

      return normalizeText(asset.ticker).includes(term) || normalizeText(asset.name).includes(term);
    });
  }

  function getRecommendationGroups() {
    return {
      compra: state.assets
        .filter(function filterBuy(asset) {
          return asset.recommendation === "compra";
        })
        .sort(function sortBuy(a, b) {
          return b.aiScore - a.aiScore;
        }),
      manter: state.assets.filter(function filterHold(asset) {
        return asset.recommendation === "manter";
      }),
      venda: state.assets.filter(function filterSell(asset) {
        return asset.recommendation === "venda";
      }),
    };
  }

  function getRiskBreakdown() {
    const totals = { Baixo: 0, Moderado: 0, Alto: 0 };
    let total = 0;

    state.assets.forEach(function addRisk(asset) {
      const currentValue = asset.price * asset.quantity;
      totals[asset.risk] += currentValue;
      total += currentValue;
    });

    return {
      Baixo: total ? round((totals.Baixo / total) * 100, 1) : 0,
      Moderado: total ? round((totals.Moderado / total) * 100, 1) : 0,
      Alto: total ? round((totals.Alto / total) * 100, 1) : 0,
    };
  }

  function getDividendProjection() {
    return state.assets.reduce(function sumProjection(total, asset) {
      if (!asset.dividendYield || asset.quantity <= 0) {
        return total;
      }
      return total + (asset.price * asset.quantity * asset.dividendYield) / 100 / 12;
    }, 0);
  }

  function getSearchIcon() {
    return '<svg class="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.5-3.5"></path></svg>';
  }

  function getTrendClass(value) {
    return value >= 0 ? "positive" : "negative";
  }

  function getScoreClass(score) {
    if (score >= 75) {
      return "score-high";
    }
    if (score >= 50) {
      return "score-medium";
    }
    return "score-low";
  }

  function getRiskClass(risk) {
    if (risk === "Baixo") {
      return "risk-low";
    }
    if (risk === "Moderado") {
      return "risk-medium";
    }
    return "risk-high";
  }

  function mapPoints(values, width, height, padding) {
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    return values.map(function mapValue(value, index) {
      const x = padding.left + (values.length === 1 ? innerWidth / 2 : (innerWidth * index) / (values.length - 1));
      const y = padding.top + ((maxValue - value) / range) * innerHeight;
      return { x: x, y: y, value: value };
    });
  }

  function pointsToLine(points) {
    return points
      .map(function mapPoint(point, index) {
        return (index === 0 ? "M" : "L") + point.x + " " + point.y;
      })
      .join(" ");
  }

  function pointsToArea(points, bottomY) {
    if (!points.length) {
      return "";
    }

    return (
      "M" +
      points[0].x +
      " " +
      bottomY +
      " " +
      points
        .map(function mapPoint(point) {
          return "L" + point.x + " " + point.y;
        })
        .join(" ") +
      " L" +
      points[points.length - 1].x +
      " " +
      bottomY +
      " Z"
    );
  }

  function buildSparkline(values, positive) {
    const width = 100;
    const height = 36;
    const padding = { top: 6, right: 4, bottom: 6, left: 4 };
    const points = mapPoints(values, width, height, padding);
    const line = pointsToLine(points);
    const area = pointsToArea(points, height - padding.bottom);
    const stroke = positive ? "#28c76f" : "#ff5b6e";
    const fill = positive ? "rgba(40, 199, 111, 0.14)" : "rgba(255, 91, 110, 0.14)";

    return (
      '<svg class="sparkline" viewBox="0 0 100 36" aria-hidden="true">' +
      '<path d="' +
      area +
      '" fill="' +
      fill +
      '"></path>' +
      '<path d="' +
      line +
      '" fill="none" stroke="' +
      stroke +
      '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
      "</svg>"
    );
  }

  function buildLineChart(data) {
    const width = 860;
    const height = 300;
    const padding = { top: 24, right: 18, bottom: 34, left: 54 };
    const values = data.map(function mapItem(item) {
      return item.value;
    });
    const benchmarkValues = values.map(function mapBench(val, idx) {
      return values[0] * (1 + (idx * 0.004));
    });

    const maxValue = Math.max(Math.max.apply(null, values), Math.max.apply(null, benchmarkValues));
    const minValue = Math.min(Math.min.apply(null, values), Math.min.apply(null, benchmarkValues));
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    const points = values.map(function mapValue(value, index) {
      const x = padding.left + (values.length === 1 ? innerWidth / 2 : (innerWidth * index) / (values.length - 1));
      const y = padding.top + ((maxValue - value) / range) * innerHeight;
      return { x: x, y: y, value: value };
    });

    const benchPoints = benchmarkValues.map(function mapValue(value, index) {
      const x = padding.left + (benchmarkValues.length === 1 ? innerWidth / 2 : (innerWidth * index) / (benchmarkValues.length - 1));
      const y = padding.top + ((maxValue - value) / range) * innerHeight;
      return { x: x, y: y, value: value };
    });

    const line = pointsToLine(points);
    const benchLine = pointsToLine(benchPoints);
    const area = pointsToArea(points, height - padding.bottom);
    const gridLines = 4;
    let yLabels = "";
    let xLabels = "";
    let grid = "";

    for (let index = 0; index <= gridLines; index += 1) {
      const ratio = index / gridLines;
      const y = padding.top + (height - padding.top - padding.bottom) * ratio;
      const value = maxValue - (maxValue - minValue) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 12) + '" y="' + (y + 4) + '" text-anchor="end" fill="#7d90aa" font-size="11">' + formatCurrency(value, 0) + "</text>";
    }

    points.forEach(function mapPoint(point, index) {
      xLabels += '<text x="' + point.x + '" y="' + (height - 12) + '" text-anchor="middle" fill="#7d90aa" font-size="11">' + data[index].label + "</text>";
    });

    return (
      '<div class="chart-wrapper"><svg viewBox="0 0 860 300" role="img" aria-label="Evolução do patrimônio da carteira">' +
      grid +
      yLabels +
      xLabels +
      '<text x="' + (width - padding.right) + '" y="' + (padding.top - 8) + '" text-anchor="end" fill="#2aa8ff" font-size="11" font-weight="700">IBOV</text>' +
      '<path d="' +
      area +
      '" fill="rgba(42, 168, 255, 0.10)"></path>' +
      '<path d="' +
      benchLine +
      '" fill="none" stroke="#2aa8ff" stroke-width="2" stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '<path d="' +
      line +
      '" fill="none" stroke="#28c76f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>' +
      points
        .map(function mapPoint(point) {
          return '<circle cx="' + point.x + '" cy="' + point.y + '" r="3.2" fill="#28c76f"></circle>';
        })
        .join("") +
      "</svg></div>"
    );
  }

  function buildDonutChart(allocation) {
    const width = 260;
    const height = 260;
    const radius = 74;
    const circumference = 2 * Math.PI * radius;
    const total = allocation.reduce(function sumAllocation(sum, item) {
      return sum + item.value;
    }, 0) || 1;
    let offset = 0;

    const circles = allocation
      .map(function mapSegment(item, index) {
        const color = CHART_COLORS[index % CHART_COLORS.length];
        const dash = (item.value / total) * circumference;
        const circle =
          '<circle cx="130" cy="130" r="' +
          radius +
          '" fill="none" stroke="' +
          color +
          '" stroke-width="22" stroke-linecap="round" stroke-dasharray="' +
          dash +
          " " +
          (circumference - dash) +
          '" stroke-dashoffset="' +
          (-offset) +
          '" transform="rotate(-90 130 130)"></circle>';
        offset += dash;
        return circle;
      })
      .join("");

    return (
      '<div class="chart-wrapper"><svg viewBox="0 0 260 260" role="img" aria-label="Alocação por classe de ativo">' +
      '<circle cx="130" cy="130" r="' +
      radius +
      '" fill="none" stroke="rgba(116, 146, 179, 0.14)" stroke-width="22"></circle>' +
      circles +
      '<circle cx="130" cy="130" r="48" fill="#0c1625"></circle>' +
      '<text x="130" y="122" text-anchor="middle" fill="#7d90aa" font-size="12">Alocação</text>' +
      '<text x="130" y="144" text-anchor="middle" fill="#e8f1fb" font-size="22" font-weight="700">' +
      allocation.length +
      "</text>" +
      '<text x="130" y="162" text-anchor="middle" fill="#7d90aa" font-size="11">classes</text>' +
      "</svg></div>"
    );
  }

  function buildBarChart(items) {
    const width = 860;
    const height = 270;
    const padding = { top: 20, right: 18, bottom: 40, left: 34 };
    const maxValue = Math.max.apply(
      null,
      items.map(function mapItem(item) {
        return Math.max(item.returnPercent, 0);
      })
    ) || 1;
    const usableWidth = width - padding.left - padding.right;
    const barSpace = usableWidth / items.length;
    const barWidth = Math.min(92, barSpace * 0.56);
    const chartHeight = height - padding.top - padding.bottom;

    return (
      '<div class="chart-wrapper"><svg viewBox="0 0 860 270" role="img" aria-label="Top performance percentual dos ativos">' +
      '<line x1="' +
      padding.left +
      '" y1="' +
      (height - padding.bottom) +
      '" x2="' +
      (width - padding.right) +
      '" y2="' +
      (height - padding.bottom) +
      '" stroke="rgba(116, 146, 179, 0.18)"></line>' +
      items
        .map(function mapItem(item, index) {
          const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
          const barHeight = (Math.max(item.returnPercent, 0) / maxValue) * chartHeight;
          const y = height - padding.bottom - barHeight;
          const fill = item.returnPercent >= 0 ? "#28c76f" : "#ff5b6e";
          return (
            '<g>' +
            '<rect x="' +
            x +
            '" y="' +
            y +
            '" width="' +
            barWidth +
            '" height="' +
            Math.max(barHeight, 4) +
            '" rx="16" fill="' +
            fill +
            '"></rect>' +
            '<text x="' +
            (x + barWidth / 2) +
            '" y="' +
            (y - 8) +
            '" text-anchor="middle" fill="#e8f1fb" font-size="11" font-weight="700">' +
            formatSignedPercent(item.returnPercent, 1) +
            "</text>" +
            '<text x="' +
            (x + barWidth / 2) +
            '" y="' +
            (height - 14) +
            '" text-anchor="middle" fill="#7d90aa" font-size="11">' +
            item.ticker +
            "</text>" +
            "</g>"
          );
        })
        .join("") +
      "</svg></div>"
    );
  }

  function dashboardMetricCard(title, value, subtitle, iconName, tone) {
    const toneClass = tone === "positive" ? " positive-soft" : tone === "warning" ? " warning-soft" : "";
    return (
      '<article class="dashboard-metric-card">' +
      '<div class="dashboard-metric-head">' +
      '<div class="dashboard-metric-copy">' +
      "<p>" + title + "</p>" +
      "<strong>" + value + "</strong>" +
      "<span>" + subtitle + "</span>" +
      "</div>" +
      '<div class="dashboard-icon-wrap' + toneClass + '">' +
      icon(iconName, "metric-icon") +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function buildDashboardLineChart(data) {
    if (!data.length) {
      return '<div class="empty-state"><strong>Sem dados no período</strong><p>Selecione um intervalo diferente para visualizar a serie.</p></div>';
    }

    const width = 860;
    const height = 280;
    const padding = { top: 22, right: 18, bottom: 34, left: 24 };
    const values = data.map(function(item) { return item.value; });
    const points = mapPoints(values, width, height, padding);
    const line = pointsToLine(points);
    const area = pointsToArea(points, height - padding.bottom);
    const baseValue = data[0] ? data[0].value : 0;
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const gridLines = 4;
    let grid = "";
    let xLabels = "";
    let pointMarkers = "";

    for (let index = 0; index <= gridLines; index += 1) {
      const ratio = index / gridLines;
      const y = padding.top + (height - padding.top - padding.bottom) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
    }

    points.forEach(function(point, index) {
      const item = data[index];
      const changePercent = baseValue ? ((item.value - baseValue) / baseValue) * 100 : 0;
      const detailLabel = changePercent >= 0 ? "Rentabilidade" : "Perda";
      const detailColor = changePercent >= 0 ? "#28c76f" : "#ff5b6e";
      const tooltipWidth = 178;
      const tooltipX = Math.max(padding.left + 2, Math.min(point.x - tooltipWidth / 2, width - padding.right - tooltipWidth - 2));
      const tooltipY = Math.max(8, point.y - 72);

      xLabels += '<text x="' + point.x + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="9">' + data[index].label + "</text>";
      pointMarkers +=
        '<g class="dashboard-line-point">' +
        '<circle class="dashboard-line-point-hit" cx="' + point.x + '" cy="' + point.y + '" r="12"></circle>' +
        '<circle class="dashboard-line-point-core" cx="' + point.x + '" cy="' + point.y + '" r="3.2"></circle>' +
        '<g class="dashboard-line-tooltip" transform="translate(' + tooltipX + " " + tooltipY + ')">' +
        '<rect class="dashboard-line-tooltip-box" width="' + tooltipWidth + '" height="52" rx="10"></rect>' +
        '<text class="dashboard-line-tooltip-label" x="10" y="18">Valor atual</text>' +
        '<text class="dashboard-line-tooltip-value" x="' + (tooltipWidth - 10) + '" y="18" text-anchor="end">' + escapeHtml(formatCurrency(item.value, 0)) + "</text>" +
        '<text class="dashboard-line-tooltip-label" x="10" y="37">' + detailLabel + "</text>" +
        '<text x="' + (tooltipWidth - 10) + '" y="37" text-anchor="end" font-size="10" font-weight="800" fill="' + detailColor + '">' + escapeHtml(formatSignedPercent(changePercent, 2)) + "</text>" +
        "</g>" +
        '<title>Valor atual: ' + escapeHtml(formatCurrency(item.value, 0)) + "&#10;" + detailLabel + ": " + escapeHtml(formatSignedPercent(changePercent, 2)) + "</title>" +
        "</g>";
    });

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 860 280" role="img" aria-label="Evolução do patrimônio no período">' +
      grid +
      xLabels +
      '<path d="' + area + '" fill="rgba(42, 168, 255, 0.10)"></path>' +
      '<path d="' + line + '" fill="none" stroke="#28c76f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>' +
      pointMarkers +
      "</svg></div>"
    );
  }

  function buildDashboardAreaChart(data) {
    if (!data.length) {
      return '<div class="empty-state"><strong>Sem dados no período</strong><p>Selecione um intervalo diferente para visualizar a serie.</p></div>';
    }

    const width = 860;
    const height = 250;
    const padding = { top: 20, right: 18, bottom: 34, left: 24 };
    const values = data.map(function(item) {
      return item.dailyChange;
    });
    values.push(0);
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / data.length;
    const barWidth = Math.max(6, Math.min(18, barSpace * 0.62));
    const zeroY = padding.top + ((maxValue - 0) / range) * innerHeight;
    const gridLines = 4;
    let grid = "";
    let xLabels = "";
    let bars = "";
    let barLabels = "";

    for (let index = 0; index <= gridLines; index += 1) {
      const ratio = index / gridLines;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
    }

    grid += '<line x1="' + padding.left + '" y1="' + zeroY + '" x2="' + (width - padding.right) + '" y2="' + zeroY + '" stroke="#7d90aa" stroke-dasharray="4 6"></line>';

    data.forEach(function(item, index) {
      const value = item.dailyChange;
      const xCenter = padding.left + barSpace * index + barSpace / 2;
      const yValue = padding.top + ((maxValue - value) / range) * innerHeight;
      const positive = value >= 0;
      const barY = positive ? yValue : zeroY;
      const barHeight = Math.max(2, Math.abs(zeroY - yValue));
      const fill = positive ? "#28c76f" : "#ff5b6e";
      const labelY = positive ? Math.max(10, barY - 6) : Math.min(height - 22, barY + barHeight + 4);
      const labelAttrs = positive ? "" : ' dominant-baseline="hanging"';
      const valueLabel = (value >= 0 ? "+" : "-") + formatCurrency(Math.abs(value), 0);

      bars +=
        '<rect x="' +
        (xCenter - barWidth / 2) +
        '" y="' +
        barY +
        '" width="' +
        barWidth +
        '" height="' +
        barHeight +
        '" rx="' +
        Math.max(2, barWidth / 3) +
        '" fill="' +
        fill +
        '"></rect>';

      barLabels += '<text x="' + xCenter + '" y="' + labelY + '" text-anchor="middle" fill="' + fill + '" font-size="9.2" font-weight="700"' + labelAttrs + ">" + valueLabel + "</text>";
      xLabels += '<text x="' + xCenter + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="9">' + item.label + "</text>";
    });

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 860 250" role="img" aria-label="Serie temporal de ganhos e perdas diarios">' +
      grid +
      bars +
      barLabels +
      xLabels +
      "</svg></div>"
    );
  }

  function buildDashboardDonutChart(allocation) {
    const colors = ["#173f71", "#2f7edb", "#0f766e", "#d97706", "#dc2626"];
    const width = 250;
    const height = 250;
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const total = allocation.reduce(function(sum, item) {
      return sum + item.current;
    }, 0) || 1;
    let offset = 0;

    const slices = allocation.map(function(item, index) {
      const dash = (item.current / total) * circumference;
      const slice =
        '<circle cx="125" cy="125" r="' + radius + '" fill="none" stroke="' + colors[index % colors.length] + '" stroke-width="22" stroke-linecap="round" stroke-dasharray="' + dash + " " + (circumference - dash) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 125 125)"></circle>';
      offset += dash;
      return slice;
    }).join("");

    return (
      '<svg class="dashboard-allocation-donut" viewBox="0 0 250 250" role="img" aria-label="Distribuição da carteira por alocação">' +
      '<circle cx="125" cy="125" r="' + radius + '" fill="none" stroke="rgba(116, 146, 179, 0.14)" stroke-width="22"></circle>' +
      slices +
      '<circle cx="125" cy="125" r="52" fill="#0c1625"></circle>' +
      '<text x="125" y="120" text-anchor="middle" fill="#7d90aa" font-size="12">Classes</text>' +
      '<text x="125" y="144" text-anchor="middle" fill="#e8f1fb" font-size="22" font-weight="800">' + allocation.length + "</text>" +
      "</svg>"
    );
  }

  function buildDashboardBars(items, valueKey, formatter, useValueTone) {
    const maxValue = items.reduce(function(max, item) {
      return Math.max(max, Math.abs(item[valueKey]));
    }, 0) || 1;

    return (
      '<div class="dashboard-bars">' +
      items.map(function(item) {
        const value = item[valueKey];
        const width = Math.max(10, (Math.abs(value) / maxValue) * 100);
        const toneClass = useValueTone ? (value >= 0 ? " positive" : " negative") : "";

        return (
          '<div class="dashboard-bar-item">' +
          '<div class="dashboard-bar-head">' +
          "<strong>" + escapeHtml(item.name) + "</strong>" +
          "<span>" + formatter(value) + "</span>" +
          "</div>" +
          '<div class="dashboard-bar-track">' +
          '<span class="dashboard-bar-fill' + toneClass + '" style="width:' + width + '%"></span>' +
          "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>"
    );
  }

  function buildDashboardFace(type) {
    const mouth =
      type === "happy"
        ? '<path d="M8 14Q12 17 16 14"></path>'
        : type === "neutral"
          ? '<path d="M9 15.2h6"></path>'
          : '<path d="M8 16Q12 13 16 16"></path>';

    return (
      '<svg class="dashboard-face-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<circle cx="12" cy="12" r="8.2"></circle>' +
      '<circle cx="9.1" cy="10.2" r="0.8" fill="currentColor" stroke="none"></circle>' +
      '<circle cx="14.9" cy="10.2" r="0.8" fill="currentColor" stroke="none"></circle>' +
      mouth +
      "</svg>"
    );
  }

  function buildDashboardThermometer(score, status, tone) {
    const meterProgress = Math.max(10, Math.min(96, score));
    const activeCritical = score < 58;
    const activeStable = score >= 58 && score < 78;
    const activeHealthy = score >= 78;

    const pointerHtml = '<div class="dashboard-mood-pointer ' + tone + '"></div>';

    return (
      '<div class="dashboard-thermo">' +
      '<div class="dashboard-health-copy">' +
      "<span>Score atual</span>" +
      "<strong>" + score + "</strong>" +
      '<div class="dashboard-health-badge ' + tone + '">' + status + "</div>" +
      "</div>" +
      '<div class="dashboard-thermo-stage">' +
      '<div class="dashboard-diagonal-meter">' +
      '<div class="dashboard-diagonal-bar">' +
      '<div class="dashboard-diagonal-track"></div>' +
      '<div class="dashboard-diagonal-progress" style="width:' + meterProgress + '%"></div>' +
      '<div class="dashboard-diagonal-thumb" style="left:' + meterProgress + '%"></div>' +
      "</div>" +
      "</div>" +
      '<div class="dashboard-mood-rail">' +
      '<div class="dashboard-mood-list">' +
      '<div class="dashboard-mood-item' + (activeCritical ? " active" : "") + '">' + (activeCritical ? pointerHtml : "") + buildDashboardFace("sad") + "<span>Crítico</span></div>" +
      '<div class="dashboard-mood-item' + (activeStable ? " active" : "") + '">' + (activeStable ? pointerHtml : "") + buildDashboardFace("neutral") + "<span>Estável</span></div>" +
      '<div class="dashboard-mood-item' + (activeHealthy ? " active" : "") + '">' + (activeHealthy ? pointerHtml : "") + buildDashboardFace("happy") + "<span>Saudável</span></div>" +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function buildDashboardAllocationTrend(value, index) {
    const width = 72;
    const height = 24;
    const padding = { top: 3, right: 3, bottom: 3, left: 3 };
    const amplitude = Math.max(0.8, Math.min(4.4, Math.abs(value) * 0.16));
    const values = Array.from({ length: 7 }, function(_, step) {
      const progress = step / 6;
      const trend = value * (0.35 + progress * 0.65);
      const wave = Math.sin((step + 1) * (index + 1) * 0.82) * amplitude * (1 - progress * 0.55);
      return round(trend + wave, 2);
    });

    values[0] = round(value * 0.2 + Math.sin((index + 1) * 0.8) * amplitude * 0.45, 2);
    values[values.length - 1] = round(value, 2);

    const points = mapPoints(values, width, height, padding);
    const area = pointsToArea(points, height - padding.bottom);
    const line = pointsToLine(points);
    const positive = value >= 0;
    const stroke = positive ? "#28c76f" : "#ff5b6e";
    const fill = positive ? "rgba(40, 199, 111, 0.16)" : "rgba(255, 91, 110, 0.16)";

    return (
      '<svg class="dashboard-mini-line" viewBox="0 0 72 24" aria-hidden="true">' +
      '<path d="' + area + '" fill="' + fill + '"></path>' +
      '<path d="' + line + '" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>' +
      "</svg>"
    );
  }

  function buildDashboardAllocationTable(allocation) {
    const colors = ["#173f71", "#2f7edb", "#0f766e", "#d97706", "#dc2626"];

    if (!allocation.length) {
      return '<div class="empty-state"><strong>Sem dados de alocação</strong><p>Não foi possível montar o resumo para o período atual.</p></div>';
    }

    return (
      '<div class="dashboard-allocation-card">' +
      '<div class="dashboard-allocation-table-wrap">' +
      '<div class="dashboard-allocation-table">' +
      '<div class="dashboard-allocation-row header">' +
      '<div class="dashboard-allocation-head-label">Classe</div>' +
      '<div class="dashboard-allocation-head-label">Peso</div>' +
      '<div class="dashboard-allocation-head-label">Valor</div>' +
      '<div class="dashboard-allocation-head-label">Retorno</div>' +
      '<div class="dashboard-allocation-head-label">Tendência</div>' +
      "</div>" +
      allocation.map(function(item, index) {
        const toneClass = item.periodReturnPercent >= 0 ? "positive" : "negative";

        return (
          '<div class="dashboard-allocation-row">' +
          '<div class="dashboard-allocation-cell">' +
          '<div class="dashboard-allocation-name">' +
          '<span class="dashboard-allocation-dot" style="background:' + colors[index % colors.length] + '"></span>' +
          "<strong>" + escapeHtml(item.name) + "</strong>" +
          "</div>" +
          "</div>" +
          '<div class="dashboard-allocation-cell dashboard-allocation-value mono">' + formatPercent(item.share, 2) + "</div>" +
          '<div class="dashboard-allocation-cell dashboard-allocation-value mono">' + formatCurrency(item.current, 0) + "</div>" +
          '<div class="dashboard-allocation-cell dashboard-allocation-value mono ' + toneClass + '">' + formatSignedPercent(item.periodReturnPercent, 2) + "</div>" +
          '<div class="dashboard-allocation-cell dashboard-allocation-trend">' + buildDashboardAllocationTrend(item.periodReturnPercent, index) + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</div>" +
      "</div>"
    );
  }

  function buildDashboardTopColumns(items, totalCurrent) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem ativos no período</strong><p>A carteira não possui ativos elegíveis para comparação nesse intervalo.</p></div>';
    }

    const colors = ["#173f71", "#2f7edb", "#0f766e", "#d97706", "#dc2626", "#7b7fff"];
    const baseTotal = totalCurrent || items.reduce(function(sum, item) { return sum + item.endValue; }, 0) || 1;

    return (
      '<div class="dashboard-top-table-wrap">' +
      '<div class="dashboard-top-table">' +
      '<div class="dashboard-top-table-row header">' +
      '<div class="dashboard-top-head-label">Logo</div>' +
      '<div class="dashboard-top-head-label">Ativo</div>' +
      '<div class="dashboard-top-head-label">Peso</div>' +
      '<div class="dashboard-top-head-label">Valor</div>' +
      '<div class="dashboard-top-head-label">Retorno</div>' +
      '<div class="dashboard-top-head-label">Tendência</div>' +
      "</div>" +
      items.map(function(item, index) {
        const accent = colors[index % colors.length];
        const ticker = item.asset.ticker || item.asset.name || "ATV";
        const logoText = ticker.replace(/[^A-Za-z0-9]/g, "").slice(0, 3).toUpperCase();
        const weight = baseTotal ? (item.endValue / baseTotal) * 100 : 0;
        const toneClass = item.periodChangePercent >= 0 ? "positive" : "negative";

        return (
          '<div class="dashboard-top-table-row">' +
          '<div class="dashboard-top-cell"><div class="dashboard-top-logo" style="background:' + accent + '2e;border-color:' + accent + '66;">' + escapeHtml(logoText || "ATV") + "</div></div>" +
          '<div class="dashboard-top-cell dashboard-top-asset"><strong>' + escapeHtml(item.asset.ticker) + "</strong><span>" + escapeHtml(item.asset.name) + "</span></div>" +
          '<div class="dashboard-top-cell mono">' + formatPercent(weight, 2) + "</div>" +
          '<div class="dashboard-top-cell mono">' + formatCurrency(item.endValue, 0) + "</div>" +
          '<div class="dashboard-top-cell mono ' + toneClass + '">' + formatSignedPercent(item.periodChangePercent, 2) + "</div>" +
          '<div class="dashboard-top-cell dashboard-allocation-trend">' + buildDashboardAllocationTrend(item.periodChangePercent, index) + "</div>" +
          "</div>"
        );
      }).join("") +
      "</div>" +
      "</div>"
    );
  }

  function buildDashboardSectorColumns(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem setores no período</strong><p>Não foi possível calcular a performance setorial nesse intervalo.</p></div>';
    }

    const width = 980;
    const height = 310;
    const padding = { top: 24, right: 22, bottom: 108, left: 64 };
    const values = items.map(function(item) { return item.periodReturnPercent; });
    const maxPositive = Math.max(0, Math.max.apply(null, values));
    const minNegative = Math.min(0, Math.min.apply(null, values));
    const range = maxPositive - minNegative || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.min(96, barSpace * 0.56);
    const zeroY = padding.top + ((maxPositive - 0) / range) * innerHeight;
    let grid = "";
    let yLabels = "";

    function toY(value) {
      return padding.top + ((maxPositive - value) / range) * innerHeight;
    }

    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      const value = maxPositive - (maxPositive - minNegative) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 12) + '" y="' + (y + 5) + '" text-anchor="end" fill="#8ba0ba" font-size="12" font-weight="700">' + formatSignedPercent(value, 1) + "</text>";
    }

    const bars = items.map(function(item, index) {
      const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
      const value = item.periodReturnPercent;
      const yValue = toY(value);
      const positive = value >= 0;
      const barY = positive ? yValue : zeroY;
      const barHeight = Math.max(4, Math.abs(zeroY - yValue));
      const fill = positive ? "#28c76f" : "#ff5b6e";
      const valueLabelY = positive ? Math.max(padding.top + 16, barY - 12) : Math.min(height - padding.bottom + 20, barY + barHeight + 18);

      return (
        '<g>' +
        '<rect x="' + x + '" y="' + barY + '" width="' + barWidth + '" height="' + barHeight + '" rx="12" fill="' + fill + '"></rect>' +
        '<text x="' + (x + barWidth / 2) + '" y="' + valueLabelY + '" text-anchor="middle" fill="#cfd9e8" font-size="16" font-weight="800">' + formatSignedPercent(value, 2) + "</text>" +
        '<text x="' + (x + barWidth / 2) + '" y="' + (height - 44) + '" text-anchor="middle" fill="#a7b8cf" font-size="15" font-weight="800">' + escapeHtml(truncateLabel(item.name, 12)) + "</text>" +
        '<text x="' + (x + barWidth / 2) + '" y="' + (height - 18) + '" text-anchor="middle" fill="#7d90aa" font-size="13.5">' + escapeHtml(formatCurrencyCompact(item.performanceValue)) + "</text>" +
        "</g>"
      );
    }).join("");

    return (
      '<svg class="dashboard-sector-chart" viewBox="0 0 980 310" preserveAspectRatio="none" role="img" aria-label="Rentabilidade e performance por setores">' +
      grid +
      yLabels +
      '<line x1="' + padding.left + '" y1="' + zeroY + '" x2="' + (width - padding.right) + '" y2="' + zeroY + '" stroke="#7d90aa" stroke-dasharray="4 6"></line>' +
      bars +
      "</svg>"
    );
  }

  function buildCandlestickChart(asset, rangeId) {
    if (!asset) {
      return '<div class="empty-state"><strong>Sem ativo selecionado</strong><p>Use os filtros da esquerda para escolher um papel.</p></div>';
    }

    const config = (
      BROKER_RANGE_OPTIONS.find(function(option) {
        return option.id === rangeId;
      }) || BROKER_RANGE_OPTIONS[0]
    );
    const candleCount = config.candles;
    const random = createSeededRandom(asset.ticker + "-broker-" + config.id);
    const volatilityBase = asset.risk === "Alto" ? 0.028 : asset.risk === "Moderado" ? 0.019 : 0.012;
    const driftPerCandle = (asset.changePercent / 100) / Math.max(candleCount * 0.45, 1);
    const data = [];
    let previousClose = asset.price * (0.93 + random() * 0.12);

    for (let index = 0; index < candleCount; index += 1) {
      const open = previousClose * (1 + (random() - 0.5) * volatilityBase * 0.7);
      const move = driftPerCandle + (random() - 0.5) * volatilityBase;
      const close = Math.max(asset.price * 0.42, open * (1 + move));
      const high = Math.max(open, close) * (1 + random() * volatilityBase * 0.75);
      const low = Math.max(asset.price * 0.32, Math.min(open, close) * (1 - random() * volatilityBase * 0.75));
      data.push({
        open: open,
        high: high,
        low: low,
        close: close,
      });
      previousClose = close;
    }

    const lastClose = data[data.length - 1] ? data[data.length - 1].close : asset.price;
    const adjustFactor = lastClose ? asset.price / lastClose : 1;
    data.forEach(function(item) {
      item.open = round(item.open * adjustFactor, 2);
      item.high = round(item.high * adjustFactor, 2);
      item.low = round(item.low * adjustFactor, 2);
      item.close = round(item.close * adjustFactor, 2);
    });

    const width = 980;
    const height = 420;
    const padding = { top: 24, right: 24, bottom: 44, left: 62 };
    const lows = data.map(function(item) { return item.low; });
    const highs = data.map(function(item) { return item.high; });
    const rawMin = Math.min.apply(null, lows);
    const rawMax = Math.max.apply(null, highs);
    const paddingValue = (rawMax - rawMin || 1) * 0.08;
    const minValue = rawMin - paddingValue;
    const maxValue = rawMax + paddingValue;
    const usableWidth = width - padding.left - padding.right;
    const usableHeight = height - padding.top - padding.bottom;
    const step = usableWidth / data.length;
    const bodyWidth = Math.max(7, step * 0.5);

    function toY(value) {
      return padding.top + ((maxValue - value) / (maxValue - minValue || 1)) * usableHeight;
    }

    function getXAxisLabel(index) {
      if (config.id === "dia") {
        const hour = 9 + Math.floor(index / 2);
        const minute = index % 2 === 0 ? "00" : "30";
        return String(hour).padStart(2, "0") + ":" + minute;
      }
      if (config.id === "semana") {
        const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex"];
        return dayNames[Math.min(dayNames.length - 1, Math.floor(index / 5))];
      }
      if (config.id === "mes") {
        return "D" + (index + 1);
      }
      const monthRef = new Date(DASHBOARD_REFERENCE_DATE.getFullYear(), DASHBOARD_REFERENCE_DATE.getMonth() - 11 + Math.floor(index / 2), 1);
      return MONTHS[monthRef.getMonth()];
    }

    const tickIndexes = [0, Math.floor(data.length * 0.25), Math.floor(data.length * 0.5), Math.floor(data.length * 0.75), data.length - 1];
    const shownTicks = {};
    let grid = "";
    let labels = "";
    let xLabels = "";

    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + usableHeight * ratio;
      const value = maxValue - (maxValue - minValue) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      labels += '<text x="' + (padding.left - 12) + '" y="' + (y + 4) + '" text-anchor="end" fill="#7d90aa" font-size="11">' + formatCurrency(value, 2) + "</text>";
    }

    const candles = data
      .map(function(item, index) {
        const x = padding.left + step * index + step / 2;
        const openY = toY(item.open);
        const closeY = toY(item.close);
        const highY = toY(item.high);
        const lowY = toY(item.low);
        const rectY = Math.min(openY, closeY);
        const rectHeight = Math.max(Math.abs(closeY - openY), 2);
        const fill = item.close >= item.open ? "#28c76f" : "#ff5b6e";

        if (tickIndexes.includes(index) && !shownTicks[index]) {
          shownTicks[index] = true;
          xLabels += '<text x="' + x + '" y="' + (height - 14) + '" text-anchor="middle" fill="#7d90aa" font-size="10.8">' + getXAxisLabel(index) + "</text>";
        }

        return (
          '<g>' +
          '<line x1="' + x + '" y1="' + highY + '" x2="' + x + '" y2="' + lowY + '" stroke="' + fill + '" stroke-width="2"></line>' +
          '<rect x="' + (x - bodyWidth / 2) + '" y="' + rectY + '" width="' + bodyWidth + '" height="' + rectHeight + '" rx="3.6" fill="' + fill + '" opacity="0.92"></rect>' +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="chart-wrapper"><svg viewBox="0 0 980 420" role="img" aria-label="Gráfico candle do ativo selecionado">' +
      grid +
      labels +
      candles +
      xLabels +
      "</svg></div>"
    );
  }

  function renderTicker() {
    const liquidAssets = getLiquidAssets();
    const tickerItems = liquidAssets.concat(liquidAssets);

    app.ticker.innerHTML =
      '<div class="ticker-track">' +
      tickerItems
        .map(function mapTicker(asset) {
          return (
            '<div class="ticker-item">' +
            '<span class="ticker-symbol">' +
            escapeHtml(asset.ticker) +
            "</span>" +
            '<span class="ticker-price">' +
            formatCurrency(asset.price, 2) +
            "</span>" +
            '<span class="ticker-change ' +
            getTrendClass(asset.changePercent) +
            '">' +
            (asset.changePercent >= 0 ? icon("trendUp", "status-icon") : icon("trendDown", "status-icon")) +
            " " +
            formatSignedPercent(asset.changePercent, 2) +
            "</span>" +
            "</div>"
          );
        })
        .join("") +
      "</div>";
  }

  function renderSidebar() {
    app.sidebar.className = "sidebar" + (state.sidebarCollapsed ? " is-collapsed" : "");
    app.sidebar.innerHTML =
      '<div class="sidebar-head">' +
      '<div class="brand">' +
      '<div class="brand-mark">' +
      icon("trendUp", "nav-icon") +
      "</div>" +
      '<div class="brand-copy">' +
      "<h1>FinanceAI</h1>" +
      "<p>Predictor</p>" +
      "</div>" +
      "</div>" +
      '<button class="collapse-btn-small" type="button" id="toggle-sidebar" title="Ocultar menu">' +
      icon(state.sidebarCollapsed ? "expand" : "collapse", "nav-icon") +
      '</button>' +
      "</div>" +
      '<nav class="sidebar-nav">' +
      NAV_ITEMS.map(function mapItem(item) {
        const active = state.activeTab === item.id ? " active" : "";
        return (
          '<button class="nav-button' +
          active +
          '" type="button" data-tab="' +
          item.id +
          '" title="' +
          item.label +
          '">' +
          icon(item.icon, "nav-icon") +
          '<span class="nav-label">' +
          item.label +
          "</span>" +
          (state.activeTab === item.id ? '<span class="nav-indicator" aria-hidden="true"></span>' : "") +
          "</button>"
        );
      }).join("") +
      "</nav>" +
      '<div class="sidebar-user">' +
      '<div class="avatar">MF</div>' +
      '<div class="user-copy">' +
      "<strong>Marielio R. Fernandes</strong>" +
      "<span>Plano Premium</span>" +
      "</div>" +
      "</div>";

    app.sidebar.querySelectorAll("[data-tab]").forEach(function bindTab(button) {
      button.addEventListener("click", function handleClick() {
        state.activeTab = button.getAttribute("data-tab");
        renderSidebar();
        renderMain();
      });
    });

    const toggleButton = document.getElementById("toggle-sidebar");
    if (toggleButton) {
      toggleButton.addEventListener("click", function toggleSidebar() {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        renderSidebar();
      });
    }
  }

  function metricCard(title, value, subtitle, iconName, trend) {
    const wrapClass = trend === "down" ? "negative-soft" : trend === "up" ? "positive-soft" : "warning-soft";
    const subtitleClass = trend === "down" ? "negative" : trend === "up" ? "positive" : "muted";
    return (
      '<article class="metric-card">' +
      '<div class="metric-card-head">' +
      '<div class="metric-copy">' +
      "<p>" +
      title +
      "</p>" +
      "<strong>" +
      value +
      "</strong>" +
      '<span class="' +
      subtitleClass +
      '">' +
      subtitle +
      "</span>" +
      "</div>" +
      '<div class="metric-icon-wrap ' +
      wrapClass +
      '">' +
      icon(iconName, "metric-icon") +
      "</div>" +
      "</div>" +
      "</article>"
    );
  }

  function renderDashboardView() {
    const dashboard = getDashboardData();

    return (
      '<section class="view dashboard-view">' +
      '<div class="dashboard-toolbar">' +
      '<div>' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("dashboard", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>Controle Geral</h2>" +
      "<p>Layout reorganizado por blocos, com leitura do patrimônio, saúde da carteira e alocação no período selecionado.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta" style="margin-top: 0.95rem;">' +
      '<span class="secondary-badge"><strong>' + dashboard.range.label + "</strong> período selecionado</span>" +
      '<span class="secondary-badge"><strong>12 meses</strong> base histórica disponivel</span>' +
      '<span class="secondary-badge"><strong>' + formatNumber(dashboard.upCount + dashboard.downCount) + "</strong> ativos com leitura diária</span>" +
      "</div>" +
      "</div>" +
      '<div class="dashboard-filter">' +
      '<label class="dashboard-date-field" for="dashboard-start"><span>Data inicial</span><input id="dashboard-start" class="dashboard-date-input" type="date" min="' + dateToInputValue(DASHBOARD_MIN_DATE) + '" max="' + dateToInputValue(DASHBOARD_REFERENCE_DATE) + '" value="' + dashboard.range.startValue + '"></label>' +
      '<label class="dashboard-date-field" for="dashboard-end"><span>Data final</span><input id="dashboard-end" class="dashboard-date-input" type="date" min="' + dateToInputValue(DASHBOARD_MIN_DATE) + '" max="' + dateToInputValue(DASHBOARD_REFERENCE_DATE) + '" value="' + dashboard.range.endValue + '"></label>' +
      "</div>" +
      "</div>" +
      '<p class="dashboard-meta-note">Use o calendario do navegador para definir o período da análise.</p>' +

      '<div class="dashboard-metrics-grid">' +
      dashboardMetricCard("Patrimônio Total", formatCurrency(dashboard.totalCurrent, 0), "Fechamento em " + dashboard.currentDateLabel, "money", "neutral") +
      dashboardMetricCard("Rentabilidade", formatCurrency(dashboard.periodReturnValue, 0), formatSignedPercent(dashboard.periodReturnPercent, 2) + " no período", "trendUp", dashboard.periodReturnPercent >= 0 ? "positive" : "warning") +
      dashboardMetricCard("Risco da Carteira", dashboard.riskLabel, "Vol anualizada " + formatPercent(dashboard.volatility, 2), "shield", "warning") +
      dashboardMetricCard("Ativos Hoje", dashboard.upCount + " up / " + dashboard.downCount + " down", "Movimento diário em " + dashboard.currentDateLabel, "activity", dashboard.upCount >= dashboard.downCount ? "positive" : "warning") +
      dashboardMetricCard("Média de rentabilidade", formatSignedPercent(dashboard.averageDailyReturn, 2), "Retorno medio por dia do período", "trendUp", dashboard.averageDailyReturn >= 0 ? "positive" : "warning") +
      "</div>" +

      '<div class="dashboard-layout">' +
      '<div class="dashboard-stack">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Evolução do patrimônio</p><p class="panel-subtitle">Leitura diária dos últimos ate 30 dias no formato dd/mm.</p></div></div>' +
      buildDashboardLineChart(dashboard.lineSeries) +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Serie temporal de rentabilidade e perdas</p><p class="panel-subtitle">Variação diária em colunas: ganho em verde e perda em vermelho (últimos ate 30 dias).</p></div></div>' +
      buildDashboardAreaChart(dashboard.performanceSeries) +
      "</article>" +

      '<div class="dashboard-pair">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Valores investidos por alocação</p><p class="panel-subtitle">Capital distribuido por classe de ativo.</p></div></div>' +
      buildDashboardBars(dashboard.allocation, "current", function(value) { return formatCurrency(value, 0); }, false) +
      "</article>" +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Rentabilidade por alocação</p><p class="panel-subtitle">Desempenho percentual por classe no período filtrado.</p></div></div>' +
      buildDashboardBars(dashboard.allocation, "periodReturnPercent", function(value) { return formatSignedPercent(value, 2); }, true) +
      "</article>" +
      "</div>" +
      "</div>" +

      '<div class="dashboard-side-stack">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Saúde da carteira</p><p class="panel-subtitle">Termômetro consolidado com retorno, risco e resiliência.</p></div></div>' +
      buildDashboardThermometer(dashboard.healthScore, dashboard.healthStatus, dashboard.healthTone) +
      "</article>" +

      '<article class="dashboard-panel dashboard-allocation-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Alocação</p><p class="panel-subtitle">Distribuição por classe de ativo no fechamento do período.</p></div></div>' +
      '<div class="dashboard-allocation-wrap">' +
      '<div class="dashboard-allocation-top">' +
      buildDashboardDonutChart(dashboard.allocation) +
      "</div>" +
      buildDashboardAllocationTable(dashboard.allocation) +
      "</div>" +
      "</article>" +
      "</div>" +
      "</div>" +

      '<div class="dashboard-bottom-row">' +
      '<article class="dashboard-panel dashboard-sector-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Rentabilidade por setor</p><p class="panel-subtitle">Colunas por setor com rentabilidade percentual e performance financeira no período.</p></div></div>' +
      buildDashboardSectorColumns(dashboard.sectorPerformance) +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Top performance</p><p class="panel-subtitle">Top 5 ativos mais lucrativos da carteira no período selecionado.</p></div></div>' +
      buildDashboardTopColumns(dashboard.topAssets, dashboard.totalCurrent) +
      "</article>" +
      "</div>" +
      "</section>"
    );
  }

  function renderAssetsView() {
    const filteredAssets = getFilteredAssets();

    return (
      '<section class="view">' +
      '<header class="section-header">' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("bars", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>Monitoramento de Ativos</h2>" +
      "<p>Filtro por categoria, busca em tempo real e comparação de lucro por ativo.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta"><span class="secondary-badge"><strong>' +
      formatNumber(filteredAssets.length) +
      "</strong> ativos exibidos</span></div>" +
      "</header>" +
      '<div class="toolbar">' +
      '<label class="search-field" for="asset-search">' +
      getSearchIcon() +
      '<input id="asset-search" type="search" autocomplete="off" placeholder="Buscar ticker ou nome..." value="' +
      escapeHtml(state.assetSearch) +
      '">' +
      "</label>" +
      '<div class="filter-group">' +
      TYPE_FILTERS.map(function mapFilter(filter) {
        const active = state.assetFilter === filter.id ? " active" : "";
        return (
          '<button type="button" class="filter-button' +
          active +
          '" data-filter="' +
          filter.id +
          '">' +
          filter.label +
          "</button>"
        );
      }).join("") +
      "</div>" +
      "</div>" +
      '<article class="panel table-shell">' +
      (filteredAssets.length
        ? '<div class="table-scroll"><table class="assets-table"><thead><tr><th>Ativo</th><th class="align-right">Preço</th><th class="align-right">Variação</th><th class="align-right">Qtd</th><th class="align-right">Total</th><th class="align-right">Lucro</th><th class="align-center">Risco</th><th class="align-center">Gráfico</th><th class="align-center">AI</th></tr></thead><tbody>' +
          filteredAssets
            .map(function mapAsset(asset) {
              const total = asset.price * asset.quantity;
              const profit = (asset.price - asset.avgPrice) * asset.quantity;
              const profitPercent = asset.avgPrice > 0 ? ((asset.price - asset.avgPrice) / asset.avgPrice) * 100 : 0;
              return (
                "<tr>" +
                "<td>" +
                '<div class="asset-line"><div><div class="asset-primary">' +
                escapeHtml(asset.ticker) +
                '</div><div class="asset-meta">' +
                escapeHtml(asset.name) +
                '</div></div><span class="asset-type">' +
                escapeHtml(asset.typeLabel) +
                "</span></div>" +
                "</td>" +
                '<td class="align-right mono">' +
                formatCurrency(asset.price, 2) +
                "</td>" +
                '<td class="align-right mono ' +
                getTrendClass(asset.changePercent) +
                '">' +
                formatSignedPercent(asset.changePercent, 2) +
                "</td>" +
                '<td class="align-right mono">' +
                formatNumber(asset.quantity) +
                "</td>" +
                '<td class="align-right mono">' +
                formatCurrency(total, 0) +
                "</td>" +
                '<td class="align-right mono ' +
                getTrendClass(profitPercent) +
                '">' +
                formatSignedPercent(profitPercent, 1) +
                "</td>" +
                '<td class="align-center"><span class="risk-badge ' +
                getRiskClass(asset.risk) +
                '">' +
                asset.risk +
                "</span></td>" +
                '<td class="align-center">' +
                buildSparkline(asset.history.slice(-18), asset.changePercent >= 0) +
                "</td>" +
                '<td class="align-center"><span class="score-badge ' +
                getScoreClass(asset.aiScore) +
                '">' +
                asset.aiScore +
                "</span></td>" +
                "</tr>"
              );
            })
            .join("") +
          "</tbody></table></div>"
        : '<div class="empty-state"><strong>Nenhum ativo encontrado</strong><p>Ajuste o filtro ou refine a busca para localizar outros ativos.</p></div>') +
      "</article>" +
      "</section>"
    );
  }

  function getAIRecommendationAction(row) {
    if (row.recommendation === "venda" || row.trendScore <= 40) {
      return "Reduzir 2% a 5% e proteger risco";
    }
    if (row.recommendation === "compra" && row.confidence >= 76) {
      return "Aumentar 2% a 4% em pullbacks";
    }
    if (row.recommendation === "compra") {
      return "Compra gradual e acompanhar gatilhos";
    }
    return "Manter e monitorar tendência";
  }

  function getAIPrimaryReason(row) {
    if (row.recommendation === "venda" || row.trendScore < 40) {
      return "Perda de tendência com piora da relacao risco/retorno";
    }
    if (row.opportunity >= 78) {
      return "Score alto com contexto favoravel de oportunidade";
    }
    if (row.confidence < 55) {
      return "Baixa confiança do modelo e sinais mistos";
    }
    return "Leitura neutra com necessidade de monitoramento";
  }

  function getAIExplainabilityReasons(row) {
    const trendReason = row.trendScore >= 65 ? "Tendência de alta confirmada" : row.trendScore >= 45 ? "Tendência lateral sem rompimento claro" : "Tendência frágil e perda de força";
    const momentumReason = row.score >= 80 ? "Momentum tecnico forte" : row.score >= 60 ? "Momentum moderado" : "Momentum fraco";
    const volatilityReason = row.volatility <= 16 ? "Volatilidade controlada" : row.volatility <= 28 ? "Volatilidade moderada" : "Volatilidade elevada";
    const marketReason = row.correlation <= 0.25 ? "Baixa correlação com a carteira" : row.correlation <= 0.55 ? "Correlação média com o portfólio" : "Alta correlação com o portfólio";
    return [trendReason, momentumReason, volatilityReason, marketReason];
  }

  function getAIHeatCellColor(metric, value) {
    const intensity = clampNumber(value / 100, 0.05, 1);
    const alpha = round(0.12 + intensity * 0.52, 3);
    if (metric === "risk") {
      return "rgba(255, 91, 110, " + alpha + ")";
    }
    if (metric === "score") {
      return "rgba(42, 168, 255, " + alpha + ")";
    }
    return "rgba(40, 199, 111, " + alpha + ")";
  }

  function getAIEngineData() {
    const smart = getSmartPortfolioData();
    const activeAssets = state.assets.filter(function(asset) {
      return asset.quantity > 0;
    });
    const totalCurrent = activeAssets.reduce(function(sum, asset) {
      return sum + asset.price * asset.quantity;
    }, 0);
    const insights = AI_INSIGHTS.slice().sort(function(a, b) {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
    const portfolioReturns = smart.selectedSeries.slice(1).map(function(point, index) {
      const previous = smart.selectedSeries[index] ? smart.selectedSeries[index].value : point.value;
      return previous ? (point.value - previous) / previous : 0;
    });
    const classRiskDefaults = {
      Ações: 68,
      FIIs: 52,
      "Renda Fixa": 28,
      Cripto: 92,
    };
    const classOptions = ["Ações", "FIIs", "Renda Fixa", "Cripto"];
    const classShare = {
      Ações: 0,
      FIIs: 0,
      "Renda Fixa": 0,
      Cripto: 0,
    };
    const classRisk = Object.assign({}, classRiskDefaults);

    smart.allocation.forEach(function(item) {
      classShare[item.name] = item.share;
      if (item.riskPercent > 0) {
        classRisk[item.name] = round(item.riskPercent, 2);
      }
    });

    let fromClass = classOptions.includes(state.aiSimFromClass) ? state.aiSimFromClass : "Ações";
    let toClass = classOptions.includes(state.aiSimToClass) ? state.aiSimToClass : "Renda Fixa";
    if (fromClass === toClass) {
      toClass = classOptions.find(function(name) {
        return name !== fromClass;
      }) || "Renda Fixa";
    }

    const simShift = clampNumber(parseInt(state.aiSimShiftPercent, 10) || 5, 1, 20);
    const assetRows = activeAssets
      .map(function(asset) {
        const currentValue = asset.price * asset.quantity;
        const investedValue = asset.avgPrice * asset.quantity;
        const weight = totalCurrent ? (currentValue / totalCurrent) * 100 : 0;
        const returnPercent = investedValue ? ((currentValue - investedValue) / investedValue) * 100 : 0;
        const dailyChangePercent = asset.previousPrice ? ((asset.price - asset.previousPrice) / asset.previousPrice) * 100 : 0;
        const historyReturns = asset.history.slice(1).map(function(value, index) {
          const previous = asset.history[index];
          return previous ? (value - previous) / previous : 0;
        });
        const volatility = standardDeviation(historyReturns) * Math.sqrt(252) * 100;
        const riskNumeric = asset.risk === "Alto" ? 86 : asset.risk === "Moderado" ? 58 : 28;
        const trendScore = clampNumber(50 + dailyChangePercent * 8 + (asset.aiScore - 65) * 0.6, 5, 98);
        const confidence = clampNumber(asset.aiScore * 0.72 + (asset.recommendation === "compra" ? 10 : asset.recommendation === "manter" ? 4 : -8) + (asset.risk === "Baixo" ? 10 : asset.risk === "Moderado" ? 2 : -6) + (dailyChangePercent >= 0 ? 6 : -6), 18, 98);
        const opportunity = clampNumber(asset.aiScore * 0.6 + (asset.recommendation === "compra" ? 16 : asset.recommendation === "manter" ? 6 : -12) + Math.max(-16, Math.min(16, returnPercent)) * 0.8 + (asset.dividendYield || 0) * 0.45, 4, 99);
        const trendLabel = trendScore >= 65 ? "Bullish" : trendScore >= 45 ? "Neutra" : "Defensiva";
        const correlation = pearsonCorrelation(historyReturns, portfolioReturns);
        const profileFit = clampNumber(100 - Math.abs(riskNumeric - 58) - volatility * 0.6, 8, 96);
        const action = getAIRecommendationAction({
          recommendation: asset.recommendation,
          confidence: confidence,
          trendScore: trendScore,
        });
        const row = {
          id: asset.id,
          ticker: asset.ticker,
          name: asset.name,
          className: getSmartClassName(asset),
          score: asset.aiScore,
          confidence: round(confidence, 1),
          recommendation: asset.recommendation,
          trendLabel: trendLabel,
          trendScore: round(trendScore, 1),
          risk: asset.risk,
          riskNumeric: round(riskNumeric, 1),
          opportunity: round(opportunity, 1),
          volatility: round(volatility, 2),
          returnPercent: round(returnPercent, 2),
          dailyChangePercent: round(dailyChangePercent, 2),
          value: round(currentValue, 0),
          weight: round(weight, 2),
          correlation: round(correlation, 2),
          profileFit: round(profileFit, 1),
          mainReason: "",
          action: action,
          explainability: [],
        };
        row.mainReason = getAIPrimaryReason(row);
        row.explainability = getAIExplainabilityReasons(row);
        return row;
      })
      .sort(function(a, b) {
        return b.value - a.value;
      });

    const highPriority = [];
    const monitoring = [];
    const attention = [];
    assetRows.forEach(function(row) {
      if (row.recommendation === "venda" || row.trendScore <= 40 || (row.risk === "Alto" && row.dailyChangePercent <= -2.5)) {
        attention.push(row);
      } else if (row.opportunity >= 72 || row.confidence >= 78 || (row.risk === "Alto" && row.opportunity >= 64)) {
        highPriority.push(row);
      } else {
        monitoring.push(row);
      }
    });

    highPriority.sort(function(a, b) {
      return b.opportunity - a.opportunity;
    });
    monitoring.sort(function(a, b) {
      return b.confidence - a.confidence;
    });
    attention.sort(function(a, b) {
      return a.trendScore - b.trendScore;
    });

    const avgConfidence = round(average(assetRows.map(function(row) { return row.confidence; })), 1);
    const avgScore = round(average(assetRows.map(function(row) { return row.score; })), 1);
    const avgTrend = round(average(assetRows.map(function(row) { return row.trendScore; })), 1);
    const riskAggregate = round(assetRows.reduce(function(sum, row) {
      return sum + row.riskNumeric * (row.weight / 100);
    }, 0), 1);
    const riskAggregateLabel = riskAggregate <= 42 ? "Baixo" : riskAggregate <= 62 ? "Moderado" : "Elevado";
    const dominantTrend = avgTrend >= 66 ? "Bullish" : avgTrend >= 48 ? "Neutra" : "Defensiva";
    const opportunitiesCount = highPriority.filter(function(row) {
      return row.recommendation === "compra";
    }).length;
    const benchmarkBase = (smart.cdiReturnPercent + smart.ibovReturnPercent) / 2;
    const benchmarkGap = round(smart.yearReturnPercent - benchmarkBase, 2);
    const promisingAsset = highPriority[0] || assetRows.slice().sort(function(a, b) {
      return b.opportunity - a.opportunity;
    })[0] || null;
    const deterioratingAsset = attention[0] || null;
    const highSeverityInsights = insights.filter(function(item) {
      return item.severity === "high";
    }).length;
    const riskAlertCount = attention.length + highSeverityInsights;
    let aiStatus = "Ativa";
    if (riskAlertCount >= 6 || smart.volatility >= 24) {
      aiStatus = "Atenção Elevada";
    } else if (smart.volatility >= 19) {
      aiStatus = "Mercado Volatil";
    } else if (riskAlertCount >= 3) {
      aiStatus = "Monitorando";
    }

    let marketMode = "Neutro";
    const positiveRatio = assetRows.length ? assetRows.filter(function(row) { return row.dailyChangePercent >= 0; }).length / assetRows.length : 0;
    if (smart.volatility >= 24 || smart.dayReturnPercent <= -1.2) {
      marketMode = "Instavel";
    } else if (positiveRatio >= 0.6 && smart.yearReturnPercent >= smart.cdiReturnPercent) {
      marketMode = "Alta";
    } else if (riskAggregate >= 62 || smart.mainAllocation.share >= 52) {
      marketMode = "Defensivo";
    }

    const summaryText =
      "A carteira esta " +
      (riskAggregate <= 62 ? "equilibrada" : "pressionada por risco") +
      ", com exposição dominante em " +
      smart.mainAllocation.name +
      ". Foram identificadas " +
      formatNumber(opportunitiesCount) +
      " oportunidades de compra com boa relacao risco/retorno. " +
      (deterioratingAsset ? deterioratingAsset.ticker + " apresenta deterioracao de tendência. " : "Nenhum ativo crítico em deterioracao aguda. ") +
      "O risco agregado esta em " +
      riskAggregateLabel.toLowerCase() +
      " (" +
      formatPercent(riskAggregate, 1) +
      ") para o perfil moderado.";

    const confidenceBars = assetRows
      .slice()
      .sort(function(a, b) {
        return b.confidence - a.confidence;
      })
      .slice(0, 10);

    const scatterPoints = assetRows
      .slice()
      .sort(function(a, b) {
        return b.weight - a.weight;
      })
      .slice(0, 12)
      .map(function(row) {
        return {
          ticker: row.ticker,
          riskScore: row.riskNumeric,
          opportunity: row.opportunity,
          confidence: row.confidence,
          recommendation: row.recommendation,
          weight: row.weight,
          score: row.score,
          volatility: row.volatility,
        };
      });

    const heatmapRows = assetRows.slice(0, 8).map(function(row) {
      return {
        ticker: row.ticker,
        name: row.name,
        risk: row.riskNumeric,
        trend: row.trendScore,
        score: row.score,
      };
    });
    const opportunityBase = highPriority.length ? highPriority : assetRows;

    const radarMetrics = [
      { label: "Tendência", value: clampNumber(avgTrend, 5, 98) },
      { label: "Força", value: clampNumber(avgScore, 5, 98) },
      { label: "Risco", value: clampNumber(100 - riskAggregate, 5, 98) },
      { label: "Diversificação", value: clampNumber(smart.diversificationScore, 5, 98) },
      { label: "Confiança", value: clampNumber(avgConfidence, 5, 98) },
      { label: "Oportunidade", value: clampNumber(average(opportunityBase.map(function(row) { return row.opportunity; })), 5, 98) },
    ];

    const signalSource = [];
    highPriority.slice(0, 3).forEach(function(row, index) {
      signalSource.push({
        timestamp: new Date(DASHBOARD_REFERENCE_DATE.getTime() - (240 - index * 45) * 60000),
        type: "buy",
        title: "Compra sugerida em " + row.ticker,
        message: "Score " + row.score + ", confiança " + formatPercent(row.confidence, 1) + " e oportunidade " + formatPercent(row.opportunity, 1) + ".",
      });
    });
    attention.slice(0, 3).forEach(function(row, index) {
      signalSource.push({
        timestamp: new Date(DASHBOARD_REFERENCE_DATE.getTime() - (120 - index * 25) * 60000),
        type: row.recommendation === "venda" ? "sell" : "alert",
        title: "Atenção em " + row.ticker,
        message: "Tendência " + row.trendLabel + " com risco " + row.risk + " e volatilidade de " + formatPercent(row.volatility, 2) + ".",
      });
    });
    insights.slice(0, 5).forEach(function(item, index) {
      signalSource.push({
        timestamp: new Date(new Date(item.timestamp).getTime() + index * 60000),
        type: item.type === "suggestion" ? "buy" : item.severity === "high" ? "alert" : "sell",
        title: item.title,
        message: item.message,
      });
    });

    const signalHistory = signalSource
      .sort(function(a, b) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      })
      .slice(0, 10);

    const feed = signalHistory.map(function(item) {
      return {
        time: item.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        title: item.title,
        message: item.message,
      };
    });

    const practicalActions = [];
    if (smart.mainAllocation.share > smart.mainAllocation.target + 6) {
      practicalActions.push({
        title: "Reduzir exposição em " + smart.mainAllocation.name,
        message: "Classe com " + formatPercent(smart.mainAllocation.share, 1) + " da carteira. Ajuste reduz risco de concentracao.",
      });
    }
    if (promisingAsset) {
      practicalActions.push({
        title: "Aumentar posicao em " + promisingAsset.ticker,
        message: "Melhor relacao entre score (" + promisingAsset.score + ") e confiança (" + formatPercent(promisingAsset.confidence, 1) + ").",
      });
    }
    if (deterioratingAsset) {
      practicalActions.push({
        title: "Controlar risco em " + deterioratingAsset.ticker,
        message: "Ativo com pior leitura de tendência. Considere reduzir posicao ou usar protecao.",
      });
    }
    practicalActions.push({
      title: "Manter caixa tatico",
      message: "Reserva de oportunidade para capturar correcoes sem elevar a volatilidade estrutural.",
    });

    const focusRows = highPriority.concat(attention).slice(0, 6);
    const explainabilityRows = (focusRows.length ? focusRows : assetRows.slice(0, 6)).map(function(row) {
      return {
        ticker: row.ticker,
        score: row.score,
        recommendation: row.recommendation,
        reasons: row.explainability,
      };
    });

    const justificationRows = (focusRows.length ? focusRows : assetRows.slice(0, 4)).slice(0, 4).map(function(row) {
      const profileLabel = row.profileFit >= 70 ? "alinhado" : row.profileFit >= 45 ? "parcialmente alinhado" : "desalinhado";
      return {
        ticker: row.ticker,
        text:
          "Tendência " +
          row.trendLabel +
          " | Score tecnico " +
          formatNumber(row.score) +
          " | Vol " +
          formatPercent(row.volatility, 2) +
          " | Correlação " +
          row.correlation.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
          " | Perfil " +
          profileLabel +
          ".",
      };
    });

    const availableFrom = classShare[fromClass] || 0;
    const effectiveShift = Math.min(simShift, availableFrom);
    const simulatedShare = {
      Ações: classShare.Ações,
      FIIs: classShare.FIIs,
      "Renda Fixa": classShare["Renda Fixa"],
      Cripto: classShare.Cripto,
    };
    simulatedShare[fromClass] = round(simulatedShare[fromClass] - effectiveShift, 2);
    simulatedShare[toClass] = round(simulatedShare[toClass] + effectiveShift, 2);

    function computeRiskFromShare(shareMap) {
      return round(
        classOptions.reduce(function(sum, name) {
          return sum + (shareMap[name] || 0) * (classRisk[name] || classRiskDefaults[name] || 50);
        }, 0) / 100,
        2
      );
    }

    const currentRisk = computeRiskFromShare(classShare);
    const simulatedRisk = computeRiskFromShare(simulatedShare);
    const volatilityProjection = clampNumber(round(smart.volatility - (currentRisk - simulatedRisk) * 0.18, 2), 4, 45);
    const simulatorMessage =
      effectiveShift > 0
        ? "Se reduzir " + formatPercent(effectiveShift, 1) + " em " + fromClass + " e aumentar em " + toClass + ", o risco da carteira cai de " + formatPercent(currentRisk, 1) + " para " + formatPercent(simulatedRisk, 1) + " e a vol projetada fica em " + formatPercent(volatilityProjection, 2) + "."
        : "Sem exposição suficiente em " + fromClass + " para simular " + formatPercent(simShift, 1) + ". Ajuste a classe de origem.";

    const assetTableRows = assetRows.map(function(row) {
      return {
        ticker: row.ticker,
        name: row.name,
        score: row.score,
        confidence: row.confidence,
        recommendation: row.recommendation,
        trend: row.trendLabel,
        risk: row.risk,
        reason: row.mainReason,
        action: row.action,
      };
    });

    return {
      generatedAt: DASHBOARD_REFERENCE_DATE.toLocaleString("pt-BR"),
      aiStatus: aiStatus,
      marketMode: marketMode,
      insightsCount: insights.length + signalHistory.length,
      avgConfidence: avgConfidence,
      avgScore: avgScore,
      alertCount: attention.length + highSeverityInsights,
      opportunitiesCount: opportunitiesCount,
      riskAggregate: riskAggregate,
      riskAggregateLabel: riskAggregateLabel,
      dominantTrend: dominantTrend,
      benchmarkGap: benchmarkGap,
      promisingAsset: promisingAsset,
      summaryText: summaryText,
      priority: {
        high: highPriority.slice(0, 6),
        monitoring: monitoring.slice(0, 6),
        attention: attention.slice(0, 6),
      },
      confidenceBars: confidenceBars,
      scatterPoints: scatterPoints,
      signalHistory: signalHistory,
      heatmapRows: heatmapRows,
      radarMetrics: radarMetrics,
      feed: feed,
      practicalActions: practicalActions,
      explainabilityRows: explainabilityRows,
      justificationRows: justificationRows,
      simulator: {
        classOptions: classOptions,
        fromClass: fromClass,
        toClass: toClass,
        shift: simShift,
        currentRisk: currentRisk,
        projectedRisk: simulatedRisk,
        projectedVolatility: volatilityProjection,
        message: simulatorMessage,
      },
      assetTableRows: assetTableRows,
    };
  }

  function buildAIPriorityColumn(title, subtitle, tone, items) {
    return (
      '<div class="ai-priority-card">' +
      '<div class="ai-priority-card-head"><strong>' + escapeHtml(title) + '</strong><span class="ai-priority-count">' + formatNumber(items.length) + "</span></div>" +
      '<p class="ai-priority-subtitle">' + escapeHtml(subtitle) + "</p>" +
      '<div class="ai-priority-items">' +
      (items.length
        ? items
            .map(function(row) {
              return (
                '<div class="ai-priority-item">' +
                "<div><strong>" + escapeHtml(row.ticker) + "</strong><span>" + escapeHtml(row.mainReason) + "</span></div>" +
                '<span class="ai-priority-tag ' + tone + '">AI ' + formatNumber(row.score) + "</span>" +
                "</div>"
              );
            })
            .join("")
        : '<div class="ai-priority-item"><div><strong>Sem ativos</strong><span>Nenhum item nesta faixa no momento.</span></div><span class="ai-priority-tag">0</span></div>') +
      "</div>" +
      "</div>"
    );
  }

  function buildAIConfidenceBars(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem dados de confiança</strong><p>Não ha ativos para exibir confiança por ativo.</p></div>';
    }

    const width = 980;
    const height = 280;
    const padding = { top: 20, right: 16, bottom: 58, left: 56 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.min(62, barSpace * 0.62);
    let grid = "";
    let yLabels = "";

    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      const value = round(100 - ratio * 100, 0);
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.1)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 10) + '" y="' + (y + 4) + '" text-anchor="end" fill="#8fa7c2" font-size="11">' + value + "%</text>";
    }

    const bars = items
      .map(function(item, index) {
        const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
        const barHeight = innerHeight * (item.confidence / 100);
        const y = height - padding.bottom - barHeight;
        const fill = item.confidence >= 80 ? "#28c76f" : item.confidence >= 65 ? "#ffbf4d" : "#ff5b6e";
        return (
          '<g>' +
          '<rect x="' + x + '" y="' + y + '" width="' + barWidth + '" height="' + Math.max(4, barHeight) + '" rx="10" fill="' + fill + '"></rect>' +
          '<text x="' + (x + barWidth / 2) + '" y="' + (y - 8) + '" text-anchor="middle" fill="#e6f2ff" font-size="11.2" font-weight="800">' + escapeHtml(formatPercent(item.confidence, 1)) + "</text>" +
          '<text x="' + (x + barWidth / 2) + '" y="' + (height - 12) + '" text-anchor="middle" fill="#9bb2cb" font-size="11.4" font-weight="700">' + escapeHtml(item.ticker) + "</text>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 280" role="img" aria-label="Confiança média por ativo">' +
      grid +
      yLabels +
      bars +
      "</svg></div>"
    );
  }

  function buildAIRiskOpportunityScatter(points) {
    if (!points.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar risco versus oportunidade.</p></div>';
    }

    const width = 980;
    const height = 360;
    const padding = { top: 20, right: 22, bottom: 58, left: 62 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const tickCount = 4;
    let grid = "";
    let xLabels = "";
    let yLabels = "";

    for (let index = 0; index <= tickCount; index += 1) {
      const ratio = index / tickCount;
      const x = padding.left + innerWidth * ratio;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + x + '" y1="' + padding.top + '" x2="' + x + '" y2="' + (height - padding.bottom) + '" stroke="rgba(116, 146, 179, 0.09)" stroke-dasharray="3 6"></line>';
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.09)" stroke-dasharray="3 6"></line>';
      xLabels += '<text x="' + x + '" y="' + (height - 28) + '" text-anchor="middle" fill="#97afca" font-size="11">' + round(ratio * 100, 0) + "%</text>";
      yLabels += '<text x="' + (padding.left - 10) + '" y="' + (y + 4) + '" text-anchor="end" fill="#97afca" font-size="11.2">' + round((1 - ratio) * 100, 0) + "%</text>";
    }

    const highlighted = points
      .slice()
      .sort(function(a, b) {
        return b.weight + b.opportunity - (a.weight + a.opportunity);
      })
      .slice(0, 6)
      .map(function(item) {
        return item.ticker;
      });

    const pointsSvg = points
      .map(function(item, index) {
        const x = padding.left + (item.riskScore / 100) * innerWidth;
        const y = padding.top + ((100 - item.opportunity) / 100) * innerHeight;
        const color = item.recommendation === "compra" ? "#28c76f" : item.recommendation === "venda" ? "#ff5b6e" : "#ffbf4d";
        const radius = clampNumber(5 + Math.sqrt(Math.max(item.weight, 0.2)) * 1.4, 5, 14);
        const tooltipWidth = 210;
        const tooltipX = clampNumber(x + 8, padding.left + 4, width - padding.right - tooltipWidth - 4);
        const tooltipY = clampNumber(y - 98, padding.top + 4, height - padding.bottom - 96);
        const showLabel = highlighted.includes(item.ticker);
        return (
          '<g class="ai-scatter-point">' +
          '<circle class="ai-scatter-hit" cx="' + x + '" cy="' + y + '" r="' + Math.max(14, radius + 7) + '"></circle>' +
          '<circle cx="' + x + '" cy="' + y + '" r="' + radius + '" fill="' + color + '" fill-opacity="0.86" stroke="' + color + '" stroke-width="1.2"></circle>' +
          (showLabel ? '<text x="' + x + '" y="' + (y - radius - 9) + '" text-anchor="middle" fill="#e7f2ff" font-size="11.4" font-weight="800" stroke="#081423" stroke-width="2.2" paint-order="stroke fill">' + escapeHtml(item.ticker) + "</text>" : "") +
          '<g class="ai-scatter-tooltip" transform="translate(' + tooltipX + " " + tooltipY + ')">' +
          '<rect class="ai-scatter-tooltip-box" width="' + tooltipWidth + '" height="92" rx="12"></rect>' +
          '<text class="ai-scatter-tooltip-title" x="10" y="20">' + escapeHtml(item.ticker) + "</text>" +
          '<text class="ai-scatter-tooltip-text" x="10" y="40">Risco: ' + escapeHtml(formatPercent(item.riskScore, 1)) + " | Oportunidade: " + escapeHtml(formatPercent(item.opportunity, 1)) + "</text>" +
          '<text class="ai-scatter-tooltip-text" x="10" y="58">Confiança: ' + escapeHtml(formatPercent(item.confidence, 1)) + " | Score: " + formatNumber(item.score) + "</text>" +
          '<text class="ai-scatter-tooltip-text" x="10" y="76">Volatilidade: ' + escapeHtml(formatPercent(item.volatility, 2)) + " | Peso: " + escapeHtml(formatPercent(item.weight, 2)) + "</text>" +
          "</g>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 360" role="img" aria-label="Risco versus oportunidade por ativo">' +
      grid +
      xLabels +
      yLabels +
      pointsSvg +
      '<text x="' + (width / 2) + '" y="' + (height - 8) + '" text-anchor="middle" fill="#d7e7f9" font-size="12.8" font-weight="800">Risco normalizado (%)</text>' +
      '<text x="14" y="' + (height / 2) + '" transform="rotate(-90 14 ' + (height / 2) + ')" text-anchor="middle" fill="#d7e7f9" font-size="12.8" font-weight="800">Oportunidade (%)</text>' +
      "</svg></div>"
    );
  }

  function buildAISignalTimeline(events) {
    if (!events.length) {
      return '<div class="empty-state"><strong>Sem sinais recentes</strong><p>Nenhum evento operacional registrado no período.</p></div>';
    }

    return (
      '<div class="ai-signal-list">' +
      events
        .map(function(item) {
          const typeClass = item.type === "buy" ? "buy" : item.type === "sell" ? "sell" : "alert";
          const timeLabel = item.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
          return (
            '<div class="ai-signal-item">' +
            '<span class="ai-signal-dot ' + typeClass + '"></span>' +
            "<div><strong>" + escapeHtml(timeLabel + " - " + item.title) + "</strong><p>" + escapeHtml(item.message) + "</p></div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildAIHeatmap(rows) {
    if (!rows.length) {
      return '<div class="empty-state"><strong>Sem heatmap</strong><p>Não ha ativos suficientes para a matriz de risco/tendência/score.</p></div>';
    }

    return (
      '<div class="ai-heatmap-wrap">' +
      '<table class="ai-heatmap-table">' +
      "<thead><tr><th>Ativo</th><th>Risco</th><th>Tendência</th><th>Score IA</th></tr></thead>" +
      "<tbody>" +
      rows
        .map(function(row) {
          return (
            '<tr class="ai-heatmap-row">' +
            "<td><strong>" + escapeHtml(row.ticker) + "</strong><div class='asset-meta'>" + escapeHtml(row.name) + "</div></td>" +
            '<td><div class="ai-heat-cell" style="background:' + getAIHeatCellColor("risk", row.risk) + '">' + escapeHtml(formatPercent(row.risk, 1)) + "</div></td>" +
            '<td><div class="ai-heat-cell" style="background:' + getAIHeatCellColor("trend", row.trend) + '">' + escapeHtml(formatPercent(row.trend, 1)) + "</div></td>" +
            '<td><div class="ai-heat-cell" style="background:' + getAIHeatCellColor("score", row.score) + '">' + formatNumber(row.score) + "</div></td>" +
            "</tr>"
          );
        })
        .join("") +
      "</tbody>" +
      "</table>" +
      "</div>"
    );
  }

  function buildAIRadarChart(metrics) {
    if (!metrics.length) {
      return '<div class="empty-state"><strong>Sem radar</strong><p>Não foi possível montar os indicadores da IA.</p></div>';
    }

    const centerX = 180;
    const centerY = 180;
    const radius = 125;
    const steps = [20, 40, 60, 80, 100];
    const slice = (Math.PI * 2) / metrics.length;
    let grid = "";
    let labels = "";
    let axis = "";

    steps.forEach(function(level) {
      const levelRadius = radius * (level / 100);
      const points = metrics
        .map(function(_, index) {
          const angle = -Math.PI / 2 + index * slice;
          const x = centerX + Math.cos(angle) * levelRadius;
          const y = centerY + Math.sin(angle) * levelRadius;
          return x + " " + y;
        })
        .join(" ");
      grid += '<polygon points="' + points + '" fill="none" stroke="rgba(116, 146, 179, 0.12)" stroke-width="1"></polygon>';
    });

    const dataPoints = metrics
      .map(function(metric, index) {
        const angle = -Math.PI / 2 + index * slice;
        const pointRadius = radius * (clampNumber(metric.value, 0, 100) / 100);
        const x = centerX + Math.cos(angle) * pointRadius;
        const y = centerY + Math.sin(angle) * pointRadius;
        const labelX = centerX + Math.cos(angle) * (radius + 26);
        const labelY = centerY + Math.sin(angle) * (radius + 26);
        const axisX = centerX + Math.cos(angle) * radius;
        const axisY = centerY + Math.sin(angle) * radius;
        axis += '<line x1="' + centerX + '" y1="' + centerY + '" x2="' + axisX + '" y2="' + axisY + '" stroke="rgba(116, 146, 179, 0.16)" stroke-width="1"></line>';
        labels += '<text x="' + labelX + '" y="' + (labelY + 4) + '" text-anchor="middle" fill="#9eb4ce" font-size="11.8" font-weight="700">' + escapeHtml(metric.label) + "</text>";
        return {
          x: x,
          y: y,
        };
      });

    const polygonPoints = dataPoints
      .map(function(point) {
        return point.x + " " + point.y;
      })
      .join(" ");

    const dots = dataPoints
      .map(function(point) {
        return '<circle cx="' + point.x + '" cy="' + point.y + '" r="3.6" fill="#2aa8ff"></circle>';
      })
      .join("");

    const list = metrics
      .map(function(metric) {
        return '<div class="ai-radar-item"><span>' + escapeHtml(metric.label) + '</span><strong>' + escapeHtml(formatPercent(metric.value, 1)) + "</strong></div>";
      })
      .join("");

    return (
      '<div class="ai-radar-shell">' +
      '<svg viewBox="0 0 360 360" role="img" aria-label="Radar da IA">' +
      grid +
      axis +
      '<polygon points="' + polygonPoints + '" fill="rgba(42, 168, 255, 0.24)" stroke="#2aa8ff" stroke-width="2.2"></polygon>' +
      dots +
      labels +
      "</svg>" +
      '<div class="ai-radar-list">' + list + "</div>" +
      "</div>"
    );
  }

  function buildAIFeed(events) {
    if (!events.length) {
      return '<div class="empty-state"><strong>Sem eventos no feed</strong><p>A IA ainda não registrou novas ocorrências.</p></div>';
    }

    return (
      '<div class="ai-feed-list">' +
      events
        .map(function(event) {
          return (
            '<div class="ai-feed-item"><span class="ai-feed-time">' + escapeHtml(event.time) + "</span><div><strong>" + escapeHtml(event.title) + "</strong><p>" + escapeHtml(event.message) + "</p></div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildAIPracticalActions(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem recomendacoes</strong><p>Não ha ação taticas sugeridas neste momento.</p></div>';
    }

    return (
      '<div class="ai-action-list">' +
      items
        .map(function(item) {
          return '<div class="ai-action-item"><strong>' + escapeHtml(item.title) + "</strong><p>" + escapeHtml(item.message) + "</p></div>";
        })
        .join("") +
      "</div>"
    );
  }

  function buildAIExplainCards(rows) {
    if (!rows.length) {
      return '<div class="empty-state"><strong>Sem explicabilidade</strong><p>Não ha ativos para justificar recomendacoes.</p></div>';
    }

    return (
      '<div class="ai-explain-grid">' +
      rows
        .map(function(row) {
          const recommendationTone = row.recommendation === "compra" ? "positive" : row.recommendation === "venda" ? "negative" : "warning";
          return (
            '<div class="ai-explain-card">' +
            '<div class="ai-explain-head"><div><strong>' + escapeHtml(row.ticker) + " - Score " + formatNumber(row.score) + "</strong><span>" + escapeHtml(row.recommendation.toUpperCase()) + "</span></div><span class='ai-priority-tag " + recommendationTone + "'>AI</span></div>" +
            '<ul class="ai-explain-list">' +
            row.reasons.map(function(reason) {
              return "<li>" + escapeHtml(reason) + "</li>";
            }).join("") +
            "</ul>" +
            "</div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function buildAIJustificationPanel(rows) {
    if (!rows.length) {
      return '<div class="empty-state"><strong>Sem justificativas</strong><p>Não ha ativos com leitura detalhada no momento.</p></div>';
    }

    return (
      '<div class="ai-justification-list">' +
      rows
        .map(function(row) {
          return '<div class="ai-justification-item"><strong>' + escapeHtml(row.ticker) + "</strong><p>" + escapeHtml(row.text) + "</p></div>";
        })
        .join("") +
      "</div>"
    );
  }

  function renderAIView() {
    const ai = getAIEngineData();
    const statusTone = ai.aiStatus === "Ativa" ? "positive" : ai.aiStatus === "Monitorando" ? "neutral" : "warning";
    const modeTone = ai.marketMode === "Alta" ? "positive" : ai.marketMode === "Defensivo" || ai.marketMode === "Instavel" ? "warning" : "neutral";
    const benchmarkTone = ai.benchmarkGap >= 0 ? "positive" : "warning";
    const promisingTicker = ai.promisingAsset ? ai.promisingAsset.ticker : "-";

    return (
      '<section class="view dashboard-view ai-view">' +
      '<header class="section-header">' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("brain", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>FinanceAI</h2>" +
      "<p>Motor de inteligência para interpretar carteira, explicar decisao e sugerir ação.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta">' +
      '<span class="secondary-badge"><strong>' + escapeHtml(ai.generatedAt) + "</strong> leitura executiva</span>" +
      '<span class="secondary-badge"><strong>' + formatNumber(ai.assetTableRows.length) + "</strong> ativos analisados</span>" +
      "</div>" +
      "</header>" +

      '<div class="ai-header-grid">' +
      dashboardMetricCard("Status da IA", ai.aiStatus, "Motor em análise continua da carteira", "activity", statusTone) +
      dashboardMetricCard("Insights gerados", formatNumber(ai.insightsCount), "Eventos, sinais e alertas mapeados", "spark", "neutral") +
      dashboardMetricCard("Confiança média", formatPercent(ai.avgConfidence, 1), "Média ponderada das recomendacoes", "shield", ai.avgConfidence >= 72 ? "positive" : "warning") +
      dashboardMetricCard("Modo de mercado", ai.marketMode, "Leitura dinamica do contexto atual", "trendUp", modeTone) +
      "</div>" +

      '<div class="ai-kpi-grid">' +
      dashboardMetricCard("Score medio da carteira", formatNumber(ai.avgScore), "Qualidade tecnica agregada", "dashboard", ai.avgScore >= 72 ? "positive" : "warning") +
      dashboardMetricCard("Confiança das recomendacoes", formatPercent(ai.avgConfidence, 1), "Precisao média do modelo local", "shield", ai.avgConfidence >= 72 ? "positive" : "warning") +
      dashboardMetricCard("Ativos em alerta", formatNumber(ai.alertCount), "Perda de tendência ou risco crescente", "alert", ai.alertCount > 4 ? "negative" : "warning") +
      dashboardMetricCard("Oportunidades detectadas", formatNumber(ai.opportunitiesCount), "Ativos com gatilho de ação imediata", "bulb", ai.opportunitiesCount > 0 ? "positive" : "neutral") +
      dashboardMetricCard("Risco agregado", formatPercent(ai.riskAggregate, 1), ai.riskAggregateLabel, "activity", ai.riskAggregate <= 62 ? "positive" : "warning") +
      dashboardMetricCard("Tendência dominante", ai.dominantTrend, "Direção média dos sinais tecnicos", "trendUp", ai.dominantTrend === "Bullish" ? "positive" : ai.dominantTrend === "Defensiva" ? "warning" : "neutral") +
      dashboardMetricCard("Divergencia benchmark", formatSignedPercent(ai.benchmarkGap, 2), "Comparação contra CDI e IBOV", "bars", benchmarkTone) +
      dashboardMetricCard("Ativo mais promissor", promisingTicker, ai.promisingAsset ? "Confiança " + formatPercent(ai.promisingAsset.confidence, 1) : "Sem destaque", "spark", ai.promisingAsset ? "positive" : "neutral") +
      "</div>" +

      '<div class="ai-layout">' +
      '<div class="ai-main-stack">' +
      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Painel Principal da IA</p><p class="panel-subtitle">Resumo executivo automatizado com contexto de risco e oportunidade.</p></div></div>' +
      '<div class="ai-summary-block"><span class="ai-summary-label">Leitura automatica</span><p>' + escapeHtml(ai.summaryText) + "</p></div>" +
      "</article>" +

      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Confiança por Ativo</p><p class="panel-subtitle">Nivel de confiança da IA em cada recomendação principal.</p></div></div>' +
      buildAIConfidenceBars(ai.confidenceBars) +
      "</article>" +

      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Risco vs Oportunidade</p><p class="panel-subtitle">Cada ponto representa um ativo com risco projetado e oportunidade relativa.</p></div></div>' +
      buildAIRiskOpportunityScatter(ai.scatterPoints) +
      "</article>" +

      '<div class="ai-duo-grid ai-panel-span-2">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Heatmap de Ativos</p><p class="panel-subtitle">Mapa de risco, tendência e score por ativo.</p></div></div>' +
      buildAIHeatmap(ai.heatmapRows) +
      "</article>" +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Radar da IA</p><p class="panel-subtitle">Indicadores estruturais de tendência, risco e confiança.</p></div></div>' +
      buildAIRadarChart(ai.radarMetrics) +
      "</article>" +
      "</div>" +

      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Histórico de Sinais</p><p class="panel-subtitle">Linha do tempo de compras, vendas e alertas de risco.</p></div></div>' +
      buildAISignalTimeline(ai.signalHistory) +
      "</article>" +
      "</div>" +

      '<aside class="ai-side-stack">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Recomendacoes por Prioridade</p><p class="panel-subtitle">Classificacao operacional para ação imediata, monitoramento e atenção.</p></div></div>' +
      '<div class="ai-priority-grid">' +
      buildAIPriorityColumn("Alta prioridade", "Sinais fortes, oportunidade imediata e risco relevante.", "positive", ai.priority.high) +
      buildAIPriorityColumn("Monitoramento", "Ativos neutros sem ação imediata.", "warning", ai.priority.monitoring) +
      buildAIPriorityColumn("Atenção", "Perda de tendência, queda de score e aumento de risco.", "negative", ai.priority.attention) +
      "</div>" +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Explicabilidade da IA</p><p class="panel-subtitle">Por ativo: por que a recomendação foi gerada.</p></div></div>' +
      buildAIExplainCards(ai.explainabilityRows) +
      "</article>" +

      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Por que a IA sugeriu isso?</p><p class="panel-subtitle">Tendência, score tecnico, volatilidade, correlação e perfil de risco.</p></div></div>' +
      buildAIJustificationPanel(ai.justificationRows) +
      "</article>" +
      "</aside>" +
      "</div>" +

      '<div class="ai-duo-grid">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Feed de Insights</p><p class="panel-subtitle">Fluxo cronologico de eventos detectados pela IA.</p></div></div>' +
      buildAIFeed(ai.feed) +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Recomendacoes Praticas</p><p class="panel-subtitle">Ações objetivas para execucao imediata.</p></div></div>' +
      buildAIPracticalActions(ai.practicalActions) +
      "</article>" +

      '<article class="dashboard-panel ai-panel-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Simulador de Ação</p><p class="panel-subtitle">Teste o impacto de rebalancear classes na carteira.</p></div></div>' +
      '<div class="ai-simulator-grid">' +
      '<div class="ai-simulator-field"><label for="ai-sim-from">Reduzir classe</label><select id="ai-sim-from" class="ai-select">' +
      ai.simulator.classOptions
        .map(function(name) {
          return '<option value="' + escapeHtml(name) + '"' + (name === ai.simulator.fromClass ? " selected" : "") + ">" + escapeHtml(name) + "</option>";
        })
        .join("") +
      "</select></div>" +
      '<div class="ai-simulator-field"><label for="ai-sim-to">Aumentar classe</label><select id="ai-sim-to" class="ai-select">' +
      ai.simulator.classOptions
        .map(function(name) {
          return '<option value="' + escapeHtml(name) + '"' + (name === ai.simulator.toClass ? " selected" : "") + ">" + escapeHtml(name) + "</option>";
        })
        .join("") +
      "</select></div>" +
      '<div class="ai-simulator-field"><label for="ai-sim-shift">Mover (%)</label><input id="ai-sim-shift" class="ai-range" type="range" min="1" max="20" step="1" value="' + formatNumber(ai.simulator.shift) + '"></div>' +
      "</div>" +
      '<div class="ai-simulator-output"><p><strong>Risco atual:</strong> ' + formatPercent(ai.simulator.currentRisk, 1) + " | <strong>Risco projetado:</strong> " + formatPercent(ai.simulator.projectedRisk, 1) + " | <strong>Vol projetada:</strong> " + formatPercent(ai.simulator.projectedVolatility, 2) + "</p><p>" + escapeHtml(ai.simulator.message) + "</p></div>" +
      "</article>" +
      "</div>" +
      "</section>"
    );
  }

  function renderBrokerView() {
    const filteredAssets = getBrokerFilteredAssets();
    let selectedAsset = filteredAssets.find(function(asset) {
      return asset.id === state.selectedAssetId;
    });
    if (!selectedAsset) {
      selectedAsset = filteredAssets[0] || null;
      if (selectedAsset) {
        state.selectedAssetId = selectedAsset.id;
      }
    }
    const movers = getBrokerMoversData();
    const rangeConfig = getBrokerRangeConfig();
    const selectedLabel = selectedAsset ? selectedAsset.ticker : "Nenhum";

    return (
      '<section class="view">' +
      '<header class="section-header">' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("candles", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>Traide Análise</h2>" +
      "<p>Painel de candlestick para analisar desempenho de ativos ao longo do tempo.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta"><span class="secondary-badge"><strong>' +
      escapeHtml(selectedLabel) +
      "</strong> ativo selecionado</span></div>" +
      "</header>" +

      '<div class="trade-layout">' +
      '<aside class="trade-left-stack">' +
      '<article class="panel">' +
      '<div class="panel-head"><div><p class="panel-title">Filtro de Alocacoes</p><p class="panel-subtitle">Selecione a classe para refinar os ativos exibidos.</p></div></div>' +
      '<div class="trade-allocation-chips">' +
      TYPE_FILTERS.map(function(filter) {
        const active = state.brokerAllocationFilter === filter.id ? " active" : "";
        return (
          '<button type="button" class="trade-chip' + active + '" data-broker-allocation="' + filter.id + '">' + filter.label + "</button>"
        );
      }).join("") +
      "</div>" +
      "</article>" +

      '<article class="panel">' +
      '<div class="panel-head"><div><p class="panel-title">Filtro do Ativo</p><p class="panel-subtitle">Pesquise e selecione o ativo para análise.</p></div></div>' +
      '<div class="trade-search-shell">' +
      '<input id="broker-search" type="search" autocomplete="off" placeholder="Buscar ticker ou nome..." value="' + escapeHtml(state.brokerAssetSearch) + '">' +
      '<div class="trade-assets-scroll"><div class="asset-list">' +
      (filteredAssets.length
        ? filteredAssets
            .map(function(asset) {
              const active = selectedAsset && asset.id === selectedAsset.id ? " active" : "";
              return (
                '<button type="button" class="asset-list-button' +
                active +
                '" data-select-asset="' +
                asset.id +
                '">' +
                '<div class="asset-list-copy"><strong>' +
                escapeHtml(asset.ticker) +
                "</strong><small>" +
                escapeHtml(asset.name) +
                "</small></div>" +
                '<div class="mono ' +
                getTrendClass(asset.changePercent) +
                '">' +
                formatSignedPercent(asset.changePercent, 2) +
                "</div>" +
                "</button>"
              );
            })
            .join("")
        : '<div class="empty-state"><strong>Sem ativos no filtro</strong><p>Ajuste a alocação ou a busca para localizar ativos.</p></div>') +
      "</div></div>" +
      "</div>" +
      "</article>" +

      '<article class="panel">' +
      '<div class="panel-head"><div><p class="panel-title">Altas e Baixas do Dia</p><p class="panel-subtitle">Tabela de desempenho diário dos ativos com maior movimento.</p></div></div>' +
      '<div class="trade-movers-wrap"><div class="trade-movers-scroll"><table class="trade-movers-table">' +
      "<thead><tr><th>Ativo</th><th class='align-right'>Variação</th><th class='align-center'>Status</th></tr></thead>" +
      "<tbody>" +
      movers
        .map(function(row) {
          return (
            "<tr>" +
            "<td><strong>" + escapeHtml(row.ticker) + "</strong><div class='asset-meta'>" + escapeHtml(row.name) + "</div></td>" +
            '<td class="align-right mono ' + getTrendClass(row.changePercent) + '">' + formatSignedPercent(row.changePercent, 2) + "</td>" +
            '<td class="align-center"><span class="trade-movers-tag ' + (row.direction === "up" ? "up" : "down") + '">' + (row.direction === "up" ? "Alta" : "Baixa") + "</span></td>" +
            "</tr>"
          );
        })
        .join("") +
      "</tbody></table></div></div>" +
      "</article>" +
      "</aside>" +

      '<article class="panel trade-main-panel">' +
      (selectedAsset
        ? '<div class="panel-head"><div><p class="panel-title">' +
          escapeHtml(selectedAsset.ticker) +
          " - " +
          escapeHtml(selectedAsset.name) +
          '</p><p class="panel-subtitle">Gráfico candlestick para acompanhamento temporal de desempenho.</p></div><div class="trade-top-meta"><div class="broker-price ' +
          getTrendClass(selectedAsset.changePercent) +
          '">' +
          formatCurrency(selectedAsset.price, 2) +
          '</div><div class="trade-range-controls">' +
          BROKER_RANGE_OPTIONS.map(function(option) {
            const active = option.id === rangeConfig.id ? " active" : "";
            return '<button type="button" class="trade-range-button' + active + '" data-broker-range="' + option.id + '">' + option.label + "</button>";
          }).join("") +
          "</div></div></div>" +
          buildCandlestickChart(selectedAsset, rangeConfig.id) +
          '<div class="chart-summary">' +
          '<div class="chart-stat"><span>Setor</span><strong>' + escapeHtml(selectedAsset.sector) + "</strong></div>" +
          '<div class="chart-stat"><span>Risco</span><strong>' + selectedAsset.risk + "</strong></div>" +
          '<div class="chart-stat"><span>Quantidade em carteira</span><strong>' + formatNumber(selectedAsset.quantity) + "</strong></div>" +
          '<div class="chart-stat"><span>Variação diária</span><strong class="' + getTrendClass(selectedAsset.changePercent) + '">' + formatSignedPercent(selectedAsset.changePercent, 2) + "</strong></div>" +
          '<div class="chart-stat"><span>AI Score</span><strong>' + formatNumber(selectedAsset.aiScore) + "</strong></div>" +
          '<div class="chart-stat"><span>Volume</span><strong>' + formatNumber(selectedAsset.volume) + "</strong></div>" +
          "</div>"
        : '<div class="empty-state"><strong>Sem ativo disponivel</strong><p>Os filtros atuais não retornaram ativos com liquidez para análise.</p></div>') +
      "</article>" +
      "</div>" +
      "</section>"
    );
  }

  function renderProventosView() {
    const dividendData = getDividendAnalytics();

    return (
      '<section class="view dashboard-view proventos-view">' +
      '<header class="section-header" style="margin-bottom: 0;">' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("money", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>Proventos e Dividendos</h2>" +
      "<p>Fluxo de renda passiva com leitura mensal, previsibilidade e qualidade da carteira pagadora.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta">' +
      '<span class="secondary-badge"><strong>' + formatNumber(dividendData.monthlySeries.length) + "</strong> meses no histórico</span>" +
      '<span class="secondary-badge"><strong>' + dividendData.latestLabel + "</strong> último fechamento</span>" +
      '<span class="secondary-badge"><strong>' + formatNumber(dividendData.payerCount) + "</strong> ativos pagadores</span>" +
      "</div>" +
      "</header>" +

      '<div class="proventos-metrics-grid">' +
      dashboardMetricCard("Dividendos totais (mes)", formatCurrency(dividendData.monthDividends, 2), "Fechamento de " + dividendData.latestLabel, "money", "positive") +
      dashboardMetricCard("Dividendos totais (ano)", formatCurrency(dividendData.yearDividends, 2), "Ano corrente ate " + dividendData.latestLabel, "trendUp", "positive") +
      dashboardMetricCard("Dividend Yield (DY)", formatPercent(dividendData.portfolioDividendYield, 2), "DY medio ponderado da carteira", "activity", "warning") +
      dashboardMetricCard("Renda mensal média", formatCurrency(dividendData.avgMonthly, 2), "Média dos últimos " + formatNumber(dividendData.monthlySeries.length) + " meses", "dashboard", "neutral") +
      dashboardMetricCard("Projeção anual", formatCurrency(dividendData.annualProjection, 0), "Mantendo composicao e DY atual", "spark", "positive") +
      "</div>" +

      '<div class="proventos-board">' +
      '<article class="dashboard-panel proventos-panel proventos-span-7">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Dividendos Mensais</p><p class="panel-subtitle">Bar chart com sazonalidade e consistencia de pagamentos.</p></div></div>' +
      buildDividendMonthlyBars(dividendData.monthlySeries) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-5">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Evolução da Renda Passiva</p><p class="panel-subtitle">Linha da tendência de crescimento mes a mes.</p></div></div>' +
      buildDividendPassiveLine(dividendData.monthlySeries) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4 proventos-equal-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Distribuição por Ativo</p><p class="panel-subtitle">Quem paga mais dividendos na carteira.</p></div></div>' +
      buildDividendDistributionDonut(dividendData.assetDistribution, dividendData.annualProjection) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4 proventos-sector-panel proventos-equal-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Dividendos por Setor</p><p class="panel-subtitle">Renda por setor para leitura de diversificação.</p></div></div>' +
      buildDividendSectorBars(dividendData.sectorDistribution) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4 proventos-equal-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Yield por Ativo (DY)</p><p class="panel-subtitle">Barra horizontal com DY e renda estimada anual.</p></div></div>' +
      buildDividendYieldBars(dividendData.yieldByAsset) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-12">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Heatmap de Dividendos</p><p class="panel-subtitle">Intensidade de pagamentos por dia e mes para prever fluxo.</p></div></div>' +
      buildDividendHeatmap(dividendData.heatmap) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Projeção de Renda</p><p class="panel-subtitle">Linha histórica + forecast dos proximos meses.</p></div></div>' +
      buildDividendForecastChart(dividendData.forecast) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Yield on Cost (YOC)</p><p class="panel-subtitle">Rendimento sobre custo histórico da carteira.</p></div></div>' +
      buildDividendYocChart(dividendData.yocSeries) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-4">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Dividendos vs Aportes</p><p class="panel-subtitle">Comparativo entre capital investido e renda gerada.</p></div></div>' +
      buildDividendVsAportesChart(dividendData.monthlySeries) +
      "</article>" +

      '<article class="dashboard-panel proventos-panel proventos-span-12">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Acumulado de Dividendos</p><p class="panel-subtitle">Curva acumulada para mostrar o efeito bola de neve.</p></div></div>' +
      buildDividendAccumulatedChart(dividendData.monthlySeries) +
      "</article>" +
      "</div>" +
      "</section>"
    );
  }

  function clampNumber(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function average(values) {
    if (!values.length) {
      return 0;
    }

    return values.reduce(function(sum, value) {
      return sum + value;
    }, 0) / values.length;
  }

  function standardDeviation(values) {
    if (!values.length) {
      return 0;
    }

    const mean = average(values);
    const variance = values.reduce(function(sum, value) {
      return sum + Math.pow(value - mean, 2);
    }, 0) / values.length;

    return Math.sqrt(variance);
  }

  function getSeriesReturnPercent(series) {
    if (!series.length) {
      return 0;
    }

    const start = series[0].value;
    const end = series[series.length - 1].value;
    return start ? ((end - start) / start) * 100 : 0;
  }

  function pearsonCorrelation(seriesA, seriesB) {
    const size = Math.min(seriesA.length, seriesB.length);
    if (!size) {
      return 0;
    }

    const valuesA = seriesA.slice(seriesA.length - size);
    const valuesB = seriesB.slice(seriesB.length - size);
    const meanA = average(valuesA);
    const meanB = average(valuesB);
    const deviationA = standardDeviation(valuesA);
    const deviationB = standardDeviation(valuesB);

    if (!deviationA || !deviationB) {
      return 0;
    }

    const covariance = valuesA.reduce(function(sum, value, index) {
      return sum + (value - meanA) * (valuesB[index] - meanB);
    }, 0) / size;

    return covariance / (deviationA * deviationB);
  }

  function getSmartClassName(asset) {
    if (!asset) {
      return "Outros";
    }

    if (asset.type === "acao_br" || asset.type === "acao_int") {
      return "Ações";
    }

    if (asset.type === "fii") {
      return "FIIs";
    }

    if (asset.type === "renda_fixa" || asset.type === "previdência") {
      return "Renda Fixa";
    }

    if (asset.type === "cripto") {
      return "Cripto";
    }

    return "Outros";
  }

  function getSmartRangeConfig() {
    return (
      SMART_RANGE_OPTIONS.find(function(option) {
        return option.id === state.smartRange;
      }) || SMART_RANGE_OPTIONS[1]
    );
  }

  function getSmartToneClass(value) {
    return value >= 0 ? "positive" : "negative";
  }

  function getSmartRiskTone(risk) {
    if (risk === "Baixo") {
      return "positive";
    }
    return "warning";
  }

  function getSmartHeatColor(value) {
    const normalized = clampNumber(Math.abs(value) / 8, 0.08, 1);
    if (value >= 0) {
      return "rgba(40, 199, 111, " + round(0.1 + normalized * 0.72, 3) + ")";
    }
    return "rgba(255, 91, 110, " + round(0.1 + normalized * 0.72, 3) + ")";
  }

  function getSmartPortfolioData() {
    const activeAssets = state.assets.filter(function(asset) {
      return asset.quantity > 0;
    });
    const totalCurrent = activeAssets.reduce(function(sum, asset) {
      return sum + asset.price * asset.quantity;
    }, 0);
    const totalInvested = activeAssets.reduce(function(sum, asset) {
      return sum + asset.avgPrice * asset.quantity;
    }, 0);
    const previousTotal = activeAssets.reduce(function(sum, asset) {
      return sum + asset.previousPrice * asset.quantity;
    }, 0);
    const dayReturnValue = totalCurrent - previousTotal;
    const dayReturnPercent = previousTotal ? (dayReturnValue / previousTotal) * 100 : 0;

    const fullDays = 365;
    const startDate = addDays(DASHBOARD_REFERENCE_DATE, -(fullDays - 1));
    const fullSeries = Array.from({ length: fullDays }, function(_, index) {
      const date = addDays(startDate, index);
      const value = activeAssets.reduce(function(sum, asset) {
        return sum + getDashboardPriceAtDate(asset, date) * asset.quantity;
      }, 0);

      return {
        date: date,
        label: formatDateDayMonth(date),
        value: round(value, 2),
      };
    });

    const benchmarkSeries = SMART_BENCHMARK_CONFIG.map(function(config) {
      const baseValue = fullSeries[0] ? fullSeries[0].value : 1;
      const data = fullSeries.map(function(point, index) {
        const growth = Math.pow(1 + config.annualRate / 100, index / 252);
        const wave = Math.sin(index * config.waveFreq + config.wavePhase) * baseValue * config.waveScale;
        const secondaryWave = Math.cos(index * config.waveFreq * 0.38 + config.wavePhase) * baseValue * config.waveScale * 0.58;
        return {
          date: point.date,
          label: point.label,
          value: round(baseValue * growth + wave + secondaryWave, 2),
        };
      });

      return {
        id: config.id,
        label: config.label,
        color: config.color,
        annualRate: config.annualRate,
        data: data,
      };
    });

    const rangeConfig = getSmartRangeConfig();
    const rangeDays = clampNumber(rangeConfig.days, 7, fullSeries.length);
    const selectedSeries = fullSeries.slice(fullSeries.length - rangeDays).map(function(item) {
      return {
        date: item.date,
        label: formatDateDayMonth(item.date),
        value: item.value,
      };
    });
    const selectedBenchmarkSeries = benchmarkSeries.map(function(series) {
      return {
        id: series.id,
        label: series.label,
        color: series.color,
        annualRate: series.annualRate,
        data: series.data.slice(series.data.length - rangeDays).map(function(item) {
          return {
            date: item.date,
            label: formatDateDayMonth(item.date),
            value: item.value,
          };
        }),
      };
    });

    const monthSeries = fullSeries.slice(fullSeries.length - Math.min(30, fullSeries.length));
    const yearSeries = fullSeries.slice(fullSeries.length - Math.min(252, fullSeries.length));
    const rangeReturnPercent = getSeriesReturnPercent(selectedSeries);
    const monthReturnPercent = getSeriesReturnPercent(monthSeries);
    const yearReturnPercent = getSeriesReturnPercent(yearSeries);

    const cdiSeries = selectedBenchmarkSeries.find(function(series) { return series.id === "cdi"; });
    const ibovSeries = selectedBenchmarkSeries.find(function(series) { return series.id === "ibov"; });
    const sp500Series = selectedBenchmarkSeries.find(function(series) { return series.id === "sp500"; });
    const cdiReturnPercent = cdiSeries ? getSeriesReturnPercent(cdiSeries.data) : 0;
    const ibovReturnPercent = ibovSeries ? getSeriesReturnPercent(ibovSeries.data) : 0;
    const sp500ReturnPercent = sp500Series ? getSeriesReturnPercent(sp500Series.data) : 0;
    const relativeToCdi = rangeReturnPercent - cdiReturnPercent;

    const rangeReturns = selectedSeries.slice(1).map(function(point, index) {
      const previousValue = selectedSeries[index].value;
      return previousValue ? (point.value - previousValue) / previousValue : 0;
    });
    const meanRangeReturn = average(rangeReturns);
    const stdRangeReturn = standardDeviation(rangeReturns);
    const cdiAnnualRate = SMART_BENCHMARK_CONFIG.find(function(item) { return item.id === "cdi"; }).annualRate;
    const riskFreeDaily = Math.pow(1 + cdiAnnualRate / 100, 1 / 252) - 1;
    const volatility = stdRangeReturn * Math.sqrt(252) * 100;
    const sharpeRatio = stdRangeReturn > 0 ? ((meanRangeReturn - riskFreeDaily) / stdRangeReturn) * Math.sqrt(252) : 0;

    let peakValue = selectedSeries[0] ? selectedSeries[0].value : 0;
    const drawdownSeries = selectedSeries.map(function(point) {
      peakValue = Math.max(peakValue, point.value);
      const drawdown = peakValue ? ((point.value - peakValue) / peakValue) * 100 : 0;
      return {
        date: point.date,
        label: point.label,
        value: point.value,
        drawdown: round(drawdown, 2),
      };
    });
    const maxDrawdown = drawdownSeries.reduce(function(minimum, item) {
      return Math.min(minimum, item.drawdown);
    }, 0);

    const classMap = { Ações: 0, FIIs: 0, "Renda Fixa": 0, Cripto: 0 };
    const classRiskMap = {
      Ações: { weightedRisk: 0, value: 0 },
      FIIs: { weightedRisk: 0, value: 0 },
      "Renda Fixa": { weightedRisk: 0, value: 0 },
      Cripto: { weightedRisk: 0, value: 0 },
    };
    activeAssets.forEach(function(asset) {
      const className = getSmartClassName(asset);
      const positionValue = asset.price * asset.quantity;
      const riskWeight = asset.risk === "Alto" ? 100 : asset.risk === "Moderado" ? 60 : 25;
      classMap[className] = (classMap[className] || 0) + positionValue;
      if (!classRiskMap[className]) {
        classRiskMap[className] = { weightedRisk: 0, value: 0 };
      }
      classRiskMap[className].weightedRisk += positionValue * riskWeight;
      classRiskMap[className].value += positionValue;
    });
    const allocation = SMART_TARGET_ALLOCATION.map(function(target) {
      const current = classMap[target.name] || 0;
      const riskBucket = classRiskMap[target.name] || { weightedRisk: 0, value: 0 };
      const share = totalCurrent ? (current / totalCurrent) * 100 : 0;
      const riskPercent = riskBucket.value ? (riskBucket.weightedRisk / riskBucket.value) : 0;
      return {
        name: target.name,
        target: target.target,
        current: round(current, 0),
        share: round(share, 2),
        diff: round(target.target - share, 2),
        riskPercent: round(riskPercent, 2),
      };
    });

    const sortedAllocation = allocation.slice().sort(function(a, b) {
      return b.share - a.share;
    });
    const mainAllocation = sortedAllocation[0] || { name: "-", share: 0, target: 0 };
    const concentrationLevel = mainAllocation.share >= 55 ? "high" : mainAllocation.share >= 45 ? "medium" : "low";
    const concentrationAlert =
      concentrationLevel === "high"
        ? {
            tone: "negative",
            title: "Concentracao elevada",
            message: "A classe " + mainAllocation.name + " representa " + formatPercent(mainAllocation.share, 1) + " da carteira. Considere reduzir para evitar risco concentrado.",
          }
        : concentrationLevel === "medium"
          ? {
              tone: "warning",
              title: "Concentracao acima do ideal",
              message: "A classe " + mainAllocation.name + " esta acima de " + formatPercent(mainAllocation.target, 1) + " e pode pressionar a volatilidade da carteira.",
            }
          : {
              tone: "positive",
              title: "Concentracao controlada",
              message: "Nenhuma classe ultrapassa limites criticos de exposição para o perfil moderado.",
            };

    const sectorMap = {};
    activeAssets.forEach(function(asset) {
      const key = asset.sector || asset.typeLabel || "Outros";
      sectorMap[key] = (sectorMap[key] || 0) + asset.price * asset.quantity;
    });
    const sectorDistribution = Object.keys(sectorMap).map(function(sector) {
      const value = sectorMap[sector];
      return {
        sector: sector,
        value: value,
        share: totalCurrent ? round((value / totalCurrent) * 100, 2) : 0,
      };
    }).sort(function(a, b) {
      return b.value - a.value;
    });
    const topSector = sectorDistribution[0] || { sector: "-", share: 0 };

    const highRiskValue = activeAssets
      .filter(function(asset) {
        return asset.risk === "Alto";
      })
      .reduce(function(sum, asset) {
        return sum + asset.price * asset.quantity;
      }, 0);
    const riskExposurePercent = totalCurrent ? (highRiskValue / totalCurrent) * 100 : 0;

    const performanceByAsset = activeAssets
      .map(function(asset) {
        const currentValue = asset.price * asset.quantity;
        const investedValue = asset.avgPrice * asset.quantity;
        const totalReturnPercent = investedValue ? ((currentValue - investedValue) / investedValue) * 100 : 0;
        const dailyChangePercent = asset.previousPrice ? ((asset.price - asset.previousPrice) / asset.previousPrice) * 100 : 0;
        const historyReturns = asset.history.slice(1).map(function(value, index) {
          const previous = asset.history[index];
          return previous ? (value - previous) / previous : 0;
        });
        const assetVolatility = standardDeviation(historyReturns) * Math.sqrt(252) * 100;
        const assetSharpe = standardDeviation(historyReturns) > 0
          ? ((average(historyReturns) - riskFreeDaily) / standardDeviation(historyReturns)) * Math.sqrt(252)
          : 0;

        return {
          asset: asset,
          className: getSmartClassName(asset),
          currentValue: round(currentValue, 2),
          investedValue: round(investedValue, 2),
          positionShare: totalCurrent ? round((currentValue / totalCurrent) * 100, 2) : 0,
          totalReturnPercent: round(totalReturnPercent, 2),
          dailyChangePercent: round(dailyChangePercent, 2),
          volatilityPercent: round(assetVolatility, 2),
          assetSharpe: round(assetSharpe, 2),
        };
      })
      .sort(function(a, b) {
        return b.currentValue - a.currentValue;
      });

    const bestAsset = performanceByAsset
      .slice()
      .sort(function(a, b) {
        return b.totalReturnPercent - a.totalReturnPercent;
      })[0] || null;
    const worstAsset = performanceByAsset
      .slice()
      .sort(function(a, b) {
        return a.totalReturnPercent - b.totalReturnPercent;
      })[0] || null;

    const positiveShares = allocation
      .filter(function(item) { return item.share > 0; })
      .map(function(item) { return item.share / 100; });
    const hhi = positiveShares.reduce(function(sum, value) {
      return sum + Math.pow(value, 2);
    }, 0);
    const effectiveClasses = Math.max(1, positiveShares.length);
    const rawDiversification = effectiveClasses > 1 ? (1 - hhi) / (1 - 1 / effectiveClasses) : 0.35;
    const diversificationScore = clampNumber(Math.round(rawDiversification * 100), 22, 98);
    const riskScore = clampNumber(Math.round(100 - volatility * 2.1 - Math.abs(maxDrawdown) * 1.6 - riskExposurePercent * 0.42), 18, 96);
    const performanceScore = clampNumber(Math.round(58 + yearReturnPercent * 1.8 + relativeToCdi * 2.4 + sharpeRatio * 7.5), 16, 98);
    const overallScore = clampNumber(Math.round(diversificationScore * 0.34 + riskScore * 0.33 + performanceScore * 0.33), 18, 98);
    const scoreLabel = overallScore >= 80 ? "Excelente" : overallScore >= 66 ? "Bom" : overallScore >= 50 ? "Em atenção" : "Crítico";
    const riskLabel = volatility <= 12 ? "Baixo" : volatility <= 22 ? "Moderado" : "Alto";

    const rebalanceActions = allocation
      .filter(function(item) {
        return Math.abs(item.diff) >= 2.5;
      })
      .map(function(item) {
        const side = item.diff > 0 ? "compra" : "venda";
        const amount = totalCurrent * (Math.abs(item.diff) / 100);
        const classAssets = performanceByAsset.filter(function(row) {
          return row.className === item.name;
        });
        const candidates = classAssets
          .slice()
          .sort(function(a, b) {
            if (side === "compra") {
              return b.asset.aiScore - a.asset.aiScore;
            }
            return a.totalReturnPercent - b.totalReturnPercent;
          })
          .slice(0, 3);
        const tickers = candidates.length
          ? candidates.map(function(candidate) { return candidate.asset.ticker; }).join(", ")
          : item.name === "Cripto" && side === "compra"
            ? "BTC, ETH"
            : "Sem candidatos";

        return {
          side: side,
          className: item.name,
          diff: item.diff,
          amount: round(amount, 0),
          tickers: tickers,
          reason:
            side === "compra"
              ? "Classe abaixo da meta de " + formatPercent(item.target, 1) + ". Reforco melhora equilibrio de risco."
              : "Classe acima da meta de " + formatPercent(item.target, 1) + ". Reducao ajuda a controlar concentracao.",
        };
      });

    const diagnostics = [];
    if (mainAllocation.share >= 45) {
      diagnostics.push({
        tone: mainAllocation.share >= 55 ? "negative" : "warning",
        title: "Concentracao em " + mainAllocation.name,
        message: "A classe lidera com " + formatPercent(mainAllocation.share, 1) + " da carteira e aumenta risco especifico.",
      });
    }
    if (riskExposurePercent >= 25) {
      diagnostics.push({
        tone: "warning",
        title: "Exposição elevada a risco alto",
        message: formatPercent(riskExposurePercent, 1) + " do patrimônio esta em ativos de risco alto.",
      });
    }
    if (relativeToCdi < 0) {
      diagnostics.push({
        tone: "negative",
        title: "Abaixo do CDI no período",
        message: "A carteira entregou " + formatSignedPercent(rangeReturnPercent, 2) + " contra " + formatSignedPercent(cdiReturnPercent, 2) + " do CDI.",
      });
    }
    if (volatility > 22) {
      diagnostics.push({
        tone: "warning",
        title: "Volatilidade acima do ideal",
        message: "Volatilidade anualizada em " + formatPercent(volatility, 2) + " para um perfil moderado.",
      });
    }
    if (!diagnostics.length) {
      diagnostics.push({
        tone: "positive",
        title: "Carteira equilibrada no momento",
        message: "Sem desvios criticos de risco, concentracao ou benchmark no período selecionado.",
      });
    }

    const contexts = [
      {
        tone: relativeToCdi >= 0 ? "positive" : "negative",
        title: "Comparativo de benchmark",
        message:
          "Carteira: " +
          formatSignedPercent(rangeReturnPercent, 2) +
          " | CDI: " +
          formatSignedPercent(cdiReturnPercent, 2) +
          " | IBOV: " +
          formatSignedPercent(ibovReturnPercent, 2) +
          " | S&P500: " +
          formatSignedPercent(sp500ReturnPercent, 2) +
          ".",
      },
      {
        tone: sharpeRatio >= 1 ? "positive" : sharpeRatio >= 0.5 ? "warning" : "negative",
        title: "Leitura de eficiencia risco x retorno",
        message:
          "Sharpe em " +
          round(sharpeRatio, 2).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
          " com drawdown máximo de " +
          formatPercent(maxDrawdown, 2) +
          ".",
      },
      {
        tone: topSector.share >= 30 ? "warning" : "muted",
        title: "Concentracao setorial",
        message: "Maior setor: " + topSector.sector + " com " + formatPercent(topSector.share, 1) + " da carteira.",
      },
    ];

    const actionInsights = [];
    rebalanceActions.slice(0, 4).forEach(function(action) {
      actionInsights.push({
        tone: action.side === "compra" ? "positive" : "warning",
        title: (action.side === "compra" ? "Comprar " : "Reduzir ") + action.className,
        message:
          (action.side === "compra" ? "Alocar " : "Desalocar ") +
          formatCurrency(action.amount, 0) +
          " para aproximar a carteira da meta. Candidatos: " +
          action.tickers +
          ".",
      });
    });
    if (worstAsset && worstAsset.totalReturnPercent <= -15) {
      actionInsights.push({
        tone: "warning",
        title: "Ativo com impacto negativo relevante",
        message:
          worstAsset.asset.ticker +
          " acumula " +
          formatSignedPercent(worstAsset.totalReturnPercent, 2) +
          ". Avalie reduzir posicao ou redefinir tese.",
      });
    }
    if (!actionInsights.length) {
      actionInsights.push({
        tone: "positive",
        title: "Sem ajuste urgente de rebalanceamento",
        message: "A carteira esta próxima das metas definidas para o perfil atual.",
      });
    }

    const alerts = performanceByAsset
      .filter(function(item) {
        return item.dailyChangePercent <= -3 || item.totalReturnPercent <= -18 || (item.asset.risk === "Alto" && item.volatilityPercent > 28);
      })
      .slice(0, 5)
      .map(function(item) {
        let trigger = "Volatilidade elevada";
        if (item.dailyChangePercent <= -3) {
          trigger = "Queda forte no dia";
        } else if (item.totalReturnPercent <= -18) {
          trigger = "Perda acumulada relevante";
        }

        return {
          tone: "negative",
          title: item.asset.ticker + " - " + trigger,
          message:
            "Dia: " +
            formatSignedPercent(item.dailyChangePercent, 2) +
            " | Retorno total: " +
            formatSignedPercent(item.totalReturnPercent, 2) +
            " | Vol: " +
            formatPercent(item.volatilityPercent, 2) +
            ".",
        };
      });

    if (!alerts.length) {
      alerts.push({
        tone: "positive",
        title: "Sem alertas criticos ativos",
        message: "Não houve rompimentos negativos relevantes no conjunto principal da carteira.",
      });
    }

    const opportunities = performanceByAsset
      .filter(function(item) {
        return item.asset.aiScore >= 78 && (item.asset.recommendation === "compra" || item.dailyChangePercent < 0);
      })
      .slice(0, 5)
      .map(function(item) {
        const reason = item.dailyChangePercent < 0 ? "Preço recuou com score elevado" : "Score de IA acima da média";
        return {
          tone: "positive",
          title: item.asset.ticker + " - oportunidade",
          message:
            reason +
            ". AI " +
            item.asset.aiScore +
            " | Retorno total " +
            formatSignedPercent(item.totalReturnPercent, 2) +
            " | Classe " +
            item.className +
            ".",
        };
      });

    if (!opportunities.length) {
      performanceByAsset.slice(0, 3).forEach(function(item) {
        opportunities.push({
          tone: "muted",
          title: item.asset.ticker + " - monitorar",
          message: "Sem gatilho de compra imediato. Mantenha no radar para pullbacks e confirmacao de tendência.",
        });
      });
    }

    const monthWindow = Array.from({ length: 6 }, function(_, index) {
      const ref = addDays(DASHBOARD_REFERENCE_DATE, (index - 5) * 30);
      return MONTHS[ref.getMonth()];
    });
    const heatmapRows = performanceByAsset.slice(0, 6).map(function(item, rowIndex) {
      const rowRandom = createSeededRandom(item.asset.ticker + "-smart-heat");
      const values = monthWindow.map(function(_, colIndex) {
        const drift = item.totalReturnPercent * 0.11 + (item.asset.aiScore - 60) * 0.06;
        const wave = Math.sin((rowIndex + 1) * (colIndex + 2) * 0.7) * 1.9;
        const noise = (rowRandom() - 0.5) * 4.2;
        return round(clampNumber(drift + wave + noise, -9, 9), 1);
      });
      return {
        label: item.asset.ticker,
        values: values,
      };
    });

    const returnBars = performanceByAsset
      .slice()
      .sort(function(a, b) {
        return b.totalReturnPercent - a.totalReturnPercent;
      })
      .slice(0, 10);

    const scatterPoints = performanceByAsset.slice(0, 12).map(function(item) {
      return {
        ticker: item.asset.ticker,
        className: item.className,
        risk: item.asset.risk,
        aiScore: item.asset.aiScore,
        recommendation: item.asset.recommendation,
        volatility: item.volatilityPercent,
        returnPercent: item.totalReturnPercent,
        sharpe: item.assetSharpe,
        weight: item.positionShare,
        size: clampNumber(5 + Math.sqrt(Math.max(item.positionShare, 0.01)) * 2.2, 5, 15),
      };
    });

    const correlationAssets = performanceByAsset.slice(0, 6).map(function(item) {
      return item.asset;
    });
    const returnMap = {};
    correlationAssets.forEach(function(asset) {
      returnMap[asset.id] = asset.history.slice(1).map(function(value, index) {
        const previous = asset.history[index];
        return previous ? (value - previous) / previous : 0;
      });
    });
    const correlationMatrix = correlationAssets.map(function(assetA) {
      return correlationAssets.map(function(assetB) {
        if (assetA.id === assetB.id) {
          return 1;
        }
        return round(pearsonCorrelation(returnMap[assetA.id], returnMap[assetB.id]), 2);
      });
    });

    const projectionSteps = 12;
    const trendWindow = selectedSeries.slice(selectedSeries.length - Math.min(24, selectedSeries.length));
    const firstTrendValue = trendWindow[0] ? trendWindow[0].value : totalCurrent;
    const lastTrendPoint = selectedSeries[selectedSeries.length - 1] || { date: DASHBOARD_REFERENCE_DATE, value: totalCurrent, label: formatDateDayMonth(DASHBOARD_REFERENCE_DATE) };
    const slope = trendWindow.length > 1 ? (lastTrendPoint.value - firstTrendValue) / (trendWindow.length - 1) : 0;
    const stepDays = Math.max(1, Math.round(rangeDays / projectionSteps));
    const projection = Array.from({ length: projectionSteps }, function(_, index) {
      const step = index + 1;
      const date = addDays(lastTrendPoint.date, stepDays * step);
      const wave = Math.sin(step * 0.82) * Math.abs(slope) * 0.58;
      const value = Math.max(0, lastTrendPoint.value + slope * step + wave);
      return {
        date: date,
        label: formatDateDayMonth(date),
        value: round(value, 0),
      };
    });

    const assetRows = performanceByAsset.map(function(item) {
      return {
        ticker: item.asset.ticker,
        name: item.asset.name,
        className: item.className,
        risk: item.asset.risk,
        recommendation: item.asset.recommendation,
        aiScore: item.asset.aiScore,
        value: round(item.currentValue, 0),
        weight: item.positionShare,
        returnPercent: item.totalReturnPercent,
        volatility: item.volatilityPercent,
        sharpe: item.assetSharpe,
      };
    });

    return {
      rangeConfig: rangeConfig,
      activeCount: activeAssets.length,
      totalCurrent: round(totalCurrent, 0),
      totalInvested: round(totalInvested, 0),
      dayReturnValue: round(dayReturnValue, 0),
      dayReturnPercent: round(dayReturnPercent, 2),
      monthReturnPercent: round(monthReturnPercent, 2),
      yearReturnPercent: round(yearReturnPercent, 2),
      rangeReturnPercent: round(rangeReturnPercent, 2),
      cdiReturnPercent: round(cdiReturnPercent, 2),
      ibovReturnPercent: round(ibovReturnPercent, 2),
      sp500ReturnPercent: round(sp500ReturnPercent, 2),
      relativeToCdi: round(relativeToCdi, 2),
      volatility: round(volatility, 2),
      maxDrawdown: round(maxDrawdown, 2),
      sharpeRatio: round(sharpeRatio, 2),
      riskLabel: riskLabel,
      riskExposurePercent: round(riskExposurePercent, 2),
      overallScore: overallScore,
      scoreLabel: scoreLabel,
      diversificationScore: diversificationScore,
      riskScore: riskScore,
      performanceScore: performanceScore,
      allocation: allocation,
      mainAllocation: mainAllocation,
      concentrationAlert: concentrationAlert,
      topSector: topSector,
      bestAsset: bestAsset,
      worstAsset: worstAsset,
      selectedSeries: selectedSeries,
      selectedBenchmarkSeries: selectedBenchmarkSeries,
      drawdownSeries: drawdownSeries,
      projection: projection,
      heatmap: {
        months: monthWindow,
        rows: heatmapRows,
      },
      returnBars: returnBars,
      scatterPoints: scatterPoints,
      correlation: {
        labels: correlationAssets.map(function(asset) { return asset.ticker; }),
        matrix: correlationMatrix,
      },
      diagnostics: diagnostics,
      contexts: contexts,
      actionInsights: actionInsights,
      rebalanceActions: rebalanceActions,
      alerts: alerts,
      opportunities: opportunities,
      assetRows: assetRows,
    };
  }

  function buildSmartEvolutionChart(series, projection) {
    if (!series.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível calcular a evolução da carteira.</p></div>';
    }

    const width = 980;
    const height = 320;
    const padding = { top: 20, right: 20, bottom: 38, left: 68 };
    const combined = series.concat(projection);
    const values = combined.map(function(item) { return item.value; });
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    function toX(index) {
      return padding.left + (innerWidth * index) / Math.max(combined.length - 1, 1);
    }

    function toY(value) {
      return padding.top + ((maxValue - value) / range) * innerHeight;
    }

    const actualPoints = series.map(function(item, index) {
      return { x: toX(index), y: toY(item.value), label: item.label, value: item.value };
    });
    const forecastPoints = projection.map(function(item, index) {
      return { x: toX(series.length + index), y: toY(item.value), label: item.label, value: item.value };
    });
    const fullForecastLine = actualPoints.length && forecastPoints.length
      ? [actualPoints[actualPoints.length - 1]].concat(forecastPoints)
      : forecastPoints;

    const areaPath = actualPoints.length
      ? "M" +
        actualPoints[0].x +
        " " +
        (height - padding.bottom) +
        " " +
        actualPoints
          .map(function(point) {
            return "L" + point.x + " " + point.y;
          })
          .join(" ") +
        " L" +
        actualPoints[actualPoints.length - 1].x +
        " " +
        (height - padding.bottom) +
        " Z"
      : "";

    let grid = "";
    let yLabels = "";
    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      const value = maxValue - range * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 12) + '" y="' + (y + 4) + '" text-anchor="end" fill="#8ea4be" font-size="11">' + escapeHtml(formatCurrencyCompact(value)) + "</text>";
    }

    let xLabels = "";
    const step = Math.max(1, Math.floor(combined.length / 6));
    for (let index = 0; index < combined.length; index += step) {
      const item = combined[index];
      xLabels += '<text x="' + toX(index) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(item.label) + "</text>";
    }
    xLabels += '<text x="' + toX(combined.length - 1) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(combined[combined.length - 1].label) + "</text>";

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 320" role="img" aria-label="Evolução da carteira com projeção">' +
      grid +
      yLabels +
      xLabels +
      '<path d="' + areaPath + '" fill="rgba(42, 168, 255, 0.10)"></path>' +
      '<path d="' + pointsToLine(actualPoints) + '" fill="none" stroke="#28c76f" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>' +
      (fullForecastLine.length > 1 ? '<path d="' + pointsToLine(fullForecastLine) + '" fill="none" stroke="#9cc9ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 6"></path>' : "") +
      (actualPoints.length ? '<circle cx="' + actualPoints[actualPoints.length - 1].x + '" cy="' + actualPoints[actualPoints.length - 1].y + '" r="4.2" fill="#28c76f"></circle>' : "") +
      (forecastPoints.length ? '<circle cx="' + forecastPoints[forecastPoints.length - 1].x + '" cy="' + forecastPoints[forecastPoints.length - 1].y + '" r="4.2" fill="#9cc9ff"></circle>' : "") +
      "</svg></div>"
    );
  }

  function buildSmartBenchmarkChart(portfolioSeries, benchmarkSeries) {
    if (!portfolioSeries.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível comparar carteira com benchmarks.</p></div>';
    }

    const datasets = [{ label: "Carteira", color: "#28c76f", data: portfolioSeries }].concat(benchmarkSeries);
    const width = 980;
    const height = 300;
    const padding = { top: 24, right: 22, bottom: 38, left: 68 };
    const allValues = datasets.reduce(function(values, dataset) {
      return values.concat(
        dataset.data.map(function(item) {
          return item.value;
        })
      );
    }, []);
    const maxValue = Math.max.apply(null, allValues);
    const minValue = Math.min.apply(null, allValues);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const dataLength = portfolioSeries.length;

    function toX(index) {
      return padding.left + (innerWidth * index) / Math.max(dataLength - 1, 1);
    }

    function toY(value) {
      return padding.top + ((maxValue - value) / range) * innerHeight;
    }

    let grid = "";
    let yLabels = "";
    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      const value = maxValue - range * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 12) + '" y="' + (y + 4) + '" text-anchor="end" fill="#8ea4be" font-size="11">' + escapeHtml(formatCurrencyCompact(value)) + "</text>";
    }

    let xLabels = "";
    const step = Math.max(1, Math.floor(dataLength / 6));
    for (let index = 0; index < dataLength; index += step) {
      xLabels += '<text x="' + toX(index) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(portfolioSeries[index].label) + "</text>";
    }
    xLabels += '<text x="' + toX(dataLength - 1) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(portfolioSeries[dataLength - 1].label) + "</text>";

    const lines = datasets
      .map(function(dataset, index) {
        const points = dataset.data.map(function(item, pointIndex) {
          return { x: toX(pointIndex), y: toY(item.value) };
        });
        const widthStroke = dataset.label === "Carteira" ? 3.1 : 2.1;
        const dash = dataset.label === "Carteira" ? "" : ' stroke-dasharray="' + (index % 2 === 0 ? "8 6" : "4 4") + '"';
        return '<path d="' + pointsToLine(points) + '" fill="none" stroke="' + dataset.color + '" stroke-width="' + widthStroke + '" stroke-linecap="round" stroke-linejoin="round"' + dash + "></path>";
      })
      .join("");

    const legend = datasets
      .map(function(dataset) {
        return '<span class="smart-chart-legend-item"><i style="background:' + dataset.color + '"></i>' + escapeHtml(dataset.label) + "</span>";
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell">' +
      '<div class="smart-chart-legend">' + legend + "</div>" +
      '<svg viewBox="0 0 980 300" role="img" aria-label="Comparativo da carteira com CDI, IBOV e S&P500">' +
      grid +
      yLabels +
      xLabels +
      lines +
      "</svg></div>"
    );
  }

  function buildSmartAllocationPanel(allocation, concentrationAlert) {
    const donutData = allocation
      .filter(function(item) {
        return item.current > 0;
      })
      .map(function(item) {
        return {
          name: item.name,
          current: item.current,
        };
      });

    const allocationRows = allocation
      .map(function(item) {
        const toneClass = item.diff >= 0 ? "positive" : "negative";
        const diffLabel = (item.diff >= 0 ? "+" : "") + formatPercent(item.diff, 2);
        const riskToneClass = item.riskPercent >= 66 ? "negative" : item.riskPercent >= 46 ? "warning" : "positive";
        return (
          '<div class="smart-allocation-row">' +
          '<strong class="col-name">' + escapeHtml(item.name) + "</strong>" +
          '<span class="col-num mono">' + formatPercent(item.share, 2) + "</span>" +
          '<span class="col-num mono">' + formatPercent(item.target, 2) + "</span>" +
          '<span class="col-num mono ' + toneClass + '">' + diffLabel + "</span>" +
          '<span class="col-risk mono ' + riskToneClass + '">' + formatPercent(item.riskPercent, 1) + "</span>" +
          "</div>"
        );
      })
      .join("");

    return (
      '<div class="smart-allocation-shell">' +
      '<div class="smart-allocation-donut-wrap">' +
      (donutData.length ? buildDashboardDonutChart(donutData) : '<div class="empty-state"><strong>Sem alocação</strong><p>Sem dados para distribuir.</p></div>') +
      "</div>" +
      '<div class="smart-allocation-list">' +
      '<div class="smart-allocation-header"><span class="col-name">Classe</span><span class="col-num">Atual</span><span class="col-num">Meta</span><span class="col-num">Gap</span><span class="col-risk">Risco (%)</span></div>' +
      allocationRows +
      "</div>" +
      "</div>" +
      '<div class="smart-inline-alert ' + concentrationAlert.tone + '">' +
      "<strong>" + escapeHtml(concentrationAlert.title) + "</strong>" +
      "<p>" + escapeHtml(concentrationAlert.message) + "</p>" +
      "</div>"
    );
  }

  function buildSmartHeatmapChart(heatmap) {
    if (!heatmap.rows.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar o heatmap de performance.</p></div>';
    }

    const cellWidth = 88;
    const cellHeight = 34;
    const padding = { top: 48, right: 20, bottom: 16, left: 118 };
    const width = padding.left + heatmap.months.length * cellWidth + padding.right;
    const height = padding.top + heatmap.rows.length * cellHeight + padding.bottom;
    let monthLabels = "";
    let rowLabels = "";
    let cells = "";

    heatmap.months.forEach(function(month, monthIndex) {
      const x = padding.left + monthIndex * cellWidth + cellWidth / 2;
      monthLabels += '<text x="' + x + '" y="28" text-anchor="middle" fill="#8ea4be" font-size="12" font-weight="700">' + escapeHtml(month) + "</text>";
    });

    heatmap.rows.forEach(function(row, rowIndex) {
      const y = padding.top + rowIndex * cellHeight;
      rowLabels += '<text x="' + (padding.left - 10) + '" y="' + (y + cellHeight / 2 + 4) + '" text-anchor="end" fill="#9bb0c9" font-size="11" font-weight="700">' + escapeHtml(row.label) + "</text>";

      row.values.forEach(function(value, valueIndex) {
        const x = padding.left + valueIndex * cellWidth;
        const fill = getSmartHeatColor(value);
        const textColor = Math.abs(value) >= 4 ? "#f0f7ff" : "#d5e1f1";
        cells +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          (cellWidth - 3) +
          '" height="' +
          (cellHeight - 3) +
          '" rx="8" fill="' +
          fill +
          '"></rect>' +
          '<text x="' +
          (x + (cellWidth - 3) / 2) +
          '" y="' +
          (y + cellHeight / 2 + 4) +
          '" text-anchor="middle" fill="' +
          textColor +
          '" font-size="10.8" font-weight="700">' +
          escapeHtml(formatSignedPercent(value, 1)) +
          "</text>";
      });
    });

    return (
      '<div class="dashboard-chart-shell smart-heatmap-shell">' +
      '<svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Heatmap de performance por ativo e mes">' +
      monthLabels +
      rowLabels +
      cells +
      "</svg>" +
      '<div class="proventos-heat-legend"><span>Perda</span><span class="proventos-heat-scale" aria-hidden="true"></span><span>Ganho</span></div>' +
      "</div>"
    );
  }

  function buildSmartReturnBarsChart(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar a rentabilidade por ativo.</p></div>';
    }

    const width = 980;
    const height = 332;
    const padding = { top: 30, right: 20, bottom: 78, left: 66 };
    const values = items.map(function(item) { return item.totalReturnPercent; }).concat([0]);
    const maxPositive = Math.max.apply(null, values);
    const minNegative = Math.min.apply(null, values);
    const range = maxPositive - minNegative || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.min(72, barSpace * 0.6);
    const zeroY = padding.top + ((maxPositive - 0) / range) * innerHeight;

    function toY(value) {
      return padding.top + ((maxPositive - value) / range) * innerHeight;
    }

    let grid = "";
    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.11)" stroke-dasharray="4 6"></line>';
    }

    let bars = "";
    items.forEach(function(item, index) {
      const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
      const yValue = toY(item.totalReturnPercent);
      const positive = item.totalReturnPercent >= 0;
      const barY = positive ? yValue : zeroY;
      const barHeight = Math.max(4, Math.abs(zeroY - yValue));
      const fill = positive ? "#28c76f" : "#ff5b6e";
      const labelY = positive ? Math.max(16, barY - 10) : Math.min(height - 34, barY + barHeight + 18);

      bars +=
        '<g>' +
        '<rect x="' +
        x +
        '" y="' +
        barY +
        '" width="' +
        barWidth +
        '" height="' +
        barHeight +
        '" rx="10" fill="' +
        fill +
        '"></rect>' +
        '<text x="' +
        (x + barWidth / 2) +
        '" y="' +
        labelY +
        '" text-anchor="middle" fill="#e8f2ff" font-size="13.6" font-weight="800">' +
        escapeHtml(formatSignedPercent(item.totalReturnPercent, 1)) +
        "</text>" +
        '<text x="' +
        (x + barWidth / 2) +
        '" y="' +
        (height - 24) +
        '" text-anchor="middle" fill="#b8cce5" font-size="13.2" font-weight="800">' +
        escapeHtml(item.asset.ticker) +
        "</text>" +
        "</g>";
    });

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 332" role="img" aria-label="Rentabilidade por ativo">' +
      grid +
      '<line x1="' + padding.left + '" y1="' + zeroY + '" x2="' + (width - padding.right) + '" y2="' + zeroY + '" stroke="#7d90aa" stroke-dasharray="4 6"></line>' +
      bars +
      "</svg></div>"
    );
  }

  function buildSmartDrawdownChart(series) {
    if (!series.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar a curva de drawdown.</p></div>';
    }

    const width = 980;
    const height = 260;
    const padding = { top: 22, right: 18, bottom: 36, left: 66 };
    const values = series.map(function(item) { return item.drawdown; }).concat([0]);
    const maxValue = 0;
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    function toX(index) {
      return padding.left + (innerWidth * index) / Math.max(series.length - 1, 1);
    }

    function toY(value) {
      return padding.top + ((maxValue - value) / range) * innerHeight;
    }

    const points = series.map(function(item, index) {
      return { x: toX(index), y: toY(item.drawdown), label: item.label };
    });
    const zeroY = toY(0);
    const areaPath =
      "M" +
      points[0].x +
      " " +
      zeroY +
      " " +
      points
        .map(function(point) {
          return "L" + point.x + " " + point.y;
        })
        .join(" ") +
      " L" +
      points[points.length - 1].x +
      " " +
      zeroY +
      " Z";

    let xLabels = "";
    const step = Math.max(1, Math.floor(series.length / 6));
    for (let index = 0; index < series.length; index += step) {
      xLabels += '<text x="' + toX(index) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(series[index].label) + "</text>";
    }
    xLabels += '<text x="' + toX(series.length - 1) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(series[series.length - 1].label) + "</text>";

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 260" role="img" aria-label="Curva de drawdown da carteira">' +
      '<line x1="' + padding.left + '" y1="' + zeroY + '" x2="' + (width - padding.right) + '" y2="' + zeroY + '" stroke="#7d90aa" stroke-dasharray="4 6"></line>' +
      '<path d="' + areaPath + '" fill="rgba(255, 91, 110, 0.16)"></path>' +
      '<path d="' + pointsToLine(points) + '" fill="none" stroke="#ff5b6e" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"></path>' +
      xLabels +
      "</svg></div>"
    );
  }

  function buildSmartRiskReturnScatterChart(points) {
    if (!points.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar o gráfico risco x retorno.</p></div>';
    }

    const width = 980;
    const height = 560;
    const padding = { top: 36, right: 26, bottom: 86, left: 92 };
    const xValues = points.map(function(item) { return item.volatility; });
    const yValues = points.map(function(item) { return item.returnPercent; }).concat([0]);
    const rawMinX = Math.min.apply(null, xValues);
    const rawMaxX = Math.max.apply(null, xValues);
    const rawMinY = Math.min.apply(null, yValues);
    const rawMaxY = Math.max.apply(null, yValues);
    const xPadding = Math.max(1.8, (rawMaxX - rawMinX || 1) * 0.28);
    const yPadding = Math.max(2.2, (rawMaxY - rawMinY || 1) * 0.24);
    let minX = Math.max(0, rawMinX - xPadding);
    let maxX = rawMaxX + xPadding;
    let minY = Math.min(-2, rawMinY - yPadding);
    let maxY = Math.max(2, rawMaxY + yPadding);

    if (maxX - minX < 10) {
      maxX = minX + 10;
    }

    if (maxY - minY < 16) {
      const middle = (maxY + minY) / 2;
      minY = middle - 8;
      maxY = middle + 8;
    }

    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    function toX(value) {
      const ratio = clampNumber((value - minX) / (maxX - minX || 1), 0, 1);
      const spread = Math.pow(ratio, 0.72);
      return padding.left + spread * innerWidth;
    }

    function toY(value) {
      return padding.top + ((maxY - value) / (maxY - minY || 1)) * innerHeight;
    }

    let grid = "";
    let xTicks = "";
    let yTicks = "";
    const tickSteps = 4;
    for (let index = 0; index <= tickSteps; index += 1) {
      const ratio = index / tickSteps;
      const x = padding.left + innerWidth * ratio;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + x + '" y1="' + padding.top + '" x2="' + x + '" y2="' + (height - padding.bottom) + '" stroke="rgba(116, 146, 179, 0.08)" stroke-dasharray="3 5"></line>';
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.08)" stroke-dasharray="3 5"></line>';

      const xValue = minX + (maxX - minX) * ratio;
      const yValue = maxY - (maxY - minY) * ratio;
      xTicks += '<text x="' + x + '" y="' + (height - 48) + '" text-anchor="middle" fill="#d7e7fa" font-size="15.2" font-weight="800" stroke="#071221" stroke-width="2.4" paint-order="stroke fill">' + escapeHtml(formatPercent(xValue, 1)) + "</text>";
      yTicks += '<text x="' + (padding.left - 12) + '" y="' + (y + 5) + '" text-anchor="end" fill="#d7e7fa" font-size="15.2" font-weight="800" stroke="#071221" stroke-width="2.4" paint-order="stroke fill">' + escapeHtml(formatSignedPercent(yValue, 1)) + "</text>";
    }

    const zeroY = toY(0);
    const plottedPoints = points.map(function(item, index) {
      const color = item.risk === "Alto" ? "#ff5b6e" : item.risk === "Moderado" ? "#ffbf4d" : "#28c76f";
      const jitter = createSeededRandom(item.ticker + "-scatter-jitter");
      const jitterX = (jitter() - 0.5) * 18;
      const jitterY = (jitter() - 0.5) * 14;
      const x = clampNumber(toX(item.volatility) + jitterX, padding.left + 8, width - padding.right - 8);
      const y = clampNumber(toY(item.returnPercent) + jitterY, padding.top + 8, height - padding.bottom - 8);
      return {
        key: item.ticker + "-" + index,
        ticker: item.ticker,
        className: item.className,
        risk: item.risk,
        aiScore: item.aiScore,
        recommendation: item.recommendation,
        volatility: item.volatility,
        returnPercent: item.returnPercent,
        sharpe: item.sharpe,
        weight: item.weight,
        size: item.size,
        color: color,
        x: x,
        y: y,
      };
    });

    const mustLabelKeys = new Set();
    if (plottedPoints.length) {
      const byWeight = plottedPoints.slice().sort(function(a, b) { return b.weight - a.weight; });
      const byAbsReturn = plottedPoints.slice().sort(function(a, b) { return Math.abs(b.returnPercent) - Math.abs(a.returnPercent); });
      const byVolatility = plottedPoints.slice().sort(function(a, b) { return b.volatility - a.volatility; });
      const byNegativeReturn = plottedPoints.slice().sort(function(a, b) { return a.returnPercent - b.returnPercent; });
      if (byWeight[0]) {
        mustLabelKeys.add(byWeight[0].key);
      }
      if (byAbsReturn[0]) {
        mustLabelKeys.add(byAbsReturn[0].key);
      }
      if (byVolatility[0]) {
        mustLabelKeys.add(byVolatility[0].key);
      }
      if (byNegativeReturn[0]) {
        mustLabelKeys.add(byNegativeReturn[0].key);
      }
    }

    const rankedPoints = plottedPoints.slice().sort(function(a, b) {
      const priorityA = (mustLabelKeys.has(a.key) ? 1000 : 0) + a.weight * 3 + Math.abs(a.returnPercent) * 1.2 + a.aiScore * 0.08;
      const priorityB = (mustLabelKeys.has(b.key) ? 1000 : 0) + b.weight * 3 + Math.abs(b.returnPercent) * 1.2 + b.aiScore * 0.08;
      return priorityB - priorityA;
    });

    function rectsOverlap(rectA, rectB) {
      return !(rectA.x2 < rectB.x1 || rectA.x1 > rectB.x2 || rectA.y2 < rectB.y1 || rectA.y1 > rectB.y2);
    }

    function estimateLabelBox(x, y, anchor, text, fontSize) {
      const textWidth = Math.max(40, text.length * fontSize * 0.62);
      const textHeight = fontSize + 4;
      let x1 = x - textWidth / 2;
      if (anchor === "start") {
        x1 = x - 1;
      } else if (anchor === "end") {
        x1 = x - textWidth + 1;
      }
      const y1 = y - textHeight + 2;
      return {
        x1: x1 - 3,
        y1: y1 - 2,
        x2: x1 + textWidth + 3,
        y2: y + 4,
      };
    }

    function isInsidePlot(rect) {
      return (
        rect.x1 >= padding.left + 4 &&
        rect.x2 <= width - padding.right - 4 &&
        rect.y1 >= padding.top + 4 &&
        rect.y2 <= height - padding.bottom - 6
      );
    }

    const labelFontSize = 15.2;
    const labelLayouts = {};
    const placedLabelBoxes = [];
    const maxVisibleLabels = Math.min(5, plottedPoints.length);
    let labelsPlaced = 0;

    rankedPoints.forEach(function(point) {
      if (labelsPlaced >= maxVisibleLabels) {
        return;
      }

      const placements = [
        { x: point.x, y: point.y - point.size - 12, anchor: "middle" },
        { x: point.x + point.size + 10, y: point.y - 5, anchor: "start" },
        { x: point.x + point.size + 10, y: point.y + point.size + 13, anchor: "start" },
        { x: point.x, y: point.y + point.size + 16, anchor: "middle" },
        { x: point.x - point.size - 10, y: point.y - 5, anchor: "end" },
        { x: point.x - point.size - 10, y: point.y + point.size + 13, anchor: "end" },
      ];

      let chosenLayout = null;
      placements.some(function(placement) {
        const box = estimateLabelBox(placement.x, placement.y, placement.anchor, point.ticker, labelFontSize);
        if (!isInsidePlot(box)) {
          return false;
        }
        const overlaps = placedLabelBoxes.some(function(placedBox) {
          return rectsOverlap(box, placedBox);
        });
        if (!overlaps) {
          chosenLayout = {
            x: placement.x,
            y: placement.y,
            anchor: placement.anchor,
            box: box,
          };
          return true;
        }
        return false;
      });

      if (!chosenLayout && mustLabelKeys.has(point.key)) {
        const fallbackX = clampNumber(point.x, padding.left + 24, width - padding.right - 24);
        const fallbackY = clampNumber(point.y - point.size - 10, padding.top + 18, height - padding.bottom - 10);
        const fallbackBox = estimateLabelBox(fallbackX, fallbackY, "middle", point.ticker, labelFontSize);
        chosenLayout = {
          x: fallbackX,
          y: fallbackY,
          anchor: "middle",
          box: fallbackBox,
        };
      }

      if (chosenLayout) {
        labelLayouts[point.key] = {
          x: chosenLayout.x,
          y: chosenLayout.y,
          anchor: chosenLayout.anchor,
        };
        placedLabelBoxes.push(chosenLayout.box);
        labelsPlaced += 1;
      }
    });

    const pointsSvg = plottedPoints
      .map(function(item) {
        const x = item.x;
        const y = item.y;
        const tooltipWidth = 430;
        const tooltipHeight = 220;
        const tooltipX = clampNumber(x + 12, padding.left + 4, width - padding.right - tooltipWidth - 4);
        const tooltipY = clampNumber(y - tooltipHeight - 12, padding.top + 4, height - padding.bottom - tooltipHeight - 4);
        const labelLayout = labelLayouts[item.key];
        const showLabel = !!labelLayout;

        return (
          '<g class="smart-scatter-point">' +
          '<circle class="smart-scatter-hit" cx="' + x + '" cy="' + y + '" r="' + Math.max(14, item.size + 6) + '"></circle>' +
          '<circle class="smart-scatter-core" cx="' + x + '" cy="' + y + '" r="' + item.size + '" fill="' + item.color + '" fill-opacity="0.84" stroke="' + item.color + '" stroke-width="1.25"></circle>' +
          (showLabel ? '<text class="smart-scatter-label" x="' + labelLayout.x + '" y="' + labelLayout.y + '" text-anchor="' + labelLayout.anchor + '" fill="#e9f4ff" font-size="15.2" font-weight="800" stroke="#071221" stroke-width="2.6" paint-order="stroke fill">' + escapeHtml(item.ticker) + "</text>" : "") +
          '<g class="smart-scatter-tooltip" transform="translate(' + tooltipX + " " + tooltipY + ')">' +
          '<rect class="smart-scatter-tooltip-box" width="' + tooltipWidth + '" height="' + tooltipHeight + '" rx="18"></rect>' +
          '<text class="smart-scatter-tooltip-title" x="22" y="42">' + escapeHtml(item.ticker) + " • " + escapeHtml(item.className) + "</text>" +
          '<text class="smart-scatter-tooltip-label" x="22" y="84">Retorno</text>' +
          '<text class="smart-scatter-tooltip-value" x="' + (tooltipWidth - 22) + '" y="84" text-anchor="end">' + escapeHtml(formatSignedPercent(item.returnPercent, 2)) + "</text>" +
          '<text class="smart-scatter-tooltip-label" x="22" y="116">Volatilidade</text>' +
          '<text class="smart-scatter-tooltip-value" x="' + (tooltipWidth - 22) + '" y="116" text-anchor="end">' + escapeHtml(formatPercent(item.volatility, 2)) + "</text>" +
          '<text class="smart-scatter-tooltip-label" x="22" y="148">Peso na carteira</text>' +
          '<text class="smart-scatter-tooltip-value" x="' + (tooltipWidth - 22) + '" y="148" text-anchor="end">' + escapeHtml(formatPercent(item.weight, 2)) + "</text>" +
          '<text class="smart-scatter-tooltip-label" x="22" y="180">Sharpe / AI</text>' +
          '<text class="smart-scatter-tooltip-value" x="' + (tooltipWidth - 22) + '" y="180" text-anchor="end">' + escapeHtml(round(item.sharpe, 2).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " • " + escapeHtml(String(item.aiScore)) + "</text>" +
          "</g>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 560" role="img" aria-label="Scatter de risco e retorno dos ativos">' +
      grid +
      yTicks +
      xTicks +
      '<line x1="' + padding.left + '" y1="' + zeroY + '" x2="' + (width - padding.right) + '" y2="' + zeroY + '" stroke="#7d90aa" stroke-dasharray="4 6"></line>' +
      pointsSvg +
      '<text x="' + (width / 2) + '" y="' + (height - 14) + '" text-anchor="middle" fill="#d7e7fa" font-size="17" font-weight="800" stroke="#071221" stroke-width="2.6" paint-order="stroke fill">Volatilidade anualizada (%)</text>' +
      '<text x="18" y="' + (height / 2) + '" transform="rotate(-90 18 ' + (height / 2) + ')" text-anchor="middle" fill="#d7e7fa" font-size="17" font-weight="800" stroke="#071221" stroke-width="2.6" paint-order="stroke fill">Retorno (%)</text>' +
      "</svg></div>"
    );
  }

  function buildSmartRiskReturnMiniTable(points) {
    if (!points.length) {
      return "";
    }

    const rows = points
      .slice()
      .sort(function(a, b) {
        return b.weight - a.weight;
      })
      .slice(0, 8);

    return (
      '<div class="smart-risk-mini-wrap">' +
      '<div class="smart-risk-mini-scroll">' +
      '<table class="smart-risk-mini-table">' +
      "<thead><tr><th>Ativo</th><th>Risco</th><th class='align-right'>Retorno</th><th class='align-right'>Volatilidade</th></tr></thead>" +
      "<tbody>" +
      rows
        .map(function(row) {
          const riskDot = row.risk === "Alto" ? "#ff5b6e" : row.risk === "Moderado" ? "#ffbf4d" : "#28c76f";
          return (
            "<tr>" +
            "<td><strong>" + escapeHtml(row.ticker) + "</strong></td>" +
            '<td><span class="smart-risk-mini-tag"><i class="smart-risk-mini-dot" style="background:' + riskDot + ';"></i>' + escapeHtml(row.risk) + "</span></td>" +
            '<td class="align-right mono ' + getSmartToneClass(row.returnPercent) + '">' + formatSignedPercent(row.returnPercent, 2) + "</td>" +
            '<td class="align-right mono">' + formatPercent(row.volatility, 2) + "</td>" +
            "</tr>"
          );
        })
        .join("") +
      "</tbody>" +
      "</table>" +
      "</div>" +
      "</div>"
    );
  }

  function buildSmartCorrelationChart(correlation) {
    if (!correlation.labels.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar a matriz de correlação.</p></div>';
    }

    const cellSize = 62;
    const padding = { top: 58, right: 20, bottom: 20, left: 84 };
    const width = padding.left + correlation.labels.length * cellSize + padding.right;
    const height = padding.top + correlation.labels.length * cellSize + padding.bottom;
    let labels = "";
    let cells = "";

    correlation.labels.forEach(function(label, index) {
      const x = padding.left + index * cellSize + cellSize / 2;
      const y = padding.top + index * cellSize + cellSize / 2 + 4;
      labels += '<text x="' + x + '" y="34" text-anchor="middle" fill="#8ea4be" font-size="11" font-weight="700">' + escapeHtml(label) + "</text>";
      labels += '<text x="' + (padding.left - 8) + '" y="' + y + '" text-anchor="end" fill="#8ea4be" font-size="11" font-weight="700">' + escapeHtml(label) + "</text>";
    });

    correlation.matrix.forEach(function(row, rowIndex) {
      row.forEach(function(value, colIndex) {
        const x = padding.left + colIndex * cellSize;
        const y = padding.top + rowIndex * cellSize;
        const intensity = clampNumber(Math.abs(value), 0, 1);
        const fill = value >= 0
          ? "rgba(42, 168, 255, " + round(0.12 + intensity * 0.72, 3) + ")"
          : "rgba(255, 91, 110, " + round(0.12 + intensity * 0.72, 3) + ")";
        cells +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          (cellSize - 4) +
          '" height="' +
          (cellSize - 4) +
          '" rx="10" fill="' +
          fill +
          '"></rect>' +
          '<text x="' +
          (x + (cellSize - 4) / 2) +
          '" y="' +
          (y + cellSize / 2 + 4) +
          '" text-anchor="middle" fill="#e8f1fb" font-size="10.8" font-weight="800">' +
          value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) +
          "</text>";
      });
    });

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 ' + width + " " + height + '" role="img" aria-label="Matriz de correlação entre ativos">' +
      labels +
      cells +
      "</svg></div>"
    );
  }

  function buildSmartProjectionChart(series, projection) {
    if (!series.length) {
      return '<div class="empty-state"><strong>Sem dados</strong><p>Não foi possível montar a projeção futura.</p></div>';
    }

    const history = series.slice(series.length - Math.min(90, series.length));
    const combined = history.concat(projection);
    const width = 980;
    const height = 290;
    const padding = { top: 22, right: 20, bottom: 36, left: 66 };
    const values = combined.map(function(item) { return item.value; });
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;

    function toX(index) {
      return padding.left + (innerWidth * index) / Math.max(combined.length - 1, 1);
    }

    function toY(value) {
      return padding.top + ((maxValue - value) / range) * innerHeight;
    }

    const historyPoints = history.map(function(item, index) {
      return { x: toX(index), y: toY(item.value), label: item.label };
    });
    const projectionPoints = projection.map(function(item, index) {
      return { x: toX(history.length + index), y: toY(item.value), label: item.label };
    });
    const projectedLine = historyPoints.length && projectionPoints.length
      ? [historyPoints[historyPoints.length - 1]].concat(projectionPoints)
      : projectionPoints;

    const areaPath = historyPoints.length
      ? pointsToArea(historyPoints, height - padding.bottom)
      : "";

    let xLabels = "";
    const step = Math.max(1, Math.floor(combined.length / 6));
    for (let index = 0; index < combined.length; index += step) {
      xLabels += '<text x="' + toX(index) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(combined[index].label) + "</text>";
    }
    xLabels += '<text x="' + toX(combined.length - 1) + '" y="' + (height - 10) + '" text-anchor="middle" fill="#7d90aa" font-size="10">' + escapeHtml(combined[combined.length - 1].label) + "</text>";

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 980 290" role="img" aria-label="Projeção futura da carteira">' +
      '<path d="' + areaPath + '" fill="rgba(42, 168, 255, 0.10)"></path>' +
      '<path d="' + pointsToLine(historyPoints) + '" fill="none" stroke="#28c76f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"></path>' +
      (projectedLine.length > 1 ? '<path d="' + pointsToLine(projectedLine) + '" fill="none" stroke="#9cc9ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="8 6"></path>' : "") +
      xLabels +
      "</svg></div>"
    );
  }

  function buildSmartIntelList(items, iconName) {
    return (
      '<div class="smart-intel-list">' +
      items
        .map(function(item) {
          return (
            '<article class="smart-intel-item ' +
            item.tone +
            '">' +
            icon(iconName, "status-icon") +
            '<div class="smart-intel-copy">' +
            "<strong>" +
            escapeHtml(item.title) +
            "</strong>" +
            "<p>" +
            escapeHtml(item.message) +
            "</p>" +
            "</div>" +
            "</article>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderSmartPortfolioView() {
    const smart = getSmartPortfolioData();
    const scoreTone = smart.overallScore >= 80 ? "positive" : "warning";
    const bestTicker = smart.bestAsset ? smart.bestAsset.asset.ticker : "-";
    const worstTicker = smart.worstAsset ? smart.worstAsset.asset.ticker : "-";
    const zoomControls = SMART_RANGE_OPTIONS.map(function(option) {
      const active = state.smartRange === option.id ? " active" : "";
      return '<button type="button" class="smart-zoom-button' + active + '" data-smart-range="' + option.id + '">' + option.label + "</button>";
    }).join("");

    return (
      '<section class="view dashboard-view smart-view">' +
      '<header class="section-header" style="margin-bottom: 0;">' +
      '<div class="section-heading">' +
      '<div class="section-icon">' +
      icon("spark", "section-icon-svg") +
      "</div>" +
      '<div class="section-copy">' +
      "<h2>Smart Portfólio</h2>" +
      "<p>Diagnostico automatico, contexto de benchmark e ações praticas para melhorar retorno ajustado a risco.</p>" +
      "</div>" +
      "</div>" +
      '<div class="section-meta">' +
      '<span class="secondary-badge"><strong>' + smart.rangeConfig.label + "</strong> janela ativa</span>" +
      '<span class="secondary-badge"><strong>' + formatNumber(smart.activeCount) + "</strong> ativos monitorados</span>" +
      '<span class="secondary-badge"><strong>' + formatSignedPercent(smart.relativeToCdi, 2) + "</strong> vs CDI</span>" +
      "</div>" +
      "</header>" +

      '<div class="smart-metrics-grid">' +
      dashboardMetricCard("Patrimônio Total", formatCurrency(smart.totalCurrent, 0), "Variação diária " + formatSignedPercent(smart.dayReturnPercent, 2), "money", smart.dayReturnPercent >= 0 ? "positive" : "warning") +
      dashboardMetricCard("Rentabilidade (D/M/A)", formatSignedPercent(smart.yearReturnPercent, 2), "Dia " + formatSignedPercent(smart.dayReturnPercent, 2) + " • Mes " + formatSignedPercent(smart.monthReturnPercent, 2), "trendUp", smart.yearReturnPercent >= 0 ? "positive" : "warning") +
      dashboardMetricCard("Risco da Carteira", smart.riskLabel, "Vol " + formatPercent(smart.volatility, 2) + " • Sharpe " + round(smart.sharpeRatio, 2).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }), "shield", getSmartRiskTone(smart.riskLabel)) +
      dashboardMetricCard("Score da Carteira", formatNumber(smart.overallScore) + " pts", smart.scoreLabel + " • Diversificação " + formatNumber(smart.diversificationScore), "dashboard", scoreTone) +
      dashboardMetricCard("Alocação Principal", smart.mainAllocation.name, formatPercent(smart.mainAllocation.share, 2) + " da carteira", "bars", smart.mainAllocation.share > smart.mainAllocation.target + 6 ? "warning" : "positive") +
      dashboardMetricCard("Melhor Ativo", bestTicker, smart.bestAsset ? formatSignedPercent(smart.bestAsset.totalReturnPercent, 2) : "Sem leitura", "trendUp", smart.bestAsset && smart.bestAsset.totalReturnPercent >= 0 ? "positive" : "warning") +
      dashboardMetricCard("Pior Ativo", worstTicker, smart.worstAsset ? formatSignedPercent(smart.worstAsset.totalReturnPercent, 2) : "Sem leitura", "trendDown", smart.worstAsset && smart.worstAsset.totalReturnPercent < 0 ? "warning" : "positive") +
      dashboardMetricCard("Exposição ao Risco", formatPercent(smart.riskExposurePercent, 2), "Classe de risco alto da carteira", "activity", smart.riskExposurePercent > 25 ? "warning" : "positive") +
      "</div>" +

      '<div class="smart-layout">' +
      '<div class="smart-main-stack">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Evolução da carteira</p><p class="panel-subtitle">Linha temporal com area preenchida e projeção futura em tracejado.</p></div><div class="smart-zoom-controls">' + zoomControls + "</div></div>" +
      buildSmartEvolutionChart(smart.selectedSeries, smart.projection) +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Carteira vs Benchmark</p><p class="panel-subtitle">Comparativo com CDI, IBOV e S&P500 para avaliar contexto de performance.</p></div></div>' +
      buildSmartBenchmarkChart(smart.selectedSeries, smart.selectedBenchmarkSeries) +
      "</article>" +

      '<div class="smart-main-grid">' +
      '<article class="dashboard-panel smart-span-2">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Análise de Alocação</p><p class="panel-subtitle">Distribuição por classe com alerta automatico de concentracao.</p></div></div>' +
      buildSmartAllocationPanel(smart.allocation, smart.concentrationAlert) +
      "</article>" +
      "</div>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Rebalanceamento Automático</p><p class="panel-subtitle">Sugestoes de compra e venda com base na meta de alocação e no nivel de risco.</p></div></div>' +
      (smart.rebalanceActions.length
        ? '<div class="table-scroll"><table class="assets-table smart-assets-table"><thead><tr><th>Ação</th><th>Classe</th><th class="align-right">Gap</th><th class="align-right">Valor</th><th>Candidatos</th><th>Motivo</th></tr></thead><tbody>' +
          smart.rebalanceActions
            .map(function(action) {
              return (
                "<tr>" +
                "<td><span class='" + (action.side === "compra" ? "positive" : "warning") + "'>" + (action.side === "compra" ? "Comprar" : "Vender") + "</span></td>" +
                "<td>" + escapeHtml(action.className) + "</td>" +
                '<td class="align-right mono ' + (action.diff >= 0 ? "positive" : "negative") + '">' + (action.diff >= 0 ? "+" : "") + formatPercent(action.diff, 2) + "</td>" +
                '<td class="align-right mono">' + formatCurrency(action.amount, 0) + "</td>" +
                "<td>" + escapeHtml(action.tickers) + "</td>" +
                "<td>" + escapeHtml(action.reason) + "</td>" +
                "</tr>"
              );
            })
            .join("") +
          "</tbody></table></div>"
        : '<div class="empty-state"><strong>Carteira alinhada</strong><p>Não ha ajustes materiais de rebalanceamento para a meta atual.</p></div>') +
      "</article>" +
      "</div>" +

      '<aside class="smart-side-stack">' +
      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Diagnostico Automático</p><p class="panel-subtitle">Leitura imediata dos principais desvios de carteira.</p></div></div>' +
      buildSmartIntelList(smart.diagnostics, "alert") +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Contexto</p><p class="panel-subtitle">Comparativos para responder se a carteira esta indo bem ou mal.</p></div></div>' +
      buildSmartIntelList(smart.contexts, "activity") +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Ações Recomendadas</p><p class="panel-subtitle">Sugestoes praticas para ajustar retorno e risco.</p></div></div>' +
      buildSmartIntelList(smart.actionInsights, "bulb") +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Alertas Inteligentes</p><p class="panel-subtitle">Quedas fortes e pontos de atenção ativos.</p></div></div>' +
      buildSmartIntelList(smart.alerts, "alert") +
      "</article>" +

      '<article class="dashboard-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Oportunidades</p><p class="panel-subtitle">Ativos com potencial de compra dentro da estratégia.</p></div></div>' +
      buildSmartIntelList(smart.opportunities, "spark") +
      "</article>" +
      "</aside>" +
      "</div>" +

      '<div class="smart-bottom-grid">' +
      '<article class="dashboard-panel smart-bottom-framed smart-bottom-heatmap">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Heatmap de Performance</p><p class="panel-subtitle">Verde para lucro e vermelho para prejuizo por ativo e mes.</p></div></div>' +
      buildSmartHeatmapChart(smart.heatmap) +
      "</article>" +

      '<article class="dashboard-panel smart-bottom-framed">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Rentabilidade por Ativo</p><p class="panel-subtitle">Comparativo de retorno total dos principais ativos da carteira.</p></div></div>' +
      buildSmartReturnBarsChart(smart.returnBars) +
      "</article>" +

      '<article class="dashboard-panel smart-scatter-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Risco vs Retorno</p><p class="panel-subtitle">Scatter plot para avaliar ativos eficientes e ineficientes.</p></div></div>' +
      buildSmartRiskReturnScatterChart(smart.scatterPoints) +
      buildSmartRiskReturnMiniTable(smart.scatterPoints) +
      "</article>" +

      '<article class="dashboard-panel smart-correlation-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Correlação entre Ativos</p><p class="panel-subtitle">Matriz para identificar redundancia e diversificação real.</p></div></div>' +
      buildSmartCorrelationChart(smart.correlation) +
      "</article>" +

      "</div>" +

      '<article class="dashboard-panel smart-assets-panel">' +
      '<div class="dashboard-panel-head"><div><p class="panel-title">Tabela de Ativos Inteligente</p><p class="panel-subtitle">Resumo por ativo com peso, retorno, risco e recomendação de ação.</p></div></div>' +
      '<div class="table-scroll smart-assets-scroll-limited"><table class="assets-table smart-assets-table"><thead><tr><th>Ativo</th><th>Classe</th><th class="align-right">Peso</th><th class="align-right">Valor</th><th class="align-right">Retorno</th><th class="align-right">Vol</th><th class="align-right">Sharpe</th><th class="align-center">AI</th><th class="align-center">Recomendação</th></tr></thead><tbody>' +
      smart.assetRows
        .map(function(row) {
          return (
            "<tr>" +
            "<td><div class='asset-line'><div><div class='asset-primary'>" + escapeHtml(row.ticker) + "</div><div class='asset-meta'>" + escapeHtml(row.name) + "</div></div></div></td>" +
            "<td>" + escapeHtml(row.className) + "</td>" +
            '<td class="align-right mono">' + formatPercent(row.weight, 2) + "</td>" +
            '<td class="align-right mono">' + formatCurrency(row.value, 0) + "</td>" +
            '<td class="align-right mono ' + getSmartToneClass(row.returnPercent) + '">' + formatSignedPercent(row.returnPercent, 2) + "</td>" +
            '<td class="align-right mono">' + formatPercent(row.volatility, 2) + "</td>" +
            '<td class="align-right mono">' + round(row.sharpe, 2).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "</td>" +
            '<td class="align-center"><span class="score-badge ' + getScoreClass(row.aiScore) + '">' + row.aiScore + "</span></td>" +
            '<td class="align-center"><span class="' + (row.recommendation === "compra" ? "positive" : row.recommendation === "venda" ? "negative" : "muted") + '">' + escapeHtml(row.recommendation.toUpperCase()) + "</span></td>" +
            "</tr>"
          );
        })
        .join("") +
      "</tbody></table></div>" +
      "</article>" +
      "</section>"
    );
  }

  function getDividendAnalytics() {
    const monthlySeries = DIVIDEND_MONTHLY_HISTORY
      .map(function mapItem(item) {
        return {
          year: item.year,
          month: item.month,
          label: item.label,
          shortLabel: MONTHS[item.month - 1],
          value: round(item.value, 2),
          aporte: round(item.aporte, 2),
          date: new Date(item.year, item.month - 1, 1),
        };
      })
      .sort(function sortByDate(a, b) {
        return a.date.getTime() - b.date.getTime();
      });

    let runningDividends = 0;
    monthlySeries.forEach(function addCumulative(item) {
      runningDividends += item.value;
      item.cumulative = round(runningDividends, 2);
    });

    const incomeAssets = state.assets
      .filter(function filterPayers(asset) {
        return asset.quantity > 0 && (asset.dividendYield || 0) > 0;
      })
      .map(function mapAsset(asset) {
        const currentValue = asset.price * asset.quantity;
        const annualIncome = (currentValue * (asset.dividendYield || 0)) / 100;

        return {
          ticker: asset.ticker,
          name: asset.name,
          sector: asset.sector,
          dividendYield: asset.dividendYield || 0,
          currentValue: currentValue,
          annualIncome: annualIncome,
        };
      })
      .sort(function sortIncome(a, b) {
        return b.annualIncome - a.annualIncome;
      });

    const annualProjection = incomeAssets.reduce(function sumAnnual(total, item) {
      return total + item.annualIncome;
    }, 0);
    const totalPortfolioValue = state.assets.reduce(function sumCurrent(total, asset) {
      return total + asset.price * asset.quantity;
    }, 0);

    const monthDividends = monthlySeries.length ? monthlySeries[monthlySeries.length - 1].value : 0;
    const currentYear = DASHBOARD_REFERENCE_DATE.getFullYear();
    const yearDividends = monthlySeries.reduce(function sumYear(total, item) {
      return total + (item.year === currentYear ? item.value : 0);
    }, 0);
    const avgMonthly = monthlySeries.reduce(function sumMonths(total, item) {
      return total + item.value;
    }, 0) / (monthlySeries.length || 1);
    const portfolioDividendYield = totalPortfolioValue > 0 ? (annualProjection / totalPortfolioValue) * 100 : 0;

    const assetDistribution = incomeAssets.slice(0, 6).map(function mapTop(item) {
      return Object.assign({}, item, {
        share: annualProjection > 0 ? (item.annualIncome / annualProjection) * 100 : 0,
      });
    });

    const sectorBucket = {};
    incomeAssets.forEach(function accumulateSector(item) {
      const current = sectorBucket[item.sector] || 0;
      sectorBucket[item.sector] = current + item.annualIncome;
    });
    const sectorDistribution = Object.keys(sectorBucket)
      .map(function mapSector(sector) {
        return {
          sector: sector,
          value: sectorBucket[sector],
        };
      })
      .sort(function sortSector(a, b) {
        return b.value - a.value;
      })
      .slice(0, 8);

    const yieldByAsset = incomeAssets
      .slice()
      .sort(function sortByYield(a, b) {
        return b.dividendYield - a.dividendYield;
      })
      .slice(0, 8);

    return {
      monthlySeries: monthlySeries,
      monthDividends: round(monthDividends, 2),
      yearDividends: round(yearDividends, 2),
      avgMonthly: round(avgMonthly, 2),
      annualProjection: round(annualProjection, 2),
      portfolioDividendYield: round(portfolioDividendYield, 2),
      latestLabel: monthlySeries.length ? monthlySeries[monthlySeries.length - 1].label : "-",
      payerCount: incomeAssets.length,
      assetDistribution: assetDistribution,
      sectorDistribution: sectorDistribution,
      yieldByAsset: yieldByAsset,
      heatmap: getDividendHeatmapData(monthlySeries),
      forecast: getDividendForecastData(monthlySeries),
      yocSeries: getDividendYocSeries(monthlySeries),
    };
  }

  function getDividendHeatmapData(monthlySeries) {
    const daysPerMonth = 31;
    const weights = [0.34, 0.28, 0.22, 0.16];
    let maxValue = 0;

    const rows = monthlySeries.map(function mapMonth(item, index) {
      const values = Array.from({ length: daysPerMonth }, function() {
        return 0;
      });
      const paymentDays = [
        4 + (index % 5),
        11 + ((index + 1) % 4),
        18 + ((index + 2) % 5),
        26 + ((index + 3) % 4),
      ];

      paymentDays.forEach(function assignPayment(day, paymentIndex) {
        const clampedDay = Math.max(1, Math.min(daysPerMonth, day));
        const value = item.value * weights[paymentIndex];
        values[clampedDay - 1] = values[clampedDay - 1] + value;
        maxValue = Math.max(maxValue, values[clampedDay - 1]);
      });

      return {
        label: item.shortLabel,
        fullLabel: item.label,
        values: values,
      };
    });

    return {
      rows: rows,
      maxValue: maxValue,
    };
  }

  function getDividendForecastData(monthlySeries) {
    if (!monthlySeries.length) {
      return { history: [], projected: [] };
    }

    const history = monthlySeries.map(function mapMonth(item) {
      return {
        label: item.label,
        value: item.value,
      };
    });

    let growthSum = 0;
    let growthCount = 0;
    const startIndex = Math.max(1, history.length - 4);

    for (let index = startIndex; index < history.length; index += 1) {
      const previousValue = history[index - 1].value;
      const currentValue = history[index].value;
      if (previousValue > 0) {
        growthSum += (currentValue - previousValue) / previousValue;
        growthCount += 1;
      }
    }

    let baseGrowth = growthCount ? growthSum / growthCount : 0.035;
    baseGrowth = Math.max(0.012, Math.min(baseGrowth, 0.075));

    const projected = [];
    const last = monthlySeries[monthlySeries.length - 1];
    let currentDate = new Date(last.year, last.month - 1, 1);
    let currentValue = last.value;

    for (let step = 1; step <= 6; step += 1) {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      const decay = 1 - (step - 1) * 0.09;
      const growth = Math.max(0.008, baseGrowth * decay);
      currentValue = currentValue * (1 + growth);
      projected.push({
        label: MONTHS[currentDate.getMonth()] + "/" + String(currentDate.getFullYear()).slice(-2),
        value: round(currentValue, 2),
      });
    }

    return {
      history: history,
      projected: projected,
    };
  }

  function getDividendYocSeries(monthlySeries) {
    let investedCost = 92000;
    let cumulativeDividends = 0;

    return monthlySeries.map(function mapMonth(item, index) {
      investedCost += item.aporte;
      cumulativeDividends += item.value;
      const averageMonthly = cumulativeDividends / (index + 1);
      const yoc = investedCost > 0 ? (averageMonthly * 12) / investedCost * 100 : 0;

      return {
        label: item.label,
        value: round(yoc, 2),
      };
    });
  }

  function getHeatmapColor(value, maxValue) {
    if (value <= 0 || maxValue <= 0) {
      return "rgba(116, 146, 179, 0.12)";
    }

    const ratio = value / maxValue;

    if (ratio >= 0.85) {
      return "#4ade80";
    }
    if (ratio >= 0.65) {
      return "#1fc987";
    }
    if (ratio >= 0.45) {
      return "#0ea57f";
    }
    if (ratio >= 0.25) {
      return "#0f6e83";
    }

    return "#144762";
  }

  function buildDividendMonthlyBars(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem pagamentos no período</strong><p>Não ha dividendos para exibir nesse intervalo.</p></div>';
    }

    const width = 900;
    const height = 285;
    const padding = { top: 24, right: 20, bottom: 50, left: 56 };
    const maxValue = Math.max.apply(null, items.map(function(item) { return item.value; })) || 1;
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.min(44, barSpace * 0.56);
    let grid = "";
    let yLabels = "";

    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + innerHeight * ratio;
      const value = maxValue - maxValue * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.12)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 10) + '" y="' + (y + 4) + '" text-anchor="end" fill="#8ba0ba" font-size="11">' + escapeHtml(formatCurrencyCompact(value)) + "</text>";
    }

    const bars = items
      .map(function mapItem(item, index) {
        const x = padding.left + barSpace * index + (barSpace - barWidth) / 2;
        const barHeight = (item.value / maxValue) * innerHeight;
        const y = height - padding.bottom - barHeight;

        return (
          '<g>' +
          '<rect x="' + x + '" y="' + y + '" width="' + barWidth + '" height="' + Math.max(barHeight, 4) + '" rx="10" fill="#2aa8ff"></rect>' +
          '<text x="' + (x + barWidth / 2) + '" y="' + (y - 8) + '" text-anchor="middle" fill="#d9e7fb" font-size="10.8" font-weight="700">' + escapeHtml(formatCurrency(item.value, 0)) + "</text>" +
          '<text x="' + (x + barWidth / 2) + '" y="' + (height - 14) + '" text-anchor="middle" fill="#7d90aa" font-size="10.5">' + escapeHtml(item.label) + "</text>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 900 285" role="img" aria-label="Dividendos mensais da carteira">' +
      grid +
      yLabels +
      bars +
      "</svg></div>"
    );
  }

  function buildDividendPassiveLine(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem histórico</strong><p>Não foi possível montar a evolução da renda passiva.</p></div>';
    }

    const width = 900;
    const height = 320;
    const padding = { top: 56, right: 56, bottom: 62, left: 64 };
    const values = items.map(function(item) { return item.value; });
    const maxValue = Math.max.apply(null, values);
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.max(26, Math.min(56, barSpace * 0.62));
    let grid = "";
    let bars = "";

    for (let index = 0; index <= 3; index += 1) {
      const ratio = index / 3;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.11)" stroke-dasharray="4 6"></line>';
    }

    bars = items
      .map(function mapItem(item, index) {
        const xCenter = padding.left + barSpace * index + barSpace / 2;
        const barHeight = (item.value / (maxValue || 1)) * innerHeight;
        const y = height - padding.bottom - barHeight;
        const valueY = y - 12;
        return (
          '<g>' +
          '<rect x="' + (xCenter - barWidth / 2) + '" y="' + y + '" width="' + barWidth + '" height="' + Math.max(5, barHeight) + '" rx="10" fill="url(#passive-bar-gradient)"></rect>' +
          '<text x="' + xCenter + '" y="' + valueY + '" text-anchor="middle" fill="#e9f2fc" font-size="17.2" font-weight="800">' + escapeHtml(formatCurrency(item.value, 0)) + "</text>" +
          '<text x="' + xCenter + '" y="' + (height - 14) + '" text-anchor="middle" fill="#9cb3ce" font-size="16.4" font-weight="800">' + escapeHtml(item.shortLabel) + "</text>" +
          '<title>' + escapeHtml(item.label) + ": " + escapeHtml(formatCurrency(item.value, 2)) + "</title>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 900 320" role="img" aria-label="Evolução da renda passiva">' +
      '<defs><linearGradient id="passive-bar-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#35d97e"></stop><stop offset="100%" stop-color="#1ea85d"></stop></linearGradient></defs>' +
      grid +
      bars +
      "</svg></div>"
    );
  }

  function buildDividendDistributionDonut(items, annualTotal) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem ativos pagadores</strong><p>Adicione ativos com DY positivo para montar a distribuição.</p></div>';
    }

    const colors = ["#173f71", "#2f7edb", "#0f766e", "#d97706", "#7b7fff", "#22c55e"];
    const width = 260;
    const height = 260;
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const total = items.reduce(function(sum, item) {
      return sum + item.annualIncome;
    }, 0) || 1;
    let offset = 0;

    const slices = items
      .map(function mapItem(item, index) {
        const dash = (item.annualIncome / total) * circumference;
        const slice =
          '<circle cx="130" cy="130" r="' + radius + '" fill="none" stroke="' + colors[index % colors.length] + '" stroke-width="22" stroke-linecap="round" stroke-dasharray="' + dash + " " + (circumference - dash) + '" stroke-dashoffset="' + (-offset) + '" transform="rotate(-90 130 130)"></circle>';
        offset += dash;
        return slice;
      })
      .join("");

    const legend = items
      .map(function mapItem(item, index) {
        return (
          '<div class="proventos-distribution-item">' +
          '<span class="proventos-distribution-dot" style="background:' + colors[index % colors.length] + '"></span>' +
          '<div class="proventos-distribution-copy"><strong>' + escapeHtml(item.ticker) + '</strong><span>' + escapeHtml(truncateLabel(item.name, 16)) + "</span></div>" +
          '<span class="proventos-distribution-share">' + escapeHtml(formatPercent(item.share, 1)) + "</span>" +
          "</div>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell">' +
      '<div class="proventos-distribution-shell">' +
      '<div class="proventos-distribution-top">' +
      '<svg class="proventos-donut" viewBox="0 0 260 260" role="img" aria-label="Distribuição de dividendos por ativo">' +
      '<circle cx="130" cy="130" r="' + radius + '" fill="none" stroke="rgba(116, 146, 179, 0.14)" stroke-width="22"></circle>' +
      slices +
      '<circle cx="130" cy="130" r="50" fill="#0c1625"></circle>' +
      '<text x="130" y="117" text-anchor="middle" fill="#7d90aa" font-size="11">Anual estimado</text>' +
      '<text x="130" y="138" text-anchor="middle" fill="#e8f1fb" font-size="17" font-weight="800">' + escapeHtml(formatCurrencyCompact(annualTotal)) + "</text>" +
      '<text x="130" y="157" text-anchor="middle" fill="#7d90aa" font-size="10">' + formatNumber(items.length) + " ativos</text>" +
      "</svg>" +
      "</div>" +
      '<div class="proventos-distribution-list">' + legend + "</div>" +
      "</div>"
    );
  }

  function buildDividendSectorBars(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem dados setoriais</strong><p>Não foi possível consolidar os setores pagadores.</p></div>';
    }

    const maxValue = Math.max.apply(null, items.map(function(item) { return item.value; })) || 1;
    const totalValue = items.reduce(function sumTotal(sum, item) {
      return sum + item.value;
    }, 0) || 1;

    return (
      '<div class="dashboard-chart-shell">' +
      '<div class="proventos-sector-list">' +
      items
        .map(function mapItem(item) {
          const fillPercent = Math.max(6, (item.value / maxValue) * 100);
          const share = totalValue > 0 ? (item.value / totalValue) * 100 : 0;

          return (
            '<div class="proventos-sector-row">' +
            '<div class="proventos-sector-label">' + escapeHtml(item.sector) + "</div>" +
            '<div class="proventos-sector-track"><span class="proventos-sector-fill" style="width:' + fillPercent + '%"></span></div>' +
            '<div class="proventos-sector-value">' + escapeHtml(formatCurrencyCompact(item.value)) + " • " + escapeHtml(formatPercent(share, 1)) + "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      "</div>"
    );
  }

  function buildDividendYieldBars(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem DY para comparar</strong><p>Não ha ativos suficientes com rendimento para essa leitura.</p></div>';
    }

    const maxYield = Math.max.apply(null, items.map(function(item) { return item.dividendYield; })) || 1;

    return (
      '<div class="dashboard-chart-shell">' +
      '<div class="proventos-yield-list">' +
      items
        .map(function mapItem(item) {
          const width = Math.max(8, (item.dividendYield / maxYield) * 100);
          return (
            '<div class="proventos-yield-row">' +
            '<div class="proventos-yield-label"><strong>' + escapeHtml(item.ticker) + '</strong><span>' + escapeHtml(formatCurrency(item.annualIncome, 0)) + " ao ano</span></div>" +
            '<div class="proventos-yield-track"><span class="proventos-yield-fill" style="width:' + width + '%"></span></div>' +
            '<div class="proventos-yield-value">' + escapeHtml(formatPercent(item.dividendYield, 2)) + "</div>" +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      "</div>"
    );
  }

  function buildDividendHeatmap(heatmap) {
    if (!heatmap.rows.length) {
      return '<div class="empty-state"><strong>Sem mapa de calor</strong><p>Não ha dados suficientes para distribuir os pagamentos por dia.</p></div>';
    }

    const width = 1220;
    const height = 392;
    const padding = { top: 38, right: 26, bottom: 30, left: 92 };
    const columns = 31;
    const rows = heatmap.rows.length;
    const cellWidth = (width - padding.left - padding.right) / columns;
    const cellHeight = (height - padding.top - padding.bottom) / rows;
    let dayLabels = "";
    let monthLabels = "";
    let cells = "";

    for (let day = 1; day <= columns; day += 1) {
      if (day % 5 === 0 || day === 1 || day === columns) {
        const x = padding.left + (day - 0.5) * cellWidth;
        dayLabels += '<text x="' + x + '" y="24" text-anchor="middle" fill="#8ba0ba" font-size="11">D' + day + "</text>";
      }
    }

    heatmap.rows.forEach(function mapRow(row, rowIndex) {
      const yCenter = padding.top + rowIndex * cellHeight + cellHeight / 2 + 3;
      monthLabels += '<text x="' + (padding.left - 12) + '" y="' + yCenter + '" text-anchor="end" fill="#8ba0ba" font-size="12" font-weight="700">' + escapeHtml(row.label) + "</text>";

      row.values.forEach(function mapCell(value, columnIndex) {
        const x = padding.left + columnIndex * cellWidth + 1;
        const y = padding.top + rowIndex * cellHeight + 1;
        const day = String(columnIndex + 1).padStart(2, "0");
        cells +=
          '<rect x="' +
          x +
          '" y="' +
          y +
          '" width="' +
          Math.max(2, cellWidth - 2) +
          '" height="' +
          Math.max(2, cellHeight - 2) +
          '" rx="2.4" fill="' +
          getHeatmapColor(value, heatmap.maxValue) +
          '">' +
          "<title>" +
          escapeHtml(row.fullLabel) +
          " - dia " +
          day +
          ": " +
          escapeHtml(formatCurrency(value, 2)) +
          "</title></rect>";
      });
    });

    return (
      '<div class="dashboard-chart-shell">' +
      '<div class="proventos-heat-shell">' +
      '<svg class="proventos-heatmap-svg" viewBox="0 0 1220 392" role="img" aria-label="Heatmap de dividendos por dia e mes">' +
      dayLabels +
      monthLabels +
      cells +
      "</svg>" +
      '<div class="proventos-heat-legend"><span>Baixa</span><span class="proventos-heat-scale" aria-hidden="true"></span><span>Alta</span></div>' +
      "</div>" +
      "</div>"
    );
  }

  function buildDividendForecastChart(forecast) {
    if (!forecast.history.length) {
      return '<div class="empty-state"><strong>Sem dados para forecast</strong><p>Não foi possível projetar a renda futura com a serie atual.</p></div>';
    }

    const width = 640;
    const height = 330;
    const padding = { top: 28, right: 22, bottom: 62, left: 70 };
    const combined = forecast.history.concat(forecast.projected);
    const values = combined.map(function(item) { return item.value; });
    const points = mapPoints(values, width, height, padding);
    const historyPoints = points.slice(0, forecast.history.length);
    const projectionPoints = points.slice(Math.max(0, forecast.history.length - 1));
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    let grid = "";
    let xLabels = "";

    for (let index = 0; index <= 3; index += 1) {
      const ratio = index / 3;
      const y = padding.top + (height - padding.top - padding.bottom) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.11)" stroke-dasharray="4 6"></line>';
    }

    points.forEach(function addLabel(point, index) {
      if (index % 3 === 0 || index === forecast.history.length - 1 || index === points.length - 1) {
        xLabels += '<text x="' + point.x + '" y="' + (height - 16) + '" text-anchor="middle" fill="#8ea4bf" font-size="14.5" font-weight="800">' + escapeHtml(combined[index].label) + "</text>";
      }
    });

    const pivot = historyPoints[historyPoints.length - 1];
    const historyArea = pointsToArea(historyPoints, height - padding.bottom);
    const historyLine = pointsToLine(historyPoints);
    const projectionLine = projectionPoints.length > 1 ? pointsToLine(projectionPoints) : "";
    const lastPoint = points[points.length - 1];
    const lastValue = combined[combined.length - 1].value;
    const legendStartX = padding.left + 18;
    const legendGap = 112;

    const hoverCards = points
      .map(function mapPoint(point, index) {
        const item = combined[index];
        const previous = index > 0 ? combined[index - 1].value : item.value;
        const delta = previous ? ((item.value - previous) / previous) * 100 : 0;
        const typeLabel = index >= forecast.history.length ? "Projeção" : "Histórico";
        const pointColor = index >= forecast.history.length ? "#2aa8ff" : "#28c76f";
        const tooltipWidth = 252;
        const tooltipHeight = 96;
        const tooltipX = Math.max(padding.left + 2, Math.min(point.x - tooltipWidth / 2, width - padding.right - tooltipWidth - 2));
        const tooltipY = Math.max(8, point.y - tooltipHeight - 12);
        const deltaColor = delta >= 0 ? "#28c76f" : "#ff5b6e";

        return (
          '<g class="proventos-hover-group">' +
          '<circle class="proventos-hover-hit" cx="' + point.x + '" cy="' + point.y + '" r="12"></circle>' +
          '<circle class="proventos-hover-core" cx="' + point.x + '" cy="' + point.y + '" r="3.8" fill="' + pointColor + '"></circle>' +
          '<g class="proventos-hover-tooltip" transform="translate(' + tooltipX + ' ' + tooltipY + ')">' +
          '<rect class="proventos-hover-box" width="' + tooltipWidth + '" height="' + tooltipHeight + '" rx="10"></rect>' +
          '<text class="proventos-hover-label" x="10" y="22">' + escapeHtml(item.label) + " • " + typeLabel + "</text>" +
          '<text class="proventos-hover-value" x="10" y="49">' + escapeHtml(formatCurrency(item.value, 2)) + "</text>" +
          '<text x="10" y="77" fill="' + deltaColor + '" font-size="14.2" font-weight="800">Variação ' + escapeHtml(formatSignedPercent(delta, 2)) + "</text>" +
          "</g>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 640 330" role="img" aria-label="Projeção de renda passiva">' +
      grid +
      xLabels +
      '<path d="' + historyArea + '" fill="rgba(40, 199, 111, 0.12)"></path>' +
      '<path d="' + historyLine + '" fill="none" stroke="#28c76f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"></path>' +
      (projectionLine ? '<path d="' + projectionLine + '" fill="none" stroke="#2aa8ff" stroke-width="3.4" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round"></path>' : "") +
      (pivot ? '<line x1="' + pivot.x + '" y1="' + padding.top + '" x2="' + pivot.x + '" y2="' + (height - padding.bottom) + '" stroke="rgba(42, 168, 255, 0.34)" stroke-dasharray="3 5"></line>' : "") +
      hoverCards +
      '<text x="' + legendStartX + '" y="' + (padding.top - 8) + '" fill="#28c76f" font-size="13.2" font-weight="800">Histórico</text>' +
      '<text x="' + (legendStartX + legendGap) + '" y="' + (padding.top - 8) + '" fill="#2aa8ff" font-size="13.2" font-weight="800">Projeção</text>' +
      '<text x="' + (width - padding.right) + '" y="' + (Math.max(18, lastPoint.y - 12)) + '" text-anchor="end" fill="#d9e7fb" font-size="13.1" font-weight="800">' + escapeHtml(formatCurrency(lastValue, 0)) + "</text>" +
      "</svg></div>"
    );
  }

  function buildDividendYocChart(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem YOC para exibir</strong><p>O histórico precisa de mais meses para esta leitura.</p></div>';
    }

    const width = 640;
    const height = 330;
    const padding = { top: 28, right: 22, bottom: 62, left: 74 };
    const values = items.map(function(item) { return item.value; });
    const points = mapPoints(values, width, height, padding);
    const line = pointsToLine(points);
    const area = pointsToArea(points, height - padding.bottom);
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    let grid = "";
    let xLabels = "";

    for (let index = 0; index <= 3; index += 1) {
      const ratio = index / 3;
      const y = padding.top + (height - padding.top - padding.bottom) * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.11)" stroke-dasharray="4 6"></line>';
    }

    points.forEach(function addXLabel(point, index) {
      if (index % 3 === 0 || index === points.length - 1) {
        xLabels += '<text x="' + point.x + '" y="' + (height - 16) + '" text-anchor="middle" fill="#8ea4bf" font-size="14.5" font-weight="800">' + escapeHtml(items[index].shortLabel || items[index].label) + "</text>";
      }
    });

    const lastPoint = points[points.length - 1];
    const lastValue = items[items.length - 1].value;
    const hoverCards = points
      .map(function mapPoint(point, index) {
        const item = items[index];
        const previous = index > 0 ? items[index - 1].value : item.value;
        const delta = item.value - previous;
        const deltaLabel = (delta >= 0 ? "+" : "-") + Math.abs(delta).toFixed(2).replace(".", ",") + " p.p";
        const tooltipWidth = 238;
        const tooltipHeight = 96;
        const tooltipX = Math.max(padding.left + 2, Math.min(point.x - tooltipWidth / 2, width - padding.right - tooltipWidth - 2));
        const tooltipY = Math.max(8, point.y - tooltipHeight - 12);
        const deltaColor = delta >= 0 ? "#28c76f" : "#ff5b6e";

        return (
          '<g class="proventos-hover-group">' +
          '<circle class="proventos-hover-hit" cx="' + point.x + '" cy="' + point.y + '" r="12"></circle>' +
          '<circle class="proventos-hover-core" cx="' + point.x + '" cy="' + point.y + '" r="3.6" fill="#ffbf4d"></circle>' +
          '<g class="proventos-hover-tooltip" transform="translate(' + tooltipX + ' ' + tooltipY + ')">' +
          '<rect class="proventos-hover-box" width="' + tooltipWidth + '" height="' + tooltipHeight + '" rx="10"></rect>' +
          '<text class="proventos-hover-label" x="10" y="22">' + escapeHtml(item.shortLabel || item.label) + "</text>" +
          '<text class="proventos-hover-value" x="10" y="49">YOC ' + escapeHtml(formatPercent(item.value, 2)) + "</text>" +
          '<text x="10" y="77" fill="' + deltaColor + '" font-size="14.2" font-weight="800">Delta ' + escapeHtml(deltaLabel) + "</text>" +
          "</g>" +
          "</g>"
        );
      })
      .join("");

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 640 330" role="img" aria-label="Yield on cost da carteira">' +
      grid +
      xLabels +
      '<path d="' + area + '" fill="rgba(255, 191, 77, 0.14)"></path>' +
      '<path d="' + line + '" fill="none" stroke="#ffbf4d" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"></path>' +
      hoverCards +
      '<text x="' + (width - padding.right) + '" y="' + (Math.max(18, lastPoint.y - 12)) + '" text-anchor="end" fill="#d9e7fb" font-size="13.1" font-weight="800">' + escapeHtml(formatPercent(lastValue, 2)) + "</text>" +
      "</svg></div>"
    );
  }

  function buildDividendVsAportesChart(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem comparativo</strong><p>Não ha dados de aportes e dividendos para comparar.</p></div>';
    }

    const width = 640;
    const height = 330;
    const padding = { top: 30, right: 76, bottom: 62, left: 72 };
    const innerWidth = width - padding.left - padding.right;
    const innerHeight = height - padding.top - padding.bottom;
    const maxAporte = Math.max.apply(null, items.map(function(item) { return item.aporte; })) || 1;
    const maxDividend = Math.max.apply(null, items.map(function(item) { return item.value; })) || 1;
    const barSpace = innerWidth / items.length;
    const barWidth = Math.min(24, barSpace * 0.5);
    let grid = "";
    let bars = "";
    let xLabels = "";
    let hoverCards = "";

    function toAporteY(value) {
      return padding.top + (1 - value / maxAporte) * innerHeight;
    }

    function toDividendY(value) {
      return padding.top + (1 - value / maxDividend) * innerHeight;
    }

    for (let index = 0; index <= 3; index += 1) {
      const ratio = index / 3;
      const y = padding.top + innerHeight * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.1)" stroke-dasharray="4 6"></line>';
    }

    const linePoints = items
      .map(function mapItem(item, index) {
        const xCenter = padding.left + barSpace * index + barSpace / 2;
        const barY = toAporteY(item.aporte);
        const barHeight = Math.max(3, height - padding.bottom - barY);
        const lineY = toDividendY(item.value);
        bars += '<rect x="' + (xCenter - barWidth / 2) + '" y="' + barY + '" width="' + barWidth + '" height="' + barHeight + '" rx="8" fill="rgba(42, 168, 255, 0.78)"></rect>';

        if (index % 3 === 0 || index === items.length - 1) {
          xLabels += '<text x="' + xCenter + '" y="' + (height - 16) + '" text-anchor="middle" fill="#8ea4bf" font-size="14.5" font-weight="800">' + escapeHtml(item.shortLabel) + "</text>";
        }

        const tooltipWidth = 264;
        const tooltipHeight = 114;
        const tooltipX = Math.max(padding.left + 2, Math.min(xCenter - tooltipWidth / 2, width - padding.right - tooltipWidth - 2));
        const tooltipY = Math.max(8, Math.min(Math.min(barY, lineY) - tooltipHeight - 10, height - padding.bottom - tooltipHeight - 4));
        const coverage = item.aporte > 0 ? (item.value / item.aporte) * 100 : 0;

        hoverCards +=
          '<g class="proventos-hover-group">' +
          '<rect class="proventos-hover-hit" x="' + (xCenter - barSpace / 2) + '" y="' + padding.top + '" width="' + barSpace + '" height="' + innerHeight + '"></rect>' +
          '<g class="proventos-hover-tooltip" transform="translate(' + tooltipX + ' ' + tooltipY + ')">' +
          '<rect class="proventos-hover-box" width="' + tooltipWidth + '" height="' + tooltipHeight + '" rx="10"></rect>' +
          '<text class="proventos-hover-label" x="10" y="22">' + escapeHtml(item.label) + "</text>" +
          '<text class="proventos-hover-value" x="10" y="49">Aportes: ' + escapeHtml(formatCurrency(item.aporte, 0)) + "</text>" +
          '<text class="proventos-hover-value" x="10" y="76">Dividendos: ' + escapeHtml(formatCurrency(item.value, 0)) + "</text>" +
          '<text class="proventos-hover-label" x="10" y="102">Cobertura: ' + escapeHtml(formatPercent(coverage, 1)) + "</text>" +
          "</g>" +
          "</g>";

        return {
          x: xCenter,
          y: lineY,
          value: item.value,
          label: item.label,
        };
      });

    const line = pointsToLine(linePoints);
    const area = pointsToArea(linePoints, height - padding.bottom);

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 640 330" role="img" aria-label="Comparativo entre dividendos e aportes">' +
      grid +
      bars +
      '<path d="' + area + '" fill="rgba(40, 199, 111, 0.12)"></path>' +
      '<path d="' + line + '" fill="none" stroke="#28c76f" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"></path>' +
      linePoints.map(function(point) {
        return '<circle class="proventos-hover-core" cx="' + point.x + '" cy="' + point.y + '" r="3.2" fill="#28c76f"></circle>';
      }).join("") +
      hoverCards +
      xLabels +
      '<text x="' + (padding.left + 2) + '" y="' + (padding.top - 8) + '" fill="#2aa8ff" font-size="13.2" font-weight="800">Aportes</text>' +
      '<text x="' + (padding.left + 92) + '" y="' + (padding.top - 8) + '" fill="#28c76f" font-size="13.2" font-weight="800">Dividendos</text>' +
      "</svg></div>"
    );
  }

  function buildDividendAccumulatedChart(items) {
    if (!items.length) {
      return '<div class="empty-state"><strong>Sem acumulado</strong><p>Não ha histórico para consolidar o acumulado de dividendos.</p></div>';
    }

    const width = 900;
    const height = 285;
    const padding = { top: 24, right: 20, bottom: 46, left: 56 };
    const values = items.map(function(item) { return item.cumulative; });
    const points = mapPoints(values, width, height, padding);
    const line = pointsToLine(points);
    const area = pointsToArea(points, height - padding.bottom);
    const maxValue = Math.max.apply(null, values);
    const minValue = Math.min.apply(null, values);
    const range = maxValue - minValue || 1;
    let grid = "";
    let yLabels = "";
    let xLabels = "";

    for (let index = 0; index <= 4; index += 1) {
      const ratio = index / 4;
      const y = padding.top + (height - padding.top - padding.bottom) * ratio;
      const value = maxValue - range * ratio;
      grid += '<line x1="' + padding.left + '" y1="' + y + '" x2="' + (width - padding.right) + '" y2="' + y + '" stroke="rgba(116, 146, 179, 0.11)" stroke-dasharray="4 6"></line>';
      yLabels += '<text x="' + (padding.left - 10) + '" y="' + (y + 4) + '" text-anchor="end" fill="#8ba0ba" font-size="11">' + escapeHtml(formatCurrencyCompact(value)) + "</text>";
    }

    points.forEach(function mapPoint(point, index) {
      if (index % 2 === 0 || index === points.length - 1) {
        xLabels += '<text x="' + point.x + '" y="' + (height - 12) + '" text-anchor="middle" fill="#7d90aa" font-size="9.8">' + escapeHtml(items[index].shortLabel) + "</text>";
      }
    });

    const lastPoint = points[points.length - 1];
    const lastValue = values[values.length - 1];

    return (
      '<div class="dashboard-chart-shell"><svg viewBox="0 0 900 285" role="img" aria-label="Acumulado de dividendos da carteira">' +
      grid +
      yLabels +
      xLabels +
      '<path d="' + area + '" fill="rgba(42, 168, 255, 0.12)"></path>' +
      '<path d="' + line + '" fill="none" stroke="#2aa8ff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"></path>' +
      '<circle cx="' + lastPoint.x + '" cy="' + lastPoint.y + '" r="4.2" fill="#2aa8ff"></circle>' +
      '<text x="' + (Math.max(padding.left + 10, lastPoint.x - 8)) + '" y="' + (Math.max(20, lastPoint.y - 12)) + '" text-anchor="end" fill="#d9e7fb" font-size="11" font-weight="700">' + escapeHtml(formatCurrency(lastValue, 0)) + "</text>" +
      "</svg></div>"
    );
  }

  function renderMain() {
    const activeNavItem = NAV_ITEMS.find(function findItem(item) {
      return item.id === state.activeTab;
    }) || NAV_ITEMS[0];

    if (!activeNavItem || !activeNavItem.id) {
      state.activeTab = "dashboard";
    } else if (activeNavItem.id !== state.activeTab) {
      state.activeTab = activeNavItem.id;
    }

    document.title = "FinanceAI Predictor - " + activeNavItem.label;

    if (state.activeTab === "dashboard") {
      app.main.innerHTML = renderDashboardView();
    } else if (state.activeTab === "assets") {
      app.main.innerHTML = renderAssetsView();
    } else if (state.activeTab === "proventos") {
      app.main.innerHTML = renderProventosView();
    } else if (state.activeTab === "smart_portfolio") {
      app.main.innerHTML = renderSmartPortfolioView();
    } else if (state.activeTab === "ai") {
      app.main.innerHTML = renderAIView();
    } else {
      app.main.innerHTML = renderBrokerView();
    }

    bindMainEvents();
  }

  function bindMainEvents() {
    if (state.activeTab === "dashboard") {
      const startInput = document.getElementById("dashboard-start");
      const endInput = document.getElementById("dashboard-end");

      if (startInput) {
        startInput.addEventListener("change", function handleDashboardStart() {
          const selectedStart = clampDate(parseInputDate(startInput.value), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);
          const currentEnd = clampDate(parseInputDate(state.dashboardDateEnd), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);
          state.dashboardDateStart = dateToInputValue(selectedStart);
          state.dashboardDateEnd = dateToInputValue(selectedStart.getTime() > currentEnd.getTime() ? selectedStart : currentEnd);
          renderMain();
        });
      }

      if (endInput) {
        endInput.addEventListener("change", function handleDashboardEnd() {
          const selectedEnd = clampDate(parseInputDate(endInput.value), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);
          const currentStart = clampDate(parseInputDate(state.dashboardDateStart), DASHBOARD_MIN_DATE, DASHBOARD_REFERENCE_DATE);
          state.dashboardDateEnd = dateToInputValue(selectedEnd);
          state.dashboardDateStart = dateToInputValue(selectedEnd.getTime() < currentStart.getTime() ? selectedEnd : currentStart);
          renderMain();
        });
      }
    }

    if (state.activeTab === "assets") {
      const searchInput = document.getElementById("asset-search");
      if (searchInput) {
        searchInput.addEventListener("input", function handleSearch() {
          const cursor = searchInput.selectionStart == null ? searchInput.value.length : searchInput.selectionStart;
          state.assetSearch = searchInput.value;
          renderMain();
          const newInput = document.getElementById("asset-search");
          if (newInput) {
            newInput.focus();
            newInput.setSelectionRange(cursor, cursor);
          }
        });
      }

      app.main.querySelectorAll("[data-filter]").forEach(function bindFilter(button) {
        button.addEventListener("click", function handleFilter() {
          state.assetFilter = button.getAttribute("data-filter");
          renderMain();
        });
      });
    }

    if (state.activeTab === "smart_portfolio") {
      app.main.querySelectorAll("[data-smart-range]").forEach(function bindSmartRange(button) {
        button.addEventListener("click", function handleSmartRange() {
          const nextRange = button.getAttribute("data-smart-range");
          if (!nextRange || nextRange === state.smartRange) {
            return;
          }
          state.smartRange = nextRange;
          renderMain();
        });
      });
    }

    if (state.activeTab === "ai") {
      const simFrom = document.getElementById("ai-sim-from");
      const simTo = document.getElementById("ai-sim-to");
      const simShift = document.getElementById("ai-sim-shift");

      if (simFrom) {
        simFrom.addEventListener("change", function handleFromClass() {
          state.aiSimFromClass = simFrom.value;
          if (state.aiSimFromClass === state.aiSimToClass) {
            state.aiSimToClass = state.aiSimFromClass === "Renda Fixa" ? "Ações" : "Renda Fixa";
          }
          renderMain();
        });
      }

      if (simTo) {
        simTo.addEventListener("change", function handleToClass() {
          state.aiSimToClass = simTo.value;
          if (state.aiSimToClass === state.aiSimFromClass) {
            state.aiSimFromClass = state.aiSimToClass === "Renda Fixa" ? "Ações" : "Renda Fixa";
          }
          renderMain();
        });
      }

      if (simShift) {
        simShift.addEventListener("input", function handleShift() {
          state.aiSimShiftPercent = clampNumber(parseInt(simShift.value, 10) || 5, 1, 20);
          renderMain();
        });
      }
    }

    if (state.activeTab === "broker") {
      app.main.querySelectorAll("[data-broker-allocation]").forEach(function bindBrokerAllocation(button) {
        button.addEventListener("click", function handleBrokerAllocation() {
          const nextFilter = button.getAttribute("data-broker-allocation") || "all";
          state.brokerAllocationFilter = nextFilter;
          renderMain();
        });
      });

      app.main.querySelectorAll("[data-broker-range]").forEach(function bindBrokerRange(button) {
        button.addEventListener("click", function handleBrokerRange() {
          const nextRange = button.getAttribute("data-broker-range");
          if (!nextRange || nextRange === state.brokerRange) {
            return;
          }
          state.brokerRange = nextRange;
          renderMain();
        });
      });

      const brokerSearchInput = document.getElementById("broker-search");
      if (brokerSearchInput) {
        brokerSearchInput.addEventListener("input", function handleBrokerSearch() {
          const cursor = brokerSearchInput.selectionStart == null ? brokerSearchInput.value.length : brokerSearchInput.selectionStart;
          state.brokerAssetSearch = brokerSearchInput.value;
          renderMain();
          const refreshedInput = document.getElementById("broker-search");
          if (refreshedInput) {
            refreshedInput.focus();
            refreshedInput.setSelectionRange(cursor, cursor);
          }
        });
      }

      app.main.querySelectorAll("[data-select-asset]").forEach(function bindAsset(button) {
        button.addEventListener("click", function selectAsset() {
          state.selectedAssetId = button.getAttribute("data-select-asset");
          renderMain();
        });
      });

      app.main.querySelectorAll("[data-order-type]").forEach(function bindType(button) {
        button.addEventListener("click", function selectType() {
          state.orderType = button.getAttribute("data-order-type");
          renderMain();
        });
      });

      const qtyInput = document.getElementById("order-qty");
      if (qtyInput) {
        qtyInput.addEventListener("input", function updateQuantity() {
          const cursor = qtyInput.selectionStart == null ? qtyInput.value.length : qtyInput.selectionStart;
          state.orderQty = qtyInput.value;
          renderMain();
          const newQtyInput = document.getElementById("order-qty");
          if (newQtyInput) {
            newQtyInput.focus();
            newQtyInput.setSelectionRange(cursor, cursor);
          }
        });
      }

      const submitButton = document.getElementById("submit-order");
      if (submitButton) {
        submitButton.addEventListener("click", handleOrderSubmit);
      }
    }
  }

  function renderChat() {
    if (!state.chatOpen) {
      app.chat.innerHTML =
        '<button type="button" class="chat-launcher" id="open-chat" aria-label="Abrir assistente">' +
        icon("bot", "chat-icon") +
        "</button>";
      document.getElementById("open-chat").addEventListener("click", function openChat() {
        state.chatOpen = true;
        renderChat();
      });
      return;
    }

    app.chat.innerHTML =
      '<section class="chat-window" aria-label="Assistente FinanceAI">' +
      '<div class="chat-head">' +
      '<div class="chat-title">' +
      icon("bot", "chat-icon") +
      '<div><strong>FinanceAI Chat</strong><div class="helper-text">Assistente local da sua carteira</div></div>' +
      '<span class="status-dot" aria-hidden="true"></span>' +
      "</div>" +
      '<button type="button" class="chat-close" id="close-chat" aria-label="Fechar chat">' +
      icon("close", "button-icon") +
      "</button>" +
      "</div>" +
      '<div class="chat-body" id="chat-body">' +
      state.messages
        .map(function mapMessage(message) {
          return (
            '<div class="chat-row ' +
            message.role +
            '">' +
            (message.role === "bot" ? icon("bot", "chat-icon muted") : "") +
            '<div class="chat-bubble">' +
            escapeHtml(message.text).replace(/\n/g, "<br>") +
            "</div>" +
            (message.role === "user" ? icon("user", "chat-icon muted") : "") +
            "</div>"
          );
        })
        .join("") +
      "</div>" +
      '<div class="chat-form">' +
      '<div class="quick-actions">' +
      ["Resumo da carteira", "Ativos em queda", "Onde investir?", "Dividendos do mes"]
        .map(function mapChip(chip) {
          return '<button type="button" class="chat-chip" data-chat-prompt="' + escapeHtml(chip) + '">' + chip + "</button>";
        })
        .join("") +
      "</div>" +
      '<div class="chat-input-row">' +
      '<input id="chat-input" class="chat-input" type="text" autocomplete="off" placeholder="Pergunte algo sobre a carteira..." value="' +
      escapeHtml(state.chatInput) +
      '">' +
      '<button type="button" class="chat-send" id="chat-send" aria-label="Enviar mensagem">' +
      icon("send", "button-icon") +
      "</button>" +
      "</div>" +
      "</div>" +
      "</section>";

    bindChatEvents();
    requestAnimationFrame(scrollChatToBottom);
  }

  function bindChatEvents() {
    const closeButton = document.getElementById("close-chat");
    const sendButton = document.getElementById("chat-send");
    const input = document.getElementById("chat-input");

    closeButton.addEventListener("click", function closeChat() {
      state.chatOpen = false;
      renderChat();
    });

    app.chat.querySelectorAll("[data-chat-prompt]").forEach(function bindPrompt(button) {
      button.addEventListener("click", function selectPrompt() {
        const prompt = button.getAttribute("data-chat-prompt") || "";
        state.chatInput = prompt;
        renderChat();
      });
    });

    input.addEventListener("input", function syncInput() {
      state.chatInput = input.value;
    });

    input.addEventListener("keydown", function handleKeydown(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSendChatMessage();
      }
    });

    sendButton.addEventListener("click", handleSendChatMessage);
  }

  async function handleSendChatMessage() {
    const inputValue = state.chatInput.trim();
    if (!inputValue) {
      return;
    }

    state.messages.push({ role: "user", text: inputValue });
    state.chatInput = "";
    renderChat();

    // Adiciona uma mensagem de "loading" provisória
    const loadingIdx = state.messages.length;
    state.messages.push({ role: "bot", text: "..." });
    renderChat();

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputValue })
      });
      const data = await response.json();
      
      // Substitui o "..." pela resposta real do Llama 3
      state.messages[loadingIdx].text = data.reply || "Erro na interpretação.";
    } catch (error) {
      state.messages[loadingIdx].text = "Falha de rede ao contatar o Agente AI: " + error.message;
    }
    
    renderChat();
  }

  function buildPortfolioMessage() {
    const metrics = getPortfolioMetrics();
    const best = getTopAssets().slice(0, 3);
    const worst = state.assets
      .filter(function filterByQuantity(asset) {
        return asset.quantity > 0;
      })
      .map(function mapAsset(asset) {
        return {
          ticker: asset.ticker,
          returnPercent: asset.avgPrice > 0 ? ((asset.price - asset.avgPrice) / asset.avgPrice) * 100 : 0,
        };
      })
      .sort(function sortWorst(a, b) {
        return a.returnPercent - b.returnPercent;
      })[0];

    return (
      "Sua carteira soma " +
      formatCurrency(metrics.totalCurrent, 0) +
      ", com retorno acumulado de " +
      formatSignedPercent(metrics.returnPercent, 2) +
      ". Melhores destaques: " +
      best
        .map(function mapAsset(asset) {
          return asset.ticker + " (" + formatSignedPercent(asset.returnPercent, 1) + ")";
        })
        .join(", ") +
      ". Ponto de atenção: " +
      worst.ticker +
      " com " +
      formatSignedPercent(worst.returnPercent, 1) +
      " frente ao preço medio."
    );
  }

  function buildDeclineMessage() {
    const losers = state.assets
      .filter(function filterLosers(asset) {
        return asset.changePercent < 0;
      })
      .sort(function sortLosers(a, b) {
        return a.changePercent - b.changePercent;
      })
      .slice(0, 7);

    if (!losers.length) {
      return "Hoje nenhum ativo da base esta em queda frente ao fechamento anterior.";
    }

    return (
      "Ativos em queda hoje: " +
      losers
        .map(function mapLoser(asset) {
          return asset.ticker + " (" + formatSignedPercent(asset.changePercent, 2) + ")";
        })
        .join(", ") +
      "."
    );
  }

  function buildOpportunityMessage() {
    const opportunities = getRecommendationGroups().compra.slice(0, 4);
    return (
      "As melhores oportunidades pelo motor local sao: " +
      opportunities
        .map(function mapOpportunity(asset) {
          return asset.ticker + " (score " + asset.aiScore + ", " + asset.sector + ")";
        })
        .join(", ") +
      ". Busque equilibrio entre renda fixa, fiis e ações para manter a carteira saudável."
    );
  }

  function buildRiskMessage() {
    const breakdown = getRiskBreakdown();
    const metrics = getPortfolioMetrics();

    return (
      "O risco medio atual da carteira esta em nivel " +
      metrics.avgRisk.toLowerCase() +
      ". Distribuição por valor de mercado: baixo " +
      formatPercent(breakdown.Baixo, 1) +
      ", moderado " +
      formatPercent(breakdown.Moderado, 1) +
      ", alto " +
      formatPercent(breakdown.Alto, 1) +
      ". Se quiser reduzir oscilacao, aumente a parcela em renda fixa e fiis defensivos."
    );
  }

  function buildDividendMessage() {
    const topIncome = state.assets
      .filter(function filterIncome(asset) {
        return (asset.dividendYield || 0) > 0 && asset.quantity > 0;
      })
      .sort(function sortIncome(a, b) {
        return (b.dividendYield || 0) - (a.dividendYield || 0);
      })
      .slice(0, 5);

    return (
      "Os maiores pagadores da carteira hoje sao " +
      topIncome
        .map(function mapAsset(asset) {
          return asset.ticker + " (DY " + formatPercent(asset.dividendYield || 0, 1) + ")";
        })
        .join(", ") +
      ". Projeção média mensal aproximada: " +
      formatCurrency(getDividendProjection(), 0) +
      "."
    );
  }

  function buildChatResponse(message) {
    const text = normalizeText(message);

    if (text.includes("carteira") || text.includes("patrimônio") || text.includes("portfólio") || text.includes("resumo")) {
      return buildPortfolioMessage();
    }

    if (text.includes("queda") || text.includes("caindo") || text.includes("negativ")) {
      return buildDeclineMessage();
    }

    if (text.includes("investir") || text.includes("comprar") || text.includes("oportunidade")) {
      return buildOpportunityMessage();
    }

    if (text.includes("risco") || text.includes("volatilidade") || text.includes("segur")) {
      return buildRiskMessage();
    }

    if (text.includes("dividendo") || text.includes("provento") || text.includes("yield")) {
      return buildDividendMessage();
    }

    return "Posso te ajudar com resumo da carteira, ativos em queda, oportunidades de compra, leitura de risco e dividendos. Experimente perguntar: resumo da carteira, ativos em queda ou dividendos.";
  }

  function handleOrderSubmit() {
    const selectedAsset = getSelectedAsset();
    const quantity = parseInt(state.orderQty, 10);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      showToast("Informe uma quantidade valida para registrar a ordem.", "error");
      return;
    }

    if (state.orderType === "venda" && quantity > selectedAsset.quantity) {
      showToast("Não ha quantidade suficiente em carteira para vender esse volume.", "error");
      return;
    }

    const asset = state.assets.find(function findAsset(item) {
      return item.id === selectedAsset.id;
    });

    if (state.orderType === "compra") {
      const totalInvestedBefore = asset.avgPrice * asset.quantity;
      const totalInvestedNow = totalInvestedBefore + asset.price * quantity;
      asset.quantity += quantity;
      asset.avgPrice = asset.quantity > 0 ? round(totalInvestedNow / asset.quantity, 2) : asset.price;
    } else {
      asset.quantity -= quantity;
      if (asset.quantity === 0) {
        asset.avgPrice = asset.price;
      }
    }

    state.orderHistory.unshift({
      type: state.orderType,
      ticker: asset.ticker,
      qty: quantity,
      price: asset.price,
      time: new Date().toLocaleString("pt-BR"),
    });
    state.orderQty = "10";

    showToast(
      (state.orderType === "compra" ? "Compra simulada de " : "Venda simulada de ") +
        formatNumber(quantity) +
        " " +
        asset.ticker +
        " registrada com sucesso.",
      "success"
    );

    renderMain();
  }

  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.className = "toast " + (type || "info");
    toast.textContent = message;
    app.toast.appendChild(toast);

    window.setTimeout(function removeToast() {
      toast.remove();
    }, 3400);
  }

  function scrollChatToBottom() {
    const body = document.getElementById("chat-body");
    if (body) {
      body.scrollTop = body.scrollHeight;
      const input = document.getElementById("chat-input");
      if (input) {
        input.focus();
      }
    }
  }

  async function boot() {
    try {
      const resp = await fetch("http://localhost:8000/api/assets");
      const data = await resp.json();
      RAW_ASSETS = data;
      state.assets = enrichAssets(RAW_ASSETS);
      if (state.assets.length > 0) {
        state.selectedAssetId = getLiquidAssets()[0] ? getLiquidAssets()[0].id : state.assets[0].id;
      }
    } catch(e) {
      console.warn("Backend FastAPI offline, data was not loaded from API.", e);
    }
    
    renderTicker();
    renderSidebar();
    renderMain();
    renderChat();
  }

  boot();
})();