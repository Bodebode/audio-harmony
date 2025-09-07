// Hidden sections that can be re-implemented in the future
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export const About = () => {
  return (
    <section id="about" className="p-6">
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">About Bode Nathaniel</h2>
          <p className="text-muted-foreground leading-relaxed">
            Bode Nathaniel is a talented musician whose style cuts across pop, Afro-pop, and other contemporary genres. The British-Nigerian artist has carved out a niche as a captivating performer and songwriter, blending African rhythms with Afrobeats influences to create music that resonates across cultures.
          </p>
          <p className="text-muted-foreground leading-relaxed mt-4">
            With a rapidly growing fanbase, Bode Nathaniel continues to craft inspiring and uplifting tracks that explore themes of gratitude, life, love, and cultural pride.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    setFormData({ name: '', email: '', message: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <section id="contact" className="p-6">
      <Card className="bg-background/50 backdrop-blur-sm border-border/50">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Contact</h2>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-foreground mb-2">Name</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-background/20 border-border/50"
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-foreground mb-2">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-background/20 border-border/50"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-foreground mb-2">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="bg-background/20 border-border/50 min-h-[150px]"
                placeholder="Write your message here..."
                required
              />
            </div>
            <Button 
              type="submit"
              className="w-full"
            >
              Send Message
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
};