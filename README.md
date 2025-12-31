# MindMath - Mental Math Trainer

A web-based mental math training app inspired by MonkeyType, built with Next.js. Practice addition, subtraction, and multiplication with timed sessions and track your progress over time.

## Features

- **Multiple Math Modes**: Addition, Subtraction, Multiplication, and Mixed
- **Three Difficulty Levels**: Easy, Medium, and Hard
- **Timed Sessions**: 15, 30, or 60 second tests
- **Real-time Feedback**: Instant visual feedback on answers
- **Performance Tracking**: Accuracy and problems-per-minute (PPM) metrics
- **Session History**: Track progress with graphs and statistics
- **Google Authentication**: Sign in to save your sessions
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and authentication
- **Recharts** - Data visualization

## Quick Start

1. **Clone and install**
   ```bash
   git clone <your-repo-url>
   cd mental-math-trainer/web
   npm install
   ```

2. **Set up Supabase**
   - Create a project at [supabase.com](https://supabase.com)
   - Create the `sessions` table:
   ```sql
   create table sessions (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade,
     mode text not null,
     difficulty text not null,
     duration integer not null,
     correct integer not null,
     total integer not null,
     accuracy numeric(5,2) not null,
     ppm numeric(6,2) not null,
     skipped boolean default false,
     created_at timestamp with time zone default now()
   );

   alter table sessions enable row level security;

   create policy "Users can view their own sessions"
     on sessions for select
     using (auth.uid() = user_id);

   create policy "Users can insert their own sessions"
     on sessions for insert
     with check (auth.uid() = user_id);
   ```
   - Enable Google OAuth in Authentication settings

3. **Configure environment**
   
   Create `.env.local` in the `web/` directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## How to Use

1. Select your preferences (mode, difficulty, duration)
2. Press `Enter` or `Space` to start
3. Type answers (auto-submits when complete)
4. View results and track your progress over time

**Keyboard Shortcuts:**
- `Tab` - Skip problem
- `F` - Finish test early
- `Esc` - Exit to menu

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── lib/              # Core logic and utilities
│   │   │   ├── db/           # Database operations
│   │   │   ├── supabase/     # Supabase clients
│   │   │   └── ...           # Problem generation, types
│   │   └── auth/             # OAuth callback
│   └── components/           # React components
│       ├── GameContainer.tsx # Main game logic
│       ├── SessionHistory.tsx # History with graphs
│       └── ...               # UI components
```

## Design

Minimalist dark theme inspired by MonkeyType with:
- Clean typography
- Color-coded feedback (green/yellow/red)
- Smooth animations
- Keyboard-first navigation

## Notes

This is a student project created to learn:
- Full-stack web development with Next.js
- Authentication and database integration
- Real-time data visualization
- Responsive design principles

## Credits

- Inspired by [MonkeyType](https://monkeytype.com/)
- Built with [Next.js](https://nextjs.org/), [Supabase](https://supabase.com/), and [Tailwind CSS](https://tailwindcss.com/)
