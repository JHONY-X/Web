import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  HeartPulse,
  MapPin,
  ShieldCheck,
  UsersRound,
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
      <section className="relative overflow-hidden bg-[#f7faf6]">
        <div className="pointer-events-none absolute -right-36 -top-32 h-[28rem] w-[28rem] rounded-full bg-accent-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary-100/80 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16 lg:px-8 lg:py-24">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-2 text-xs font-semibold tracking-wide text-primary-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-accent-600" />
              HEALTHCARE CAREERS &amp; ORGANIZATION SUPPORT
            </div>
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
              Better connections for <span className="text-primary-700">healthcare</span> and care.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              Rohobot brings healthcare professionals and organizations together through profile review, recruitment tools, and career support.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/employer/register"><Button size="lg" className="w-full gap-2 sm:w-auto">Find healthcare talent <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link href="/login?role=candidate"><Button size="lg" variant="outline" className="w-full bg-white sm:w-auto">Candidate sign in</Button></Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary-700" /> Profile review workflow</span>
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-700" /> Built for Ethiopia</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-4 -top-5 h-24 w-24 rounded-3xl bg-accent-100 sm:-right-6 sm:-top-6" />
            <div className="absolute -bottom-5 -left-5 h-28 w-28 rounded-full bg-primary-100" />
            <div className="relative rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_24px_70px_-35px_rgba(25,55,40,0.35)] sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary-700">One connected platform</p>
                  <h2 className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">Designed around care teams</h2>
                </div>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50 text-accent-700"><HeartPulse className="h-6 w-6" /></span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#fbfcfa] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-800"><UsersRound className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">Professional profiles</p>
                    <p className="mt-1 text-sm text-slate-500">Experience, qualifications, and career details</p>
                  </div>
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                </div>
                <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-[#fbfcfa] p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-100 text-accent-800"><BriefcaseBusiness className="h-5 w-5" /></span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900">Organization tools</p>
                    <p className="mt-1 text-sm text-slate-500">Recruitment workflows for healthcare employers</p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-accent-600" />
                </div>
                <div className="flex items-center gap-4 rounded-2xl bg-primary-900 p-4 text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10"><ClipboardCheck className="h-5 w-5" /></span>
                  <div>
                    <p className="font-semibold">People-first process</p>
                    <p className="mt-1 text-sm text-primary-100">Support for both sides of healthcare hiring</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-slate-400">A preview of Rohobot&apos;s professional workflow</p>
            </div>
          </div>
        </div>
      </section>

      <section role="note" className="border-y border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm leading-6 text-amber-900">
        Local demo preview. Email, identity verification, payments, and records are not connected to production services. Please do not submit real sensitive information.
      </section>

      <section id="how-it-works" className="scroll-mt-28 bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
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

      <section className="bg-primary-900 px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary-200">Start with Rohobot</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Let&apos;s make healthcare connections count.</h2>
            <p className="mt-3 text-sm leading-6 text-primary-100 sm:text-base">Choose the path that fits you and take the next step.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/login?role=candidate"><Button size="lg" className="w-full bg-white text-primary-900 hover:bg-primary-50 sm:w-auto">Candidate sign in</Button></Link>
            <Link href="/employer/register"><Button size="lg" className="w-full sm:w-auto">For employers</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
