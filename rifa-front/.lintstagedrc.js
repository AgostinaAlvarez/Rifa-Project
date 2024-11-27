module.exports = {
  '*.ts': ['prettier --write', 'eslint --fix'],
  '*.tsx': ['prettier --write', 'eslint --fix'],
  '*.json': ['prettier --write'],
  '*.css': ['prettier --write'],
};
