import jsPDF from "jspdf";

interface TripPDFData {
  title: string;
  country: string;
  duration: number;
  budget: string;
  travelStyle: string;
  estimatedPrice: string;
  description: string;
  itinerary: Array<{
    day: number;
    location: string;
    activities: Array<{ time: string; description: string }>;
  }>;
  bestTimeToVisit?: string[];
  weatherInfo?: string[];
}

export const exportTripToPDF = (trip: TripPDFData) => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header Banner
  doc.setFillColor(30, 144, 255); // Dodger Blue
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("TRIPVISITO TRAVEL GUIDE", 15, 14);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Personalized AI Travel Itinerary", 15, 21);

  y = 38;

  // Trip Title
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const titleLines = doc.splitTextToSize(trip.title || "Travel Itinerary", pageWidth - 30);
  doc.text(titleLines, 15, y);
  y += titleLines.length * 7 + 2;

  // Key Specs Banner
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(15, y, pageWidth - 30, 16, 2, 2, "F");

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont("helvetica", "normal");
  const specs = `Country: ${trip.country}   |   Duration: ${trip.duration} Days   |   Style: ${trip.travelStyle}   |   Budget: ${trip.budget}   |   Est. Price: ${trip.estimatedPrice}`;
  doc.text(specs, 18, y + 10);
  y += 24;

  // Description
  if (trip.description) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 30, 30);
    doc.text("Overview", 15, y);
    y += 6;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    const descLines = doc.splitTextToSize(trip.description, pageWidth - 30);
    doc.text(descLines, 15, y);
    y += descLines.length * 5 + 6;
  }

  // Daily Schedule
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 144, 255);
  doc.text("Daily Itinerary Plan", 15, y);
  y += 6;

  trip.itinerary?.forEach((dayPlan) => {
    // Check if near bottom of page
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(`Day ${dayPlan.day}: ${dayPlan.location}`, 15, y);
    y += 5;

    dayPlan.activities?.forEach((act) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(8.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(30, 144, 255);
      doc.text(`[${act.time}]`, 20, y);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(70, 70, 70);
      const actLines = doc.splitTextToSize(act.description, pageWidth - 55);
      doc.text(actLines, 38, y);
      y += actLines.length * 4.5 + 2;
    });

    y += 3;
  });

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Tripvisito Travel Guide  ·  Page ${i} of ${pageCount}  ·  Generated with Tripvisito AI`,
      pageWidth / 2,
      290,
      { align: "center" }
    );
  }

  const cleanFileName = (trip.title || "trip-itinerary")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  doc.save(`${cleanFileName}.pdf`);
};
