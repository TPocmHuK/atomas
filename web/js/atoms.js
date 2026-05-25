// Atom definitions: symbols and colors per atomic number.
// atomicNumber === 0 is the special "plus" trigger.

const ATOM_SYMBOLS = [
  '+', 'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
  'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
  'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
];

const ATOM_PALETTE = [
  '#e53935', // red
  '#fb8c00', // orange
  '#fdd835', // yellow
  '#43a047', // green
  '#1e88e5', // blue
  '#8e24aa', // purple
  '#d81b60', // pink
  '#00897b', // teal
  '#6d4c41', // brown
  '#3949ab', // indigo
];

function atomSymbol(n) {
  return ATOM_SYMBOLS[n] || `E${n}`;
}

function atomColor(n) {
  if (n === 0) return '#b0bec5';
  return ATOM_PALETTE[(n - 1) % ATOM_PALETTE.length];
}
