import Layout from "@/components/Layout";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { ZodError, z } from "zod";

const carValidator = z
  .object({
    id: z.number().positive(),
    make: z.string(),
    model: z.string(),
    img: z.string().url().optional().nullable(),
    licenseplate: z.string(),
    year: z.number().int(),
    userId: z.number().positive(),
    UserJob: z.array(
      z.object({
        id: z.number().positive(),
        lastService: z.string().transform((str) => new Date(str)), // handle date as string
        job: z.object({
          id: z.number().positive(),
          description: z.string(),
          interval: z.number().int().positive(),
        }),
        Bid: z.array(
          z.object({
            id: z.number().positive(),
            amount: z.number().int().positive(),
            garageId: z.number().positive(),
            userJobId: z.number().positive(),
            accepted: z.boolean(),
            garage: z.object({
              id: z.number().int(),
              name: z.string(),
            }),
          })
        ),
      })
    ),
  })
  .strict();

const newCarValidator = z
  .object({
    make: z.string(),
    model: z.string(),
    img: z.string().optional().nullable(),
    licenseplate: z.string().min(1),
    year: z.number().int().positive(),
  })
  .strict();

const addJobValidator = z.object({
  jobId: z.number().int().positive(),
  lastService: z.date(),
});

type NewCar = z.infer<typeof newCarValidator>;
type AddJob = z.infer<typeof addJobValidator>;

const arrayOfCarsValidator = z.array(carValidator);

export type Car = z.infer<typeof carValidator>;

