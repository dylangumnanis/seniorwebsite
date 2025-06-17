# Senior Tech Connect

This is a nonprofit platform connecting senior citizens with student volunteers for technology education.

## Features

- User authentication for both senior citizens and student volunteers
- Training hub for student volunteers
- Live webinar integration with Zoom
- Forum for remote communication
- Financial literacy resources
- Scheduling system for sessions
- Progress tracking and certification system
- WordPress headless CMS integration
- Automated GitHub Actions deployment to Bluehost
- Modern Next.js 14 application with TypeScript and Chakra UI

## Deployment Status
✅ GitHub Actions automated deployment configured and ready!

*Last updated: Testing automated deployment system*

## Tech Stack

- Next.js 14
- TypeScript
- Chakra UI
- Prisma (Database ORM)
- NextAuth.js (Authentication)
- TailwindCSS

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/senior_tech_connect"

   # NextAuth
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Zoom API (for webinar integration)
   ZOOM_API_KEY="your-zoom-api-key"
   ZOOM_API_SECRET="your-zoom-api-secret"

   # Email (for notifications)
   SMTP_HOST="smtp.example.com"
   SMTP_PORT="587"
   SMTP_USER="your-smtp-username"
   SMTP_PASSWORD="your-smtp-password"
   SMTP_FROM="noreply@seniortechconnect.com"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app directory
  - `/api` - API routes
  - `/components` - Reusable React components
  - `/dashboard` - Dashboard pages
  - `/seniors` - Senior citizen specific pages
  - `/volunteers` - Volunteer specific pages
  - `/webinars` - Webinar related pages
  - `/forum` - Forum pages
- `/prisma` - Database schema and migrations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration

## Features in Detail

### For Senior Citizens
- Easy-to-use interface designed for accessibility
- Find and connect with student volunteers
- Schedule one-on-one learning sessions
- Access learning resources and tutorials
- Participate in webinars
- Join community discussions

### For Student Volunteers
- Complete training and certification
- Manage volunteer hours
- Schedule sessions with seniors
- Access teaching resources
- Track progress and achievements
- Earn community service hours

### Webinars
- Live interactive sessions
- Recorded sessions for later viewing
- Q&A functionality
- Integration with Zoom

### Forum
- Community discussions
- Topic-based categories
- Private messaging
- Resource sharing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 