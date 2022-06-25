import bcrypt from "bcrypt";

export const compare = async (pw: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(pw, hash);
}

export const hashPasword = async (pw: string): Promise<string> => {
    return await bcrypt.hash(pw, 10);
};