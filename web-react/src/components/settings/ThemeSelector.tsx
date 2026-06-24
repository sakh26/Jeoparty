import type { ColorTheme } from '../../types';

const COLOR_THEMES: { value: ColorTheme; label: string }[] = [
  { value: 'soft-pink', label: 'Soft Pink' },
  { value: 'lavender', label: 'Lavender' },
  { value: 'rose-gold', label: 'Rose Gold' },
  { value: 'midnight', label: 'Midnight' },
  { value: 'barbie', label: 'Barbie' },
];

interface ThemeSelectorProps {
  value: ColorTheme;
  onChange: (theme: ColorTheme) => void;
}

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <label>
      Fargetema
      <select value={value} onChange={(e) => onChange(e.target.value as ColorTheme)}>
        {COLOR_THEMES.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
    </label>
  );
}
