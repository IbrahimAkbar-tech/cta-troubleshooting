//apply ?gis=2 OR &gis=2 to the URL depending on what is already included in the URL
function enforceTestParam() {
  let url = window.location.href;

  if (url.indexOf("?") > -1) {
    url += "&gis=2";
  } else {
    url += "?gis=2";
  }

  alert(
    "Adding ?gis=2 to the end of the URL as we could not see the CTA on the page. Press OK to continue - please check console for any issues related to the script injection"
  );
  window.location.href = url;
}

//Check if an element has a specific class
function hasClass(element, clsName) {
  return (" " + element.className + " ").indexOf(" " + clsName + " ") > -1;
}

//Check if the GIS script is being injected
function checkScript(script_URL) {
  var requests = window.performance.getEntriesByType("resource");

  for (var i = 0; i < requests.length; i++) {
    if (requests[i].name.includes(script_URL)) {
      token = requests[i];
      console.log(
        script_URL +
          token.name.slice(37) +
          " is the current script injected on this page"
      );
      return true;
    }
  }
}

//Check if the GIS CTA is hidden and why
function isCtaHidden() {
  if (gisCta && gisCta.style.display !== "none") {
    console.log(
      "We can see the CTA, please wait a few seconds for it to appear"
    );
  } else if (gisCta && gisCta.style.display === "none") {
    console.log('CTA is being hidden due to display property set to "none"');
  } else {
    console.log(
      "Cannot see the CTA, adding ?gis=2 to the URL as client could be in testing phase"
    );
    enforceTestParam();
  }
}

//Check if the script is injected and if the CTA is hidden
function checkCta() {
  if (checkScript(script_URL)) {
    try {
      if (!GISAPP.serverInjectionService.getSystemConfig().persistentCta) {
        if (hasClass(persistentCta, "gis-circle-animate-hide")) {
          alert(
            "Client is non-persistent, executing clerkIsAvailable() to show CTA"
          );
          console.log(
            "Client is non-persistent, executing clerkIsAvailable() to show CTA"
          );
          clerkIsAvailable();
        }
      }
    } catch (err) {
      console.log("Cannot locate #gis-cta. Forcing clerkIsAvailable()");
      console.log(
        "If you see clerkIsAvailable is not defined in the console, then script is not injected"
      );
      clerkIsAvailable();
      return;
    }
    isCtaHidden();
  } else {
    console.log("script is not injected");
  }
}

const gisCta = document.querySelector(".gis-cta-reset");
const persistentCta = document.querySelector("#gis-cta");

var token = "";
const script_URL = "https://gis.goinstore.com/gis/script/" + token;

checkCta();
