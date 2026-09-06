import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact";

const ContactPage = () => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto py-12 px-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-3">
        <Mail className="size-12 text-[#007AFF]" />
        <h1 className="text-3xl sm:text-4xl font-bold text-[#FAFAFA]">
          Get in touch
        </h1>
        <p className="text-sm sm:text-base text-[#8A8A8A] max-w-xl">
          Have a question, feedback, or just want to say hi? Drop us a message
          and we will get back to you as soon as possible.
        </p>
      </section>

      {/* Form + Info */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Contact info
            </h3>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#007AFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A8A8A]">Email</p>
                <p className="text-sm text-[#FAFAFA]">
                  support@proyectojuegos.cl
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone size={18} className="text-[#007AFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A8A8A]">Phone</p>
                <p className="text-sm text-[#FAFAFA]">+56 9 1234 5678</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-[#007AFF] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A8A8A]">Location</p>
                <p className="text-sm text-[#FAFAFA]">
                  Av. Libertador 1234, Santiago, Chile
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-[#FAFAFA]">
              Business hours
            </h3>
            <p className="text-sm text-[#C0C0C0]">Monday to Friday</p>
            <p className="text-sm text-[#C0C0C0]">9:00 AM - 6:00 PM (CLT)</p>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ContactPage;
