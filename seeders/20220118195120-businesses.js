'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'businesses',
			[
				{
					name: 'Luka Finance',
					email: 'test@test.com',
					phone: '+2347067869400',
					country: 'Nigeria',
					city: 'Ibadan',
					payday: 27,
					type: 'registered',
					password: '123456',
					commissionId: 1,
					lukaId: 1,
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
