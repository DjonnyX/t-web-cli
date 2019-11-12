import { RuntimeErrors } from "../../../../runtime";

export const linkExternalProperty = <T = any>(
  map: {
    [x: string]: () => any;
  },
  propName: string,
  externalProperty: () => T
): void => {
  if (propName in map) {
    throw new Error(
      RuntimeErrors.PROPERTY__P__ALREADY_BINDED.replace(/\$p/, propName)
    );
  }

  map[propName] = externalProperty;
};


export const unlinkExternalProperty = (map: {
  [x: string]: () => any;
}): void => {
  const propNames = Object.keys(map);

  for (const propName of propNames) {
    map[propName] = undefined;
    delete map[propName];
  }
}

