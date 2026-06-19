import type { ReactNode } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Stack, Person } from "@/data/portfolio";

const styles = StyleSheet.create({
  page: {
    paddingVertical: 36,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 10,
    lineHeight: 1.4,
    color: "#111111",
  },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  role: { fontSize: 12, fontFamily: "Helvetica-Bold", marginTop: 2 },
  contact: { fontSize: 9, color: "#444444", marginTop: 4 },
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
  bulletRow: { flexDirection: "row", marginTop: 3, paddingRight: 6 },
  bulletDot: { width: 10 },
  bulletText: { flex: 1 },
});

function Bullets({ points }: { points: string[] }) {
  return (
    <>
      {points.map((p, i) => (
        <View key={i} style={styles.bulletRow} wrap={false}>
          <Text style={styles.bulletDot}>{"•"}</Text>
          <Text style={styles.bulletText}>{p}</Text>
        </View>
      ))}
    </>
  );
}

function Section({
  title,
  show,
  children,
}: {
  title: string;
  show: boolean;
  children: ReactNode;
}) {
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

  return (
    <Document
      title={`${person.name} - ${role}`}
      author={person.name}
      subject={`${role} CV`}
    >
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

        <Section title="Professional Experience" show={stack.experience.length > 0}>
          {stack.experience.map((e, i) => {
            const sub = [e.period, e.location].filter(Boolean).join("   •   ");
            return (
              <View key={i} style={styles.item} wrap={false}>
                <Text style={styles.itemTitle}>
                  {e.company}
                  {e.role ? ` — ${e.role}` : ""}
                </Text>
                {!!sub && <Text style={styles.sub}>{sub}</Text>}
                <Bullets points={e.points} />
              </View>
            );
          })}
        </Section>

        <Section title="Projects" show={stack.projects.length > 0}>
          {stack.projects.map((p, i) => (
            <View key={i} style={styles.item} wrap={false}>
              <Text style={styles.itemTitle}>
                {p.name}
                {p.role ? ` — ${p.role}` : ""}
              </Text>
              {p.stack.length > 0 && (
                <Text style={styles.sub}>Tech: {p.stack.join(", ")}</Text>
              )}
              {!!p.link && <Text style={styles.sub}>{p.link}</Text>}
              <Bullets points={p.points} />
            </View>
          ))}
        </Section>

        <Section title="Education" show={!!person.education}>
          <Text style={styles.para}>{person.education}</Text>
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
