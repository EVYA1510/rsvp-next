#!/usr/bin/env node

/**
 * Test script for RSVP API endpoint
 * Usage: node scripts/test-rsvp-api.js [reportId]
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3001';

async function testRSVPAPI(reportId) {
  console.log('🧪 Testing RSVP API...');
  console.log(`📍 Base URL: ${BASE_URL}`);
  console.log(`🆔 Report ID: ${reportId || 'NOT_PROVIDED'}`);
  console.log('─'.repeat(50));

  if (!reportId) {
    console.log('❌ No reportId provided. Usage: node scripts/test-rsvp-api.js <reportId>');
    console.log('💡 Example: node scripts/test-rsvp-api.js test123');
    return;
  }

  try {
    // Test 1: Valid reportId
    console.log('📡 Testing GET /api/rsvp with valid reportId...');
    const response = await fetch(`${BASE_URL}/api/rsvp?id=${encodeURIComponent(reportId)}`);
    
    console.log(`📊 Response Status: ${response.status}`);
    console.log(`📋 Response Headers:`, Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📄 Response Data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      if (data.success && data.data) {
        console.log('✅ SUCCESS: API returned valid data structure');
        console.log('📋 RSVP Data:', {
          name: data.data.name,
          status: data.data.status,
          guests: data.data.guests,
          blessing: data.data.blessing,
          reportId: data.data.reportId
        });
      } else if (data.name) {
        console.log('✅ SUCCESS: API returned direct GAS response');
        console.log('📋 RSVP Data:', {
          name: data.name,
          status: data.status,
          guests: data.guests,
          blessing: data.blessing,
          reportId: data.reportId
        });
      } else {
        console.log('⚠️  WARNING: Unexpected response format');
      }
    } else {
      console.log('❌ ERROR: API request failed');
      if (data.error) {
        console.log('🔍 Error details:', data.error);
      }
    }
    
  } catch (error) {
    console.log('💥 EXCEPTION:', error.message);
  }

  console.log('─'.repeat(50));
  
  // Test 2: Invalid reportId
  console.log('📡 Testing GET /api/rsvp with invalid reportId...');
  try {
    const invalidResponse = await fetch(`${BASE_URL}/api/rsvp?id=invalid_id_12345`);
    const invalidData = await invalidResponse.json();
    
    console.log(`📊 Invalid Response Status: ${invalidResponse.status}`);
    console.log('📄 Invalid Response Data:', JSON.stringify(invalidData, null, 2));
    
    if (invalidResponse.status === 400 || invalidResponse.status === 404) {
      console.log('✅ SUCCESS: API properly handles invalid reportId');
    } else {
      console.log('⚠️  WARNING: Unexpected response for invalid reportId');
    }
  } catch (error) {
    console.log('💥 EXCEPTION (invalid test):', error.message);
  }

  console.log('─'.repeat(50));
  
  // Test 3: Missing reportId
  console.log('📡 Testing GET /api/rsvp without reportId...');
  try {
    const missingResponse = await fetch(`${BASE_URL}/api/rsvp`);
    const missingData = await missingResponse.json();
    
    console.log(`📊 Missing ID Response Status: ${missingResponse.status}`);
    console.log('📄 Missing ID Response Data:', JSON.stringify(missingData, null, 2));
    
    if (missingResponse.status === 400) {
      console.log('✅ SUCCESS: API properly handles missing reportId');
    } else {
      console.log('⚠️  WARNING: Unexpected response for missing reportId');
    }
  } catch (error) {
    console.log('💥 EXCEPTION (missing test):', error.message);
  }

  console.log('─'.repeat(50));
  console.log('🏁 API Testing Complete');
}

// Get reportId from command line arguments
const reportId = process.argv[2];

if (require.main === module) {
  testRSVPAPI(reportId);
}

module.exports = { testRSVPAPI };
