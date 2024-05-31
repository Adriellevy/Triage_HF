import bcrypt from 'bcrypt';

export const encrypt = async (data: string): Promise<string> => {
  const hash = await bcrypt.hash(data, 10);
  return hash;
};

export const compare = async (passwordPlain: string, hashPassword: string): Promise<boolean> => {
  const result = await bcrypt.compare(passwordPlain, hashPassword);
  return result;
};
