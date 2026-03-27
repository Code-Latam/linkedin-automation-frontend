import Script from 'next/script';

export default function BlogPage() {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTgxYTExMWQ0ZGQ2YmUwYjhlMzk5OTkiLCJjbGllbnRJZCI6eyJyYXRlTGltaXQiOnsicnBtIjoxMjAsImJ1cnN0IjozMH0sImNvbm5lY3RlZEFjY291bnRzIjp7ImxpbmtlZGluIjp7ImF1dGgiOnsibWV0aG9kIjoiY29va2llIiwibGFzdENvb2tpZVJlZnJlc2hBdCI6IjIwMjYtMDMtMjJUMjA6MTQ6NDAuOTI3WiIsInVzZXJBZ2VudCI6Ik1vemlsbGEvNS4wIChXaW5kb3dzIE5UIDEwLjA7IFdpbjY0OyB4NjQpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8xNDYuMC4wLjAgU2FmYXJpLzUzNy4zNiJ9LCJwcm92aWRlciI6ImxpbmtlZGluIiwidW5pcGlsZUFjY291bnRJZCI6Im5ISkwyUzY1U0pHeVZ1OURDTWl4SEEiLCJzdGF0dXMiOiJjb25uZWN0ZWQiLCJsYXN0Q29ubmVjdGVkQXQiOiIyMDI2LTAzLTE1VDEzOjI5OjMzLjMyM1oiLCJsYXN0Q2hlY2tlZEF0IjoiMjAyNi0wMy0yNVQyMDo1MDozMC45NTNaIiwibGFzdEVycm9yIjpudWxsfX0sIl9pZCI6IjY5ODBkZjYwZDRkZDZiZTBiOGUzMDgxYyIsImVtYWlsIjoic3RldmVuK3Rlc3QxQHNhYXNlbnRpYWwudGVjaCIsIm5hbWUiOiJTYWFzZW50aWFsIFRlc3QgQ2xpZW50Iiwic3RhdHVzIjoiYWN0aXZlIiwicGxhbiI6InByZW1pdW0iLCJ0aW1lem9uZSI6IkFtZXJpY2EvQm9nb3RhIiwiYWdlbnRJZHMiOltdLCJhcGlLZXlzIjpbeyJrZXlJZCI6ImtfMDByZGxYdUVYUEFpIiwia2V5SGFzaCI6IiQyYiQxMiRvazlTSE90ck9uUERSSi5mTWxURU1PZHg2V1B3Rjk0NXR6clNmRm0xYjkzWXdSSkxwb0xFQyIsInByZWZpeCI6InpnM1hHU3hiIiwibGFiZWwiOiJEZWZhdWx0Iiwic2NvcGVzIjpbIioiXSwibGFzdFVzZWRBdCI6IjIwMjYtMDItMjdUMjI6MDA6MDIuMTQ1WiIsInJldm9rZWRBdCI6bnVsbCwiY3JlYXRlZEF0IjoiMjAyNi0wMi0wMlQxNzozMToxMi4wMjlaIn1dLCJjcmVhdGVkQXQiOiIyMDI2LTAyLTAyVDE3OjMxOjEyLjAzMloiLCJ1cGRhdGVkQXQiOiIyMDI2LTAzLTI1VDIwOjUwOjMwLjk1NFoiLCJfX3YiOjAsInN0cmlwZUN1c3RvbWVySWQiOiJjdXNfVTllTHNYWTFEbE9kZjkiLCJibG9nIjp7InNlbyI6eyJtZXRhVGl0bGUiOiIiLCJtZXRhRGVzY3JpcHRpb24iOiIiLCJrZXl3b3JkcyI6W119LCJlbmFibGVkIjpmYWxzZSwidGl0bGUiOiJCbG9nIiwibGF5b3V0IjoiZ3JpZCIsInBvc3RzUGVyUGFnZSI6MTAsImN1c3RvbUNTUyI6IiIsImN1c3RvbURvbWFpbiI6IiJ9fSwicm9sZSI6Im93bmVyIiwiaWF0IjoxNzc0NDc1Njk0LCJleHAiOjE3NzUwODA0OTR9.CGROos-sPYRKB4z5EkJeAxEOg0D68bhyC8E6b8l9ye0';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.meetingmaker.tech';
  
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-black mb-8">Blog</h1>
        {/* Simple div where widget will be placed */}
        <div id="meetingmaker-blog" className="bg-white rounded-lg shadow p-6"></div>
        <Script 
          src={`${apiUrl}/widgets/embed.js`}
          data-token={token}
          strategy="afterInteractive"
        />
      </div>
    </div>
  );
}