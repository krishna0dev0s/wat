import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FAQSection } from "@/components/faq-section";
import { faqs } from "@/data/faqs";
import { features } from "@/data/features";
import { howItWorks } from "@/data/howItWorks";
import { testimonial } from "@/data/testimonial";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MarketingHome() {
  return (
    <div className="w-full py-10 md:py-20">
      {/* Feature Cards Section */}
      <section className="w-full py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12 text-foreground">
            These features will blow your mind...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-2 border-muted hover:border-primary hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out rounded-xl p-6"
              >
                <CardContent className="text-center flex flex-col items-center">
                  <div className="flex flex-col items-center justify-center gap-4 w-full">
                    {feature.icon}
                    <h3 className="text-2xl font-semibold tracking-tight mb-2 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-base leading-relaxed tracking-normal text-center">
                      {feature.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-10 md:py-20">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {[
              { stat: "50+", label: "Industries Covered" },
              { stat: "1000+", label: "Interview Questions" },
              { stat: "95%", label: "Success Rate" },
              { stat: "24/7", label: "AI Support" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center text-center space-y-4 rounded-xl p-6 border border-muted hover:border-primary hover:shadow-lg transition-all duration-300 ease-in-out"
              >
                <h3 className="text-5xl font-extrabold text-foreground tracking-tight">
                  {item.stat}
                </h3>
                <p className="text-muted-foreground text-base leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full py-12 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
              How Watshibo Stands Out
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Four simple steps to get started with Watshibo and accelerate your career growth.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col items-center text-center space-y-5 p-6 rounded-xl border border-border shadow-md hover:shadow-lg transition-all duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-primary text-2xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg md:text-xl tracking-tight">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-snug">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
              What our users say
            </h2>
            <p className="text-muted-foreground mt-3">
              Real feedback from professionals who accelerated their career with Watshibo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonial.map((t, i) => (
              <article
                key={i}
                className="border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow duration-200"
                aria-labelledby={`testimonial-title-${i}`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={t.image}
                      alt={t.author ?? "User avatar"}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3
                      id={`testimonial-title-${i}`}
                      className="text-sm font-semibold text-foreground truncate"
                    >
                      {t.author}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate">{t.role}</p>
                  </div>

                  <div className="flex items-center gap-1" aria-hidden>
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <svg
                        key={idx}
                        className={`w-4 h-4 ${idx < (t.rating ?? 5) ? "text-yellow-400" : "text-muted-foreground"}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.375 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.997 2.404c-.785.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.011 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69L9.05 2.927z" />
                      </svg>
                    ))}
                  </div>
                </div>

                <blockquote className="text-sm text-muted-foreground leading-relaxed">"{t.quote}"</blockquote>

                <footer className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                  <span>{t.date ?? ""}</span>
                  <span className="text-xs text-primary font-medium">Verified</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-4 text-foreground">
              Frequently asked questions
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Got questions? We&apos;ve got answers. Explore our frequently asked questions to learn more.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FAQSection faqs={faqs} />
          </div>
        </div>
      </section>
      <section className="w-full ">
        <div className=" mx-auto py-24 gradient rounded-lg>">
          <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto px-4">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground text-base md:text-lg leading-relaxed">
              Join thousands of professionals who have transformed their careers with Watshibo a AI powered Interview companion.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg" variant='secondary'>
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}