export const AppMsgResProps = {
  head: {
    title: {
      default: "Site IQ",
      home: "Home",
    },
  },
  body: {
    content: {
      siteiq: "Site IQ",
      copyright: function () {
        return `Copyright ${String.fromCharCode(
          169
        )} ${new Date().getFullYear()} SiteIQ. All rights reserved.`;
      },
      listRecordsDisplayInfo: function (start, end, total) {
        return `${start} to ${end} of ${total}`;
      },
      confirmation: "Confirmation",
      firstPage: "First Page",
      lastPage: "Last Page",
      previousPage: "Previous Page",
      nextPage: "Next Page",
      page: "Page",
    },
    form: {
      save: { label: "Save" },
      cancel: { label: "Cancel" },
      close: { label: "Close" },
      clear: { label: "Clear" },
      yes: { label: "Yes" },
      no: { label: "No" },
      search: { label: "Search" },
      sort: { label: "Sort" },
      go: { label: "GO" },
      ok: { label: "OK" },
      goHome: { label: "Go Home" },
      goBack: { label: "Go Back" },
      searchAddress: {
        label: "Search Address",
      },
    },
    notification: {
      warning: {
        requestCancelled: "Request Cancelled.",
      },
      error: {
        default: "An error has occured.",
        serverTimeout: "Error occured while connecting to server.",
        pageNotFound: "Page not found.",
      },
    },
  },
};
