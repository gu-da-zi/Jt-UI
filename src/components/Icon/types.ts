import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome';

export type ExtendedFontAwesomeIconProps = FontAwesomeIconProps & {
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  color?: string;
};
