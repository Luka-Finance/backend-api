'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.bulkInsert(
			'admins',
			[
				{
					names: 'Luka Admin',
					email: 'we@luka.finance',
					password: '$2a$15$wY.umc3c9xbwwlsTt5kcFuD7Jm/GIVNYJVS.8zQcYt/B0gNgLRqwC', // 000000
					phone: '+2347067869400',
					role: 'control',
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
