import Link from "next/link";
import { Gamepad2, Sparkles, Users, Target, Heart, Zap } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="flex flex-col gap-16 w-full max-w-5xl mx-auto py-12 px-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-4">
        <Gamepad2 className="size-16 text-[#007AFF]" />
        <h1 className="text-4xl sm:text-5xl font-bold text-[#FAFAFA]">
          About Us
        </h1>
        <p className="text-base sm:text-lg text-[#8A8A8A] max-w-2xl">
          We are a passionate team of gamers building the best place to
          discover, buy, and play your favorite games.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-3">
          <Target className="size-8 text-[#A1CD44]" />
          <h2 className="text-2xl font-bold text-[#FAFAFA]">Our Mission</h2>
          <p className="text-sm text-[#C0C0C0] leading-relaxed">
            To connect gamers with the best titles at fair prices, while
            supporting developers and fostering a community where everyone can
            find their next favorite game.
          </p>
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6 flex flex-col gap-3">
          <Sparkles className="size-8 text-[#007AFF]" />
          <h2 className="text-2xl font-bold text-[#FAFAFA]">Our Vision</h2>
          <p className="text-sm text-[#C0C0C0] leading-relaxed">
            To become the go-to platform for game discovery worldwide, where
            every player can find, buy, and enjoy games seamlessly across any
            device.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Gamepad2, label: "Games", value: "500+" },
          { icon: Users, label: "Users", value: "10K+" },
          { icon: Heart, label: "Reviews", value: "25K+" },
          { icon: Zap, label: "Countries", value: "50+" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-4 flex flex-col items-center gap-1 text-center"
            >
              <Icon className="size-6 text-[#007AFF]" />
              <p className="text-2xl font-bold text-[#FAFAFA]">{stat.value}</p>
              <p className="text-xs text-[#8A8A8A] uppercase tracking-wide">
                {stat.label}
              </p>
            </div>
          );
        })}
      </section>

      {/* Values */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA] text-center">
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Community First",
              description:
                "Gamers are at the heart of everything we do. We listen, adapt, and grow with our community.",
            },
            {
              title: "Fair Pricing",
              description:
                "Transparent deals, frequent discounts, and no hidden fees. Just great games at honest prices.",
            },
            {
              title: "Developer Support",
              description:
                "We work closely with studios of all sizes to make sure great games get the audience they deserve.",
            },
          ].map((value) => (
            <div
              key={value.title}
              className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-5 flex flex-col gap-2"
            >
              <h3 className="text-lg font-semibold text-[#FAFAFA]">
                {value.title}
              </h3>
              <p className="text-sm text-[#C0C0C0] leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-8 flex flex-col items-center text-center gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#FAFAFA]">
          Ready to start playing?
        </h2>
        <p className="text-sm sm:text-base text-[#8A8A8A] max-w-xl">
          Browse our catalog of hundreds of games and find your next favorite.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          <Link
            href="/catalog"
            className="bg-[#007AFF] hover:bg-[#1ea4ff] active:bg-[#1ea4ff] text-white font-semibold px-6 py-2.5 rounded-md transition-colors duration-150 ease-out"
          >
            Browse the catalog
          </Link>
          <Link
            href="/"
            className="bg-[#0A0A0A] text-[#EDEDED] border border-[#2E2E2E] hover:bg-[#2E2E2E] px-6 py-2.5 font-semibold rounded-md transition-colors duration-150 ease-out"
          >
            Back to home
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
