const url = process.env.NEXT_PUBLIC_GAS_ENDPOINT || "https://script.google.com/macros/s/AKfycbzu3VBXivLEvFX2iV_a4Mb1Hp0733lazmMMczLhK1dsjL2mr0AC7Uqq89FLqugE5gotEg/exec";

async function send(p: any) {
  // Convert to URL parameters for the current GAS implementation
  const params = new URLSearchParams();
  params.append('action', p.action);
  params.append('name', p.name);
  params.append('status', p.status);
  params.append('guests', p.guests.toString());
  params.append('blessing', p.blessing);
  params.append('id', p.id);
  
  const r = await fetch(`${url}?${params.toString()}`, { 
    method: "POST"
  });
  const t = await r.text(); 
  try { 
    return JSON.parse(t); 
  } catch { 
    return t; 
  }
}

(async () => {
  console.log("Testing RSVP submission to GAS...");
  console.log("Endpoint:", url);
  
  const base = { 
    action: "submit_rsvp", 
    id: "rsvp_TEST", 
    name: "בדיקת מערכת", 
    blessing: "", 
    timestamp: new Date().toISOString() 
  };
  
  console.log("\n=== Testing YES status ===");
  console.log("YES =>", await send({ ...base, status: "מגיע", guests: 2 }));
  
  console.log("\n=== Testing MAYBE status ===");
  console.log("MAYBE =>", await send({ ...base, status: "אולי", guests: 0 }));
  
  console.log("\n=== Testing NO status ===");
  console.log("NO =>", await send({ ...base, status: "לא מגיע", guests: 0 }));
  
  console.log("\nSmoke test completed!");
})();
