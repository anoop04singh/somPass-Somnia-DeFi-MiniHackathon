import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, LoaderCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Event } from "@/data/events";
import { querySubgraph, mapSubgraphEventToEvent, SubgraphEvent } from "@/lib/subgraph";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { showError } from "@/utils/toast";
import { AISearchResultsModal } from "./AISearchResultsModal";

const fetchEventsForSearch = async (): Promise<Event[]> => {
  const query = `
    query GetEvents {
      events(orderBy: createdAtTimestamp, orderDirection: desc) {
        id
        metadataCID
        organizer
        ticketPrice
        ticketSupply
        totalTicketsSold
      }
    }
  `;
  const response = await querySubgraph<{ events: SubgraphEvent[] }>(query);
  return Promise.all(response.events.map(mapSubgraphEventToEvent));
};

export const AISearch = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsForSearch,
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !events) return;
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      showError("Gemini API key is not configured.");
      return;
    }

    setIsLoading(true);
    try {
      const upcomingEvents = events.filter(event => new Date(event.startDate) >= new Date());
      const formattedEvents = upcomingEvents.map(event => ({
        contractAddress: event.contractAddress,
        title: event.title,
        description: event.description,
        location: event.location,
      }));

      const prompt = `
        You are an intelligent event search assistant for a platform called SomPass.
        Your task is to find relevant events from a provided list based on a user's query.
        Analyze the user's query and the event data (title, description, location).
        Return ONLY a JSON array of strings, where each string is the 'contractAddress' of a matching event. Do not include any other text, explanations, or markdown formatting.

        Here is the list of available upcoming events:
        ${JSON.stringify(formattedEvents)}

        User's query: "${query}"

        JSON array of matching contract addresses:
      `;

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      let responseText = result.response.text();
      
      if (responseText.startsWith("```json")) {
        responseText = responseText.substring(7, responseText.length - 3).trim();
      }

      const resultIds = JSON.parse(responseText) as string[];
      const matchingEvents = upcomingEvents.filter(event => resultIds.includes(event.contractAddress));
      
      setResults(matchingEvents);
      setIsModalOpen(true);

    } catch (error) {
      console.error("AI search failed:", error);
      showError("AI search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full max-w-xs">
        <div className="relative flex items-center">
          <Sparkles className="absolute left-3 h-5 w-5 text-white/50" />
          <Input
            type="search"
            placeholder="AI powered search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-20 bg-black/30 border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-sm text-white [text-shadow:0_0_6px_rgba(255,255,255,0.7)] placeholder:text-white/60"
          />
          <Button type="submit" size="sm" className="absolute right-1.5 h-7 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold hover:opacity-90 transition-opacity" disabled={isLoading}>
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Find"}
          </Button>
        </div>
      </form>
      <AISearchResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
        query={query}
      />
    </>
  );
};