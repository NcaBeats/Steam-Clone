import { Mail } from "lucide-react";
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
              Our channels
            </h3>
            <div className="flex items-start gap-3">
              <svg
                role="img"
                height={24}
                width={24}
                fill="#ffffff"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Gmail</title>
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
              </svg>
              <div>
                <p className="text-xs text-[#8A8A8A]">Email</p>
                <p className="text-sm text-[#FAFAFA]">mbrsupport@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                role="img"
                height={24}
                width={24}
                fill="#ffffff"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>X</title>
                <path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" />
              </svg>
              <div>
                <p className="text-xs text-[#8A8A8A]">X/Twitter</p>
                <p className="text-sm text-[#FAFAFA]">@mbr</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <svg
                role="img"
                height={24}
                width={24}
                fill="#ffffff"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>YouTube</title>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <div>
                <p className="text-xs text-[#8A8A8A]">YouTube</p>
                <p className="text-sm text-[#FAFAFA]">@mbrofficial</p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ContactPage;
