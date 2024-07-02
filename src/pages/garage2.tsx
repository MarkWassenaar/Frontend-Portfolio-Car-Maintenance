import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ZodError, z } from "zod";

const userJobValidator = z.object({
  id: z.number(),
  lastService: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
  Bid: z.array(
    z.object({
      id: z.number(),
      amount: z.number().int().positive(),
      accepted: z.boolean(),
      garageId: z.number(),
    })
  ),
  car: z.object({
    make: z.string(),
    model: z.string(),
    year: z.number(),
    licenseplate: z.string(),
    user: z.object({
      username: z.string(),
    }),
  }),
  job: z.object({
    id: z.number(),
    description: z.string(),
    interval: z.number(),
  }),
});

const arrayOfUserJobsValidator = z.array(userJobValidator);

type UserJob = z.infer<typeof userJobValidator>;
type Bid = z.infer<typeof userJobValidator>["Bid"][0];

const GaragePage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [userJob, setUserJob] = useState<UserJob[]>([]);
  const [garageId, setGarageId] = useState<number | null>(null);
  const [bidAmount, setBidAmount] = useState<number>(0);
  const [showBidModal, setShowBidModal] = useState<boolean>(false);
  const [selectedUserJob, setSelectedUserJob] = useState<UserJob | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);

  const getUserJobsFromApi = async (token: string) => {
    try {
      const response = await fetch("http://localhost:3001/myuserjobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      const validated = arrayOfUserJobsValidator.safeParse(data);

      if (validated.success) {
        setUserJob(validated.data);
        const firstUserJob = validated.data[0];
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

  const handleRemoveBid = async (bidId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/bid/${bidId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        getUserJobsFromApi(token);
      } else {
        console.log("Failed to delete bid");
      }
    } catch (error) {
      console.error(error);
    }
  };

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

  if (error !== null) {
    return (
      <Layout>
        <div className="p-4">
          <p className="text-red-500">Something went wrong we are erroring</p>
          {error.issues.map((issue, index) => (
            <p key={index} className="text-red-500">
              {issue.message}
            </p>
          ))}
        </div>
      </Layout>
    );
  }

  const acceptedJobs = userJob.filter((userJob) =>
    userJob.Bid.some((bid) => bid.accepted)
  );
  const unacceptedBids = userJob.flatMap((userJob) =>
    userJob.Bid.filter((bid) => !bid.accepted).map((bid) => ({
      ...bid,
      userJob,
    }))
  );

  const jobsWithoutBids = userJob.filter(
    (userJob) => !userJob.Bid.some((bid) => bid.garageId === garageId)
  );

  return (
    <Layout>
      <div className="p-4 mt-32">
        <h1 className="text-2xl font-bold mb-6 text-center">Bids Overview</h1>
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 bg-green-100 p-4 rounded-lg md:mr-2">
            <h2 className="text-xl font-bold mb-4">Accepted Bids</h2>
            {acceptedJobs.length === 0 ? (
              <p>No accepted bids.</p>
            ) : (
              acceptedJobs.map((userJob, index) => (
                <div key={index} className="p-2 mb-2 bg-white rounded shadow">
                  <p>
                    <strong>Car:</strong> {userJob.car.make} {userJob.car.model}{" "}
                    ({userJob.car.year})
                  </p>
                  <p>
                    <strong>License Plate:</strong> {userJob.car.licenseplate}
                  </p>
                  <p>
                    <strong>Job Description:</strong> {userJob.job.description}
                  </p>
                  <p>
                    <strong>Bid Amount:</strong> $
                    {userJob.Bid.find((bid) => bid.accepted)?.amount}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {userJob.lastService.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Owner:</strong> {userJob.car.user.username}
                  </p>
                </div>
              ))
            )}
          </div>
          <div className="flex-1 bg-red-100 p-4 rounded-lg md:ml-2">
            <h2 className="text-xl font-bold mb-4">Unaccepted Bids</h2>
            {unacceptedBids.length === 0 ? (
              <p>No unaccepted bids.</p>
            ) : (
              unacceptedBids.map((bid, index) => (
                <div key={index} className="p-2 mb-2 bg-white rounded shadow">
                  <p>
                    <strong>Car:</strong> {bid.userJob.car.make}{" "}
                    {bid.userJob.car.model} ({bid.userJob.car.year})
                  </p>
                  <p>
                    <strong>License Plate:</strong>{" "}
                    {bid.userJob.car.licenseplate}
                  </p>
                  <p>
                    <strong>Job Description:</strong>{" "}
                    {bid.userJob.job.description}
                  </p>
                  <p>
                    <strong>Bid Amount:</strong> ${bid.amount}
                  </p>
                  <p>
                    <strong>Date:</strong>{" "}
                    {bid.userJob.lastService.toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Owner:</strong> {bid.userJob.car.user.username}
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditBid(bid.userJob, bid)}
                      className="p-2 mt-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                      Edit Bid
                    </button>
                    <button
                      onClick={() => handleRemoveBid(bid.id)}
                      className="p-2 mt-2 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Remove Bid
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Jobs Without Bids</h2>
          {jobsWithoutBids.length === 0 ? (
            <p>All jobs have bids.</p>
          ) : (
            jobsWithoutBids.map((userJob) => (
              <div
                key={userJob.id}
                className="p-2 mb-2 bg-white rounded shadow"
              >
                <p>
                  <strong>Car:</strong> {userJob.car.make} {userJob.car.model} (
                  {userJob.car.year})
                </p>
                <p>
                  <strong>License Plate:</strong> {userJob.car.licenseplate}
                </p>
                <p>
                  <strong>Job Description:</strong> {userJob.job.description}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {userJob.lastService.toLocaleDateString()}
                </p>
                <p>
                  <strong>Owner:</strong> {userJob.car.user.username}
                </p>
                <button
                  onClick={() => handleMakeBid(userJob)}
                  className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Make a Bid
                </button>
              </div>
            ))
          )}
        </div>
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
    </Layout>
  );
};

export default GaragePage;
