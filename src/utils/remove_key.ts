type Obj = { [key: string]: any };

export const removeKey = (k: string = '', { [k]: _, ...o }: Obj = {}): Obj => o;

export const removeKeys = (keys: string[] = [], o: Obj = {}): Obj =>
  keys.reduce((r, k) => removeKey(k, r), o);
