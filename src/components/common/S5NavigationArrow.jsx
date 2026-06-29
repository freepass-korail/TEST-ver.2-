/** Figma S5 화살표 — viewBox 중심(40,110) 기준 대칭 stroke */
export const S5_ARROW_VIEWBOX = { width: 80, height: 220, pivotX: 40, pivotY: 110, halfExtent: 85 };

export const S5_ARROW_PATH = [
  'M 40 195 L 40 25',
  'M 40 25 L 12 75',
  'M 40 25 L 68 75',
].join(' ');

function S5NavigationArrow({ width, height, strokeWidth = 30, color = '#FFFFFF' }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${S5_ARROW_VIEWBOX.width} ${S5_ARROW_VIEWBOX.height}`}
      overflow="visible"
      aria-hidden
    >
      <path
        d={S5_ARROW_PATH}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default S5NavigationArrow;
