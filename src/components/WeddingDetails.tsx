import WeddingCard from "./ui/WeddingCard";

export default function WeddingDetails() {
  return (
    <WeddingCard>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-pink-700 mb-8">
          פרטי האירוע
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Date and Location */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                <span className="text-pink-600 text-xl">📅</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-lg">
                  יום שלישי, 09.09.2025
                </div>
                <div className="text-gray-600">יום שלישי בשבוע</div>
              </div>
            </div>

            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-xl">📍</span>
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-lg">
                  אולם הרמוניה, רחובות
                </div>
                <div className="text-gray-600">רחוב הראשי 123</div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              לוח זמנים
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                <span className="font-medium text-gray-700">קבלת פנים</span>
                <span className="font-bold text-pink-600">19:00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-700">חופה</span>
                <span className="font-bold text-blue-600">20:00</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-700">ריקודים</span>
                <span className="font-bold text-purple-600">21:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WeddingCard>
  );
}
