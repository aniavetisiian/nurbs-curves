module.exports = {
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 120,
  proseWrap: 'never',
  endOfLine: 'lf',
  tabWidth: 2,
  importOrder: ['^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
