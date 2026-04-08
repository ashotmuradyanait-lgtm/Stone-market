/**
 * Ստեղծում է ունիկալ Chat ID երկու օգտատերերի UID-ների հիման վրա:
 * Օգտագործում է այբբենական համեմատություն, որպեսզի ID-ն լինի դետերմինացված:
 * * @param uid1 - Առաջին օգտատիրոջ ID-ն
 * @param uid2 - Երկրորդ օգտատիրոջ ID-ն
 * @returns Համակցված ID-ն (string) կամ null, եթե ID-ներից մեկը բացակայում է
 */
export const getChatId = (uid1: string | undefined, uid2: string | undefined): string | null => {
  if (!uid1 || !uid2) return null;

  // Համեմատում ենք տեքստերը, որպեսզի դասավորությունը միշտ նույնը լինի
  return uid1 < uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};