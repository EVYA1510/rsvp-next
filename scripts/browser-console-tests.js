/**
 * Manual Browser Console Tests for RSVP Integration
 *
 * Copy and paste these functions into your browser console to test the RSVP functionality.
 * Make sure you're on the RSVP page (http://localhost:3001) before running these tests.
 */

// Test 1: Check localStorage helpers
function testLocalStorageHelpers() {
  console.log("🧪 Testing localStorage helpers...");

  try {
    // Test saveFullRSVPData
    const testData = {
      reportId: "test_123",
      name: "Test User",
      status: "yes",
      guests: 2,
      blessing: "Test blessing",
      savedAt: Date.now(),
    };

    // This will be available if the page is loaded
    if (typeof saveFullRSVPData === "function") {
      saveFullRSVPData(testData);
      console.log("✅ saveFullRSVPData function exists and called");
    } else {
      console.log("❌ saveFullRSVPData function not found");
    }

    // Test loadFullRSVPData
    if (typeof loadFullRSVPData === "function") {
      const loadedData = loadFullRSVPData();
      console.log("📋 Loaded data:", loadedData);
      console.log("✅ loadFullRSVPData function exists");
    } else {
      console.log("❌ loadFullRSVPData function not found");
    }

    // Test getURLId
    if (typeof getURLId === "function") {
      const urlId = getURLId();
      console.log("🔗 URL ID:", urlId);
      console.log("✅ getURLId function exists");
    } else {
      console.log("❌ getURLId function not found");
    }
  } catch (error) {
    console.error("💥 Error testing localStorage helpers:", error);
  }
}

// Test 2: Test API endpoint directly
async function testAPIEndpoint(reportId = "test_123") {
  console.log("🧪 Testing API endpoint...");

  try {
    const response = await fetch(
      `/api/rsvp?id=${encodeURIComponent(reportId)}`
    );
    const data = await response.json();

    console.log("📊 Response status:", response.status);
    console.log("📄 Response data:", data);

    if (response.ok) {
      if (data.success && data.data) {
        console.log("✅ API returned valid data structure");
      } else if (data.name) {
        console.log("✅ API returned direct GAS response");
      } else {
        console.log("⚠️ Unexpected response format");
      }
    } else {
      console.log("❌ API request failed");
    }
  } catch (error) {
    console.error("💥 Error testing API endpoint:", error);
  }
}

// Test 3: Test form state
function testFormState() {
  console.log("🧪 Testing form state...");

  try {
    // Check if form elements exist
    const nameInput = document.querySelector('input[name="name"]');
    const statusSelect = document.querySelector('select[name="status"]');
    const guestsInput = document.querySelector('input[name="guests"]');
    const blessingTextarea = document.querySelector(
      'textarea[name="blessing"]'
    );
    const submitButton = document.querySelector('button[type="submit"]');

    console.log("📋 Form elements found:");
    console.log("- Name input:", !!nameInput);
    console.log("- Status select:", !!statusSelect);
    console.log("- Guests input:", !!guestsInput);
    console.log("- Blessing textarea:", !!blessingTextarea);
    console.log("- Submit button:", !!submitButton);

    // Check if success message is visible
    const successMessage =
      document.querySelector("text=שלום") ||
      document.querySelector("text=תודה");

    if (successMessage) {
      console.log("✅ Success message is visible");
      console.log("📋 Success message text:", successMessage.textContent);
    } else {
      console.log("ℹ️ No success message visible (form is in edit mode)");
    }

    // Check if reportId is displayed
    const reportIdElement = document.querySelector(".bg-gray-50 p");
    if (reportIdElement) {
      console.log("✅ Report ID is displayed");
      console.log("📋 Report ID:", reportIdElement.textContent);
    } else {
      console.log("ℹ️ No report ID displayed");
    }
  } catch (error) {
    console.error("💥 Error testing form state:", error);
  }
}

