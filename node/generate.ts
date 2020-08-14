import fs from 'fs';
import { resolve } from 'path';

/**
 * Set the amount of mock-users to create
 */
const USERS_AMOUNT = 500;

const profileImages = [
  'https://randomuser.me/api/portraits/med/men/18.jpg',
  'https://randomuser.me/api/portraits/med/men/7.jpg',
  'https://randomuser.me/api/portraits/med/women/48.jpg',
  'https://randomuser.me/api/portraits/med/men/60.jpg',
  'https://randomuser.me/api/portraits/med/men/98.jpg',
  'https://randomuser.me/api/portraits/med/women/46.jpg',
  'https://randomuser.me/api/portraits/med/men/71.jpg',
  'https://randomuser.me/api/portraits/med/men/43.jpg',
  'https://randomuser.me/api/portraits/med/women/43.jpg',
  'https://randomuser.me/api/portraits/med/women/20.jpg',
];

const users = [];

for (let i = 0; i < USERS_AMOUNT; i++) {
  const user = {
    username: `User Userson-${i}`,
    handle: `@user_name_${i}`,
    profileImage: profileImages[Math.floor(Math.random() * profileImages.length)],
  };

  users.push(user);
}

fs.writeFileSync(resolve(__dirname, '../src/mock/users.json'), JSON.stringify(users, null, 2));
