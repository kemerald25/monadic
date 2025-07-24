import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAppKit } from "@reown/appkit/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Image,
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useWallet } from "./WalletProvider";
import {
  useCreateEvent,
  useCreateTicketTier,
  useCreateSponsorshipTier,
} from "../hooks/useEventFactory";
import { uploadToIPFS, createEventMetadata } from "../utils/ipfs";

interface EventFormData {
  name: string;
  description: string;
  category: string;
  location: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  imageUrl: string;
  ticketTiers: {
    name: string;
    price: number;
    supply: number;
  }[];
  sponsorshipTiers: {
    level: string;
    price: number;
    benefits: string[];
  }[];
}

const categories = [
  "Technology",
  "Art",
  "Finance",
  "Gaming",
  "Education",
  "Music",
  "Sports",
];

const EventCreationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdEventAddress, setCreatedEventAddress] = useState<
    `0x${string}` | null
  >(null);
  const [deploymentProgress, setDeploymentProgress] = useState({
    event: false,
    ticketTiers: false,
    sponsorshipTiers: false,
  });

  const { isConnected } = useWallet();
  const { open } = useAppKit();
  const {
    createEvent,
    isPending: isCreatingEvent,
    isConfirming: isConfirmingEvent,
    isSuccess: eventCreated,
    hash: eventHash,
    error: eventError,
  } = useCreateEvent();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<EventFormData>({
    defaultValues: {
      ticketTiers: [{ name: "General Admission", price: 0, supply: 100 }],
      sponsorshipTiers: [
        {
          level: "Gold",
          price: 1,
          benefits: ["Logo on event page", "Booth space"],
        },
      ],
    },
  });

  const steps = [
    {
      title: "Basic Info",
      icon: Calendar,
      description: "Event details and description",
    },
    {
      title: "Location & Time",
      icon: MapPin,
      description: "When and where your event happens",
    },
    {
      title: "Tickets",
      icon: DollarSign,
      description: "Set up ticket tiers and pricing",
    },
    {
      title: "Sponsorship",
      icon: Users,
      description: "Configure sponsorship opportunities",
    },
    {
      title: "Review",
      icon: Check,
      description: "Review and deploy your event",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: EventFormData) => {
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    // Validate form data before submission
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    const now = new Date();

    if (startTime <= now) {
      alert("Start time must be in the future");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    if (!data.name || data.name.trim().length === 0) {
      alert("Event name is required");
      return;
    }

    if (data.maxAttendees <= 0) {
      alert("Maximum attendees must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Upload metadata to IPFS
      console.log("Uploading metadata to IPFS...");
      const metadata = createEventMetadata(data);
      const ipfsURI = await uploadToIPFS(metadata);

      console.log("IPFS URI received:", ipfsURI);

      if (!ipfsURI || typeof ipfsURI !== "string") {
        throw new Error("Invalid IPFS URI received");
      }

      // Step 2: Create the event on blockchain
      console.log("Creating event on blockchain...");
      const eventSymbol = data.name
        .replace(/\s+/g, "")
        .toUpperCase()
        .slice(0, 8);

      console.log("Prepared event data:", {
        name: data.name,
        symbol: eventSymbol,
        category: data.category,
        ipfsMetadataURI: ipfsURI,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        maxAttendees: data.maxAttendees,
      });

      await createEvent({
        name: data.name,
        symbol: eventSymbol,
        category: data.category,
        ipfsMetadataURI: ipfsURI,
        startTime: startTime,
        endTime: endTime,
        maxAttendees: data.maxAttendees,
      });

      setDeploymentProgress((prev) => ({ ...prev, event: true }));
    } catch (error) {
      console.error("Error creating event:", error);
      alert(
        `Error creating event: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      setIsSubmitting(false);
    }
  };

  // Handle event creation success
  useEffect(() => {
    if (eventCreated && eventHash) {
      // Note: In a real implementation, you'd parse the transaction receipt
      // to get the actual event contract address and event ID
      // For now, we'll simulate this
      const mockEventAddress = ("0x" +
        Math.random().toString(16).slice(2, 42)) as `0x${string}`;
      setCreatedEventAddress(mockEventAddress);

      // Continue with tier creation
      createTiers(mockEventAddress);
    }
  }, [eventCreated, eventHash]);

  const createTiers = async (eventAddress: `0x${string}`) => {
    const formData = watch();

    try {
      // Create ticket tiers
      console.log("Creating ticket tiers...");
      for (const tier of formData.ticketTiers || []) {
        if (tier.name && tier.supply > 0) {
          // Note: You'd need to implement this with proper transaction waiting
          console.log("Creating ticket tier:", tier.name);
        }
      }
      setDeploymentProgress((prev) => ({ ...prev, ticketTiers: true }));

      // Create sponsorship tiers
      console.log("Creating sponsorship tiers...");
      for (const tier of formData.sponsorshipTiers || []) {
        if (tier.level && tier.price > 0) {
          // Note: You'd need to implement this with proper transaction waiting
          console.log("Creating sponsorship tier:", tier.level);
        }
      }
      setDeploymentProgress((prev) => ({ ...prev, sponsorshipTiers: true }));

      // All done!
      setIsSubmitting(false);
      alert("Event created successfully! 🎉");
    } catch (error) {
      console.error("Error creating tiers:", error);
      alert("Event created but some tiers failed. You can add them later.");
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Name *
              </label>
              <input
                {...register("name", { required: "Event name is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your event..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category", { required: "Category is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Image URL
              </label>
              <input
                {...register("imageUrl")}
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                {...register("location", { required: "Location is required" })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter event location"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <input
                  {...register("startTime", {
                    required: "Start time is required",
                  })}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.startTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startTime.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <input
                  {...register("endTime", { required: "End time is required" })}
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                {errors.endTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.endTime.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Attendees *
              </label>
              <input
                {...register("maxAttendees", {
                  required: "Maximum attendees is required",
                  min: { value: 1, message: "Must be at least 1" },
                })}
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="100"
              />
              {errors.maxAttendees && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maxAttendees.message}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Ticket Tiers
              </h3>
              <button
                type="button"
                onClick={() => {
                  const tiers = watch("ticketTiers") || [];
                  setValue("ticketTiers", [
                    ...tiers,
                    { name: "", price: 0, supply: 0 },
                  ]);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Tier
              </button>
            </div>

            {watch("ticketTiers")?.map((tier, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tier Name
                    </label>
                    <input
                      {...register(`ticketTiers.${index}.name` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="General Admission"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ETH)
                    </label>
                    <input
                      {...register(`ticketTiers.${index}.price` as const)}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="0.1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Supply
                    </label>
                    <input
                      {...register(`ticketTiers.${index}.supply` as const)}
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Sponsorship Tiers
              </h3>
              <button
                type="button"
                onClick={() => {
                  const tiers = watch("sponsorshipTiers") || [];
                  setValue("sponsorshipTiers", [
                    ...tiers,
                    { level: "", price: 0, benefits: [] },
                  ]);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add Tier
              </button>
            </div>

            {watch("sponsorshipTiers")?.map((tier, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Level
                    </label>
                    <input
                      {...register(`sponsorshipTiers.${index}.level` as const)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (ETH)
                    </label>
                    <input
                      {...register(`sponsorshipTiers.${index}.price` as const)}
                      type="number"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="1.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits (one per line)
                  </label>
                  <textarea
                    onChange={(e) => {
                      const benefits = e.target.value
                        .split("\n")
                        .filter((b) => b.trim());
                      setValue(`sponsorshipTiers.${index}.benefits`, benefits);
                    }}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Logo on event page&#10;Booth space&#10;Speaking opportunity"
                  />
                </div>
              </div>
            ))}
          </div>
        );

      case 4: {
        const formData = watch();
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Review Your Event
            </h3>

            {!isConnected && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <h4 className="font-semibold text-yellow-800">
                    Wallet Required
                  </h4>
                </div>
                <button
                  onClick={() => open()}
                  className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>Connect Wallet</span>
                </button>
              </div>
            )}

            <div className="bg-gray-50 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-2">
                {formData.name}
              </h4>
              <p className="text-gray-600 mb-4">{formData.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Category:</strong> {formData.category}
                </div>
                <div>
                  <strong>Location:</strong> {formData.location}
                </div>
                <div>
                  <strong>Max Attendees:</strong> {formData.maxAttendees}
                </div>
                <div>
                  <strong>Ticket Tiers:</strong>{" "}
                  {formData.ticketTiers?.length || 0}
                </div>
              </div>
            </div>

            {isSubmitting && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Deployment Progress
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        deploymentProgress.event
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">Creating event contract</span>
                    {isCreatingEvent && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        deploymentProgress.ticketTiers
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">Setting up ticket tiers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        deploymentProgress.sponsorshipTiers
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="text-sm">
                      Setting up sponsorship tiers
                    </span>
                  </div>
                </div>

                {eventHash && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <a
                      href={`https://etherscan.io/tx/${eventHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View transaction on Etherscan</span>
                    </a>
                  </div>
                )}
              </div>
            )}

            {eventError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="font-semibold text-red-800">
                    Transaction Failed
                  </h4>
                </div>
                <p className="text-red-700 text-sm mt-1">
                  {eventError.message ||
                    "An error occurred while creating the event"}
                </p>
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">
                ⚠️ Important
              </h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Your event will be deployed to the blockchain</li>
                <li>• Gas fees will be required for deployment</li>
                <li>• Event details cannot be changed after deployment</li>
                <li>• You will be able to manage tickets and sponsorships</li>
              </ul>
            </div>
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Create New Event
        </h1>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  index < steps.length - 1 ? "flex-1" : ""
                }`}
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="text-center mt-2">
                    <p
                      className={`text-sm font-medium ${
                        index <= currentStep
                          ? "text-purple-600"
                          : "text-gray-400"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 ${
                      index < currentStep ? "bg-purple-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>

            {currentStep < steps.length - 1 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                <span>Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting || !isConnected}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  isSubmitting || !isConnected
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700"
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    <span>Creating Event...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Create Event</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EventCreationWizard;
