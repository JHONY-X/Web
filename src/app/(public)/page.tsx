import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  HeartPulse,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const pathways = [
  {
    icon: HeartPulse,
    title: "Healthcare professionals",
    description: "Build your professional profile, share your experience, and explore career opportunities.",
    action: "Candidate sign in",
    href: "/login?role=candidate",
    tone: "bg-primary-50 text-primary-800",
  },
  {
    icon: BriefcaseBusiness,
    title: "Healthcare employers",
    description: "Register your organization and find a clearer way to connect with healthcare talent.",
    action: "Register organization",
    href: "/employer/register",
    tone: "bg-accent-50 text-accent-800",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative isolate flex min-h-[620px] items-center overflow-hidden bg-primary-900 sm:min-h-[680px]">
        <Image
          src="/hero-image.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="z-0 object-cover object-center"
        />
        <div className="hero-overlay absolute inset-0 z-10 bg-gradient-to-r from-white/95 via-white/85 to-white/25" />
        <div className="relative z-20 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/90 px-3.5 py-2 text-xs font-semibold tracking-wide text-primary-800 shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent-600" />
              SERVING COMMUNITIES SINCE 2017
            </div>
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Compassionate healthcare, <span className="text-primary-700">right at home.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
              Rohobot Home-Based Health Care Service provides high-quality, comprehensive, and affordable care for chronically ill patients and older adults—delivered by skilled, compassionate, and reliable healthcare professionals.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/employer/register"><Button size="lg" className="w-full gap-2 sm:w-auto">Find healthcare talent <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/login?role=candidate"><Button size="lg" variant="outline" className="w-full border-white bg-white/90 sm:w-auto">Healthcare professional sign in</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-medium text-slate-700">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary-700" /> Quality, trusted care</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-700" /> Proudly serving Ethiopia</span>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="scroll-mt-28 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <article>
            <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent-700">Our story</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Care at home, built on understanding.
            </h2>
            <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
              <p>
                Rohobot Home-Based Health Care Service was established in 2017 to provide high-quality, comprehensive, and affordable home-based healthcare services for chronically ill patients and the elderly. Our services are delivered by skilled, compassionate, and reliable healthcare professionals.
              </p>
              <p>
                Founded by two sisters who faced the same challenge—limited access to legally registered home-based healthcare providers—Rohobot was created to bridge this gap and ensure quality care for those in need.
              </p>
            </div>
          </article>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-2xl border border-primary-100 bg-primary-50 p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-primary-700">Our vision</p>
              <h3 className="mt-3 text-xl font-bold text-slate-950">A better environment for care</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                To create a suitable environment for chronically ill patients and older adults in Ethiopia and across Africa.
              </p>
            </article>
            <article className="rounded-2xl border border-accent-100 bg-accent-50 p-6 sm:p-7">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent-700">Our mission</p>
              <h3 className="mt-3 text-xl font-bold text-slate-950">Quality care with lasting impact</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                To deliver quality healthcare services at home while fostering job opportunities for healthcare professionals through capacity building, innovation, and sustainable practices.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-[#f7faf6] px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase tracking-[0.15em] text-accent-700">Two pathways, one purpose</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">A better starting point for healthcare work.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-base">Whether you are building your career or looking for qualified people, Rohobot gives you a clear place to begin.</p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {pathways.map((pathway) => {
              const Icon = pathway.icon;
              return (
                <article key={pathway.title} className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg sm:p-8">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${pathway.tone}`}><Icon className="h-6 w-6" /></span>
                  <h3 className="mt-5 text-xl font-bold text-slate-900">{pathway.title}</h3>
                  <p className="mt-2 min-h-12 max-w-lg text-sm leading-6 text-slate-600">{pathway.description}</p>
                  <Link href={pathway.href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent-700 transition-colors group-hover:text-accent-800">
                    {pathway.action}<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
