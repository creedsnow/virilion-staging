import { icons } from "./index.js";

/**
 * <Icon name="ui-d20" />            line icon, inherits CSS `color`
 * <Icon name="classes-mage" size={40} />  gold-on-violet badge
 * <Icon name="peoples-varkyn-mono" />     single-colour emblem
 * Requires icons.svg inlined once in the document (recommended), or pass spriteUrl.
 */
export function Icon({ name, size, title, spriteUrl = "", className, style, ...rest }) {
  const meta = icons[name];
  if (!meta) return null;
  const s = size ?? (meta.viewBox.endsWith("48 48") ? 40 : 24);
  return (
    <svg width={s} height={s} viewBox={meta.viewBox} className={className} style={style}
      role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false" {...rest}>
      {title ? <title>{title}</title> : null}
      <use href={`${spriteUrl}#${name}`} />
    </svg>
  );
}
export default Icon;
