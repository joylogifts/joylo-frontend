"use client";
import { useState, useEffect } from "react";
import TextComponent from "@/lib/ui/useable-components/text-field";
import CustomButton from "@/lib/ui/useable-components/button";
import { useQuery } from "@apollo/client";
import { GET_USER_PROFILE } from "@/lib/api/graphql";
import { GET_USER_SUPPORT_TICKETS } from "@/lib/api/graphql/queries/SupportTickets";
import { useRouter } from "next/navigation";
import TicketSkeleton from "@/lib/ui/useable-components/custom-skeletons/ticket.skeleton";
import useToast from "@/lib/hooks/useToast";
import TicketChatModal from "@/lib/ui/useable-components/ticket-chat-modal";
import { useLangTranslation } from "@/lib/context/global/language.context";


// Defined types for tickets
interface ITicket {
    _id: string;
    title: string;
    status: string;
    description: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    user: {
        _id: string;
        name: string;
        email: string;
    };
}

export default function CustomerTicketsMain() {
    const { getTranslation } = useLangTranslation();
    const router = useRouter();
    const { showToast } = useToast();
    const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
    const [isChatModalVisible, setIsChatModalVisible] =
        useState<boolean>(false);

    // Get user profile data
    const { data: profileData, loading: profileLoading } = useQuery(
        GET_USER_PROFILE,
        {
            fetchPolicy: "cache-and-network",
        }
    );

    const userName =
        profileData?.profile?.name || getTranslation("user_default_name");
    const userId = profileData?.profile?._id;

    // Fetch user's support tickets
    const {
        data: ticketsData,
        loading: isTicketsLoading,
        error: ticketsError,
        refetch: refetchTickets,
    } = useQuery(GET_USER_SUPPORT_TICKETS, {
        variables: {
            input: {
                userId: userId,
                filters: {
                    page: 1,
                    limit: 10,
                },
            },
        },
        skip: !userId, // Skip the query if userId is not available yet
        fetchPolicy: "network-only", // Don't use cache to ensure we get fresh data
        onError: (error) => {
            showToast({
                type: "error",
                title: getTranslation("toast_error"),
                message:
                    error.message ||
                    getTranslation("tickets_fetch_error_message"),
            });
        },
    });

    // Get tickets from query result or default to empty array
    const tickets: ITicket[] =
        ticketsData?.getSingleUserSupportTickets?.tickets || [];

    // Sort tickets by creation date (newest first)
    const sortedTickets = [...tickets].sort((a, b) => {
        const dateA = new Date(parseInt(a.updatedAt)).getTime();
        const dateB = new Date(parseInt(b.updatedAt)).getTime();
        return dateB - dateA; // Newest first
    });

    // Format date for display
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(parseInt(dateString));
            return date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
        } catch (error) {
            return getTranslation("unknown_date");
        }
    };

    // Get status color based on ticket status
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "open":
                return "text-blue-600 bg-blue-100";
            case "inprogress":
                return "text-yellow-600 bg-yellow-100";
            case "closed":
                return "text-gray-600 bg-gray-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    // Handle opening the chat modal
    const handleOpenChat = (ticketId: string) => {
        setSelectedTicket(ticketId);
        setIsChatModalVisible(true);
    };

    // Handle closing the chat modal
    const handleCloseChat = () => {
        // Refetch tickets to get any updates when modal closes
        refetchTickets();
        setIsChatModalVisible(false);
    };

    // Handle creating a new ticket
    const handleCreateTicket = () => {
        router.push("/profile/getHelp");
    };

    // Effect to refresh tickets periodically while viewing them
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isChatModalVisible) {
                refetchTickets();
            }
        }, 30000); // Refresh every 30 seconds when not in chat

        return () => clearInterval(intervalId);
    }, [refetchTickets, isChatModalVisible]);

    // Show loading state
    if (isTicketsLoading || profileLoading) {
        return <TicketSkeleton count={3} />;
    }

    // Show error state
    if (ticketsError) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <TextComponent
                    text={getTranslation("error_loading_tickets")}
                    className="text-lg text-red-500 mb-2"
                />
                <p className="text-gray-500 mb-4">
                    {getTranslation("tickets_fetch_error_message")}
                </p>
                <CustomButton
                    label={getTranslation("retry_button")}
                    onClick={() => window.location.reload()}
                    className="bg-[#FFA500] text-white px-4 py-2 rounded-full"
                />
            </div>
        );
    }

    return (
        <div className="w-full mx-auto">
            <div className="mb-6">
                <TextComponent
                    text={`${getTranslation("welcome_user")} ${userName} 👋`}
                    className="text-xl md:text-2xl font-bold mb-2"
                />
                <div className="flex justify-between items-center">
                    <TextComponent
                        text={
                            getTranslation(
                                "your_customer_support_tickets_label"
                            ) + " 🎟️"
                        }
                        className="text-xl md:text-2xl font-semibold"
                    />
                </div>
            </div>

            {sortedTickets?.length > 0 ? (
                <div className="space-y-4">
                    {sortedTickets?.map((ticket) => (
                        <div
                            key={ticket._id}
                            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <TextComponent
                                        text={ticket?.title}
                                        className="font-medium text-lg text-gray-800"
                                    />
                                    <p className="text-sm text-gray-500">
                                        {getTranslation("ticket_id_label")}:
                                        {ticket._id}
                                    </p>
                                </div>
                                <span
                                    className={`${getStatusColor(ticket.status)} px-3 py-1 rounded-full text-sm font-medium`}
                                >
                                    {ticket.status === "inProgress"
                                        ? getTranslation(
                                            "in_progress_status_label"
                                        )
                                        : ticket.status
                                            .charAt(0)
                                            .toUpperCase() +
                                        ticket.status.slice(1)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500">
                                <p>
                                    {getTranslation("created_label")}:{" "}
                                    {formatDate(ticket.createdAt)}
                                </p>
                                <p>
                                    {getTranslation("last_updated_label")}:{" "}
                                    {formatDate(ticket.updatedAt)}
                                </p>
                            </div>
                            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                <CustomButton
                                    label={getTranslation(
                                        "view_messages_button"
                                    )}
                                    className="text-blue-600 hover:text-blue-800 bg-transparent"
                                    onClick={() => handleOpenChat(ticket._id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                    <TextComponent
                        text={getTranslation("no_tickets_found_label")}
                        className="text-lg text-gray-500 mb-2"
                    />
                    <p className="text-gray-500 mb-4">
                        {getTranslation("no_support_tickets_yet_message")}
                    </p>
                    <CustomButton
                        label={getTranslation("create_first_ticket_button")}
                        onClick={handleCreateTicket}
                        className="bg-[#FFA500] text-white px-4 py-2 rounded-full"
                    />
                </div>
            )}

            {/* Chat Modal */}
            {selectedTicket && (
                <TicketChatModal
                    visible={isChatModalVisible}
                    onHide={handleCloseChat}
                    ticketId={selectedTicket}
                />
            )}
        </div>
    );
}
