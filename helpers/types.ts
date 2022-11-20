// TYPES
export type RegisterDataType = {
	names: string;
	phone: string;
	email: string;
	password: string;
	role?: string;
};
export type AuthPayloadDataType = {
	id: number;
	phone: string;
	email: string;
	status: string;
	names?: string;
	firstName?: string;
	lastName?: string;
	otherName?: string;
	accountDetails?: string;
	businessId?: number;
	businessName?: string;
	role?: string;
	type: string;
};

export type BusinessAuthPayloadDataType = {
	name: string;
	phone: string;
	email: string;
	lukaId: string;
	country: string;
	city: string;
	payday?: number;
	type?: ['registered' | 'non-registered'];
};
export type TokenDataType = {
	type: 'token' | '2fa' | 'verification';
	token: string;
	staff?: AuthPayloadDataType;
	admin?: AuthPayloadDataType;
	business?: BusinessAuthPayloadDataType;
};
export type SendMailDataType = {
	senderName: string;
	senderEmail: string;
	mailRecipients: string[] | string;
	mailSubject: string;
	mailBody: string;
	mailAttachments?: { content: any; filename: string; type: string; disposition: string }[];
};
export type PrepareMailDataType = {
	mailRecipients: string[] | string;
	mailSubject: string;
	mailBody: string;
	senderName: string;
	senderEmail: string;
};
export type ContactUsTemplateDataType = {
	name: string;
	email: string;
	phone: string;
	subject: string;
	message: string;
};
export type SubscribeTemplateDataType = {
	firstName: string;
	email: string;
};
export type OtpDetailsDataType = {
	timestamp: Date;
	client: string;
	password?: string;
	success: boolean;
	message: string;
	otpId: number;
	businessId: number;
};
export type SendOtpDataType = {
	channel: string;
	type: typeEnum;
	password?: string;
	channelType: channelTypeEnum;
	businessId: number;
};

export type AdminSendOtpDataType = {
	channel: string;
	type: typeEnum;
	password?: string;
	channelType: channelTypeEnum;
};

export type OtpMailTemplateDataType = {
	subject: string;
	body: string;
};
export type GetOtpTemplateDataType = {
	otp: number;
	type: typeEnum;
};
export type VerifyOtpDataType = {
	token: string;
	otp: number;
	client: string;
	type: typeEnum;
};

export type resendOtpType = {
	email: string;
	phone: string;
	businessId?: number;
	type: typeEnum;
};

export type LoginDataType = {
	email: string;
	password: string;
	staff: {
		password: string;
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		otherName: string;
		phone: string;
		status: string;
		businessId: number;
	};
};
export type FnResponseDataType = {
	status: boolean;
	message: string;
	data?: any;
	code?: number;
};
export type ChangePasswordDataType = {
	token: string;
	password: string;
};
export type SendSmsDataType = {
	phone: string;
	text: string;
};
export type PrepareSmsDataType = {
	recipents: string;
};
export type AdminOnboardingTemplateData = {
	names: string;
	role: string;
	password: string;
};
export type DocumentDataType = {
	data: DocumentDataObjectType[];
	documentModelId?: number;
	userId?: number;
	id?: number;
};

export type TransactionDataType = {
	ref: string;
	transId: string;
	amount: number;
	commission: number;
	narration: string;
	gateway: string;
	type: TransactionType;
	status: string;
	meta?: any;
	businessId?: number;
	staffId?: number;
	invoiceId?: number;
	id?: number;
};

export type UtilitiesTransactionDataType = {
	ref: string;
	utility: UitilityType;
	amount: number;
	narration: string;
	status: string;
	meta?: any;
	businessId?: number;
	staffId?: number;
	transactionId?: number;
};

