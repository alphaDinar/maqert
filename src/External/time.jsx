export const getRealDate = (timestamp) => {
  const date = new Date(timestamp);

  const day = date.getDate();
  const dayWithSuffix = day + (
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const month = monthNames[date.getMonth()];

  const year = date.getFullYear();

  return `${dayWithSuffix} ${month}, ${year}`;
}

export const sortByTime = (a, b) => {
  const timeA = a.timestamp;
  const timeB = b.timestamp;
  return timeB - timeA;
}

