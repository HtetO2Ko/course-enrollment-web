import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: Phone,
    title: "Phone Number",
    value: "+959 44 36 7878 6",
    href: "tel:+959443678786",
  },
  {
    icon: Mail,
    title: "Email Address",
    value: "hteto2ko.dev@gmail.com",
    href: "mailto:hteto2ko.dev@gmail.com",
  },
  {
    icon: MapPin,
    title: "Our Address",
    value: "76th St, Corner of 36A St, Mandalay, Myanmar",
    href: "https://maps.app.goo.gl/4t3eCc1JcSUaVX7r6",
  },
];

export default function Contact() {
  return (
    <section className="py-12 font-roboto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-maincolor">Get in Touch</h1>
        <p className="mt-3 text-unselected-color">
          Have questions? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Map */}
        <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm">
          <iframe
            title="Our Location"
            src="https://maps.google.com/maps?q=21.966896,96.089840&z=16&output=embed"
            className="h-80 w-full lg:h-full lg:min-h-105"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />

          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <h2 className="font-semibold text-maincolor">Find Us Here</h2>
              <p className="mt-1 text-sm text-unselected-color">
                76th St, Corner of 36A St, Mandalay
              </p>
            </div>

            <a
              href="https://maps.app.goo.gl/4t3eCc1JcSUaVX7r6"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open location in Google Maps"
              className="shrink-0 rounded-lg bg-button-color p-3 text-button-txt transition-opacity hover:opacity-90"
            >
              <ExternalLink className="size-5" />
            </a>
          </div>
        </div>

        {/* Contact Information */}
        <div className="flex flex-col justify-center gap-5">
          {CONTACT_INFO.map(({ icon: Icon, title, value, href }) => (
            <a
              key={title}
              href={href}
              target={title === "Our Address" ? "_blank" : undefined}
              rel={title === "Our Address" ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-5 rounded-2xl border border-card-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-button-color/10 text-selected-color transition-colors group-hover:bg-button-color group-hover:text-button-txt">
                <Icon className="size-6" />
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-maincolor">{title}</h3>
                <p className="mt-1 wrap-break-word text-sm text-unselected-color">
                  {value}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
