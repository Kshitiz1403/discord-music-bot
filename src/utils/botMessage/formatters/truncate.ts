function truncate(source: string, size: number) {
  if (source.length <= size) return source;
  let trimmedString = source.substr(0, size);
  trimmedString = trimmedString.substr(
    0,
    Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))
  );

  trimmedString += "...";
  return trimmedString;
}
export default truncate;
