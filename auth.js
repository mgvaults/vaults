// ==========================================
// CONFIGURATION
// ==========================================
const GITHUB_USERNAME = 'mgvaults'; 
const REPOSITORY_NAME = 'vaults';

// Supabase project base URL & Anon API Key
const SUPABASE_URL = 'https://zioiamijgblwxlfevcdr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2lhbWlqZ2Jsd3hsZmV2Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjgwNTYsImV4cCI6MjA5MjU0NDA1Nn0.AoTc_GhRLu1GZhF7sH0h2xVhnIcpDVwmBg5PA7zXL-o';

// Initialize Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Base URL for GitHub Pages deployment
const GITHUB_PAGES_BASE = `https://${GITHUB_USERNAME}.github.io/${REPOSITORY_NAME}`;

// Determine current page state
const currentPath = window.location.pathname;
const isLoginPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === `/${REPOSITORY_NAME}/`;

document.addEventListener('DOMContentLoaded', async () => {
  // Check active session on load
  const { data: { session } } = await supabase.auth.getSession();

  if (isLoginPage) {
    // If user is already logged in, redirect directly to dashboard
    if (session) {
      window.location.href = './dashboard.html';
    }

    // Attach listener to Google button
    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', handleGoogleLogin);
    }
  } else {
    // Protected pages check: bounce back to index if not authenticated
    if (!session) {
      window.location.href = './index.html';
      return;
    }

    // Populate profile details on dashboard
    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('avatar');
    
    if (emailEl) emailEl.textContent = session.user.email;
    if (avatarEl && session.user.user_metadata?.avatar_url) {
      avatarEl.src = session.user.user_metadata.avatar_url;
      avatarEl.style.display = 'block';
    }

    // Attach listener to logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }
});

// Trigger Google OAuth Redirect
async function handleGoogleLogin() {
  // Explicitly return to your GitHub Pages dashboard after authentication
  const redirectTarget = `${GITHUB_PAGES_BASE}/dashboard.html`;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTarget
    }
  });

  if (error) console.error('Sign-in error:', error.message);
}

// Handle Sign Out
async function handleLogout() {
  await supabase.auth.signOut();
  window.location.href = './index.html';
}
