/**
 * Database Seeds Runner
 * Executes all seed files to populate the database
 */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

async function runSeeds() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'airborn',
    entities: ['src/modules/**/*.entity.ts'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected');

    // Clear existing data
    await dataSource.query('DELETE FROM messages');
    await dataSource.query('DELETE FROM leads');
    await dataSource.query('DELETE FROM projects');
    await dataSource.query('DELETE FROM users');
    console.log('✅ Existing data cleared');

    // Seed users
    const users = await seedUsers(dataSource);
    console.log(`✅ Seeded ${users.length} users`);

    // Seed projects
    const projects = await seedProjects(dataSource);
    console.log(`✅ Seeded ${projects.length} projects`);

    // Seed messages
    const messages = await seedMessages(dataSource, users);
    console.log(`✅ Seeded ${messages.length} messages`);

    console.log('\n🎉 All seeds completed successfully!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error running seeds:', error);
    process.exit(1);
  }
}

async function seedUsers(dataSource: DataSource) {
  const bcrypt = require('bcrypt');
  const saltRounds = 10;

  // Create 2 admins
  const admin1Password = await bcrypt.hash('Admin123!', saltRounds);
  const admin2Password = await bcrypt.hash('Admin123!', saltRounds);

  // Create 10 users
  const userPasswords: string[] = [];
  for (let i = 1; i <= 10; i++) {
    userPasswords.push(await bcrypt.hash(`User123!`, saltRounds));
  }

  const users = [
    // Admins
    {
      id: generateUuid(),
      email: 'admin@airborn.com',
      passwordHash: admin1Password,
      name: 'Alexander Admin',
      phone: '+79990000001',
      role: 'admin',
      avatar: null,
      isBlocked: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateUuid(),
      email: 'admin2@airborn.com',
      passwordHash: admin2Password,
      name: 'Maria Administrator',
      phone: '+79990000002',
      role: 'admin',
      avatar: null,
      isBlocked: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    // Users
    ...Array.from({ length: 10 }, (_, i) => ({
      id: generateUuid(),
      email: `user${i + 1}@airborn.com`,
      passwordHash: userPasswords[i],
      name: `User ${i + 1}`,
      phone: `+7999000000${i + 3}`,
      role: 'user' as const,
      avatar: null,
      isBlocked: false,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
  ];

  for (const user of users) {
    await dataSource.query(
      `INSERT INTO users (id, email, "passwordHash", name, phone, role, avatar, "isBlocked", "isDeleted", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      Object.values(user),
    );
  }

  return users;
}

async function seedProjects(dataSource: DataSource) {
  const projects = [
    {
      id: generateUuid(),
      title: 'Modern Office Complex',
      shortDescription: 'A state-of-the-art office building in the heart of the city',
      description: `This impressive office complex features modern architecture, sustainable design, and cutting-edge technology. The building spans 15 floors with a total area of 25,000 square meters.

Key features:
- Energy-efficient glass facade
- Smart building management system
- Underground parking for 500 vehicles
- Green rooftop terrace
- Conference centers and coworking spaces

The project was completed in 2025 and has received multiple architecture awards.`,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800',
      ]),
      files: JSON.stringify([
        { url: '/docs/office-brochure.pdf', name: 'Office Brochure.pdf', size: 2500000, mimeType: 'application/pdf' },
        { url: '/docs/office-specs.pdf', name: 'Technical Specifications.pdf', size: 1800000, mimeType: 'application/pdf' },
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateUuid(),
      title: 'Residential Sky Towers',
      shortDescription: 'Luxury residential complex with panoramic city views',
      description: `Sky Towers is a premium residential development consisting of three 40-story towers. Each apartment features floor-to-ceiling windows with breathtaking views.

Amenities include:
- Infinity pool on the 42nd floor
- Private cinema
- Fitness center and spa
- 24/7 concierge service
- Children's playground

The complex offers 2, 3, and 4-bedroom apartments ranging from 80 to 200 square meters.`,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      ]),
      files: JSON.stringify([
        { url: '/docs/skytowers-floorplan.pdf', name: 'Floor Plans.pdf', size: 3200000, mimeType: 'application/pdf' },
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateUuid(),
      title: 'Tech Innovation Hub',
      shortDescription: 'Modern co-working and innovation space for startups',
      description: `The Tech Innovation Hub is designed to foster creativity and collaboration among startups and tech companies. This 10,000 square meter facility includes:

- Flexible co-working spaces
- Private offices for teams of 5-50 people
- 5 conference rooms with video conferencing
- Event hall for 200 people
- Cafe and relaxation zones
- 24/7 access with biometric security

The hub currently houses over 50 startups and has become a key part of the local tech ecosystem.`,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800',
        'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800',
      ]),
      files: JSON.stringify([
        { url: '/docs/techhub-membership.pdf', name: 'Membership Guide.pdf', size: 1500000, mimeType: 'application/pdf' },
        { url: '/docs/techhub-layout.pdf', name: 'Space Layout.pdf', size: 2100000, mimeType: 'application/pdf' },
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateUuid(),
      title: 'Green Valley Shopping Center',
      shortDescription: 'Eco-friendly shopping mall with sustainable design',
      description: `Green Valley is a revolutionary shopping center that combines retail with environmental responsibility. The 50,000 square meter complex features:

- 150+ retail stores
- Food court with 30 restaurants
- 8-screen cinema complex
- Indoor botanical garden
- Solar panel array (500kW capacity)
- Rainwater harvesting system

The center attracts over 50,000 visitors daily and has achieved LEED Gold certification.`,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1519567241046-7f570eee3d9f?w=800',
        'https://images.unsplash.com/photo-1567449308989-36888f1f78ca?w=800',
        'https://images.unsplash.com/photo-1582298538104-fe2e74c2ed54?w=800',
      ]),
      files: JSON.stringify([
        { url: '/docs/greenvalley-sustainability.pdf', name: 'Sustainability Report.pdf', size: 4500000, mimeType: 'application/pdf' },
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: generateUuid(),
      title: 'Waterfront Marina Resort',
      shortDescription: 'Luxury resort with marina and beach access',
      description: `The Waterfront Marina Resort is a premium destination offering world-class hospitality and leisure facilities. Located on 15 hectares of pristine waterfront, the resort includes:

- 200-room five-star hotel
- 50 luxury villas with private pools
- 200-berth marina
- Championship golf course
- Full-service spa and wellness center
- 5 restaurants and 3 bars
- Private beach club

The resort has won multiple hospitality awards and maintains a 95% occupancy rate.`,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      ]),
      files: JSON.stringify([
        { url: '/docs/marina-brochure.pdf', name: 'Resort Brochure.pdf', size: 5500000, mimeType: 'application/pdf' },
        { url: '/docs/marina-villas.pdf', name: 'Villa Floor Plans.pdf', size: 3800000, mimeType: 'application/pdf' },
      ]),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  for (const project of projects) {
    await dataSource.query(
      `INSERT INTO projects (id, title, "shortDescription", description, images, files, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8)`,
      Object.values(project),
    );
  }

  return projects;
}

async function seedMessages(dataSource: DataSource, users: any[]) {
  const messages: any[] = [];
  const userMessages = [
    'Hello everyone! Welcome to AirBorn chat.',
    'Great to be here! Looking forward to collaborating.',
    'Has anyone checked out the new projects section?',
    'Yes! The designs are amazing. Love the Modern Office Complex.',
    'When is the next team meeting scheduled?',
    'I think it\'s next Monday at 10 AM.',
    'Don\'t forget to update your profiles!',
    'The new WebSocket chat is really fast!',
    'Can someone share the project documentation?',
    'Sure, I\'ll upload it to the files section.',
    'Great work on the last sprint everyone!',
    'Thanks! The collaboration has been excellent.',
    'Is the admin panel ready for testing?',
    'Yes, you can access it with admin credentials.',
    'The mobile responsiveness looks great!',
    'Has anyone tried the file upload feature?',
    'Works perfectly! Uploaded our specs yesterday.',
    'We should schedule a demo for the client.',
    'Agreed. How about Friday afternoon?',
    'Friday works for me. Let\'s prepare the presentation.',
    'The search functionality in chat is very useful.',
    'Indeed! Found an old conversation in seconds.',
    'Are we planning to add more integrations?',
    'Yes, Slack and email notifications are on the roadmap.',
    'The dark mode would be a nice addition.',
    'I\'ll add that to the feature requests.',
    'Great job on the performance optimizations!',
    'Page load times have improved significantly.',
    'The new authentication flow is much smoother.',
    'Security is our top priority. Glad you noticed!',
    'Can we add video calls in the future?',
    'That\'s a great idea for Q2.',
    'The project gallery looks stunning!',
    'High-quality images make all the difference.',
    'How many users do we have registered now?',
    'Over 10 test users and growing!',
    'The lead generation form is working well.',
    'We\'ve already received several inquiries.',
    'Make sure to follow up on all leads promptly.',
    'Customer satisfaction is key to our success.',
    'The API documentation is very comprehensive.',
    'Swagger makes it easy to test endpoints.',
    'Have you tried the rate limiting feature?',
    'Yes, it\'s protecting our endpoints well.',
    'Database migrations are running smoothly.',
    'TypeORM makes it so much easier.',
    'The seed data is really helpful for testing.',
    'Saves a lot of time during development.',
    'Looking forward to the production launch!',
    'We\'re almost there. Just final testing needed.',
  ];

  const now = new Date();
  for (let i = 0; i < 50; i++) {
    const user = users[i % users.length];
    const message = {
      id: generateUuid(),
      content: userMessages[i],
      userId: user.id,
      fileUrl: null,
      fileType: null,
      replyToId: null,
      createdAt: new Date(now.getTime() - (50 - i) * 3600000), // Spread over 50 hours
    };

    await dataSource.query(
      `INSERT INTO messages (id, content, "userId", "fileUrl", "fileType", "replyToId", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      Object.values(message),
    );

    messages.push(message);
  }

  return messages;
}

function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

runSeeds();
