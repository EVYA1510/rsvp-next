#!/usr/bin/env node

/**
 * Script to generate WhatsApp links for RSVP invitations
 * Usage: node scripts/generate-whatsapp-links.js
 */

const BASE_URL =
  "https://rsvp-next-f2j89h8q2-evyatars-projects-b9a23384.vercel.app";

// List of guests (you can modify this)
const guests = [
  { name: "אביתר לידני", phone: "+972501234567" },
  { name: "שרה כהן", phone: "+972501234568" },
  { name: "דוד לוי", phone: "+972501234569" },
  { name: "רחל גולדברג", phone: "+972501234570" },
  { name: "יוסי שפירא", phone: "+972501234571" },
  // Add more guests here...
];

function generateWhatsAppLink(name, phone) {
  const encodedName = encodeURIComponent(name);
  const rsvpUrl = `${BASE_URL}/?name=${encodedName}`;

  const message = `שלום ${name}! 🌟

אנחנו שמחים להזמין אותך לאירוע שלנו!

לאשר הגעה, לחץ על הקישור הבא:
${rsvpUrl}

נשמח לראותך! 💕

*אם הקישור לא עובד, העתק והדבק אותו בדפדפן*`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${phone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodedMessage}`;

  return {
    name,
    phone,
    rsvpUrl,
    whatsappUrl,
  };
}

function main() {
  console.log("🎉 יצירת קישורי וואטסאפ לאישור הגעה\n");
  console.log(`📍 URL בסיס: ${BASE_URL}\n`);

  const links = guests.map((guest) =>
    generateWhatsAppLink(guest.name, guest.phone)
  );

  console.log("📋 רשימת הקישורים:\n");

  links.forEach((link, index) => {
    console.log(`${index + 1}. ${link.name}`);
    console.log(`   📱 טלפון: ${link.phone}`);
    console.log(`   🔗 קישור RSVP: ${link.rsvpUrl}`);
    console.log(`   💬 קישור וואטסאפ: ${link.whatsappUrl}`);
    console.log("");
  });

  console.log("📝 הוראות:");
  console.log("1. העתק כל קישור וואטסאפ");
  console.log("2. פתח אותו בדפדפן");
  console.log("3. שלח את ההודעה למוזמן");
  console.log("4. המוזמן יקבל קישור ישיר לטופס אישור הגעה");
  console.log("");
  console.log("✨ טיפ: אתה יכול גם ליצור QR קוד לכל קישור!");
}

if (require.main === module) {
  main();
}

module.exports = { generateWhatsAppLink, guests };
