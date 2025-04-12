import colors from "tailwindcss/colors";

type GradientConfig = {
  direction: string;
  colors: {
    from: string;
    via?: string;
    to: string;
  };
};

export function extractGradient(className: string): GradientConfig {
  const directionMatch = className.match(/bg-gradient-to-(\w+)/);
  const fromMatch = className.match(/from-([^\s]+)/);
  const viaMatch = className.match(/via-([^\s]+)/);
  const toMatch = className.match(/to-([^\s]+)/);

  if (!directionMatch || !fromMatch || !toMatch) {
    throw new Error("Could not extract gradient configuration from className");
  }

  const direction = directionMatch[1];
  const fromColor = getColorFromClass(fromMatch[1]);
  const viaColor = viaMatch ? getColorFromClass(viaMatch[1]) : undefined;
  const toColor = getColorFromClass(toMatch[1]);

  return {
    direction,
    colors: {
      from: fromColor,
      ...(viaColor ? { via: viaColor } : {}),
      to: toColor,
    },
  };
}

function getColorFromClass(colorClass: string): string {
  const [color, shade] = colorClass.split("-");

  if (!colors[color] || !colors[color][shade]) {
    throw new Error(`Could not find color: ${colorClass}`);
  }

  return colors[color][shade];
}
