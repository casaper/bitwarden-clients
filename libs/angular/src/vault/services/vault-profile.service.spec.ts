import { TestBed } from "@angular/core/testing";

import { ApiService } from "@bitwarden/common/abstractions/api.service";

import { VaultProfileService } from "./vault-profile.service";

describe("VaultProfileService", () => {
  let service: VaultProfileService;
  const userId = "profile-id";
  const hardcodedDateString = "2024-02-24T12:00:00Z";

  const getProfile = jest.fn().mockResolvedValue({
    creationDate: hardcodedDateString,
    twoFactorEnabled: true,
    id: "new-user-id",
  });

  beforeEach(() => {
    getProfile.mockClear();

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useValue: { getProfile } }],
    });

    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-02-22T00:00:00Z"));
    service = TestBed.runInInjectionContext(() => new VaultProfileService());
    service["userId"] = userId;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("getProfileCreationDate", () => {
    it("calls `getProfile` when stored profile date is not set", async () => {
      expect(service["profileCreatedDate"]).toBeNull();

      const date = await service.getProfileCreationDate(userId);

      expect(date.toISOString()).toBe("2024-02-24T12:00:00.000Z");
      expect(getProfile).toHaveBeenCalled();
    });

    it("calls `getProfile` when stored profile id does not match", async () => {
      service["profileCreatedDate"] = hardcodedDateString;
      service["userId"] = "old-user-id";

      const date = await service.getProfileCreationDate(userId);

      expect(date.toISOString()).toBe("2024-02-24T12:00:00.000Z");
      expect(getProfile).toHaveBeenCalled();
    });

    it("does not call `getProfile` when the date is already stored", async () => {
      service["profileCreatedDate"] = hardcodedDateString;

      const date = await service.getProfileCreationDate(userId);

      expect(date.toISOString()).toBe("2024-02-24T12:00:00.000Z");
      expect(getProfile).not.toHaveBeenCalled();
    });
  });

  describe("getProfileTwoFactorEnabled", () => {
    it("calls `getProfile` when stored 2FA property is not stored", async () => {
      expect(service["profile2FAEnabled"]).toBeNull();

      const twoFactorEnabled = await service.getProfileTwoFactorEnabled(userId);

      expect(twoFactorEnabled).toBe(true);
      expect(getProfile).toHaveBeenCalled();
    });

    it("calls `getProfile` when stored profile id does not match", async () => {
      service["profile2FAEnabled"] = false;
      service["userId"] = "old-user-id";

      const twoFactorEnabled = await service.getProfileTwoFactorEnabled(userId);

      expect(twoFactorEnabled).toBe(true);
      expect(getProfile).toHaveBeenCalled();
    });

    it("does not call `getProfile` when 2FA property is already stored", async () => {
      service["profile2FAEnabled"] = false;

      const twoFactorEnabled = await service.getProfileTwoFactorEnabled(userId);

      expect(twoFactorEnabled).toBe(false);
      expect(getProfile).not.toHaveBeenCalled();
    });
  });
});