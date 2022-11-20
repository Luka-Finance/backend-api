'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'businessWallets',
			[
				{
					account: JSON.stringify({
						name: 'Luka Finance',
						number: '0011223344',
						bank: 'Providus Bank',
					}),
					balance: 0,
					status: 'active',
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			],
			{}
		);
	},

	down: async (queryInterface, Sequelize) => {
		/**
		 * Add commands to revert seed here.
		 *
		 * Example:
		 * await queryInterface.bulkDelete('People', null, {});
		 */
	},
};
