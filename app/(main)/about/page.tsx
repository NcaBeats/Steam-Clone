import Link from "next/link";
import Image from "next/image";
import {
  FoldText,
  Marquee,
  MarqueeContent,
  MarqueeFade,
  MarqueeItem,
  TextType,
} from "@/components/ui";

const cardCls = "font-semibold text-center rounded-lg";

const eyebrowCls =
  "text-xs font-bold uppercase tracking-[0.5px] text-[#8A8A8A]";

const titleCls = "text-5xl font-extrabold tracking-[0.4px] text-[#FAFAFA]";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto py-16 px-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-10">
        <div className="flex flex-col items-center text-center gap-1">
          <TextType
            as="h2"
            text={["For the customer,", "The best experience."]}
            className={`${titleCls} text-8xl`}
            typingSpeed={45}
            pauseDuration={2200}
            startOnVisible
          />
        </div>
      </section>

      {/* What this is */}
      <section className="flex flex-col gap-6">
        <div
          className={`${cardCls} p-6 flex flex-col gap-40 text-center items-center`}
        >
          <FoldText
            text="We are a store specializing in digital PC games. We deliver your code instantly, with no waiting or physical shipping. We work with the largest catalogs on the market to offer you the best prices and the widest selection."
            splitBy="word"
            hinge="top"
            trigger="scroll"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="2rem"
            fontWeight={600}
            color="#8A8A8A"
            className="max-w-2xl"
          />
          <FoldText
            text={`To keep a clean, honest storefront where every title is added by hand and every purchase is straightforward. We prefer a small, curated catalog over filling the shelf with noise.

To become the digital meeting point where any player, regardless of location or budget, can access the world of gaming immediately and securely.`}
            splitBy="word"
            hinge="top"
            trigger="scroll"
            duration={0.65}
            stagger={0.045}
            ease="power3.out"
            perspective={700}
            creaseShading={0.55}
            fontSize="2.25rem"
            fontWeight={400}
            color="#EDEDED"
          />
        </div>
      </section>

      {/* Publisher logos */}
      <section className="flex flex-col gap-6">
        <div className="flex flex-col items-center text-center gap-1">
          <h2 className={titleCls}>We work with the best studios</h2>
          <p className="text-sm text-[#8A8A8A]">
            To offer you 100% original and secure codes.
          </p>
        </div>
        <div className="py-5">
          <Marquee>
            <MarqueeFade side="left" className="from-[#18181C]" />
            <MarqueeContent speed={40} pauseOnHover>
              {[
                "Activision.svg",
                "CD_PROJEKT.png",
                "EA.svg",
                "Konami_4th_logo_1.svg",
                "Rockstar.svg",
                "Ubisoft_logo.svg",
                "Valve_logo.svg",
              ].map((file) => (
                <MarqueeItem
                  key={file}
                  className="mx-20 w-28 h-auto flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-200"
                >
                  <Image
                    src={`/Logos/${file}`}
                    alt={file.replace(/\.[^.]+$/, "").replace(/_/g, " ")}
                    width={348}
                    height={96}
                    className="h-20 w-auto object-contain brightness-0 invert"
                  />
                </MarqueeItem>
              ))}
            </MarqueeContent>
            <MarqueeFade side="right" className="from-[#18181C]" />
          </Marquee>
        </div>
      </section>

      {/* CTA */}
      <section
        className={`${cardCls} p-8 flex flex-col items-center text-center gap-4`}
      >
        <p className={eyebrowCls}>Get started</p>
        <h2 className={titleCls}>Take a look around</h2>
        <FoldText
          text="Browse the catalog, open a game page, and let us know what you think."
          splitBy="line"
          hinge="top"
          trigger="scroll"
          duration={0.65}
          stagger={0.045}
          ease="power3.out"
          perspective={700}
          creaseShading={0.55}
          fontSize="0.875rem"
          fontWeight={400}
          color="#8A8A8A"
          className="max-w-xl"
        />
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/catalog"
            className="bg-[#28282C] hover:bg-[#404044] text-[#FAFAFA] font-semibold px-6 py-2.5 rounded-full transition-colors duration-150 ease-out"
          >
            Browse the catalog
          </Link>
          <Link
            href="/"
            className="bg-[#101014] text-[#EDEDED] border border-[#404044] hover:bg-[#28282C] px-6 py-2.5 font-semibold rounded-full transition-colors duration-150 ease-out"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