const DashboardPage = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [error, setError] = useState<ZodError | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [viewingBidsForJobId, setViewingBidsForJobId] = useState<number | null>(
    null
  );
  const [acceptedBids, setAcceptedBids] = useState<{
    [key: number]: number | null;
  }>({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<NewCar>({
    resolver: zodResolver(newCarValidator),
  });

  const {
    register: registerJob,
    handleSubmit: handleSubmitJob,
    formState: { errors: jobErrors },
  } = useForm<AddJob>({
    resolver: zodResolver(addJobValidator),
  });

  const handleRegisterFormSubmit = async (data: NewCar) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/car`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        location.reload();
        const createdCar = await response.json();
        setCars((cars) => [...cars, createdCar]);
      } else {
        console.log("Failed to create item");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveJob = async (jobId: number) => {
    if (!token || !selectedCar) return;

    try {
      const response = await fetch(`http://localhost:3001/userJob/${jobId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Update the selectedCar state to reflect the removed job
        const updatedCar = await getUpdatedCarFromApi(selectedCar.id, token);
        setSelectedCar(updatedCar);
      } else {
        console.log("Failed to remove job");
      }
    } catch (error) {
      console.error("Failed to remove job:", error);
    }
  };

  const handleRemoveCar = async (carId: number) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/car/${carId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCars((prevCars) => prevCars.filter((car) => car.id !== carId));
        setSelectedCar(null);
      } else {
        console.log("Failed to delete car");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddJob = async (data: AddJob) => {
    if (!token || !selectedCar) return;

    try {
      const response = await fetch(
        `http://localhost:3001/car/${selectedCar.id}/job`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedCar = await getUpdatedCarFromApi(selectedCar.id, token);
        setSelectedCar(updatedCar);
        setShowJobForm(false);
      } else {
        console.log("Failed to add job");
      }
    } catch (error) {
      console.error("Failed to add job:", error);
    }
  };

  const handleViewBids = (jobId: number) => {
    if (viewingBidsForJobId === jobId) {
      setViewingBidsForJobId(null);
    } else {
      setViewingBidsForJobId(jobId);
    }
  };

  const handleAcceptBid = async (jobId: number, bidId: number) => {
    if (!token || !selectedCar) return;

    const isCurrentlyAccepted = acceptedBids[jobId] === bidId;

    try {
      const response = await fetch(
        `http://localhost:3001/bid/${bidId}/accept`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accept: !isCurrentlyAccepted }),
        }
      );

      if (response.ok) {
        setAcceptedBids((prev) => ({
          ...prev,
          [jobId]: isCurrentlyAccepted ? null : bidId,
        }));
        const updatedCar = await getUpdatedCarFromApi(selectedCar.id, token);
        setSelectedCar(updatedCar);
      } else {
        console.log("Failed to accept/unaccept bid");
      }
    } catch (error) {
      console.error("Failed to accept/unaccept bid:", error);
    }
  };

  const getJobsFromApi = async () => {
    if (!token) return;
    try {
      const response = await fetch(`http://localhost:3001/jobs`, {});
      const data = await response.json();
      setAllJobs(data);
    } catch (error) {
      console.error("Failed to get available jobs:", error);
    }
  };

  const getUpdatedCarFromApi = async (carId: number, token: string) => {
    try {
      const response = await fetch(`http://localhost:3001/car/${carId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      const validated = carValidator.safeParse(data);
      if (validated.success) {
        return validated.data;
      } else {
        setError(validated.error);
        return null;
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    if (!selectedCar) {
      return;
    }

    const initialAcceptedBids: { [key: number]: number | null } = {};

    selectedCar.UserJob.forEach((job) => {
      const acceptedBid = job.Bid.find((bid) => bid.accepted);
      initialAcceptedBids[job.id] = acceptedBid ? acceptedBid.id : null;
    });

    setAcceptedBids(initialAcceptedBids);
  }, [selectedCar]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");
    if (tokenFromStorage === null) {
      router.push("/login");
      return;
    }
    setToken(tokenFromStorage);

    const getCarsFromApi = async (token: string) => {
      try {
        const response = await fetch("http://localhost:3001/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        const validated = arrayOfCarsValidator.safeParse(data);

        if (validated.success) {
          setCars(validated.data);
        } else {
          setError(validated.error);
        }
      } catch (err) {
        setError(error);
      }
    };

    getCarsFromApi(tokenFromStorage);
  }, [router]);

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

  return (
    <Layout>
      <div className="flex">
        {/* Car Half */}

        {/* Add Car Form */}
        <div className="w-2/5 p-4 border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">My Cars</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add a Car
            </button>
          </div>
          {showForm && (
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <form onSubmit={handleSubmit(handleRegisterFormSubmit)}>
                <div className="mb-4">
                  <label
                    htmlFor="make"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Make
                  </label>
                  <input
                    id="make"
                    type="text"
                    {...register("make")}
                    className="mt-1 p-2 w-full border rounded"
                  />
                  {errors.make && (
                    <p className="text-red-500">{errors.make.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="model"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Model
                  </label>
                  <input
                    id="model"
                    type="text"
                    {...register("model")}
                    className="mt-1 p-2 w-full border rounded"
                  />
                  {errors.model && (
                    <p className="text-red-500">{errors.model.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="img"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Image
                  </label>
                  <input
                    id="img"
                    type="text"
                    {...register("img")}
                    className="mt-1 p-2 w-full border rounded"
                  />
                  {errors.img && (
                    <p className="text-red-500">{errors.img.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="year"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Year
                  </label>
                  <input
                    id="year"
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="mt-1 p-2 w-full border rounded"
                  />
                  {errors.year && (
                    <p className="text-red-500">{errors.year.message}</p>
                  )}
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="licenseplate"
                    className="block text-sm font-medium text-gray-700"
                  >
                    License Plate
                  </label>
                  <input
                    id="licenseplate"
                    type="text"
                    {...register("licenseplate")}
                    className="mt-1 p-2 h-12 max-w-xs border rounded bg-dutch-license-plate-bg text-dutch-license-plate-text font-bold tracking-wide text-center uppercase"
                  />
                  {errors.licenseplate && (
                    <p className="text-red-500">
                      {errors.licenseplate.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Add Car
                </button>
              </form>
            </div>
          )}

          {/* Overview of Cars */}

          <ul>
            {cars.length === 0 ? (
              <p>No Cars found</p>
            ) : (
              cars.map((car) => (
                <li
                  key={car.id}
                  className={`p-4 mb-4 border rounded cursor-pointer shadow-lg ${
                    selectedCar?.id === car.id
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => setSelectedCar(car)}
                >
                  <h3 className="text-xl font-semibold">
                    {car.make} {car.model}
                  </h3>
                  {car.img && (
                    <img
                      src={car.img}
                      alt={car.model}
                      className="w-full h-auto mt-2"
                    />
                  )}
                  <p className="mt-2">Year: {car.year}</p>
                  <p>Licenseplate: {car.licenseplate}</p>
                  <button
                    onClick={(e) => {
                      handleRemoveCar(car.id);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="w-1/2 p-4">
          {/* Jobs Half */}

          {selectedCar ? (
            <>
              {/* Add Job Form */}

              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold mb-4">
                  Jobs for {selectedCar.make} {selectedCar.model}
                </h1>
                <button
                  onClick={() => {
                    getJobsFromApi();
                    setShowJobForm(!showJobForm);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Job
                </button>
              </div>
              {showJobForm && (
                <div className="mb-4 p-4 border rounded bg-gray-50">
                  <form onSubmit={handleSubmitJob(handleAddJob)}>
                    <div className="mb-4">
                      <label
                        htmlFor="jobId"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Job
                      </label>
                      <select
                        id="jobId"
                        {...registerJob("jobId", { valueAsNumber: true })}
                        className="mt-1 p-2 w-full border rounded"
                      >
                        <option value="">Select a job</option>
                        {allJobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.description}
                          </option>
                        ))}
                      </select>
                      {jobErrors.jobId && (
                        <p className="text-red-500">
                          {jobErrors.jobId.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <label
                        htmlFor="lastService"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Service Date
                      </label>
                      <input
                        id="lastService"
                        type="date"
                        {...registerJob("lastService", { valueAsDate: true })}
                        className="mt-1 p-2 w-full border rounded"
                      />
                      {jobErrors.lastService && (
                        <p className="text-red-500">
                          {jobErrors.lastService.message}
                        </p>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Add Job
                    </button>
                  </form>
                </div>
              )}

              {/* Overview of Selected Jobs */}

              <div className="space-y-4">
                {selectedCar.UserJob.map((job) => (
                  <div key={job.id} className="flex items-start">
                    <div className="mr-4">
                      <p className="font-semibold text-lg">
                        {job.lastService.toLocaleDateString("en-US", {
                          weekday: "short",
                        })}
                      </p>
                      <p className="text-gray-500">
                        {job.lastService.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="flex-1 border-l-4 pl-4 border-blue-500">
                      <p className="text-lg font-semibold mb-1">
                        {job.job.description}
                      </p>

                      <ul className="space-y-2">
                        <li>
                          <p>Total Bids: {job.Bid.length}</p>
                          <p>
                            Lowest Bid:{" "}
                            {job.Bid.length > 0
                              ? Math.min(...job.Bid.map((bid) => bid.amount))
                              : "No bids"}
                          </p>
                          {job.Bid.some((bid) => bid.accepted) ? (
                            <p>
                              <span className="text-green-500">&#x2714;</span>{" "}
                              You have accepted an offer!
                            </p>
                          ) : (
                            <p>No accepted offers yet</p>
                          )}
                        </li>
                      </ul>

                      <button
                        onClick={() => handleViewBids(job.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        {viewingBidsForJobId === job.id
                          ? "Hide Bids"
                          : "View Bids"}
                      </button>

                      {viewingBidsForJobId === job.id && (
                        <ul className="mt-4">
                          {job.Bid.map((bid) => (
                            <li
                              key={bid.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={acceptedBids[job.id] === bid.id}
                                onChange={() => handleAcceptBid(job.id, bid.id)}
                                className="form-checkbox h-4 w-4"
                              />
                              <span>
                                Bid Amount: {bid.amount}, Garage:{" "}
                                {bid.garage.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <button
                        onClick={() => handleRemoveJob(job.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Remove Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p>Please select a car to view jobs</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
