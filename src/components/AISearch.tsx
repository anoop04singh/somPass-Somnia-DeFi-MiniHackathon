import { useState, useEffect, useRef } from "react";
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

const SUGGESTIONS = [
  "Web3 conferences in Europe",
  "Music festivals this summer",
  "Tech meetups near me",
  "Art exhibitions in New York",
  "Gaming tournaments",
  "Food and drink festivals",
];

export const AISearch = () => {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestion, setSuggestion] = useState(SUGGESTIONS[0]);
  const intervalRef = useRef<number | null>(null);

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEventsForSearch,
  });

  useEffect(() => {
    if (isFocused) {
      intervalRef.current = window.setInterval(() => {
        setSuggestion(prev => {
          const currentIndex = SUGGESTIONS.indexOf(prev);
          const nextIndex = (currentIndex + 1) % SUGGESTIONS.length;
          return SUGGESTIONS[nextIndex];
        });
      }, 2000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isFocused]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const searchQuery = query.trim() || suggestion;
    if (!searchQuery || !events) return;
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      showError("Gemini API key is not configured.");
      return;
    }

    setIsLoading(true);
    setResults([]); // Reset previous results

    try {
      const now = new Date();
      const upcomingEvents = events.filter(event => {
        const eventEndDate = event.endDate ? new Date(event.endDate) : new Date(event.startDate);
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);
        
        if (!isNaN(eventEndDate.getTime())) {
          eventEndDate.setUTCHours(endHours, endMinutes);
        }
  
        const isEventOver = !isNaN(eventEndDate.getTime()) && eventEndDate < now;
        return !isEventOver;
      });

      const formattedEvents = upcomingEvents.map(event => ({
        contractAddress: event.contractAddress,
        title: event.title,
        location: event.location,
        tags: event.tags || [],
      }));

      const prompt = `
        You are an intelligent event search assistant for a platform called SomPass.
        Your task is to find relevant events from a provided list based on a user's query.
        Analyze the user's query and the event data (title, location, and tags).
        Return ONLY a JSON array of strings, where each string is the 'contractAddress' of a matching event. Do not include any other text, explanations, or markdown formatting. If no events match, return an empty array [].

        Here is the list of available upcoming events:
        ${JSON.stringify(formattedEvents)}

        User's query: "${searchQuery}"

        JSON array of matching contract addresses:
      `;

      console.log("Sending the following context to the AI model:", prompt);

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      console.log("Received the following raw data from the AI model:", responseText);

      // Robustly find and parse the JSON array from the response
      const startIndex = responseText.indexOf('[');
      const endIndex = responseText.lastIndexOf(']');

      if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
        const jsonString = responseText.substring(startIndex, endIndex + 1);
        const resultIds = JSON.parse(jsonString) as string[];
        const matchingEvents = upcomingEvents.filter(event => 
          resultIds.some(id => id.toLowerCase() === event.contractAddress.toLowerCase())
        );
        setResults(matchingEvents);
      } else {
        console.warn("AI response did not contain a valid JSON array.", responseText);
        setResults([]);
      }

    } catch (error) {
      console.error("AI search failed:", error);
      showError("AI search failed. Please try again.");
      setResults([]);
    } finally {
      setIsLoading(false);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSearch} className="relative w-full max-w-xs">
        <div className="relative flex items-center">
          <Sparkles className="absolute left-3 h-5 w-5 text-white/50" />
          <Input
            type="search"
            placeholder={isFocused ? suggestion : "AI powered search"}
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-20 bg-black/30 border-0 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0 backdrop-blur-sm text-white [text-shadow:0_0_6px_rgba(255,255,255,0.7)] placeholder:text-white/60 transition-all duration-300"
          />
          <Button
            type="submit"
            size="sm"
            variant="ghost"
            className="absolute right-1.5 h-7 px-4 rounded-full text-amber-300 font-semibold drop-shadow-[0_0_8px_rgba(252,211,77,0.6)] hover:bg-transparent hover:text-amber-200 hover:drop-shadow-[0_0_12px_rgba(252,211,77,0.8)] transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Find"}
          </Button>
        </div>
      </form>
      <AISearchResultsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
        query={query.trim() || suggestion}
      />
    </>
  );
};