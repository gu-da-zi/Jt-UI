export type AlertType = 'success' | 'warning' | 'danger' | 'info';
export type EffectType = 'light' | 'dark';

export interface AlertProps {
  title?: string;
  type?: AlertType;
  description?: string;
  closable?: boolean;
  center?: boolean;
  closeText?: string;
  showIcon?: boolean;
  effect?: EffectType;
}
export interface AlertEmits {
  (e: 'close'): void;
}

export interface AlertInstance {
  hide: () => void;
}
