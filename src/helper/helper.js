export const ageInSeconds = dateString => (Date.now() - (new Date(dateString)).valueOf())/1000;


export class frameFilter {
  static id = (id) => (frame => frame.id === id);
}

export function count(arr) {
  return arr.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map());
}

export function transpose(data) {
  return data[0].map((col, i) => data.map(row => row[i]));
}