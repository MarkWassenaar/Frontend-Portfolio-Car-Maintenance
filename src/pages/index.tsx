import Layout from "@/components/Layout";
import Link from "next/link";

const HomePage = () => {
  return (
    <Layout>
      <div className="container mx-auto text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          Keep Your Car Running Smoothly
        </h1>
        <p className="text-lg mb-6">
          Track upcoming maintenance, get bids from multiple garages, and choose
          the best offer.
        </p>
        <Link
          href="/register"
          className="bg-white text-blue-600 py-2 px-4 rounded-full font-semibold hover:bg-gray-100"
        >
          Get Started
        </Link>
        <Link
          href="#learn-more"
          className="bg-blue-500 text-white py-2 px-4 rounded-full font-semibold ml-2 hover:bg-blue-700"
        >
          Learn More
        </Link>
      </div>

      <section id="how-it-works" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                1. Register Your Car
              </h3>
              <p>View all upcoming maintenance items.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">2. Receive Bids</h3>
              <p>Get bids from multiple garages.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                3. Compare and Choose
              </h3>
              <p>Select the best offer for you.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold mb-2">
                4. Schedule Your Service
              </h3>
              <p>Keep track of your cars maintenance history.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Track Maintenance</h3>
              <p>Keep an overview of all upcoming maintenance items.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Receive Bids</h3>
              <p>Multiple garages can bid on your maintenance tasks.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Compare and Choose</h3>
              <p>Compare bids and select the best offer for you.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Service History</h3>
              <p>Maintain a record of all past services.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>
                `I used to break down by the side of the road, but Thanks to Pit
                Stop Pal Ive got my car running Smoothly!` - Swendude
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <p>
                `I love how I can compare bids from different garages and choose
                the one that suits me best.` - Yoeran
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="garages" className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Garages</h2>
          <p className="mb-6">
            Join us and expand your customer base. Offer competitive prices and
            manage bids easily.
          </p>
          <Link
            href="/registerGarage"
            className="bg-blue-600 text-white py-2 px-4 rounded-full font-semibold hover:bg-blue-700"
          >
            Join Us
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
