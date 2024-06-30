export const formatDate = (
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
) =>
  new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long",
    day: opts.day ?? "numeric",
    year: opts.year ?? "numeric",
    ...opts,
  }).format(new Date(date));
