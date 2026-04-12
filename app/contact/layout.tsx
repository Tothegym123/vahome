import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact the VaHome Team | Hampton Roads Real Estate",
  description:
    "Get in touch with the VaHome Team for buying, selling, or questions about Hampton Roads real estate. Call (757) 777-7577 or send us a message.",
  openGraph: {
    title: "Contact the VaHome Team | Hampton Roads Real Estate",
    description:
      "Get in touch with the VaHome Team for buying, selling, or questions about Hampton Roads real estate.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
