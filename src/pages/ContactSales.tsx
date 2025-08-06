import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ContactSales = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Contact Our Sales Team
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Ready to unlock your crypto's potential? Get in touch with our experts for personalized solutions and enterprise support.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Contact Form */}
          <Card className="hover-scale">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <p className="text-muted-foreground">
                Fill out the form and our team will reach out within 24 hours.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your Company" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loanAmount">Expected Loan Amount</Label>
                <Input id="loanAmount" placeholder="$100,000+" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us about your requirements..."
                  className="min-h-[120px]"
                />
              </div>
              
              <Button className="w-full">
                Submit Request
              </Button>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-4">Why Choose tartr?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Institutional-grade security with multi-signature wallets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Competitive rates starting from 3.5% APY</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>24/7 dedicated support for enterprise clients</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span>Custom loan terms and flexible repayment options</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <div className="grid gap-4">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">sales@tartr.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">Within 24 hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Link to="/">
                <Button variant="outline" className="hover-scale">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSales;