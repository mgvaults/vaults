// ==========================================
// CONFIGURATION
// ==========================================
const GITHUB_USERNAME = 'mgvaults'; 
const REPOSITORY_NAME = 'vaults';

const SUPABASE_URL = 'https://zioiamijgblwxlfevcdr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inppb2lhbWlqZ2Jsd3hsZmV2Y2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NjgwNTYsImV4cCI6MjA5MjU0NDA1Nn0.AoTc_GhRLu1GZhF7sH0h2xVhnIcpDVwmBg5PA7zXL-o';

// Initialize Supabase Client with explicitly enabled local storage persistence
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

const GITHUB_PAGES_BASE = `https://${GITHUB_USERNAME}.github.io/${REPOSITORY_NAME}`;

document.addEventListener('DOMContentLoaded', async () => {
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('index.html') || currentPath.endsWith('/') || currentPath === `/${REPOSITORY_NAME}/`;

  // Check current auth status
  const { data: { session } } = await supabaseClient.auth.getSession();

  if (isLoginPage) {
    if (session) {
      window.location.href = './dashboard.html';
      return;
    }

    const googleBtn = document.getElementById('google-login-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', handleGoogleLogin);
    }
  } else {
    if (!session) {
      window.location.href = './index.html';
      return;
    }

    const emailEl = document.getElementById('user-email');
    const avatarEl = document.getElementById('avatar');
    
    if (emailEl) emailEl.textContent = session.user.email;
    if (avatarEl && session.user.user_metadata?.avatar_url) {
      avatarEl.src = session.user.user_metadata.avatar_url;
      avatarEl.style.display = 'block';
    }

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }
});

// Exposed OAuth Handler
async function handleGoogleLogin() {
  console.log('Initiating Google OAuth flow...');
  const redirectTarget = `${GITHUB_PAGES_BASE}/dashboard.html`;

  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectTarget
    }
  });

  if (error) {
    console.error('Sign-in error:', error.message);
    alert('Login error: ' + error.message);
  }
}

// Exposed Sign Out Handler
async function handleLogout() {
  await supabaseClient.auth.signOut();
  window.location.href = './index.html';
}
