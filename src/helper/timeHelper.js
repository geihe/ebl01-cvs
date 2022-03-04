export function timeDiffString(start, end) {
  const duration = end ?
    end.getTime() - start.getTime()
    : Date.now() - start.getTime() ;


  let seconds = parseInt((duration / 1000) % 60);
  let minutes = parseInt((duration / (1000 * 60)) % 60);
  let hours = parseInt((duration / (1000 * 60 * 60)) % 24);
  let days = parseInt((duration / (1000 * 60 * 60 * 24)));

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return days>0 ? days +( days>1 ? " Tage" : " Tag") : hours + ":" + minutes + ":" + seconds;
}

export function getISO(timeString) {
  const a = timeString.split(/\.|,/);
  return`${a[2]}-${a[1].padStart(2, '0')}-${a[0].padStart(2, '0')}${a[3]}`;
}