import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Bot, 
  BrainCircuit, 
  Globe2, 
  Image as ImageIcon, 
  Languages, 
  LayoutDashboard, 
  MessageSquareText, 
  Mic, 
  Settings2, 
  Share2, 
  Sparkles,
  Users,
  Wand2
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings2 className="h-6 w-6" />
            <span className="text-xl font-bold">Social AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/settings">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered Social Media Management
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Create, schedule, and manage your social media content with the power of multiple AI platforms. 
            Choose from OpenAI, Google Gemini, Anthropic Claude, and more.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg">
                Try Now
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="outline" className="text-lg">
                Configure AI
                <BrainCircuit className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Platforms Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Supported AI Platforms</h2>
          <p className="text-lg text-muted-foreground">Choose your preferred AI platform or mix and match for optimal results</p>
        </div>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <Wand2 className="h-12 w-12 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">OpenAI</h3>
            <p className="text-muted-foreground">GPT-4 for content and DALL-E for images</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <BrainCircuit className="h-12 w-12 text-purple-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Google Gemini</h3>
            <p className="text-muted-foreground">Advanced AI for text and image generation</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <Bot className="h-12 w-12 text-green-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Anthropic Claude</h3>
            <p className="text-muted-foreground">Sophisticated content generation</p>
          </Card>
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="mb-4 flex justify-center">
              <ImageIcon className="h-12 w-12 text-orange-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Image AI</h3>
            <p className="text-muted-foreground">Leonardo.AI and Runway for visuals</p>
          </Card>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            All-in-One Social Media Solution
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Share2 className="h-8 w-8" />}
              title="Multi-Platform Support"
              description="Manage content for Twitter, Instagram, Facebook, and LinkedIn from a single dashboard."
            />
            <FeatureCard
              icon={<Bot className="h-8 w-8" />}
              title="AI Content Generation"
              description="Generate engaging posts tailored for each platform using your preferred AI model."
            />
            <FeatureCard
              icon={<ImageIcon className="h-8 w-8" />}
              title="Image Generation"
              description="Create stunning visuals with multiple AI-powered image generation tools."
            />
            <FeatureCard
              icon={<MessageSquareText className="h-8 w-8" />}
              title="Blog Writing"
              description="Generate comprehensive blog posts with SEO optimization and engaging content."
            />
            <FeatureCard
              icon={<Languages className="h-8 w-8" />}
              title="Multi-Language Support"
              description="Create content in multiple languages to reach a global audience."
            />
            <FeatureCard
              icon={<Mic className="h-8 w-8" />}
              title="Text to Speech"
              description="Convert your content into natural-sounding speech for audio content."
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Why Choose Social AI?
              </h2>
              <div className="space-y-4">
                <BenefitItem
                  icon={<Globe2 className="h-6 w-6" />}
                  title="AI Platform Flexibility"
                  description="Choose from multiple AI providers or use them together for the best results."
                />
                <BenefitItem
                  icon={<LayoutDashboard className="h-6 w-6" />}
                  title="Unified Dashboard"
                  description="Manage all your social media accounts from a single, intuitive interface."
                />
                <BenefitItem
                  icon={<Users className="h-6 w-6" />}
                  title="Brand Consistency"
                  description="Maintain consistent brand voice and style across all platforms."
                />
              </div>
            </div>
            <div className="lg:pl-12">
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-2">
                <h3 className="text-2xl font-bold mb-4">
                  Start Creating Today
                </h3>
                <p className="text-muted-foreground mb-6">
                  Experience the power of multiple AI platforms working together.
                  Set up your account in minutes and start creating engaging content.
                </p>
                <Link href="/settings">
                  <Button className="w-full" size="lg">
                    Get Started
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-muted/50 border-t">
        <div className="container mx-auto text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Settings2 className="h-5 w-5" />
            <span className="font-bold">Social AI</span>
          </div>
          <p>© {new Date().getFullYear()} Social AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

function BenefitItem({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="text-primary">{icon}</div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}