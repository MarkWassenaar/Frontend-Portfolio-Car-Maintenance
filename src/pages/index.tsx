import Link from "next/link";
import Layout from "@/components/Layout";
import { cn } from "../../public/lib/utils";

import Marquee from "@/components/magicui/marquee";

const reviews = [
  {
    name: "Swen",
    username: "@Swendude",
    body: "I used to break down by the side of the road, but Thanks to Pit Stop Pal Ive got my car running Smoothly!",
    img: "https://cdn.discordapp.com/avatars/195867513207128064/58225a793e4c418df21990a8554e333f.webp?size=240",
  },
  {
    name: "Yoeran",
    username: "@Y03R4N",
    body: " love how I can compare bids from different garages and choose the one that suits me best.",
    img: "https://cdn.discordapp.com/avatars/794901237136228392/3962ff4f3b71d2e47b1da23f7c3d7b59.webp?size=240",
  },
  {
    name: "Brandon",
    username: "@Albertus",
    body: "Mannnn this makes me wanna buy a car RIGHT NOW!",
    img: "https://cdn.discordapp.com/guilds/1066268507920142346/users/874447971276693524/avatars/0caa273a7b21b35bf08efe9d0c0bc819.webp?size=256",
  },
  {
    name: "Trang",
    username: "@Trangelang",
    body: "Wtf this site is amazing!",
    img: "https://cdn.discordapp.com/avatars/1217449635476668506/6a97d15ef8ec51f57447151b1a8fe037.webp?size=240",
  },
  {
    name: "Nargiz",
    username: "@TotallyNotASpy",
    body: "Good",
    img: "https://cdn.discordapp.com/avatars/761240855787864064/5b612441eadf4b9bb83a600b9b360a77.webp?size=240",
  },
  {
    name: "Maple",
    username: "@Maplenator",
    body: "Finally the car is not shaking anymore! I can snack on drives again",
    img: "https://cdn.discordapp.com/avatars/121967561091973123/68535566f33de2f773d6edeba2b35d15.webp?size=240",
  },
];

const firstRow = reviews.slice(0, reviews.length);
const secondRow = reviews.slice(reviews.length / 2);
const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-96 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

const HomePage = () => {
  return (
    <Layout>
      <div
        className="w-full h-screen bg-cover bg-center text-center flex flex-col justify-center items-center h-120"
        style={{
          backgroundImage: "url('/garageshop.png')",
        }}
      >
        <div className="bg-white bg-opacity-75 p-8 rounded-lg">
          <h1 className="text-4xl font-bold mb-4">
            Keep Your Car Running Smoothly
          </h1>
          <p className="text-lg mb-6">
            Track upcoming maintenance, get bids from multiple garages, and
            choose the best offer.
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
      </div>

      <section id="how-it-works" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">
                1. Register Your Car
              </h3>
              <p>View all upcoming maintenance items.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">2. Receive Bids</h3>
              <p>Get bids from multiple garages.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">
                3. Compare and Choose
              </h3>
              <p>Select the best offer for you.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:scale-110">
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
            <div className="bg-blue-100 p-6 rounded-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">Track Maintenance</h3>
              <p>Keep an overview of all upcoming maintenance items.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">Receive Bids</h3>
              <p>Multiple garages can bid on your maintenance tasks.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">Compare and Choose</h3>
              <p>Compare bids and select the best offer for you.</p>
            </div>
            <div className="bg-blue-100 p-6 rounded-lg hover:scale-110">
              <h3 className="text-xl font-semibold mb-2">Service History</h3>
              <p>Maintain a record of all past services.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-16 bg-gray-100">
        <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white p-6 rounded-lg shadow-lg py-20 md:shadow-xl">
          <Marquee pauseOnHover className="[--duration:20s]">
            {firstRow.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
        {/* <div className="container mx-auto text-center">
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
        </div> */}
      </section>

      <section id="garages" className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">For Garages</h2>
          <p className="mb-6">
            Join us and expand your customer base. Offer competitive prices and
            manage bids easily.
          </p>
          <Link
            href="/registergarage"
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
