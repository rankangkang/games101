type ClassName =
  | string
  | undefined
  | null
  | boolean
  | Record<string, boolean>
  | ClassName[];

export function classNames(...classes: ClassName[]) {
  const classNameList: string[] = [];

  classes.forEach((item) => {
    if (item) {
      if (typeof item === "string") {
        if (!classNameList.includes(item)) {
          classNameList.push(item);
        }
      } else if (Array.isArray(item)) {
        classNames(...item)
          .split(" ")
          .forEach((className) => {
            if (!classNameList.includes(className)) {
              classNameList.push(className);
            }
          });
      } else if (typeof item === "object") {
        Object.entries(item).forEach(([key, value]) => {
          if (value && !classNameList.includes(key)) {
            classNameList.push(key);
          }
        });
      }
    }
  });

  return classNameList.join(" ");
}
