import './PriceBarChart.css';

/**
 * Devuelve el porcentaje (0-100) del ancho de la barra para un valor dado.
 * @param {number} value - Valor de la barra.
 * @param {number} max - Valor máximo del conjunto de datos.
 * @returns {number} Porcentaje entre 0 y 100 (0 si max <= 0).
 */
function barWidthPct(value, max) {
  if (!(max > 0)) return 0;
  const pct = (value / max) * 100;
  if (pct < 0) return 0;
  if (pct > 100) return 100;
  return pct;
}

function formatValue(value, unit) {
  const n = Number.isFinite(value) ? value : 0;
  return `${n.toFixed(3)} ${unit}`;
}

/**
 * Gráfico de barras horizontales en SVG puro (sin librerías), responsive.
 *
 * @param {Object} props
 * @param {{ label: string, value: number }[]} props.data - Datos a representar.
 * @param {string} [props.unit='€'] - Unidad mostrada junto a cada valor.
 * @param {string} [props.title] - Título opcional del gráfico.
 */
function PriceBarChart({ data = [], unit = '€', title }) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="price-bar-chart price-bar-chart--empty">
        {title ? <h3 className="price-bar-chart__title">{title}</h3> : null}
        <p className="price-bar-chart__empty">Sin datos</p>
      </div>
    );
  }

  const max = data.reduce(
    (acc, d) => (Number.isFinite(d.value) && d.value > acc ? d.value : acc),
    0
  );

  // Geometría del SVG (coordenadas internas; el render es responsive vía viewBox).
  const rowHeight = 40;
  const rowGap = 8;
  const barHeight = 22;
  const labelWidth = 120;
  const valueWidth = 110;
  const chartLeft = labelWidth;
  const chartRight = 600 - valueWidth;
  const trackWidth = chartRight - chartLeft;
  const width = 600;
  const height = data.length * (rowHeight + rowGap);

  const summaryParts = data
    .map((d) => `${d.label}: ${formatValue(d.value, unit)}`)
    .join(', ');
  const ariaLabel = `${title ? `${title}. ` : ''}Gráfico de barras con ${data.length} valores. ${summaryParts}`;

  return (
    <figure className="price-bar-chart">
      {title ? (
        <figcaption className="price-bar-chart__title">{title}</figcaption>
      ) : null}
      <svg
        className="price-bar-chart__svg"
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMin meet"
        role="img"
        aria-label={ariaLabel}
      >
        {data.map((d, i) => {
          const value = Number.isFinite(d.value) ? d.value : 0;
          const pct = barWidthPct(value, max);
          const barW = (pct / 100) * trackWidth;
          const rowTop = i * (rowHeight + rowGap);
          const barY = rowTop + (rowHeight - barHeight) / 2;
          const textY = rowTop + rowHeight / 2;

          return (
            <g
              key={`${d.label}-${i}`}
              className="price-bar-chart__row"
            >
              <text
                className="price-bar-chart__label"
                x={labelWidth - 8}
                y={textY}
                textAnchor="end"
                dominantBaseline="central"
              >
                {d.label}
              </text>

              <rect
                className="price-bar-chart__track"
                x={chartLeft}
                y={barY}
                width={trackWidth}
                height={barHeight}
                rx="4"
              />

              <rect
                className="price-bar-chart__bar"
                x={chartLeft}
                y={barY}
                width={barW}
                height={barHeight}
                rx="4"
              />

              <text
                className="price-bar-chart__value"
                x={chartLeft + barW + 8}
                y={textY}
                textAnchor="start"
                dominantBaseline="central"
              >
                {formatValue(value, unit)}
              </text>
            </g>
          );
        })}
      </svg>
    </figure>
  );
}

export default PriceBarChart;
export { barWidthPct };
