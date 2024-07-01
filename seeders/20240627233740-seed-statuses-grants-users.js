'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert into Statuses
    await queryInterface.bulkInsert(
      'Statuses',
      [
        { id: 1, status: 'Accepted' },
        { id: 2, status: 'Rejected' },
        { id: 3, status: 'Applied' },
        { id: 4, status: 'Hidden' },
      ],
      {},
    );

    // Insert into Grants
    await queryInterface.bulkInsert(
      'Grants',
      [
        {
          foundationName: 'Robinson Foundation',
          grantName: 'Robinson Foundation Grant',
          averageAmount: 25,
          deadline: 'January 10',
          location: 'Washington',
          area: ['Public Health Women', 'Culture Food'],
          isActive: true,
          creationDate: new Date(),
          updatedOn: new Date(),
          deletionDate: null,
        },
        {
          foundationName: 'Looking Out Foundation',
          grantName: 'Looking Out',
          averageAmount: 100,
          deadline: 'February 1st',
          location: 'London',
          area: ['Public Health Women', 'Culture Food', 'Culture Food'],
          isActive: true,
          creationDate: new Date(),
          updatedOn: new Date(),
          deletionDate: null,
        },
        {
          foundationName: 'Dribble Foundation',
          grantName: 'Dribble Foundation Grant',
          averageAmount: 75,
          deadline: 'March 1st',
          location: 'Italy',
          area: ['Environment Art', 'Medical Assistance'],
          isActive: true,
          creationDate: new Date(),
          updatedOn: new Date(),
          deletionDate: null,
        },
        {
          foundationName: 'Walki Foundation',
          grantName: 'Walki wako Foundation Grant',
          averageAmount: 130,
          deadline: 'September 1st',
          location: 'New York',
          area: ['Veterans` Issues', 'Religion & Spiritual Endeavors'],
          isActive: true,
          creationDate: new Date(),
          updatedOn: new Date(),
          deletionDate: null,
        },
      ],
      {},
    );

    // Insert into Users
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'Alex',
          creationDate: new Date(),
          updatedOn: new Date(),
          deletionDate: null,
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Revert seed
    await queryInterface.bulkDelete('Statuses', null, {});
    await queryInterface.bulkDelete('Grants', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  },
};
