import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { HeroButton } from "../components/ui/hero-button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Palette,
  Eye,
  Zap,
  Users,
  Star,
  Shirt,
  Upload,
  Type,
  Download,
} from "lucide-react";
import heroImage from "../assets/hero-tshirt.jpg";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Eye,
      title: "Live Preview",
      description:
        "See your design in real-time as you create it. No surprises, just perfect results.",
    },
    {
      icon: Palette,
      title: "Advanced Editor",
      description:
        "Professional design tools with layers, effects, and unlimited creativity.",
    },
    {
      icon: Upload,
      title: "Upload Designs",
      description:
        "Bring your own artwork or choose from our premium design library.",
    },
    {
      icon: Type,
      title: "Custom Text",
      description:
        "Add text with custom fonts, colors, and positioning for personal touches.",
    },
    {
      icon: Shirt,
      title: "Multiple Styles",
      description:
        "Choose from various t-shirt styles, colors, and sizes for every need.",
    },
    {
      icon: Download,
      title: "High Quality",
      description:
        "Professional printing with premium materials and lasting durability.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content:
        "Finally, a platform where I can see exactly what my team shirts will look like before ordering. Saved us from costly mistakes!",
      rating: 5,
    },
    {
      name: "Mike Chen",
      role: "Freelance Designer",
      content:
        "The design tools are incredibly powerful yet easy to use. My clients love being able to preview everything in real-time.",
      rating: 5,
    },
    {
      name: "Jessica Williams",
      role: "Event Coordinator",
      content:
        "Perfect for our annual conference t-shirts. The live preview feature made approval from stakeholders a breeze.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 animate-fade-in">
                ✨ Revolutionary T-Shirt Customization
              </Badge>

              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl animate-fade-in">
                Design. Preview. <span className="hero-text">Perfect.</span>
              </h1>

              <p className="mb-8 text-lg text-muted-foreground sm:text-xl animate-fade-in">
                Create stunning custom t-shirts with our advanced design tools
                and see exactly what you'll get with live 3D preview technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center animate-fade-in">
                <HeroButton
                  size="xl"
                  onClick={() => navigate("/designer")}
                  className="animate-pulse-glow"
                >
                  <Palette className="w-5 h-5 mr-2" />
                  Start Designing
                </HeroButton>

                <HeroButton
                  variant="hero-outline"
                  size="xl"
                  onClick={() => navigate("/marketplace")}
                >
                  <Users className="w-5 h-5 mr-2" />
                  Browse Marketplace
                </HeroButton>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative animate-fade-in">
              <div className="relative group">
                <img
                  src={heroImage}
                  alt="Custom T-Shirt Design Preview"
                  className="w-full max-w-lg mx-auto rounded-2xl shadow-glow transition-smooth group-hover:scale-105"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-smooth"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 gradient-primary rounded-full opacity-20 blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-96 h-96 gradient-accent rounded-full opacity-20 blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose TeeCustom?</h2>
            <p className="text-muted-foreground text-lg">
              Experience the future of custom t-shirt design with our innovative
              platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-smooth animate-fade-in border-0 glass-card"
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied customers who've transformed their
              ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="animate-fade-in glass-card border-0">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Create Your Perfect T-Shirt?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join our community of designers, buyers, and sellers. Start
              creating amazing custom t-shirts today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HeroButton
                size="xl"
                onClick={() => navigate("/auth")}
                className="animate-pulse-glow"
              >
                <Zap className="w-5 h-5 mr-2" />
                Get Started Free
              </HeroButton>

              <HeroButton
                variant="hero-outline"
                size="xl"
                onClick={() => navigate("/designer")}
              >
                Try Designer
              </HeroButton>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold hero-text">TeeCustom</span>
            </div>

            <p className="text-muted-foreground text-sm">
              © 2025 TeeCustom. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