export type DocumentDataObjectType = {
	label: string;
	type: string;
	description: string;
	value?: string;
};
export type DocumentModelDataType = {
	fields: DocumentDataObjectType[];
	name: string;
	description: string;
	id?: number;
};
export type FlightSearchDataType = {
	FlightSearchType: string;
	Ticketclass: string;
	Adults: number;
	Children: number;
	Infants: number;
	Itineraries: ItinerariesDataType[];
	TargetCurrency: string;
};
export type ItinerariesDataType = {
	Departure: string;
	Destination: string;
	DepartureDate: string;
};
export type FlightSelectDataType = {
	TargetCurrency: string;
	SelectData: string;
};
export type FlightBookingDataType = {
	PassengerDetails: PassengerDetailsDataType[];
	BookingItemModels: BookingItemModelsDataType[];
	BookingId: string;
	userId?: number;
};
export type PassengerDetailsDataType = {
	PassengerType: string;
	FirstName: string;
	MiddleName?: string;
	LastName: string;
	DateOfBirth: string;
	Age: number;
	PhoneNumber: string;
	PassportNumber: string;
	ExpiryDate?: string;
	PassportIssuingAuthority?: string;
	Gender: string;
	Title: string;
	Email: string;
	Address: string;
	Country: string;
	CountryCode: string;
	City: string;
	PostalCode: string;
	TicketNumber: string;
	RoomNumber: string;
};
export type BookingItemModelsDataType = {
	ProductType: string;
	BookingData: string;
	BookingId: string;
	TargetCurrency: string;
};
export type TicketPNRDataType = {
	BookingId: string;
	PnrNumber: string;
};
export type TokenizeCardDataType = {
	token: string;
	email: string;
	currency: string;
	amount: number;
	tx_ref: string | number;
	narration: string;
};

export type CreateVirtualAccountDataType = {
	tx_ref?: string | number;
	email: string;
	is_permanent: boolean;
	amount: string | number;
	narration?: string;
	meta?: MetaDataType;
	bvn?: string;
	phonenumber?: string;
	firstname?: string;
	lastname?: string;
};
export type CustomerDataType = {
	email: string;
	phonenumber?: string;
	name?: string;
};
export type CustomizationsDataType = {
	title: string;
	logo: string;
};
export type PaymentLinkDataType = {
	tx_ref: string | number;
	amount: string | number;
	currency?: 'NGN';
	payment_options: string;
	redirect_url: string;
	meta: MetaDataType;
	customer: CustomerDataType;
	customizations: CustomizationsDataType;
};

export type MetaDataType = {
	bookingId: string;
	userId: number;
	saveCard?: boolean;
};

export type HotelSearchDataType = {
	SessionID: string;
	PageNo: number;
	PageSize: string | number;
	CityId: string | number;
	CityName: string;
	Type?: 'C' | 'A' | 'B';
	Module?: 'B' | 'C' | 'A';
	HotelId?: string;
	TravellerNationality: string;
	Currency: 'AED';
	CheckInDate: Date;
	CheckOutDate: Date;
	LanguageLocale: 'en-US';
	ShowDetail: boolean;
	Rooms: RoomsDataType[];
};
export type RoomsDataType = {
	Paxs: PaxsDataType[];
	Adults: number;
	Children: number;
};
export type PaxsDataType = {
	Seq?: number | string;
	LeadPax?: Boolean;
	PaxId?: number | string;
	Title?: string;
	Forename?: string;
	Surname?: string;
	PaxType?: 'C' | 'B' | 'A';
	Age?: number | string;
};

export type HotelDetailDataType = {
	HotelProviderSearchId: string;
	SearchType: 'Hotel';
};

export type HotelMediaDataType = {
	HotelProviderSearchId: string[];
};
export type HotelAmenitiesDataType = {
	HotelProviderSearchId: string[];
};
export type CreditCheckDataType = {
	Currency: string;
	Amount: number | string;
};

export type HotelBookDataType = {
	ReservationName: string;
	ReservationArrivalDate: Date;
	ReservationCurrency: string;
	ReservationClientReference: string;
	ReservationRemarks: string;
	IsQuote: boolean;
	BookingDetails: BookingDetailsDataType[];
};
export type BookingDetailsDataType = {
	index: number;
	SearchType: string;
	UniqueReferencekey: string;
	HotelServiceDetail: HotelServiceDetailDataType[];
	ExcursionServiceDetail: string;
	PackageServiceDetail: string;
	TransferServiceDetail: string;
};

