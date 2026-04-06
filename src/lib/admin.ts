// Admin configuration
// Add emails of users who should have admin access
const ADMIN_EMAILS = [
  'thisisdarkstar@duck.com',
  'demo21437@gmail.com'
];

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map(e => e.toLowerCase()).includes(email.toLowerCase());
}
