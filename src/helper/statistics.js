function convertToPercent(d) {
  if (typeof d !== "boolean") return +d;
  return d ? 100 : 0;
}

export function mean(rawData) {
  const data = rawData.map(convertToPercent);
  const N = data.length;
  const sum = data.reduce((a, c) => a + c, 0);
  const mean = sum / N;
  const vari = data.reduce((a, c) => a + (c - mean) ** 2, 0) / N;
  const n1_vari = data.reduce((a, c) => a + (c - mean) ** 2, 0) / (N-1);
  const s = Math.sqrt(vari);
  const n1_s = Math.sqrt(n1_vari);
  const se = n1_s / Math.sqrt(N);
  const min = Math.min(...data);
  const max = Math.max(...data);
  return {count: N, min, max, sum, mean, vari, s, se};
}

export function meanObject2String(m) {
  const mean = m.mean.toFixed(2);
  const s = m.s.toFixed(2);
  return `${mean} +- ${s}`
}

export function map2Strings(map, trennzeichen='\n') {
  const a=[];
  map.forEach((value, key)=>a.push(`${key} -> ${value}`));
  return a.join(trennzeichen);
}
