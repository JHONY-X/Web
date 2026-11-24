import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/rohobothomebasedhelthcare",
    text: "f",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/netsanet-degu-429755366",
    text: "in",
  },
];

export function PublicFooter() {
  return (
    <footer className="brand-ribbon mt-auto text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-lg font-bold">
              <span className="flex h-11 w-12 items-center justify-center rounded-lg bg-white p-0.5">
                <Image src="/rohobot-logo.png" alt="" width={546} height={457} className="h-full w-full object-contain" />
              </span>
              Rohobot Healthcare Center
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/90">
              Compassionate home-based healthcare, professional development, and job-matching support for communities across Ethiopia.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(({ label, href, text }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Rohobot on ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:bg-white hover:text-primary-800"
                >
                  <span aria-hidden="true" className="font-bold">{text}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Explore</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-white/90">
              <li><Link href="/#about" className="hover:text-white hover:underline">About Rohobot</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-white hover:underline">Our services</Link></li>
              <li><Link href="/candidate/career" className="hover:text-white hover:underline">Career development</Link></li>
              <li><Link href="/employer/register" className="hover:text-white hover:underline">For employers</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold">Account &amp; contact</h2>
            <ul className="mt-3 space-y-2.5 text-sm text-white/90">
              <li><Link href="/login" className="hover:text-white hover:underline">Sign in</Link></li>
              <li><Link href="/privacy" className="hover:text-white hover:underline">Privacy &amp; data protection</Link></li>
              <li>
                <a href="mailto:nebi_deke@yahoo.com" className="inline-flex items-center gap-2 hover:text-white hover:underline">
                  <Mail className="h-4 w-4" /> nebi_deke@yahoo.com
                </a>
              </li>
              <li>
                <a href="tel:+251912011617" className="inline-flex items-center gap-2 hover:text-white hover:underline">
                  <Phone className="h-4 w-4" /> +251 912 011617
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-white/30 pt-5 text-xs text-white/85 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Rohobot Healthcare Center. All rights reserved.</p>
          <p>Addis Ababa, Ethiopia</p>
        </div>
      </div>
    </footer>
  );
}
