'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'kycs',
			[
				{
					rc: '1234567',
					tin: '1234567',
					documents: JSON.stringify([
						{ name: 'cac', file: 'https://file.com/cac.pdf' },
						{ name: 'moa', file: 'https://file.com/moa.pdf' },
					]),
					meta: null,
					businessId: 1,
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
