import { inject } from "@angular/core";
import { UrlTree, Router } from "@angular/router";

import { FeatureFlag } from "@bitwarden/common/enums/feature-flag.enum";
import { ConfigService } from "@bitwarden/common/platform/abstractions/config/config.service";

/**
 * Helper function to redirect to a new URL based on the UnauthenticatedExtensionUIRefresh feature flag.
 * @param redirectUrl - The URL to redirect to if the UnauthenticatedExtensionUIRefresh flag is enabled.
 */
export function unauthUiRefreshRedirect(redirectUrl: string): () => Promise<boolean | UrlTree> {
  return async () => {
    const configService = inject(ConfigService);
    const router = inject(Router);
    const shouldRedirect = await configService.getFeatureFlag(
      FeatureFlag.UnauthenticatedExtensionUIRefresh,
    );
    if (shouldRedirect) {
      return router.parseUrl(redirectUrl);
    } else {
      return true;
    }
  };
}