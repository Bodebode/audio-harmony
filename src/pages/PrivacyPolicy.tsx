import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return <main className="min-h-screen bg-background text-foreground px-6 py-12">
    <article className="mx-auto max-w-3xl space-y-8">
      <h1 className="text-3xl font-semibold">AlkePlay Privacy Policy</h1>
      <p className="text-muted-foreground">Last updated: November 12, 2026</p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Information collected</h2>
        <p>When you create an account, AlkePlay stores your email address, account ID, and display name with Supabase. If you upload a profile photo, it is stored in a publicly accessible avatar bucket. Guest listening does not require an account.</p>
        <p>Liked songs are saved locally on your device. Audio requests and sign-in requests are processed by our hosting providers and Supabase. Their operational logs can include IP addresses, request times, and technical error information. AlkePlay does not currently send listening history to a dedicated analytics service.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Purposes and service providers</h2>
        <p>Account information is used to authenticate you, display your profile, and provide the music service. Request logs support service delivery, security, and troubleshooting. Supabase and our hosting providers process information to provide these services.</p>
        <p>The Android app has no Premium checkout or Stripe/PayPal purchase links. On the website only, Stripe and PayPal process payments; AlkePlay may store subscription identifiers and statuses and supporter names, emails, messages, and transaction references. AlkePlay does not store payment card numbers.</p>
        <p>Uploaded avatars are publicly accessible to anyone with their link. Payment providers handle their own records under their privacy policies.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Security and retention</h2>
        <p>Connections to our hosted services use HTTPS, and account data access is restricted to the signed-in user. We retain your account and profile while your account exists. Operational logs, backups, and payment-provider records may remain according to the respective provider’s retention and legal requirements.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Account deletion and your choices</h2>
        <p>Delete your account in Profile Settings → Delete Account, or use our <Link className="text-primary underline" to="/delete-account">account deletion page</Link>. You must sign in to verify ownership. Successful deletion permanently removes your login, profile, uploaded avatar, and payment/support records stored by AlkePlay. Saved likes on the current device are cleared. Clear app or browser data on other devices to remove their locally stored likes.</p>
        <p>Deleting an account does not cancel an existing website subscription. Cancel billing separately with Stripe or PayPal before deleting. Those providers may retain transaction records as required by law.</p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>For privacy questions, use the contact links in the <Link to="/#contact" className="text-primary underline">artist contact section</Link>.</p>
      </section>
      <Link to="/" className="inline-block text-primary underline">Back to AlkePlay</Link>
    </article>
  </main>;
}