export type HotelServiceDetailDataType = {
	UniqueReferencekey: string;
	ProviderName: string;
	ServiceIdentifer: string;
	ServiceBookPrice: number | string;
	OptionalToken: string;
	ServiceCheckInTime: string;
	Image: string;
	HotelName: string;
	FromDate: Date;
	ToDate: Date;
	ServiceName: string;
	RoomNames: string;
	MealPlan: string;
	MealCode: string;
	PaxDetail: string;
	BookCurrency: string;
	RoomDetails: [];
	PkgID: number | string;
};

export type RoomDetailsDataType = {
	RoomId: number | string;
	Adults: number;
	Teens: number;
	Children: number;
	Infants: number;
	RoomName: string;
	Paxs: PaxsDataType[];
	ExtraBed: number | string;
};

export type ReservationListDataType = {
	PageNo: number | string;
	PageSize: number | string;
	DateType: 'C' | 'R';
	SearchCondition: string;
	FromDate: Date;
	ToDate: Date;
};
export type ReservationDetailDataType = {
	ReservationId?: number | string;
	ReservationReference?: number | string;
};
export type CancelQueryDataType = {
	ReservationId?: number | string;
	BookingId?: number | string;
};
export type CancelConfirmDataType = {
	ReservationId: number | string;
	BookingId: number | string;
	BookingCancellationkey?: string;
};
export type StaticDataDataType = {
	AcType: 'City';
	SearchText: string;
	CityId?: number | string;
};

export type QuickFlightDataType = {
	from: { city: string; airportCode: string };
	to: { city: string; airportCode: string };
	id?: number;
};

export type PaymentDataType = {
	identity: 'admin' | 'user' | undefined;
	id?: number;
};

export type PackagesDataType = {
	name: string;
	description: string;
	featuredImage: string;
	images: string[];
	inclusions: string[];
	date: string[];
	prices: { sellingPrice: number; actualPrice?: number; currency: 'NGN' | 'USD'; unit: string };
	documentModelId?: number;
	categoryId?: number;
	id?: number;
};

export type InvoicesDataType = {
	title: string;
	total: number;
	items: { amount: number; description: string }[];
	dueDate: string | Date;
	status?: 'paid' | 'not-paid';
	businessId?: number;
	id?: number;
};

export type BuildItUserDataType = {
	lastName: string;
	otherNames: string;
	bvn: string;
	phoneNumber: string;
	gender: 0 | 1;
	placeOfBirth?: string;
	dateOfBirth: string;
	address: string;
	accountOfficerCode?: 16000;
	emailAddress: string;
};

export type DebitCustomerDataType = {
	amount: number;
	fromAccountNumber: string;
	narration: string;
};

export type VTPassPurchaseProduct = {
	request_id: string;
	serviceID: VTPassServiceIDs;
	amount?: number;
	phone?: string;
	billersCode?: string;
	variation_code?: string;
	subscription_type?: CableSubscriptionType;
	quantity?: number;
};

export type VTPassServiceIDs = AirtimeServiceIDs | DataServiceIDs | PowerServiceIDs | CableServiceIDs;

// ENUM
export enum typeEnum {
	VERIFICATION = 'verification',
	RESET = 'reset',
	TWOFA = '2fa',
}
export enum channelTypeEnum {
	PHONE = 'phone',
	EMAIL = 'email',
}
export enum AdminRoles {
	CONTROL = 'control',
	SUPPORT = 'support',
}
export enum ValidOtpType {
	VERIFICATION = 'verification',
	RESET = 'reset',
	TWOFA = '2fa',
}
export enum ValidStatus {
	ACTIVATED = 'activate',
	DEACTIVATED = 'deactivate',
}
export enum BookingType {
	FLIGHT = 'flight',
	HOTEL = 'hotel',
	PACKAGE = 'package',
}

export enum NarrationType {
	DAILY_INTEREST = 'DAILY_INTEREST',
	REGULAR_SPEND = 'REGULAR_SPEND',
}
export enum DocumentType {
	PASSPORT = 'passport',
	NIN = 'nin',
	DRIVERS = 'drivers',
	VOTERS = 'voters',
}

