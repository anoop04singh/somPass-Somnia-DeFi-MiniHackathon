import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, QrCode } from "lucide-react";
import { mockEvents, Event } from "@/data/events";
import { mockAttendees, Attendee } from "@/data/attendees";
import { showSuccess } from "@/utils/toast";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animations";
import { QRScannerModal } from "@/components/QRScannerModal";
import { Switch } from "@/components/ui/switch";

const ManageEvent = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | undefined>(undefined);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    const foundEvent = mockEvents.find((e) => e.id === id);
    setEvent(foundEvent);
    if (foundEvent) {
      setAttendees(mockAttendees[foundEvent.id] || []);
    }
  }, [id]);

  if (!event) {
    return <NotFound />;
  }

  const handleCheckInToggle = (attendeeId: string, isCheckedIn: boolean) => {
    setAttendees(prev =>
      prev.map(att =>
        att.id === attendeeId ? { ...att, isCheckedIn } : att
      )
    );
    showSuccess(`Attendee ${isCheckedIn ? 'checked in' : 'marked as not attended'}.`);
  };

  const handleScanSuccess = (ticketId: string) => {
    showSuccess(`Successfully scanned ticket: ${ticketId}. Attendee checked in.`);
    // In a real app, you'd find the attendee by ticketId and check them in.
    setTimeout(() => setIsScannerOpen(false), 1500);
  };

  const checkedInCount = attendees.filter(a => a.isCheckedIn).length;

  return (
    <>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageTransition}
        className="min-h-screen text-white"
        style={{
          background: "linear-gradient(135deg, #2d5a3d 0%, #3d6b4a 100%)",
        }}
      >
        <Header />
        <main className="container mx-auto px-6 py-10 pt-28 flex-grow">
          <div className="mb-8">
            <Link
              to="/dashboard"
              className="inline-flex items-center text-sm font-medium text-white/60 hover:text-white transition-opacity"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{event.title}</h1>
              <p className="text-white/70 mt-1">Attendee Management</p>
            </div>
            <Button
              size="lg"
              className="w-full md:w-auto bg-white text-green-900 font-bold hover:bg-gray-200"
              onClick={() => setIsScannerOpen(true)}
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl mb-6">
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-white/70">Total Attendees</p>
                <p className="text-3xl font-bold">{attendees.length}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Checked In</p>
                <p className="text-3xl font-bold">{checkedInCount}</p>
              </div>
              <div>
                <p className="text-sm text-white/70">Attendance Rate</p>
                <p className="text-3xl font-bold">
                  {attendees.length > 0 ? ((checkedInCount / attendees.length) * 100).toFixed(0) : 0}%
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10">
              <h2 className="font-semibold">Attendee List</h2>
            </div>
            <ul className="divide-y divide-white/10">
              {attendees.map(attendee => (
                <li key={attendee.id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{attendee.name}</p>
                    <p className="text-sm text-white/60">{attendee.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold ${attendee.isCheckedIn ? 'text-green-400' : 'text-white/60'}`}>
                      {attendee.isCheckedIn ? 'Checked In' : 'Pending'}
                    </span>
                    <Switch
                      checked={attendee.isCheckedIn}
                      onCheckedChange={(checked) => handleCheckInToggle(attendee.id, checked)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </motion.div>
      <QRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </>
  );
};

export default ManageEvent;