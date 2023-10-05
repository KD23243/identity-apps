/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AnalyticsConfigurationForm } from "./analytics-form";
import { ConsentInformationControllerConfigurationForm } from "./consent-information-controller-form";
import { LoginAttemptSecurityConfigurationFrom } from "./login-attempt-security-form";
import { PasswordRecoveryConfigurationForm } from "./password-recovery-form";
import { SelfRegistrationForm } from "./self-registration-form";
import { UserClaimUpdateConfigurationForm } from "./user-claim-update-form";
import { AppState, FeatureConfigInterface } from "../../../../features/core";
import {
    GovernanceConnectorInterface,
    ServerConfigurationsConstants
} from "../../../../features/server-configurations";

/**
 * Proptypes for the connector form factory component.
 */
interface ConnectorFormFactoryInterface extends TestableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * ID of Connector.
     */
    connectorId: string;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

/**
 * Connector form factory.
 *
 * @param props - Props injected to the component.
 * @returns connector form factory component.
 */
export const ConnectorFormFactory: FunctionComponent<ConnectorFormFactoryInterface> = (
    props: ConnectorFormFactoryInterface
): ReactElement => {

    const {
        initialValues,
        onSubmit,
        connectorId,
        isConnectorEnabled,
        isSubmitting
    } = props;

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);
    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const isReadOnly: boolean = useMemo(
        () =>
            !hasRequiredScopes(
                featureConfig?.attributeDialects,
                featureConfig?.attributeDialects?.scopes?.update,
                allowedScopes
            ),
        [ featureConfig, allowedScopes ]
    );

    switch (connectorId) {
        case ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID:
            return (
                <SelfRegistrationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID:
            return (
                <LoginAttemptSecurityConfigurationFrom
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID:
            return (
                <PasswordRecoveryConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ isConnectorEnabled }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID:
            return (
                <AnalyticsConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ true }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.CONSENT_INFO_CONNECTOR_ID:
            return (
                <ConsentInformationControllerConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ true }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        case ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID:
            return (
                <UserClaimUpdateConfigurationForm
                    onSubmit={ onSubmit }
                    initialValues={ initialValues }
                    isConnectorEnabled={ true }
                    readOnly={ isReadOnly }
                    isSubmitting={ isSubmitting }
                />
            );
        default:
            return null;
    }
};

/**
 * Default proptypes for the IDP authenticator for factory component.
 */
ConnectorFormFactory.defaultProps = {
    "data-testid": "connector-edit-settings-form-factory"
};
