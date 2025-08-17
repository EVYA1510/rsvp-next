#!/bin/bash

# RSVP Integration Acceptance Tests Runner
# This script runs all acceptance tests for the RSVP integration

set -e

echo "🧪 RSVP Integration Acceptance Tests"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL=${BASE_URL:-"http://localhost:3001"}
REPORT_ID=${REPORT_ID:-""}

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Function to check if server is running
check_server() {
    echo "🔍 Checking if server is running..."
    if curl -s "$BASE_URL" > /dev/null; then
        print_status "SUCCESS" "Server is running at $BASE_URL"
    else
        print_status "ERROR" "Server is not running at $BASE_URL"
        echo "💡 Start the server with: npm run dev"
        exit 1
    fi
    echo ""
}

# Function to run API tests
run_api_tests() {
    echo "📡 Running API Tests..."
    echo "─────────────────────"
    
    if [ -z "$REPORT_ID" ]; then
        print_status "WARNING" "No REPORT_ID provided, skipping API tests"
        echo "💡 Set REPORT_ID environment variable to test with a real report ID"
        echo "💡 Example: REPORT_ID=your_report_id ./scripts/run-acceptance-tests.sh"
        echo ""
        return
    fi
    
    if command -v node >/dev/null 2>&1; then
        echo "🔄 Running API test script..."
        node scripts/test-rsvp-api.js "$REPORT_ID"
        print_status "SUCCESS" "API tests completed"
    else
        print_status "ERROR" "Node.js is not installed"
    fi
    echo ""
}

# Function to run Playwright tests
run_playwright_tests() {
    echo "🎭 Running Playwright Tests..."
    echo "────────────────────────────"
    
    if command -v npx >/dev/null 2>&1; then
        echo "🔄 Running Playwright tests..."
        npx playwright test tests/rsvp-integration.spec.ts --reporter=list
        print_status "SUCCESS" "Playwright tests completed"
    else
        print_status "ERROR" "npx is not available"
    fi
    echo ""
}

# Function to run manual tests instructions
show_manual_tests() {
    echo "🖱️  Manual Tests Instructions"
    echo "───────────────────────────"
    echo ""
    echo "1. Open your browser and go to: $BASE_URL"
    echo ""
    echo "2. Open the browser console (F12) and paste this code:"
    echo "   (Copy the content from scripts/browser-console-tests.js)"
    echo ""
    echo "3. Run the comprehensive test:"
    echo "   RSVPTests.runComprehensiveTest()"
    echo ""
    echo "4. Or run individual tests:"
    echo "   - RSVPTests.testLocalStorageHelpers()"
    echo "   - RSVPTests.testAPIEndpoint('your_report_id')"
    echo "   - RSVPTests.testFormState()"
    echo "   - RSVPTests.testLocalStorageContent()"
    echo "   - RSVPTests.testURLParameters()"
    echo "   - RSVPTests.testFormSubmission()"
    echo ""
    print_status "INFO" "Manual tests instructions displayed"
    echo ""
}

# Function to show test scenarios
show_test_scenarios() {
    echo "📋 Test Scenarios to Verify"
    echo "──────────────────────────"
    echo ""
    echo "1. 🔄 Submit → Refresh Flow:"
    echo "   - Fill and submit a new RSVP"
    echo "   - Verify reportId is returned"
    echo "   - Refresh the page"
    echo "   - Verify data persists and shows 'כבר אישרת'"
    echo ""
    echo "2. 🔗 Cross-Device Flow:"
    echo "   - Take the URL with ?id=<reportId>"
    echo "   - Open in a different browser/tab"
    echo "   - Verify data loads from GAS and shows 'כבר אישרת'"
    echo ""
    echo "3. ✏️  Update RSVP Flow:"
    echo "   - Click 'עדכן אישור'"
    echo "   - Change status or number of guests"
    echo "   - Verify the same reportId is used (no new row created)"
    echo ""
    echo "4. 🛡️  Edge Cases:"
    echo "   - ?id=non_existent → Form loads normally, no crashes"
    echo "   - Clear localStorage → Refresh → System behaves predictably"
    echo "   - No hydration errors or TypeError in console"
    echo ""
    print_status "INFO" "Test scenarios displayed"
    echo ""
}

# Main execution
main() {
    echo "🚀 Starting RSVP Integration Acceptance Tests..."
    echo ""
    
    check_server
    run_api_tests
    run_playwright_tests
    show_manual_tests
    show_test_scenarios
    
    echo "🏁 All tests completed!"
    echo ""
    echo "📊 Summary:"
    echo "   - API Tests: $(if [ -n "$REPORT_ID" ]; then echo "✅ Ready"; else echo "⚠️  Need REPORT_ID"; fi)"
    echo "   - Playwright Tests: ✅ Ready"
    echo "   - Manual Tests: ✅ Ready"
    echo ""
    echo "💡 Next steps:"
    echo "   1. Run manual tests in browser"
    echo "   2. Verify all test scenarios"
    echo "   3. Check for any console errors"
    echo ""
}

# Run main function
main "$@"
