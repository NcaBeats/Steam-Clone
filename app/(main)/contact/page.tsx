import { ContactForm } from "@/components/contact";

const titleCls =
  "text-4xl md:text-6xl font-bold tracking-[0.4px] text-[#FAFAFA]";

const ContactPage = () => {
  return (
    <div className="flex flex-col gap-12 w-full max-w-5xl mx-auto py-16 px-4">
      <section className="flex flex-col items-center text-center gap-3">
        <h1 className={titleCls}>Get in touch</h1>
        <p className="text-sm text-[#8A8A8A] max-w-xl leading-relaxed">
          Have a question, feedback, or just want to say hi? Drop us a message
          and we will get back to you as soon as possible.
        </p>
      </section>
      <div className=" w-full flex justify-center">
        <ContactForm />
      </div>
    </div>
  );
};

export default ContactPage;
