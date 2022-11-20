import axios from 'axios';
import config from '../config/configSetup';
import { VTPassServiceIDs, VTPassPurchaseProduct, PowerVariationCode } from '../helpers/types';

export class VTPass {
	protected async reqConfig(url: string, method: 'POST' | 'GET', data?: any) {
		const token = `${config.VTPASS_USERNAME}:${config.VTPASS_PASSWORD}`;
		const encodedToken = Buffer.from(token).toString('base64');
		const headers: { 'Content-Type': string; 'secret-key'?: string; 'public-key'?: string; Authorization: string } = {
			'Content-Type': 'application/json',
			Authorization: `Basic ${encodedToken}`,
		};
		return {
			method,
			url: `${config.VTPASS_SANDBOX_BASE_API_URL}${url}`,
			headers,
			data,
		};
	}

	public async purchaseProduct(data: VTPassPurchaseProduct) {
		// console.log({ data });
		const res = await axios(await this.reqConfig('/pay', 'POST', data));
		// console.log(res.data);
		return res.data;
	}

	public async getServiceVariations(serviceID: VTPassServiceIDs) {
		const res = await axios(await this.reqConfig(`/service-variations?serviceID=${serviceID}`, 'GET'));
		return res.data;
	}

	public async verifyMerchant(data: { billersCode: string; serviceID: VTPassServiceIDs; type?: PowerVariationCode }) {
		const res = await axios(await this.reqConfig('/merchant-verify', 'POST', data));
		console.log(res.data);
		return res.data;
	}

	public async queryTransactionStatus(data: { request_id: string }) {
		const res = await axios(await this.reqConfig('/requery', 'POST', data));
		return res.data;
	}
}
