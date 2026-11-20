export function publicAsset(path, base = process.env.PUBLIC_URL || '') {
  return `${base.replace(/\/+$/, '')}/${path}`;
}
