
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Archive, Target, Eye, CheckSquare } from "lucide-react"; // Changed Film to Archive

export default function AboutUsPage() {
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary tracking-tight sm:text-4xl">About Loop Robotiks</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Loop Robotiks Technologies, founded in 2023, stands at the forefront of the autonomous mobile robotics (AMR) revolution for warehouses and logistics. We are a dynamic team of innovators, engineers, and problem-solvers passionate about transforming material handling through intelligent automation.
        </p>
      </div>

      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="flex flex-row items-center space-x-2">
          <Archive className="h-6 w-6 text-primary" /> {/* Changed icon */}
          <CardTitle className="text-xl font-semibold text-primary">Our Products</CardTitle> {/* Changed title */}
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Discover the innovative AMR solutions we are building to revolutionize warehouse automation.
          </p>
          <div className="aspect-video w-full bg-muted rounded-md overflow-hidden shadow-inner">
            {/* 
              IMPORTANT: For this video to work, ensure 'v3.mp4' is located in your '/public/videos/' directory.
              The path '/videos/v3.mp4' is relative to the 'public' folder.
              Check your browser's developer console for errors if the video doesn't load.
            */}
            <video
              src="/videos/v3.mp4"
              type="video/mp4"
              preload="auto"
              className="w-full h-full object-cover rounded-md"
              autoPlay
              loop
              muted
              playsInline
              controls={true} 
              data-ai-hint="company products robotics"
            />
          </div>
          <p className="text-muted-foreground">
            At Loop Robotiks, we develop a range of autonomous mobile robots (AMRs) designed for various material handling tasks. Our core product, the FleetView platform, provides intuitive control and comprehensive oversight for complex robotic fleets, enabling seamless collaboration between humans and robots.
          </p>
          <p className="text-muted-foreground">
            Our AMRs are engineered for reliability, efficiency, and safety, aiming to enhance productivity and reduce operational costs in modern logistics environments.
          </p>
        </CardContent>
      </Card>

       <section className="space-y-4">
        <CardHeader className="flex flex-row items-center space-x-2 p-0 mb-2">
          <Target className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold text-primary">Our Mission</CardTitle>
        </CardHeader>
        <p className="text-muted-foreground">
          To empower businesses with cutting-edge AMR solutions that optimize material flow, reduce operational costs, and create safer, more productive work environments.
        </p>
      </section>

      <section className="space-y-4">
        <CardHeader className="flex flex-row items-center space-x-2 p-0 mb-2">
          <Eye className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold text-primary">Our Vision</CardTitle>
        </CardHeader>
        <p className="text-muted-foreground">
          To be a global leader in AMR technology, pioneering solutions that redefine warehouse automation and empower the next generation of smart logistics.
        </p>
      </section>

      <section className="space-y-4">
        <CardHeader className="flex flex-row items-center space-x-2 p-0 mb-2">
          <CheckSquare className="h-6 w-6 text-primary" />
          <CardTitle className="text-xl font-semibold text-primary">Our Values</CardTitle>
        </CardHeader>
        <ul className="list-disc list-inside space-y-2 text-muted-foreground pl-4">
          <li><span className="font-medium text-foreground">Innovation:</span> Continuously pushing the boundaries of robotic technology and creative solutions.</li>
          <li><span className="font-medium text-foreground">Customer-Centricity:</span> Placing our clients' needs at the heart of everything we do, delivering tailored and impactful solutions.</li>
          <li><span className="font-medium text-foreground">Reliability:</span> Building robust, dependable AMR systems that our customers can trust for consistent performance.</li>
          <li><span className="font-medium text-foreground">Collaboration:</span> Fostering strong partnerships with our clients and within our team to achieve shared success.</li>
          <li><span className="font-medium text-foreground">Excellence:</span> Striving for the highest standards in our products, services, and operational processes.</li>
        </ul>
      </section>
    </div>
  );
}
