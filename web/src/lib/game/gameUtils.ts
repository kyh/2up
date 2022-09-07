export const QuestionTypeSlugs = {
  text: {
    id: "text",
    display: "Text",
  },
  // richText: {
  //   id: "rich_text",
  //   display: "Rich Text",
  // },
  image: {
    id: "image",
    display: "Image",
  },
  video: {
    id: "video",
    display: "Video",
  },
  audio: {
    id: "audio",
    display: "Audio",
  },
  code: {
    id: "code",
    display: "Code",
  },
  // sheet: {
  //   id: "sheet",
  //   display: "Spreadsheet",
  // },
};

export const AnswerTypeSlugs = {
  text: {
    id: "text",
    display: "Text",
  },
  multiText: {
    id: "multi_text",
    display: "Multiple Choice",
  },
  // letterText: {
  //   id: "letter_text",
  //   display: "Letters",
  // },
  // multiImage: {
  //   id: "multi_image",
  //   display: "Multiple Image",
  // },
  // swipe: {
  //   id: "swipe",
  //   display: "Swipe",
  // },
  // sortText: {
  //   id: "sort_text",
  //   display: "Sort",
  // },
  // code: {
  //   id: "code",
  //   display: "Code",
  // },
};

export const maxScorePerScene = 200;

export const compareAnswer = (answer: string, answerToCompare: string) => {
  return answer.trim().toLowerCase() === answerToCompare.trim().toLowerCase();
};

export const upsert = <T>(
  array: T[],
  element: T,
  key: keyof T,
  beforeUpdate = (_oldEntry: T, newEntry: T) => newEntry
) => {
  const i = array.findIndex((e) => e[key] === element[key]);

  if (i > -1) {
    const newEntry = beforeUpdate(array[i], element);
    array[i] = newEntry;
  } else {
    array.push(element);
  }

  return array;
};

export const sortByKey = <T>(array: T[], key: keyof T) => {
  return [...array].sort((a, b) => Number(b[key]) - Number(a[key]));
};
