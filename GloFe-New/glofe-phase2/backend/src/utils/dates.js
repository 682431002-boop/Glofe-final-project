'use strict';
/** Today's date as YYYY-MM-DD in the given IANA timezone (pre-order deadlines are whole days). */
function todayInTimezone(timeZone, now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
module.exports = { todayInTimezone };
