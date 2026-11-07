import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Building2,
  CalendarDays,
  CreditCard,
  Search,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { employerService } from "@/lib/api/services/employer";
import { interviewService } from "@/lib/api/services/interview";
import { organizationService } from "@/lib/api/services/organization";

export default async function EmployerDashboardPage() {
  const [organization, interviews, candidates] = await Promise.all([
    organizationService.getOrganizationProfile(),
    interviewService.getEmployerInterviews(),
    employerService.searchCandidates({
      query: "",
      category: "",
      location: "",
      minExperience: 0,
      qualification: "",
      availability: "",
      workArrangement: "",
    }),
  ]);
  const savedCount = candidates.filter((candidate) => candidate.isSaved).length;
  const pendingInterviews = interviews.filter(
    (interview) =>
      interview.status === "Pending" ||
      interview.status === "Rescheduling Requested"
  ).length;

  const metrics = [
    { label: "Saved professionals", value: savedCount, icon: Bookmark, href: "/employer/saved", tone: "bg-accent-50 text-accent-700" },
    { label: "Interview activity", value: interviews.length, icon: CalendarDays, href: "/employer/interviews", tone: "bg-primary-50 text-primary-700" },
    { label: "Awaiting response", value: pendingInterviews, icon: ShieldCheck, href: "/employer/interviews", tone: "bg-amber-50 text-amber-700" },
  ];

  return (
    <DashboardLayout role="employer">
      <div className="space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-primary-700">EMPLOYER WORKSPACE</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Welcome, {organization.name}
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Find qualified healthcare professionals and keep recruitment moving.
            </p>
          </div>
          <Link href="/employer/search" className="inline-flex items-center justify-center gap-2 rounded-xl bg-accent-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-700">
            <Search className="h-4 w-4" />
            Search talent
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-2xl border border-primary-100 bg-primary-50 px-5 py-4">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900">
            <Building2 className="h-4 w-4" />
            {organization.status}
          </span>
          <span className="text-sm text-primary-800">{organization.type} · {organization.location}</span>
          <Link href="/employer/profile" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-primary-800 hover:text-primary-900">
            Organization profile <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => (
            <Link key={metric.label} href={metric.href} className="group">
              <Card className="flex h-full items-center gap-4 p-5 transition-shadow group-hover:shadow-md">
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${metric.tone}`}>
                  <metric.icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-2xl font-bold text-slate-900">{metric.value}</span>
                  <span className="text-sm text-slate-600">{metric.label}</span>
                </span>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Your recruitment workspace</h2>
                <p className="mt-1 text-sm text-slate-600">Continue with a common task.</p>
              </div>
              <span className="rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-800">
                {organization.subscriptionTier || "No plan selected"}
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <QuickLink href="/employer/search" icon={Search} title="Find professionals" description="Filter by role, skills, location, and availability." />
              <QuickLink href="/employer/saved" icon={Bookmark} title="Review saved talent" description="Return to your shortlisted candidates." />
              <QuickLink href="/employer/interviews" icon={CalendarDays} title="Manage interviews" description="Track invitations and candidate responses." />
              <QuickLink href="/employer/subscription" icon={CreditCard} title="Subscription & billing" description="Review your current package and transactions." />
            </div>
          </Card>

          <Card className="p-6 sm:p-7">
            <h2 className="text-lg font-bold text-slate-900">Verification & access</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Your organization must be verified before recruitment features can be enabled. Subscription activation must follow confirmed payment or an authorized Rohobot process.
            </p>
            <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Organization status</p>
              <p className="mt-1 font-semibold text-slate-900">{organization.status}</p>
            </div>
            <Link href="/employer/profile" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary-700 hover:text-primary-900">
              Review organization details <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>

        <p className="text-xs text-slate-500">
          This workspace currently uses demonstration service data. Connect the approved backend before using it for live recruitment.
        </p>
      </div>
    </DashboardLayout>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Search;
  title: string;
  description: string;
}) {
  return (
    <Link href={href} className="group rounded-xl border border-slate-200 p-4 transition-colors hover:border-primary-200 hover:bg-primary-50/60">
      <span className="flex items-center gap-2 font-semibold text-slate-900">
        <Icon className="h-4 w-4 text-primary-700" />
        {title}
      </span>
      <span className="mt-1 block text-xs leading-relaxed text-slate-600">{description}</span>
    </Link>
  );
}
