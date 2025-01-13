export const USER_ROLE = {
  user: "user",
  admin: "admin",
} as const;
export type TUserRole = keyof typeof USER_ROLE;

export type TUser = {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "user" | "admin";
  address: string;
};


