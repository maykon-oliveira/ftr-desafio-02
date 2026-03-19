import { compare, hash } from "bcryptjs";
import { Service } from "typedi";

@Service()
export class BcryptPasswordHasher {
	constructor(private readonly saltRounds = 10) {}

	async hash(value: string): Promise<string> {
		return hash(value, this.saltRounds);
	}

	async compare(value: string, hashedValue: string): Promise<boolean> {
		return compare(value, hashedValue);
	}
}
