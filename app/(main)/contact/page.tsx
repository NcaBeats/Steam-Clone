import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact";

const cardCls = "bg-[#202024] border border-white/[0.06] rounded-lg";

const eyebrowCls =
  "text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]";

const titleCls = "text-xl font-bold tracking-[0.4px] text-[#FAFAFA]";

const ContactPage = () => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto py-16 px-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-3">
        <Mail className="size-10 text-[#8A8A8A]" />
        <p className={eyebrowCls}>Contact us</p>
        <h1 className={titleCls}>Get in touch</h1>
        <p className="text-sm text-[#8A8A8A] max-w-xl leading-relaxed">
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
          <div className={`${cardCls} p-5 flex flex-col gap-3`}>
            <h3 className="text-base font-bold tracking-[0.32px] text-[#FAFAFA]">
              Contact info
            </h3>
            <div className="flex items-start gap-3">
              <Mail size={18} className="text-[#8A8A8A] shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#8A8A8A]">Email</p>
                <p className="text-sm text-[#FAFAFA]">mbrsupport@gmail.com</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ContactPage;
