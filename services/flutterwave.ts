import axios from 'axios';
import config from '../config/configSetup';
import { CreateVirtualAccountDataType, PaymentLinkDataType, TokenizeCardDataType } from '../helpers/types';

export class Flutterwave {
	protected async reqConfig(url: string, method: 'POST' | 'GET', data?: any) {
		return {
			method,
			url: `${config.FLUTTERWAVE_BASE_API_URL}${url}`,
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${config.FLUTTERWAVE_SEC_KEY}`,
			},
			data,
		};
	}
	public async verify(id: string | number) {
		const res = await axios(await this.reqConfig(`/transactions/${id}/verify`, 'GET'));
		return res.data;
	}
	public async tokenizeCard(data: TokenizeCardDataType) {
		const res = await axios(await this.reqConfig(`/tokenized-charges`, 'POST', data));
		return res.data;
	}
	public async virtualAccount(data: CreateVirtualAccountDataType) {
		const res = await axios(await this.reqConfig(`/virtual-account-numbers`, 'POST', JSON.stringify(data)));
		return res.data;
	}
	public async paymentLink(data: PaymentLinkDataType) {
		const res = await axios(await this.reqConfig(`/payments`, 'POST', data));
		return res.data;
	}
	public async initiateTransfer(data: PaymentLinkDataType) {
		const res = await axios(await this.reqConfig(`/transfers`, 'POST', data));
		return res.data;
	}
}
