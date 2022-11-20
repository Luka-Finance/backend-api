import axios from 'axios';
import config from '../config/configSetup';
import { CreateVirtualAccountDataType, PaymentLinkDataType, ServerEnv, TokenizeCardDataType } from '../helpers/types';

const enum UrlType {
	API = 'API',
	VAULT = 'VAULT',
}

type subPockets = {
	reference: string;
	publickey: string;
	currency: string;
	pocketFunction: string;
	bankVerificationNumber?: string;
	businessName: string;
	email: string;
	firstName: string;
	lastName: string;
	phoneNumber: string;
};

export class SeerBit {
	protected async reqConfig(url: string, method: 'POST' | 'GET', data?: any) {
		const token = await this.getToken();
		return {
			method,
			url: `${config.SEERBIT_BASE_URL}${url}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token.data.EncryptedSecKey.encryptedKey}`,
			},
			data,
		};
	}

	protected async getToken() {
		const res = await axios({
			method: 'POST',
			url: `${config.SEERBIT_BASE_URL}/api/v2/encrypt/keys`,
			headers: { accept: 'application/json', 'Content-Type': 'application/json' },
			data: {
				key: `${config.SEERBIT_PRIVATE_KEY}.${config.SEERBIT_PUBLIC_KEY}`,
			},
		});
		return res.data;
	}

	public async createSubPockets(data: subPockets) {
		const res = await axios(await this.reqConfig(`/api/v2/subpocket/create`, 'POST', data));
		return res.data;
	}

	public async getBalance(data: { publickey: string; pocketReference?: string; reference?: string }) {
		const res = await axios(await this.reqConfig(`/api/v2/balance`, 'POST', data));
		return res.data;
	}

	public async transactionHistory(data: { publicKey: string; pocketReference?: string }) {
		const res = await axios(await this.reqConfig(`/api/v2/transaction/search?size=100&page=0`, 'POST', data));
		return res.data;
	}

	public async getBanks() {
		const res = await axios(await this.reqConfig(`/pocket/api/v2/payout/banks`, 'POST', { publicKey: config.SEERBIT_PUBLIC_KEY }));
		return res.data;
	}

	public async nameEnquiry(data: { publicKey?: string; bankCode: string; accountNumber: string }) {
		data.publicKey = config.SEERBIT_PUBLIC_KEY;
		const res = await axios(await this.reqConfig(`/pocket/api/v2/payout/enquiry`, 'POST', data));
		return res.data;
	}

	public async fundTransfer(data: {
		publicKey?: string;
		extTransactionRef: string;
		bankCode: string;
		accountNumber: string;
		type: string;
		amount: number | string;
		debitPocketReferenceId: string;
	}) {
		data.publicKey = config.SEERBIT_PUBLIC_KEY;
		const res = await axios(await this.reqConfig(`/pocket/api/v2/payout/transfer`, 'POST', data));
		return res.data;
	}

	public async fundTransferQuery(
		data: {
			publickey: string;
			bankCode: string;
			accountNumber: string;
			type: 'CREDIT_BANK' | 'CREDIT_POCKET';
			amount: number;
			debitPocketReferenceId: string;
		},
		reference: string
	) {
		const res = await axios(await this.reqConfig(`/api/v2/payout/transfer/query/${reference}`, 'POST', data));
		return res.data;
	}

	public async virtualAccount(data: {
		publickey?: string;
		fullName: string;
		bankVerificationNumber?: string;
		currency: string;
		country: string;
		reference: string;
		email: string;
	}) {
		data.publickey = config.SEERBIT_PUBLIC_KEY;
		const res = await axios(await this.reqConfig(`/api/v2/virtual-accounts`, 'POST', data));
		return res.data;
	}
}
