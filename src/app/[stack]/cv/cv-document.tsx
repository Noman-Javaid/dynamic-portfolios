import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Stack, Person, ProjectItem } from "@/data/portfolio";
import { arrangeExperience } from "@/lib/experience";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111111",
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", lineHeight: 1.2, marginBottom: 3 },
  role: { fontSize: 12, fontFamily: "Helvetica-Bold", lineHeight: 1.2 },
  contact: { fontSize: 9, color: "#444444", marginTop: 5 },
  h2: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 16,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },
  para: { marginBottom: 4 },
  item: { marginBottom: 9 },
  itemTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: "#444444", marginTop: 1 },
  subLabel: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 4 },
  bulletRow: { flexDirection: "row", marginTop: 3, paddingRight: 6 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
});

type Variant = { label: string; points: string[]; sig: string };
type Group = { name: string; tech: string[]; variants: Variant[] };

function splitName(raw: string): { base: string; suffix: string } {
  const name = raw.trim();
  const parts = name.split(/\s[–—-]{1,2}\s/);
  const base = (parts[0] ?? name).trim();
  const opens = (base.match(/\(/g) ?? []).length;
  const closes = (base.match(/\)/g) ?? []).length;
  if (!base || opens !== closes) return { base: name, suffix: "" };
  const suffix = name.slice(base.length).replace(/^\s*[–—-]{1,2}\s*/, "").trim();
  return { base, suffix };
}

function groupProjects(projects: ProjectItem[]): Group[] {
  const order: string[] = [];
  const map = new Map<string, Group>();
  for (const p of projects) {
    const { base, suffix } = splitName(p.name);
    const key = base.toLowerCase();
    let g = map.get(key);
    if (!g) {
      g = { name: base, tech: [], variants: [] };
      map.set(key, g);
      order.push(key);
    }
    for (const t of p.stack) if (!g.tech.includes(t)) g.tech.push(t);
    const points = p.points.filter(Boolean);
    const sig = `${suffix || p.role || ""}|${points.join("•")}`;
    if (!g.variants.some((v) => v.sig === sig)) {
      g.variants.push({ label: suffix || p.role || "", points, sig });
    }
  }
  return order.map((k) => map.get(k)!);
}

function Bullets({ points }: { points: string[] }) {
  return (
    <>
      {points.map((p, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>{"•"}</Text>
          <Text style={styles.bulletText}>{p}</Text>
        </View>
      ))}
    </>
  );
}

function Section({ title, show, children }: { title: string; show: boolean; children: ReactNode }) {
  if (!show) return null;
  return (
    <View>
      <Text style={styles.h2}>{title}</Text>
      {children}
    </View>
  );
}

function CvDocument({ stack, person }: { stack: Stack; person: Person }) {
  const role = stack.name ? `${stack.name} Engineer` : person.title;
  const contact = [
    person.email,
    person.location,
    person.githubLabel || person.github,
    person.linkedinLabel || person.linkedin,
  ]
    .filter(Boolean)
    .join("   |   ");
  const summary = stack.blurb || person.intro || stack.tagline;
  const tech = stack.tech.filter((t) => t.items.length);
  const experience = arrangeExperience(stack.experience);
  const projects = groupProjects(stack.projects);

  return (
    <Document title={`${person.name} - ${role}`} author={person.name} subject={`${role} CV`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{person.name}</Text>
        <Text style={styles.role}>{role}</Text>
        {!!contact && <Text style={styles.contact}>{contact}</Text>}

        <Section title="Professional Summary" show={!!summary}>
          <Text style={styles.para}>{summary}</Text>
        </Section>

        <Section title="Technical Skills" show={tech.length > 0}>
          {tech.map((t, i) => (
            <Text key={i} style={styles.para}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{t.label}: </Text>
              {t.items.join(", ")}
            </Text>
          ))}
        </Section>

        <Section title="Professional Experience" show={experience.length > 0}>
          {experience.map((e, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>
                {e.company}
                {e.role ? ` — ${e.role}` : ""}
              </Text>
              {!!e.period && <Text style={styles.sub}>{e.period}</Text>}
              <Bullets points={e.points} />
            </View>
          ))}
        </Section>

        <Section title="Projects" show={projects.length > 0}>
          {projects.map((g, i) => (
            <View key={i} style={styles.item}>
              <Text style={styles.itemTitle}>{g.name}</Text>
              {g.tech.length > 0 && <Text style={styles.sub}>Tech: {g.tech.join(", ")}</Text>}
              {g.variants.map((v, j) => (
                <View key={j}>
                  {g.variants.length > 1 && !!v.label && (
                    <Text style={styles.subLabel}>{v.label}</Text>
                  )}
                  <Bullets points={v.points} />
                </View>
              ))}
            </View>
          ))}
        </Section>

        <Section title="Education" show>
          <Text style={styles.para}>Master&apos;s Degree</Text>
        </Section>

        <Section title="Certifications" show={person.certifications.length > 0}>
          <Bullets points={person.certifications} />
        </Section>
      </Page>
    </Document>
  );
}

export function renderCvPdf(stack: Stack, person: Person): Promise<Buffer> {
  return renderToBuffer(<CvDocument stack={stack} person={person} />);
}
