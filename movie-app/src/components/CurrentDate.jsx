import { useEffect, useState } from 'react';

function CurrentDate() {
    const [currentDate, setCurrentDate] = useState('');

useEffect(() => {
  const date = new Date()
  const formattedDate = date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric', 
    month: 'short',
    day: 'numeric',
    // hour: 'numeric',
    // minute: 'numeric',
    // second: 'numeric',
    // timeZoneName: 'short',
  });
  setCurrentDate(formattedDate)
}, []);

  return (
    <p className="text-white mt-4 text-left">{currentDate}</p>
  );
}

export default CurrentDate;
