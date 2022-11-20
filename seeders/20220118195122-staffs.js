'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'staffs',
			[
				{
					firstName: 'Emmaneul',
					lastName: 'Adelugba',
					otherName: 'Kayode',
					email: 'adelugba.emma@gmail.com',
					password: '',
					pin: '',
					phone: '+2347067869400',
					salary: 100000,
					role: 'manager',
					gender: 'male',
					status: 'active',
					verifiedAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
					businessId: 1,
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
