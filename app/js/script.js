const d = document;
const $form = d.getElementById("form-ip");

const getDataIP = async (ipValue) => {
  try {
    const $ipAddress = d.getElementById("ip-address");
    const $ipLocation = d.getElementById("ip-location");
    const $ipTimezone = d.getElementById("ip-timezone");
    const $ipIsp = d.getElementById("ip-isp");
    let url = `https://geo.ipify.org/api/v1?apiKey=at_z3oh4cZLkM5994IZK04JubB2yc9t8&ipAddress=${ipValue ?? ""}`;

    const response = await fetch(url);
    console.log(response);
    if (!response.ok) throw { status: response.status, statusText: response.statusText };
    const data = await response.json();
    const { ip, isp, location } = data;

    $ipAddress.textContent = ip;
    $ipLocation.textContent = `${location.region} ${location.city}`;
    $ipTimezone.textContent = `UTC ${location.timezone}`;
    $ipIsp.textContent = isp;
    getMap(location.lat, location.lng);
  } catch (error) {
    let message = error.statusText || "Ocurrio un error inesperado";
    return error.status
      ? alert("Es probable que el error sea por ADBLOCK , Debe desactivarlo para una mejor experiencia")
      : alert(`Error ${error.status} : ${message}`);
  }
};

const getErrorPattern = (messageError) => alert(`Error: ${messageError}`);

const getMap = (lat, lng) => {
  let containerMap = L.DomUtil.get("map");
  if (containerMap !== null) containerMap._leaflet_id = null;

  const mymap = L.map("map").setView([lat, lng], 18);
  const tilesProvider = "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png";
  L.tileLayer(tilesProvider, {
    maxZoom: 18,
  }).addTo(mymap);

  const greenIcon = L.icon({
    iconUrl: "./images/icon-location.svg",
    iconSize: [45, 55],
  });

  L.marker([lat, lng], { icon: greenIcon }).addTo(mymap).bindPopup("I am here!!").openPopup();
};

d.addEventListener("submit", async (e) => {
  if (e.target === $form) {
    e.preventDefault();
    const $txtIP = e.target.txtIP;
    let pattern = $txtIP.pattern;

    let regEx = new RegExp(pattern, "ig");
    regEx.test($txtIP.value) ? getDataIP($txtIP.value) : getErrorPattern($txtIP.title);
  }
});

d.addEventListener("DOMContentLoaded", (_) => {
  getDataIP($form.txtIP.value);
});
