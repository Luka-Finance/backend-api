import axios from 'axios';
import config from '../config/configSetup';
import { CreateVirtualAccountDataType, PaymentLinkDataType, ServerEnv, TokenizeCardDataType } from '../helpers/types';

const enum UrlType {
	API = 'API',
	VAULT = 'VAULT',
}

export class Sudo {
	protected async getUrl(type: UrlType) {
		const api = `${config.NODE_ENV === ServerEnv.PROD ? config.SUDO_BASE_API_URL : config.SUDO_SANDBOX_BASE_API_URL}`;
		const valut = `${config.NODE_ENV === ServerEnv.PROD ? config.SUDO_VAULT_URL : config.SUDO_SANDBOX_VAULT_URL}`;
		return type === UrlType.API ? api : type === UrlType.VAULT ? valut : null;
	}
	protected async reqConfig(endpoint: string, method: 'POST' | 'GET', type: UrlType, data?: any) {
		return {
			method,
			url: `${this.getUrl(type)}${endpoint}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.SUDO_API_KEY}`,
			},
			data,
		};
	}

	public async createCardHolder(data: any) {
		const res = await axios(await this.reqConfig(`/customers`, 'POST', UrlType.API, data));
		return res.data;
	}

	public async mapCard(data: any) {
		const res = await axios(await this.reqConfig(`/cards`, 'POST', UrlType.VAULT, data));
		return res.data;
	}
}
