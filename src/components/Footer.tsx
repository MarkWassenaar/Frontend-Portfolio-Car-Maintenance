const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white py-8 drop-shadow-xl">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <div className="font-bold text-xl">Car Maintenance Tracker</div>
          <p>&copy; 2024 Car Maintenance Tracker. All rights reserved.</p>
        </div>
        <div className="flex space-x-4 mb-4 md:mb-0">
          <a href="#" className="hover:underline">
            Home
          </a>
          <a href="#features" className="hover:underline">
            Features
          </a>
          <a href="#how-it-works" className="hover:underline">
            How It Works
          </a>
        </div>
        <div className="flex space-x-4">
          <a href="#">
            <img src="chatterox.jpg" alt="ChatterBox" className="h-6" />
          </a>
          <a href="#">
            <img src="birbe.jpg" alt="Birber" className="h-6" />
          </a>
          <a href="#">
            <img src="slowgra.jpeg" alt="DelayedGram" className="h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