export enum MailType {
	REG_SUCCESS = 'REG_SUCCESS',
	DAILY_INTEREST = 'DAILY_INTEREST',
	STAFF_WALLET_RESET = 'STAFF_WALLET_RESET',
	BUSINESS_WALLET_RESET = 'BUSINESS_WALLET_RESET',
	BUSINESS_WALLET_INTEREST = 'BUSINESS_WALLET_INTEREST',
	BUSINESS_INVOICE = 'BUSINESS_INVOICE',
	TRANSACTION = 'TRANSACTION',
	BOOK_SUCCESS = '',
	BOOK_STATUS_UPDATE = 'BOOK_STATUS_UPDATE',
	BOOK_PAYMENT_SUCCESS = 'BOOK_PAYMENT_SUCCESS',
	BOOK_PAYMENT_FAILED = 'BOOK_PAYMENT_FAILED',
	BOOK_EXPIRED = 'BOOK_EXPIRED',
}

export enum SettingsKey {
	WAKANOW_TOKEN = 'wakanow_token',
	AUTO_BOOKING = 'autobooking',
}

export enum ServerEnv {
	DEV = 'development',
	PROD = 'production',
}

export enum TestValues {
	AMOUNT = 200,
	ACCOUNT_NUMBER = '1100150941',
}

export enum StaffStatus {
	ACTIVE = 'active',
	PENDING = 'pending',
	SUSPENDED = 'suspended',
}

export enum StaffAccountMode {
	SUSPEND = 'suspend',
	DEACTIVATE = 'deactivate',
	RESTORE = 'restore',
}

export enum BusinessVerificationType {
	RC = 'rc',
	TIN = 'tin',
}

export enum InvoiceStatus {
	PAID = 'PAID',
	NOT_PAID = 'NOT_PAID',
}

export enum TransactionType {
	CREDIT = 'credit',
	DEBIT = 'debit',
}

export enum TransactionStatus {
	SUCCESS = 'SUCCESS',
	PENDING = 'PENDING',
	FAILED = 'FAILED',
}

export enum TransactionGateway {
	LUKA = 'LUKA',
	VTPASS = 'VTPASS',
	SEERBIT = 'SEERBIT',
}

export enum CableSubscriptionType {
	CHANGE = 'change',
	RENEW = 'renew',
}

export enum PowerVariationCode {
	PREPAID = 'prepaid',
	POSTPAID = 'postpaid',
}

export enum AirtimeServiceIDs {
	MTN = 'mtn',
	GLO = 'glo',
	AIRTEL = 'airtel',
	ETISALAT = 'etisalat',
}

export enum DataServiceIDs {
	MTN_DATA = 'mtn-data',
	AIRTEL_DATA = 'airtel-data',
	GLO_DATA = 'glo-data',
	ETISALAT_DATA = 'etisalat-data',
	SMILE_NETWORK = 'smile-direct',
	SPECTRANET = 'spectranet',
}

export enum PowerServiceIDs {
	IKEDC = 'ikeja-electric',
	EKEDC = 'eko-electric',
	KEDCO = 'kano-electric',
	PHED = 'portharcourt-electric',
	JED = 'jos-electric',
	IBEDC = 'ibadan-electric',
	KAEDCO = 'kaduna-electric',
	AEDC = 'abuja-electric',
}

export enum CableServiceIDs {
	DSTV = 'dstv',
	GOTV = 'gotv',
	STARTIMES = 'startimes',
}

export enum UitilityType {
	AIRTIME = 'AIRTIME',
	DATA = 'DATA',
	POWER = 'POWER',
	CABLE = 'CABLE',
}

export enum userType {
	ADMIN = 'admin',
	STAFF = 'staff',
	BUSINESS = 'business',
}

export enum StaffRoles {
	REGULAR = 'regular',
}

export type BusinessType = {
	name: string;
	phone: string;
	email: string;
	password: string;
	lukaId: string;
	country: string;
	city: string;
	payday?: number;
	type?: ['registered' | 'non-registered'];
	virtualAccountData: { reference: string; walletName: string; bankName: string; accountNumber: string };
};

export type BusinessLoginType = {
	email: string;
	password: string;
};

export type StaffRegisterType = {
	firstName: string;
	lastName: string;
	otherName?: string;
	email: string;
	password?: string;
	pin?: string;
	phone: string;
	salary: number;
	role: StaffRoles;
	gender: ['male', 'female'];
	status?: StaffStatus;
	businessId: string;
};
