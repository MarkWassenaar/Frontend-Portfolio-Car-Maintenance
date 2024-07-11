import CarMakeIcon from "@/components/CarMakeIcons";
import ContactUser from "@/components/ContactUser";
import Layout from "@/components/Layout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ZodError, z } from "zod";

export const userJobValidator = z.object({
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
    color: z.string(),
    licenseplate: z.string(),
    user: z.object({
      username: z.string(),
      phonenumber: z.string(),
    }),
  }),
  job: z.object({
    id: z.number(),
    description: z.string(),
    interval: z.number(),
  }),
});

export const arrayOfUserJobsValidator = z.array(userJobValidator);

export type UserJob = z.infer<typeof userJobValidator>;
export type Bid = z.infer<typeof userJobValidator>["Bid"][0];

interface PageState {
  userJob: UserJob[];
  garageId: number | null;
  bidAmount: number;
  showBidModal: boolean;
  selectedUserJob: UserJob | null;
  selectedBid: Bid | null;
  showModal: boolean;
  contact: { name: string; phone: string } | null;
}

const GaragePage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<ZodError | null>(null);

  const [pageState, setPageState] = useState<PageState>({
    userJob: [],
    garageId: null,
    bidAmount: 0,
    showBidModal: false,
    selectedUserJob: null,
    selectedBid: null,
    showModal: false,
    contact: null,
  });

  const { userJob, selectedUserJob, garageId, selectedBid, contact } =
    pageState;

  // const [userJob, setUserJob] = useState<UserJob[]>([]);
  // const [garageId, setGarageId] = useState<number | null>(null);
  // const [bidAmount, setBidAmount] = useState<number>(0);
  // const [showBidModal, setShowBidModal] = useState<boolean>(false);
  // const [selectedUserJob, setSelectedUserJob] = useState<UserJob | null>(null);
  // const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  // const [showModal, setShowModal] = useState(false);
  // const [contact, setContact] = useState<{
  //   name: string;
  //   phone: string;
  // } | null>(null);

  const getUserJobsFromApi = async (token: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/myuserjobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      const validated = arrayOfUserJobsValidator.safeParse(data);

      if (validated.success) {
        // useState updater function, very usefull
        setPageState((ps) => ({ ...ps, userJob: validated.data }));
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
    const getMe = async () => {
      const meRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/garage/me`,
        {
          headers: {
            Authorization: `Bearer ${tokenFromStorage}`,
          },
        }
      );
      const meData = await meRes.json();
      console.log("meData", meData);
      console.log("meData.id:", meData.id);

      setPageState({ ...pageState, garageId: meData.id });
      getUserJobsFromApi(tokenFromStorage);
    };
    getMe();
  }, [router]);

  const handleContactUser = (userJob: UserJob) => {
    setPageState({
      ...pageState,
      contact: {
        phone: userJob.car.user.phonenumber,
        name: userJob.car.user.username,
      },
      showModal: true,
    });
  };

  const closeModal = () => {
    setPageState({ ...pageState, showModal: false, contact: null });
  };

  const handleRemoveBid = async (bidId: number) => {
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/bid/${bidId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        getUserJobsFromApi(token);
      } else {
        console.log("Failed to delete bid");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditBid = (userJob: UserJob, bid: Bid) => {
    setPageState({
      ...pageState,
      selectedUserJob: userJob,
      selectedBid: bid,
      bidAmount: bid.amount,
      showBidModal: true,
    });
  };

  const handleSubmitBid = async () => {
    if (!token || !selectedUserJob) return;

    try {
      if (selectedBid) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/userJobs/${selectedUserJob.id}/bids/${selectedBid.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              amount: pageState.bidAmount,
            }),
          }
        );

        if (response.ok) {
          getUserJobsFromApi(token);
        } else {
          console.error("Failed to submit the bid");
        }
      }
    } catch (error) {
      console.error("An error occurred while submitting the bid:", error);
    }
    setPageState({
      ...pageState,
      selectedUserJob: null,
      selectedBid: null,
      bidAmount: 0,
      showBidModal: false,
    });
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
    userJob.Bid.some((bid) => bid.accepted && bid.garageId === garageId)
  );

  const unacceptedBids = userJob.flatMap((userJob) =>
    userJob.Bid.filter((bid) => !bid.accepted && bid.garageId === garageId).map(
      (bid) => ({
        ...bid,
        userJob,
      })
    )
  );

  const unaceptedJobs = userJob.filter((job) => {
    return !job.Bid.some((bid) => bid.accepted);
  });

  return (
    <Layout>
      <div className="p-4 mt-32">
        <div className="flex justify-between items-center">
          <div className="flex-1"></div>
          <h1 className="text-2xl font-bold mb-6 text-center flex-grow">
            Bids Overview for garage {pageState.garageId}
          </h1>
          <div className="flex-1 flex justify-end">
            <Link href="/userjobs">
              <button className="bg-blue-500 hover:bg-blue-600 rounded-xl p-4 text-white my-4">
                See available jobs
              </button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          <div className="flex-1 bg-green-100 p-4 rounded-lg md:mr-2">
            <h2 className="text-xl font-bold mb-4">Accepted Bids</h2>
            {acceptedJobs.length === 0 ? (
              <p>No accepted bids.</p>
            ) : (
              acceptedJobs.map((userJob, index) => (
                <div
                  key={index}
                  className="p-2 mb-2 bg-white rounded flex items-start cursor-pointer shadow-lg border-2 border-blue-500  transition-all duration-75 hover:scale-105"
                >
                  <div className="mr-4">
                    <p className="font-semibold text-lg">
                      {userJob.lastService.toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </p>
                    <p className="text-gray-500">
                      {userJob.lastService.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex-1 border-l-4 pl-4 border-blue-500">
                    <p>
                      <strong>Car:</strong> {userJob.car.make}{" "}
                      {userJob.car.model} ({userJob.car.year})
                    </p>
                    <p>
                      <strong>License Plate:</strong> {userJob.car.licenseplate}
                    </p>
                    <p>
                      <strong>Job Description:</strong>{" "}
                      {userJob.job.description}
                    </p>
                    <p>
                      <strong>Bid Amount:</strong> $
                      {userJob.Bid.find((bid) => bid.accepted)?.amount}
                    </p>
                    <p>
                      <strong>Owner:</strong> {userJob.car.user.username}
                    </p>
                  </div>
                  <div className="flex bg-green-400 hover:bg-green-500 text-white p-4 rounded-lg">
                    <button onClick={() => handleContactUser(userJob)}>
                      Contact Owner
                    </button>
                  </div>
                </div>
              ))
            )}
            {pageState.showModal && contact && (
              <ContactUser
                name={contact.name}
                phone={contact.phone}
                onClose={closeModal}
              />
            )}
          </div>

          <div className="flex-1 bg-red-100 p-4 rounded-lg md:ml-2">
            <h2 className="text-xl font-bold mb-4">Unaccepted Bids</h2>
            {unacceptedBids.length === 0 ? (
              <p>No unaccepted bids.</p>
            ) : (
              unacceptedBids.map((bid, index) => {
                const lowestBid = Math.min(
                  ...bid.userJob.Bid.map((bid) => bid.amount)
                );
                return (
                  <div
                    key={index}
                    className="p-2 mb-2 bg-white rounded cursor-pointer shadow-lg border-2 border-blue-500  transition-all duration-75 hover:scale-105"
                  >
                    <div className="flex flex-col rounded-lg">
                      <div className="flex justify-between items-center bg-white rounded-t-lg border-b border-gray-200 px-4 py-2">
                        <p className="font-bold text-lg text-center flex-1">
                          {bid.userJob.job.description}
                        </p>
                      </div>

                      <div
                        className={`flex justify-between items-center h-32 gradient-${bid.userJob.car.color} px-12 rounded-sm`}
                      >
                        <div>
                          <p className="mb-1 text-base">
                            {bid.userJob.car.make}
                          </p>
                          <p className="m-0 font-bold text-xl">
                            {bid.userJob.car.model}
                          </p>
                        </div>
                        <CarMakeIcon make={bid.userJob.car.make} />
                      </div>
                      <div className="flex justify-between items-center px-12 mb-4">
                        <div className="flex flex-col items-center">
                          <p className="font-bold">Year</p>
                          <p>{bid.userJob.car.year}</p>
                        </div>

                        <div className="flex flex-col ml-14 items-center">
                          <p className="font-bold">Licenseplate</p>
                          <p className="mt-1 p-2 w-32 border rounded bg-dutch-license-plate-bg text-dutch-license-plate-text font-bold tracking-wide text-center uppercase">
                            {bid.userJob.car.licenseplate}
                          </p>
                        </div>
                        <div className="flex flex-col items-center">
                          <p className="font-bold">Date</p>
                          <p>{bid.userJob.lastService.toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between px-12">
                      <div className="flex flex-col items-center">
                        <p>
                          <strong>Your Bid:</strong> €{bid.amount}
                        </p>
                        <button
                          onClick={() => handleEditBid(bid.userJob, bid)}
                          className="mt-2 p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        >
                          Edit Bid
                        </button>
                      </div>

                      <div>
                        <p>
                          <strong>Lowest Bid:</strong> €{lowestBid}
                        </p>
                      </div>

                      <button
                        onClick={() => handleRemoveBid(bid.id)}
                        className="p-2 h-12 mt-6  text-white rounded bg-red-500 hover:bg-red-600 "
                      >
                        Remove Bid
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {pageState.showBidModal && selectedUserJob && (
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
              <strong>License Plate:</strong> {selectedUserJob.car.licenseplate}
            </p>
            <p>
              <strong>Job Description:</strong>{" "}
              {selectedUserJob.job.description}
            </p>
            <input
              type="number"
              value={pageState.bidAmount}
              onChange={(e) =>
                setPageState({
                  ...pageState,
                  bidAmount: parseFloat(e.target.value),
                })
              }
              className="border border-gray-300 rounded-lg p-2 mt-2 w-full"
              placeholder="Enter bid amount"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setPageState({
                    ...pageState,
                    selectedUserJob: null,
                    selectedBid: null,
                    bidAmount: 0,
                    showBidModal: false,
                  });
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
    </Layout>
  );
};

export default GaragePage;
