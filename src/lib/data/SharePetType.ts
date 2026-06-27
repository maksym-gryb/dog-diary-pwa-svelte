export const sharePetType = [
    "owner",
    "caretaker"
] as const;

export type SharePetType = typeof sharePetType[number];