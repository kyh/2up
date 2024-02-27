export const getInitials = (name = "") => {
  const nameArr = name.split(" ");
  if (nameArr[0] && nameArr[1]) {
    return `${nameArr[0][0]}${nameArr[1][0]}`;
  } else if (nameArr[0]) {
    return nameArr[0][0];
  }
  return "NA";
};
