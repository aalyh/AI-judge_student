export default function formatTime(time: number) {
  const date = new Date(time);
  const Year: number = date.getFullYear();
  const Months: any =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  const Day: any = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const Hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();

  const Minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

  const Seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  return Year + "-" + Months + "-" + Day;
}