// Test 4: Test localStorage content
function testLocalStorageContent() {
  console.log("🧪 Testing localStorage content...");

  try {
    const keys = Object.keys(localStorage);
    console.log("📋 localStorage keys:", keys);

    keys.forEach((key) => {
      if (key.includes("rsvp")) {
        const value = localStorage.getItem(key);
        console.log(`📄 ${key}:`, value);

        try {
          const parsed = JSON.parse(value);
          console.log(`📋 ${key} (parsed):`, parsed);
        } catch (e) {
          console.log(`📄 ${key} (raw):`, value);
        }
      }
    });

    if (keys.length === 0) {
      console.log("ℹ️ localStorage is empty");
    }
  } catch (error) {
    console.error("💥 Error testing localStorage content:", error);
  }
}

// Test 5: Test URL parameters
function testURLParameters() {
  console.log("🧪 Testing URL parameters...");

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");
    const name = urlParams.get("name");

    console.log("🔗 Current URL:", window.location.href);
    console.log("📋 URL parameters:");
    console.log("- id:", id);
    console.log("- name:", name);

    if (id) {
      console.log("✅ ID parameter found in URL");
    } else {
      console.log("ℹ️ No ID parameter in URL");
    }

    if (name) {
      console.log("✅ Name parameter found in URL");
    } else {
      console.log("ℹ️ No name parameter in URL");
    }
  } catch (error) {
    console.error("💥 Error testing URL parameters:", error);
  }
}

// Test 6: Test form submission simulation
async function testFormSubmission() {
  console.log("🧪 Testing form submission simulation...");

  try {
    const form = document.querySelector("form");
    if (!form) {
      console.log("❌ No form found on page");
      return;
    }

    // Fill out the form
    const nameInput = document.querySelector('input[name="name"]');
    const statusSelect = document.querySelector('select[name="status"]');
    const guestsInput = document.querySelector('input[name="guests"]');
    const blessingTextarea = document.querySelector(
      'textarea[name="blessing"]'
    );

    if (nameInput) nameInput.value = "Console Test User";
    if (statusSelect) statusSelect.value = "yes";
    if (guestsInput) guestsInput.value = "3";
    if (blessingTextarea) blessingTextarea.value = "Console test blessing";

    console.log("📋 Form filled with test data");

    // Trigger form submission
    const submitButton = document.querySelector('button[type="submit"]');
    if (submitButton && !submitButton.disabled) {
      console.log("🔄 Triggering form submission...");
      submitButton.click();

      // Wait a bit and check the result
      setTimeout(() => {
        console.log("📋 Form submission completed");
        testFormState();
      }, 2000);
    } else {
      console.log("❌ Submit button not available or disabled");
    }
  } catch (error) {
    console.error("💥 Error testing form submission:", error);
  }
}

// Test 7: Comprehensive test
async function runComprehensiveTest() {
  console.log("🚀 Running comprehensive RSVP integration test...");
  console.log("─".repeat(50));

  testURLParameters();
  console.log("─".repeat(30));

  testLocalStorageContent();
  console.log("─".repeat(30));

  testLocalStorageHelpers();
  console.log("─".repeat(30));

  testFormState();
  console.log("─".repeat(30));

  await testAPIEndpoint();
  console.log("─".repeat(30));

  console.log("🏁 Comprehensive test completed");
}

// Export functions for easy access
window.RSVPTests = {
  testLocalStorageHelpers,
  testAPIEndpoint,
  testFormState,
  testLocalStorageContent,
  testURLParameters,
  testFormSubmission,
  runComprehensiveTest,
};

console.log("🧪 RSVP Integration Tests loaded!");
console.log("💡 Available functions:");
console.log("- RSVPTests.testLocalStorageHelpers()");
console.log("- RSVPTests.testAPIEndpoint(reportId)");
console.log("- RSVPTests.testFormState()");
console.log("- RSVPTests.testLocalStorageContent()");
console.log("- RSVPTests.testURLParameters()");
console.log("- RSVPTests.testFormSubmission()");
console.log("- RSVPTests.runComprehensiveTest()");
