import { Box, Text } from "@chakra-ui/react";
import { useState } from "react";

type Segment = {
  value: number;
  color: string;
  // optional human readable label for the segment
  label?: string;
};

function getCircumference(r: number) {
  return 2 * Math.PI * r;
}

export function DonutChart({
  segments,
  size = 120,
  strokeWidth = 10,
  centerLabel,
  title,
}: {
  segments: Segment[];
  size?: number;
  strokeWidth?: number;
  centerLabel: string | number;
  title?: string | number;
}) {
  // Force pixel alignment
  const hoverStrokeWidth = strokeWidth * 1.4;
  const hoverPadding = Math.ceil((hoverStrokeWidth - strokeWidth) / 2) + 2;
  const canvasSize = size + hoverPadding * 2;
  const center = hoverPadding + size / 2;

  const normalizedRadius = (size - strokeWidth) / 2;

  const circumference = getCircumference(normalizedRadius);

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  let offset = 0;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <Box
      position="relative"
      width="100%"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {title && (
        <Box width="100%" textAlign="center" mb={2}>
          <Text fontSize="sm" fontWeight="bold">
            {title}
          </Text>
        </Box>
      )}

      <Box position="relative" width={canvasSize} height={canvasSize} mx="auto">
        <svg
          width={canvasSize}
          height={canvasSize}
          viewBox={`0 0 ${canvasSize} ${canvasSize}`}
          style={{
            display: "block",
            shapeRendering: "geometricPrecision",
          }}
        >
          {/* Background */}
          <circle
            cx={center}
            cy={center}
            r={normalizedRadius}
            fill="none"
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
          />

          {/* Segments */}
          {segments.map((seg, i) => {
            const dash = total > 0 ? (seg.value / total) * circumference : 0;
            const percent = total > 0 ? (seg.value / total) * 100 : 0;
            const titleText = seg.label
              ? `${seg.label}: ${seg.value} (${percent.toFixed(1)}%)`
              : `${seg.value} (${percent.toFixed(1)}%)`;

            const isHovered = hovered === i;

            const node = (
              // SVG elements support a nested <title/> which browsers show as a tooltip on hover
              <circle
                key={i}
                cx={center}
                cy={center}
                r={normalizedRadius}
                fill="none"
                stroke={seg.color}
                strokeWidth={isHovered ? hoverStrokeWidth : strokeWidth}
                strokeDasharray={`${dash} ${circumference}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
                transform={`rotate(-90 ${center} ${center})`}
                vectorEffect="non-scaling-stroke"
                aria-label={titleText}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: "pointer",
                  transition: "stroke-width 120ms ease, opacity 120ms ease",
                  opacity: hovered === null ? 1 : isHovered ? 1 : 0.75,
                }}
              >
                <title>{titleText}</title>
              </circle>
            );

            offset += dash;
            return node;
          })}
        </svg>

        {/* Center label */}
        <Box
          position="absolute"
          inset="0"
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
        >
          <Text fontSize="lg" fontWeight="bold" lineHeight="1">
            {centerLabel}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}