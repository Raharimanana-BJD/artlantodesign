import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export interface LeadEmailRow {
  label: string;
  value: string;
}

export interface LeadEmailProps {
  heading: string;
  preview: string;
  rows: LeadEmailRow[];
}

export function LeadEmail({ heading, preview, rows }: LeadEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={brand}>Art Lanto Design</Text>
          <Heading style={h1}>{heading}</Heading>
          <Hr style={hr} />
          {rows.map((row) => (
            <Section key={row.label} style={rowStyle}>
              <Text style={label}>{row.label}</Text>
              <Text style={value}>{row.value}</Text>
            </Section>
          ))}
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#efeae2",
  fontFamily: "Helvetica, Arial, sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "32px",
  borderRadius: "8px",
};

const brand = {
  fontSize: "12px",
  letterSpacing: "0.08em",
  textTransform: "uppercase" as const,
  color: "#6e6258",
  margin: "0 0 8px",
};

const h1 = {
  fontSize: "22px",
  color: "#2a1f18",
  margin: "0 0 20px",
};

const hr = {
  borderColor: "#e4ddd2",
  margin: "0 0 20px",
};

const rowStyle = {
  marginBottom: "14px",
};

const label = {
  fontSize: "11px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  color: "#8f846f",
  margin: "0 0 2px",
};

const value = {
  fontSize: "15px",
  color: "#2a1f18",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

export default LeadEmail;
