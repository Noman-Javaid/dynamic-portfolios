import { getProfile } from "@server/lib/queries";
import { updateProfile } from "@server/actions/content";
import { ActionForm, Full } from "@/app/admin/_components/action-form";
import { Field, Area } from "@/app/admin/_components/fields";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-950">
          Profile
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          The person shown across every portfolio.
        </p>
      </header>

      <ActionForm action={updateProfile} submitLabel="Save profile">
        <Field label="Name" name="name" required defaultValue={profile?.name} />
        <Field label="Title" name="title" required defaultValue={profile?.title} />
        <Full>
          <Area label="Tagline" name="tagline" rows={2} defaultValue={profile?.tagline} />
        </Full>
        <Full>
          <Area label="Intro" name="intro" rows={3} defaultValue={profile?.intro} />
        </Full>
        <Field label="Email" name="email" type="email" defaultValue={profile?.email} />
        <Field label="Location" name="location" defaultValue={profile?.location} />
        <Field label="GitHub URL" name="github" defaultValue={profile?.github} />
        <Field
          label="GitHub label"
          name="github_label"
          defaultValue={profile?.githubLabel}
        />
        <Field label="LinkedIn URL" name="linkedin" defaultValue={profile?.linkedin} />
        <Field
          label="LinkedIn label"
          name="linkedin_label"
          defaultValue={profile?.linkedinLabel}
        />
        <Field
          label="Availability"
          name="availability"
          defaultValue={profile?.availability}
        />
        <Field label="Education" name="education" defaultValue={profile?.education} />
        <Full>
          <Area
            label="Certifications"
            name="certifications"
            rows={3}
            hint="One per line."
            defaultValue={profile?.certifications.join("\n")}
          />
        </Full>
      </ActionForm>
    </div>
  );
}
