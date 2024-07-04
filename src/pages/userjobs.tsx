import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ZodError } from "zod";
import { Bid, UserJob, arrayOfUserJobsValidator } from "./garage";

const Userjobs = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [userJobs, setUserJobs] = useState<UserJob[]>([]);
  const [garageId, setGarageId] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [showBidModal, setShowBidModal] = useState<boolean>(false);
  const [selectedUserJob, setSelectedUserJob] = useState<UserJob | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [filterDescription, setFilterDescription] = useState<string>("");
  const [filterBids, setFilterBids] = useState<string>("");
  const [filterBidAmount, setFilterBidAmount] = useState<string>("");

  const getUserJobsFromApi = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3001/alluserjobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const validated = arrayOfUserJobsValidator.safeParse(data);

      if (validated.success) {
        const filteredJobs = validated.data.filter(
          (job) => job.Bid.every((bid) => !bid.accepted) // Filter jobs without any accepted bid
        );
        setUserJobs(filteredJobs);
        const firstUserJob = filteredJobs[0];
        if (firstUserJob && firstUserJob.Bid.length > 0) {
          const firstBid = firstUserJob.Bid[0];
          setGarageId(firstBid.garageId);
        } else {
          setGarageId(null);
        }
      } else {
        setError(validated.error);
      }
    } catch (err) {
      setError(error);
    }
  };

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    const typeFromStorage = localStorage.getItem("type");
    if (tokenFromStorage === null) {
      router.push("/login");
      return;
    }
    if (typeFromStorage !== "garage") {
      router.push("/");
      return;
    }

    setToken(tokenFromStorage);

    getUserJobsFromApi(tokenFromStorage);
  }, [router]);

  const handleMakeBid = (userJob: UserJob) => {
    setSelectedUserJob(userJob);
    setSelectedBid(null);
    setBidAmount(0);
    setShowBidModal(true);
  };

  const handleEditBid = (userJob: UserJob, bid: Bid) => {
    setSelectedUserJob(userJob);
    setSelectedBid(bid);
    setBidAmount(bid.amount);
    setShowBidModal(true);
  };

  const handleSubmitBid = async () => {
    if (!token || !selectedUserJob) return;

    try {
      const url = selectedBid
        ? `http://localhost:3001/userJobs/${selectedUserJob.id}/bids/${selectedBid.id}`
        : `http://localhost:3001/userJobs/${selectedUserJob.id}/bids`;
      const method = selectedBid ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: bidAmount,
          garageId: garageId,
        }),
      });

      if (response.ok) {
        getUserJobsFromApi(token);
      } else {
        console.error("Failed to submit the bid");
      }
    } catch (error) {
      console.error("An error occurred while submitting the bid:", error);
    }

    setShowBidModal(false);
    setSelectedUserJob(null);
    setSelectedBid(null);
    setBidAmount(0);
  };

  const filteredJobs = userJobs.filter((job) => {
    const matchesDescription = filterDescription
      ? job.job.description
          .toLowerCase()
          .includes(filterDescription.toLowerCase())
      : true;
    const matchesBids = filterBids
      ? job.Bid.length.toString() === filterBids
      : true;
    const matchesBidAmount = filterBidAmount
      ? filterBidAmount === "highest"
        ? job.Bid.some((bid) => bid.amount >= parseFloat(filterBidAmount))
        : job.Bid.some((bid) => bid.amount <= parseFloat(filterBidAmount))
      : true;

    return matchesDescription && matchesBids && matchesBidAmount;
  });

  return (
    <Layout>
      <div className="mt-32 flex">
        <div className="w-1/4 p-4">
          <h2 className="text-xl font-bold mb-4">Filters</h2>
          <input
            type="text"
            placeholder="Job Description"
            value={filterDescription}
            onChange={(e) => setFilterDescription(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <input
            type="text"
            placeholder="Number of bids"
            value={filterBids}
            onChange={(e) => setFilterBids(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          />
          <select
            value={filterBidAmount}
            onChange={(e) => setFilterBidAmount(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 mb-4 w-full"
          >
            <option value="">Bid Amount</option>
            <option value="highest">Highest to Lowest</option>
            <option value="lowest">Lowest to Highest</option>
          </select>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold mb-4">Jobs</h2>
          {filteredJobs.length === 0 ? (
            <p>No jobs available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((userJob) => {
                const lowestBid = userJob.Bid.reduce(
                  (lowest, bid) => (bid.amount < lowest.amount ? bid : lowest),
                  userJob.Bid[0]
                );
                const garageBid = userJob.Bid.find(
                  (bid) => bid.garageId === garageId
                );

                return (
                  <div
                    key={userJob.id}
                    className="p-2 mb-2 bg-white rounded shadow"
                  >
                    <div className="flex flex-col rounded-lg">
                      <div className="flex justify-center items-center h-1/5 my-4">
                        <p className="font-bold text-lg">
                          {userJob.job.description}
                        </p>
                      </div>
                      <div className="flex justify-between items-center h-24 mb-8 bg-gradient-to-b from-blue-500 to-transparent pl-4 pr-4 rounded-sm">
                        <div>
                          <p className="mb-1 text-xs">{userJob.car.make}</p>
                          <p className="m-0 font-bold">{userJob.car.model}</p>
                        </div>
                        <img
                          src={userJob.car.img}
                          alt="Car"
                          className="w-3/5"
                        />
                      </div>
                      <div className="flex justify-between items-center h-2/5 px-8 mb-4">
                        <div className="flex flex-col items-center">
                          <p className="font-bold">Year</p>
                          <p>{userJob.car.year}</p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="font-bold">Licenseplate</p>
                          <p className="mt-1 p-2 w-32 border rounded bg-dutch-license-plate-bg text-dutch-license-plate-text font-bold tracking-wide text-center uppercase">
                            {userJob.car.licenseplate}
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="font-bold">Date</p>
                          <p>{userJob.lastService.toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between">
                        <div>
                          <p>
                            <strong>Lowest Bid:</strong> ${lowestBid.amount}
                          </p>
                          {!userJob.Bid.some(
                            (bid) => bid.garageId === garageId
                          ) && (
                            <button
                              onClick={() => handleMakeBid(userJob)}
                              className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Make a Bid
                            </button>
                          )}
                        </div>
                        {garageBid && (
                          <div>
                            <p>
                              <strong>Your Bid:</strong> ${garageBid.amount}
                            </p>
                            <button
                              onClick={() => handleEditBid(userJob, garageBid)}
                              className="mt-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                              Edit Bid
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {showBidModal && selectedUserJob && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg w-1/2">
                <h2 className="text-xl font-bold mb-4">
                  {selectedBid ? "Edit Bid" : "Make a Bid"}
                </h2>
                <p className="mb-4">Enter your bid amount for:</p>
                <p>
                  <strong>Car:</strong> {selectedUserJob.car.make}{" "}
                  {selectedUserJob.car.model} ({selectedUserJob.car.year})
                </p>
                <p>
                  <strong>License Plate:</strong>{" "}
                  {selectedUserJob.car.licenseplate}
                </p>
                <p>
                  <strong>Job Description:</strong>{" "}
                  {selectedUserJob.job.description}
                </p>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(parseFloat(e.target.value))}
                  className="border border-gray-300 rounded-lg p-2 mt-2 w-full"
                  placeholder="Enter bid amount"
                />
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      setShowBidModal(false);
                      setSelectedUserJob(null);
                      setSelectedBid(null);
                      setBidAmount(0);
                    }}
                    className="mr-2 px-4 py-2 bg-gray-500 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitBid}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    {selectedBid ? "Update Bid" : "Submit Bid"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Userjobs;

// "https://www.smashbros.com/wiiu-3ds/images/character/lizardon/main.png"
