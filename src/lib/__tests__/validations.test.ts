import {
  RSVPFormSchema,
  RSVPStatusSchema,
  validateRSVPForm,
  safeValidateRSVPForm,
} from "../validations";

// Mock data for testing
const mockFormData = {
  name: "אביתר כהן",
  status: "מגיע" as const,
  guests: 2,
  blessing: "מזל טוב!",
};



describe("RSVP Validations", () => {
  describe("RSVPStatusSchema", () => {
    it("should validate correct status values", () => {
      expect(() => RSVPStatusSchema.parse("מגיע")).not.toThrow();
      expect(() => RSVPStatusSchema.parse("אולי")).not.toThrow();
      expect(() => RSVPStatusSchema.parse("לא מגיע")).not.toThrow();
    });

    it("should reject invalid status values", () => {
      expect(() => RSVPStatusSchema.parse("invalid")).toThrow();
      expect(() => RSVPStatusSchema.parse("")).toThrow();
      expect(() => RSVPStatusSchema.parse(null)).toThrow();
    });
  });

  describe("RSVPFormSchema", () => {
    it("should validate correct form data", () => {
      const validData = {
        name: "אביתר כהן",
        status: "מגיע" as const,
        guests: 2,
        blessing: "מזל טוב!",
      };

      expect(() => RSVPFormSchema.parse(validData)).not.toThrow();
    });

    it("should validate form data without blessing", () => {
      const validData = {
        name: "שובל לוי",
        status: "אולי" as const,
        guests: 1,
      };

      expect(() => RSVPFormSchema.parse(validData)).not.toThrow();
    });

    it("should reject invalid name", () => {
      const invalidData = {
        name: "A", // Too short
        status: "מגיע" as const,
        guests: 1,
      };

      expect(() => RSVPFormSchema.parse(invalidData)).toThrow();
    });

    it("should reject name with non-Hebrew characters", () => {
      const invalidData = {
        name: "אביתר Cohen", // Contains English
        status: "מגיע" as const,
        guests: 1,
      };

      expect(() => RSVPFormSchema.parse(invalidData)).toThrow();
    });

    it("should reject invalid guest count", () => {
      const invalidData = {
        name: "אביתר כהן",
        status: "מגיע" as const,
        guests: 15, // Too many
      };

      expect(() => RSVPFormSchema.parse(invalidData)).toThrow();
    });

    it("should reject negative guest count", () => {
      const invalidData = {
        name: "אביתר כהן",
        status: "מגיע" as const,
        guests: -1,
      };

      expect(() => RSVPFormSchema.parse(invalidData)).toThrow();
    });

    it("should reject blessing that is too long", () => {
      const longBlessing = "א".repeat(501); // 501 characters
      const invalidData = {
        name: "אביתר כהן",
        status: "מגיע" as const,
        guests: 1,
        blessing: longBlessing,
      };

      expect(() => RSVPFormSchema.parse(invalidData)).toThrow();
    });
  });

  describe("validateRSVPForm", () => {
    it("should return validated data for correct input", () => {
      const result = validateRSVPForm(mockFormData);
      expect(result).toEqual(mockFormData);
    });

    it("should throw error for invalid input", () => {
      const invalidData = {
        name: "A",
        status: "מגיע" as const,
        guests: 1,
      };

      expect(() => validateRSVPForm(invalidData)).toThrow();
    });
  });

  describe("safeValidateRSVPForm", () => {
    it("should return success for valid data", () => {
      const result = safeValidateRSVPForm(mockFormData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(mockFormData);
      }
    });

    it("should return error for invalid data", () => {
      const invalidData = {
        name: "A",
        status: "מגיע" as const,
        guests: 1,
      };

      const result = safeValidateRSVPForm(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(2); // Both length and regex validation fail
        expect(result.error.issues[0].path).toEqual(["name"]);
      }
    });
  });
});
