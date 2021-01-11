const date = new Date('2021-01-11, 12:03:00');
const dateValue = new Date(date);
  const hours = formatValue(dateValue.getHours());
  const minutes = formatValue(dateValue.getMinutes());
  const seconds = formatValue(dateValue.getSeconds());

function formatValue(value) {
    return value > 10 ? value : '0' + value;
  }
console.log(`${hours}:${minutes}:${seconds}`);