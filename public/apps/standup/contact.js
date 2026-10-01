// The contact e-mail is not in the HTML, so scrapers reading the page don't get it. Like the contact section
// on sagan.dev, it is fetched from the site's API once the page has been open for 2 seconds and a contact
// link is on screen, then filled into every link marked data-contact="email".
(function () {
  var links = document.querySelectorAll('a[data-contact="email"]');
  if (!links.length) return;

  var timeReady = false;
  var inView = false;
  var requested = false;

  function reveal() {
    if (requested || !timeReady || !inView) return;
    requested = true;
    fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-requested-by": "sagan.dev" },
      body: JSON.stringify({ operationName: "ContactInfo", query: "query ContactInfo { contactInfo { email mailto } }" })
    })
      .then(function (response) { return response.json(); })
      .then(function (result) {
        var info = result && result.data && result.data.contactInfo;
        if (!info || !info.email) return;
        links.forEach(function (link) {
          link.href = info.mailto;
          link.textContent = info.email;
          link.classList.remove("email-pending");
        });
      })
      .catch(function () {});
  }

  setTimeout(function () { timeReady = true; reveal(); }, 2000);

  var observer = new IntersectionObserver(function (entries) {
    if (entries.some(function (entry) { return entry.isIntersecting; })) {
      inView = true;
      observer.disconnect();
      reveal();
    }
  }, { threshold: 0.3 });
  links.forEach(function (link) { observer.observe(link); });
})();
