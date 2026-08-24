// Initialize Supabase (requires the Supabase CDN script in your HTML)
const supabaseUrl = 'https://zioiamijgblwxlfevcdr.supabase.co/rest/v1/';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2lhbWlqZ2Jsd3hsZmV2Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjgwNTYsImV4cCI6MjA5MjU0NDA1Nn0.AoTc_GhRLu1GZhF7sH0h2xVhnIcpDVwmBg5PA7zXL-o';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// Check authentication status
async function enforceAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    const currentPage = window.location.pathname.split('/').pop();

    if (!session && currentPage !== 'login.html') {
        window.location.href = 'login.html';
    } else if (session && currentPage === 'login.html') {
        window.location.href = 'index.html';
    }
}

// Run the check immediately on load
enforceAuth();

// Global Logout Function
async function logOut() {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
}