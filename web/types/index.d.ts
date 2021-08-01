declare module "*.svg" {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}

declare module "@analytics/google-analytics" {
  type GoogleAnalyticsOptions = {
    /** Google Analytics site tracking Id */
    trackingId: string;

    /** Enable Google Analytics debug mode */
    debug?: boolean;

    /** Enable Anonymizing IP addresses sent to Google Analytics. See details below */
    anonymizeIp?: boolean;

    /** Map Custom dimensions to send extra information to Google Analytics. See details below */
    customDimensions?: object;

    /** Reset custom dimensions by key on analytics.page() calls. Useful for single page apps. */
    resetCustomDimensionsOnPage?: object;

    /** Mapped dimensions will be set to the page & sent as properties of all subsequent events on that page. If false, analytics will only pass custom dimensions as part of individual events */
    setCustomDimensionsToPage?: boolean;

    /** Custom tracker name for google analytics. Use this if you need multiple googleAnalytics scripts loaded */
    instanceName?: string;

    /** Custom URL for google analytics script, if proxying calls */
    customScriptSrc?: string;

    /** Additional cookie properties for configuring the ga cookie */
    cookieConfig?: object;

    /** Set custom google analytic tasks */
    tasks?: object;
  };

  type AnalyticsPlugin = {
    /** Name of plugin */
    name: string;

    /** exposed events of plugin */
    EVENTS?: any;

    /** Configuration of plugin */
    config?: any;

    /** Load analytics scripts method */
    initialize?: (...params: any[]) => any;

    /** Page visit tracking method */
    page?: (...params: any[]) => any;

    /** Custom event tracking method */
    track?: (...params: any[]) => any;

    /** User identify method */
    identify?: (...params: any[]) => any;

    /** Function to determine if analytics script loaded */
    loaded?: (...params: any[]) => any;

    /** Fire function when plugin ready */
    ready?: (...params: any[]) => any;
  };

  function GoogleAnalytics(options: GoogleAnalyticsOptions): AnalyticsPlugin;
  export default GoogleAnalytics;
}
