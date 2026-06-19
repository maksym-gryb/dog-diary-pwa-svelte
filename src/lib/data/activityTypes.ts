export const activityTypes = [
  "pee",
  "poop",
  "toothbrush",
  "bath"
] as const;

export type ActivityType = typeof activityTypes[number];

export const LegacyActivityMap = {
  peeing: "pee",
  pooping: "poop"
} as const;

export type LegacyActivityType = keyof typeof LegacyActivityMap;

export const ActivityIcon = {
  pee: "fa-toilet",
  poop: "fa-poo",
  walk: "fa-person-walking",
  eat: "fa-bone",
  drink: "fa-mug-hot",
  sleep: "fa-bed",
  toothbrush: "fa-tooth",
  bath: "fa-bath"
} as const;

type IconActivityType = keyof typeof ActivityIcon;

export function createIcon(activityType: string): HTMLElement {
  const icon = document.createElement("i");

  icon.classList.add("fa-solid");

  let type: IconActivityType | undefined;

  if (activityType in ActivityIcon) {
    type = activityType as IconActivityType;
  } else if (activityType in LegacyActivityMap) {
    type =
      LegacyActivityMap[
        activityType as LegacyActivityType
      ] as IconActivityType;
  }

  icon.classList.add(type ? ActivityIcon[type] : "fa-question");

  return icon;
}